import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Layout } from './components/Layout';
import { LeadStats } from './components/LeadStats';
import { LeadFilters } from './components/LeadFilters';
import { LeadTable } from './components/LeadTable';
import { KanbanColumn } from './components/KanbanBoard';
import { LeadDetails } from './components/LeadDetails';
import { LeadForm } from './components/LeadForm';
import { VisitTracking } from './components/VisitTracking';
import { QuotationList } from './components/QuotationList';
import { ReportDashboard } from './components/ReportDashboard';
import { TeamManagement } from './components/TeamManagement';
import { LeadDuplicateAlert } from './components/LeadDuplicateAlert';
import { VisitForm } from './components/VisitForm';
import { QuotationForm } from './components/QuotationForm';
import { HierarchyDrilldown } from './components/HierarchyDrilldown';
import { PerformanceDrilldown } from './components/PerformanceDrilldown';
import { MOCK_USERS, MOCK_LEADS, MOCK_VISITS, MOCK_QUOTATIONS, INITIAL_STAGES, MOCK_COMPANY } from './mockData';
import { UserProfile, Lead, PipelineStage, CompanyInfo, SiteVisit, Quotation } from './types';
import { LogIn, ShieldCheck, Plus, Users, ArrowLeft, Settings, Download } from 'lucide-react';
import { getSubordinateUids } from './lib/utils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PipelineSettings } from './components/PipelineSettings';
import { CompanySettings } from './components/CompanySettings';

export default function App() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [viewingUser, setViewingUser] = React.useState<UserProfile | null>(null);
  const [leads, setLeads] = React.useState<Lead[]>(MOCK_LEADS);
  const [visits, setVisits] = React.useState<SiteVisit[]>(MOCK_VISITS);
  const [quotations, setQuotations] = React.useState<Quotation[]>(MOCK_QUOTATIONS);
  const [stages, setStages] = React.useState<PipelineStage[]>(INITIAL_STAGES);
  const [companyInfo, setCompanyInfo] = React.useState<CompanyInfo>(MOCK_COMPANY);
  
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [showLeadForm, setShowLeadForm] = React.useState(false);
  const [showVisitForm, setShowVisitForm] = React.useState(false);
  const [showQuotationForm, setShowQuotationForm] = React.useState(false);
  const [duplicates, setDuplicates] = React.useState<Lead[]>([]);

  const handleLogin = (role: string) => {
    const mockUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setUser(mockUser);
    setViewingUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
    setViewingUser(null);
  };

  const handleDrillDown = (targetUser: UserProfile) => {
    setViewingUser(targetUser);
  };

  const handleGoBack = () => {
    if (!viewingUser || !user) return;
    const parent = MOCK_USERS.find(u => u.uid === viewingUser.parentUid);
    if (parent) {
      setViewingUser(parent);
    }
  };

  // Filter data based on viewingUser and their hierarchy
  const getFilteredData = () => {
    if (!viewingUser) return { leads: [], visits: [], quotations: [], users: [] };
    
    const subordinateUids = getSubordinateUids(viewingUser.uid, MOCK_USERS);
    const allRelevantUids = [viewingUser.uid, ...subordinateUids];
    
    return {
      leads: leads.filter(l => allRelevantUids.includes(l.assignedTo)),
      visits: visits.filter(v => allRelevantUids.includes(v.userId)),
      quotations: quotations.filter(q => allRelevantUids.includes(q.userId)),
      users: MOCK_USERS.filter(u => allRelevantUids.includes(u.uid))
    };
  };

  const filteredData = getFilteredData();

  const handleCreateLead = (data: Partial<Lead>) => {
    const newLead: Lead = {
      id: `lead-${leads.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: user?.uid || 'unassigned',
      score: Math.floor(Math.random() * 100),
      ...data,
    } as Lead;
    
    // Check for duplicates (simple check by phone)
    const existing = leads.find(l => l.phone === data.phone);
    if (existing) {
      setDuplicates([existing]);
    } else {
      setLeads([newLead, ...leads]);
      setShowLeadForm(false);
    }
  };

  const handleUpdateLeadStatus = (leadId: string, status: string) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status, updatedAt: new Date().toISOString() } : l));
  };

  const handleDownloadQuotation = (quotation: Quotation) => {
    const lead = leads.find(l => l.id === quotation.leadId);
    if (!lead) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('QUOTATION', 105, 20, { align: 'center' });
    
    // Company Info
    doc.setFontSize(10);
    doc.text(companyInfo.name, 20, 40);
    doc.text(companyInfo.address, 20, 45);
    doc.text(`Phone: ${companyInfo.phone}`, 20, 50);
    doc.text(`Email: ${companyInfo.email}`, 20, 55);
    
    // Quotation Info
    doc.text(`Quotation ID: ${quotation.id}`, 140, 40);
    doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 140, 45);
    doc.text(`Lead: ${lead.name}`, 140, 50);
    doc.text(`Phone: ${lead.phone}`, 140, 55);
    
    // Table
    autoTable(doc, {
      startY: 70,
      head: [['Description', 'Quantity', 'Price', 'Total']],
      body: quotation.items.map(item => [
        item.description,
        item.quantity,
        `INR ${item.price.toLocaleString()}`,
        `INR ${(item.quantity * item.price).toLocaleString()}`
      ]),
      foot: [['', '', 'Grand Total', `INR ${quotation.totalAmount.toLocaleString()}`]],
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }
    });
    
    doc.save(`Quotation_${quotation.id}.pdf`);
  };

  const [isAddingStage, setIsAddingStage] = React.useState(false);
  const [newStageLabel, setNewStageLabel] = React.useState('');

  const handleAddStage = () => {
    if (newStageLabel.trim()) {
      const newStage: PipelineStage = {
        id: `STAGE_${Date.now()}`,
        label: newStageLabel.trim(),
        color: 'bg-slate-100 text-slate-600',
        order: stages.length,
      };
      setStages([...stages, newStage]);
      setNewStageLabel('');
      setIsAddingStage(false);
    }
  };

  const handleUpdateLeadStatus = (leadId: string, status: string) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: status as any } : l));
  };

  const handleUpdateVisitStatus = (id: string, status: string) => {
    if (status === 'COMPLETED') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setVisits(visits.map(v => v.id === id ? { 
              ...v, 
              status: 'COMPLETED', 
              actualDate: new Date().toISOString(),
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            } : v));
          },
          (error) => {
            console.error("Geolocation error:", error);
            setVisits(visits.map(v => v.id === id ? { ...v, status: 'COMPLETED', actualDate: new Date().toISOString() } : v));
          }
        );
      } else {
        setVisits(visits.map(v => v.id === id ? { ...v, status: 'COMPLETED', actualDate: new Date().toISOString() } : v));
      }
    } else {
      setVisits(visits.map(v => v.id === id ? { ...v, status: status as any, actualDate: undefined } : v));
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === 'STAGE') {
      const items = Array.from(stages);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedStages = items.map((stage, index) => ({
        ...stage,
        order: index,
      }));

      setStages(updatedStages);
    } else if (type === 'LEAD') {
      const leadId = draggableId;
      const sourceStatus = source.droppableId;
      const destinationStatus = destination.droppableId;

      if (destinationStatus === 'PLAN_VISIT_ZONE') {
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
          setSelectedLead(lead);
          setShowVisitForm(true);
        }
      } else if (sourceStatus !== destinationStatus) {
        handleUpdateLeadStatus(leadId, destinationStatus);
      }
    } else if (type === 'VISIT') {
      const id = draggableId;
      const sourceStatus = source.droppableId;
      const destinationStatus = destination.droppableId;

      if (sourceStatus === 'leads-list') {
        // Dragging lead to visit tracking
        const lead = leads.find(l => l.id === id);
        if (lead) {
          const newVisit: SiteVisit = {
            id: `VISIT_${Date.now()}`,
            leadId: lead.id,
            plannedDate: new Date().toISOString(),
            status: destinationStatus as any,
            title: `Visit with ${lead.name}`,
          };
          setVisits([...visits, newVisit]);
        }
      } else if (sourceStatus !== destinationStatus) {
        handleUpdateVisitStatus(id, destinationStatus);
      }
    }
  };

  if (!user || !viewingUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 md:space-y-8 animate-in zoom-in duration-500">
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Vision CRM</h1>
            <p className="text-slate-500 mt-2 text-sm">Select a role to enter the demo</p>
          </div>

          <div className="grid grid-cols-1 gap-2 md:gap-3">
            {['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'].map((role) => (
              <button
                key={role}
                onClick={() => handleLogin(role)}
                className="flex items-center justify-between px-5 py-3 md:px-6 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all group"
              >
                <span className="font-bold text-slate-700 group-hover:text-blue-600 text-sm md:text-base">{role.replace('_', ' ')}</span>
                <LogIn size={18} className="text-slate-300 group-hover:text-blue-400" />
              </button>
            ))}
          </div>
          
          <p className="text-center text-xs text-slate-400 font-medium">
            Frontend-only demo with mock data
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout role={user.role} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {viewingUser.uid === user.uid ? `Welcome back, ${user.displayName}` : `Viewing as: ${viewingUser.displayName}`}
                  </h1>
                  <p className="text-slate-500 mt-1 text-sm">Here's what's happening in the sales pipeline.</p>
                </div>
                <div className="flex gap-2 md:gap-4">
                  {viewingUser.uid !== user.uid && (
                    <button 
                      onClick={handleGoBack}
                      className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <ArrowLeft size={18} />
                      Go Back
                    </button>
                  )}
                  <button 
                    onClick={() => setShowLeadForm(true)}
                    className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Plus size={18} />
                    Add New Lead
                  </button>
                </div>
              </div>

              <LeadStats leads={filteredData.leads} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 space-y-8">
                  <ReportDashboard leads={filteredData.leads} visits={filteredData.visits} users={filteredData.users} stages={stages} />
                  {user.role !== 'SALES_EXECUTIVE' && (
                    <HierarchyDrilldown 
                      currentUser={user}
                      allUsers={MOCK_USERS}
                      viewingUser={viewingUser}
                      onDrillDown={handleDrillDown}
                      onGoBack={handleGoBack}
                    />
                  )}
                </div>
              </div>
            </div>
          } />

          <Route path="/leads" element={
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Lead Management</h1>
                  <div className="flex items-center gap-3">
                    <Droppable droppableId="PLAN_VISIT_ZONE" type="LEAD">
                      {(provided, snapshot) => (
                        <div 
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 border-dashed",
                            snapshot.isDraggingOver 
                              ? "bg-blue-600 text-white border-blue-600 scale-105" 
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          )}
                        >
                          <Calendar size={18} />
                          <span>Drop to Plan Visit</span>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <button 
                      onClick={() => setShowLeadForm(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all"
                    >
                      Add New Lead
                    </button>
                  </div>
                </div>

              <LeadDuplicateAlert 
                duplicates={duplicates} 
                onClose={() => setDuplicates([])} 
                onViewLead={(l) => { setSelectedLead(l); setDuplicates([]); }}
              />

              <LeadFilters 
                onSearch={() => {}} 
                onFilterStatus={() => {}} 
                onFilterSource={() => {}} 
                stages={stages}
              />

              <LeadTable leads={filteredData.leads} onLeadClick={setSelectedLead} stages={stages} />
            </div>
          </DragDropContext>
        } />

          <Route path="/pipeline" element={
            <div className="space-y-6 h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Sales Pipeline</h1>
                  {user.role === 'ADMIN' && (
                    <NavLink 
                      to="/settings" 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Manage Pipeline Stages"
                    >
                      <Settings size={20} />
                    </NavLink>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-white p-1 rounded-xl border border-slate-100 self-start md:self-auto">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">Kanban</button>
                    <button className="px-4 py-2 text-slate-400 rounded-lg text-sm font-bold">List</button>
                  </div>
                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => setIsAddingStage(true)}
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all"
                    >
                      <Plus size={18} />
                      Add Stage
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-x-auto no-scrollbar pb-4">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="pipeline-stages" direction="horizontal" type="STAGE">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-4 md:gap-6 h-full"
                      >
                        {stages.sort((a, b) => a.order - b.order).map((stage, index) => (
                          <Draggable key={stage.id} draggableId={stage.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <KanbanColumn 
                                  status={stage.id} 
                                  label={stage.label}
                                  color={stage.color}
                                  leads={filteredData.leads.filter(l => l.status === stage.id)} 
                                  onLeadClick={setSelectedLead}
                                  isAdmin={user.role === 'ADMIN'}
                                  dragHandleProps={provided.dragHandleProps}
                                  onRename={(newLabel) => {
                                    setStages(stages.map(s => s.id === stage.id ? { ...s, label: newLabel } : s));
                                  }}
                                  onDelete={() => {
                                    if (window.confirm(`Are you sure you want to delete the "${stage.label}" stage?`)) {
                                      setStages(stages.filter(s => s.id !== stage.id));
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {user.role === 'ADMIN' && (
                          <div className="w-80 min-w-[320px]">
                            {isAddingStage ? (
                              <div className="bg-white p-4 rounded-2xl border-2 border-blue-400 shadow-lg animate-in fade-in zoom-in duration-200">
                                <h3 className="font-bold text-slate-900 mb-3">New Pipeline Stage</h3>
                                <input
                                  autoFocus
                                  type="text"
                                  placeholder="Stage Name (e.g. Negotiation)"
                                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all mb-3"
                                  value={newStageLabel}
                                  onChange={(e) => setNewStageLabel(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddStage()}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleAddStage}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
                                  >
                                    Create Stage
                                  </button>
                                  <button
                                    onClick={() => {
                                      setIsAddingStage(false);
                                      setNewStageLabel('');
                                    }}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setIsAddingStage(true)}
                                className="flex flex-col items-center justify-center w-full h-full bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all group min-h-[200px]"
                              >
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all mb-3">
                                  <Plus size={24} />
                                </div>
                                <span className="font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Add New Stage</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          } />

          <Route path="/performance" element={
            <PerformanceDrilldown 
              currentUser={user}
              allUsers={MOCK_USERS}
              leads={leads}
              visits={visits}
              quotations={quotations}
            />
          } />

          <Route path="/visits" element={
            <DragDropContext onDragEnd={onDragEnd}>
              <VisitTracking 
                visits={filteredData.visits} 
                leads={filteredData.leads} 
                onAddVisit={() => setShowVisitForm(true)}
                onUpdateStatus={handleUpdateVisitStatus}
              />
            </DragDropContext>
          } />

          <Route path="/quotations" element={
            <QuotationList 
              quotations={filteredData.quotations} 
              leads={filteredData.leads} 
              onAddQuotation={() => setShowQuotationForm(true)}
              onDownloadPDF={handleDownloadQuotation}
            />
          } />

          <Route path="/settings" element={
            user.role === 'ADMIN' ? (
              <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Settings</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <PipelineSettings stages={stages} onUpdateStages={setStages} />
                  <CompanySettings companyInfo={companyInfo} onUpdateCompany={setCompanyInfo} />
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          } />

          <Route path="/reports" element={
            <ReportDashboard leads={filteredData.leads} visits={filteredData.visits} users={filteredData.users} stages={stages} />
          } />

          <Route path="/team" element={
            <div className="space-y-6 md:space-y-8">
              <HierarchyDrilldown 
                currentUser={user}
                allUsers={MOCK_USERS}
                viewingUser={viewingUser}
                onDrillDown={handleDrillDown}
                onGoBack={handleGoBack}
              />
              <TeamManagement 
                users={MOCK_USERS.filter(u => u.parentUid === viewingUser.uid || u.uid === viewingUser.uid)} 
                onAddUser={() => alert('Add user feature')} 
                onEditUser={() => alert('Edit user feature')} 
              />
            </div>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Modals */}
        {selectedLead && (
          <LeadDetails 
            lead={selectedLead}
            stages={stages}
            visits={visits.filter(v => v.leadId === selectedLead.id)}
            quotations={quotations.filter(q => q.leadId === selectedLead.id)}
            invoices={[]}
            users={MOCK_USERS}
            onClose={() => setSelectedLead(null)}
            onUpdateStatus={(status) => handleUpdateLeadStatus(selectedLead.id, status)}
            onUpdateAssignment={(assignedTo) => {
              setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, assignedTo } : l));
              setSelectedLead({ ...selectedLead, assignedTo });
            }}
            onAddVisit={() => { setShowVisitForm(true); }}
            onAddQuotation={() => { setShowQuotationForm(true); }}
            onAddNote={(text) => {
              const note = {
                id: Math.random().toString(36).substr(2, 9),
                text,
                createdAt: new Date().toISOString(),
                createdBy: user?.uid || 'system',
                userName: user?.displayName || 'System'
              };
              const updatedLead = {
                ...selectedLead,
                followUpNotes: [...(selectedLead.followUpNotes || []), note]
              };
              setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
              setSelectedLead(updatedLead);
            }}
          />
        )}

        {showLeadForm && (
          <LeadForm 
            users={MOCK_USERS}
            stages={stages}
            onClose={() => setShowLeadForm(false)} 
            onSubmit={handleCreateLead} 
          />
        )}

        {showVisitForm && selectedLead && (
          <VisitForm 
            lead={selectedLead}
            onClose={() => setShowVisitForm(false)}
            onSubmit={(data) => {
              setVisits([{ id: `v-${Date.now()}`, ...data, userId: user.uid } as SiteVisit, ...visits]);
              setShowVisitForm(false);
            }}
          />
        )}

        {showQuotationForm && selectedLead && (
          <QuotationForm 
            lead={selectedLead}
            onClose={() => setShowQuotationForm(false)}
            onSubmit={(data) => {
              setQuotations([{ id: `q-${Date.now()}`, ...data, userId: user.uid } as Quotation, ...quotations]);
              setShowQuotationForm(false);
            }}
          />
        )}
      </Layout>
    </Router>
  );
}
