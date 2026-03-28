import React from 'react';
import { Lead, SiteVisit, Quotation, Invoice, UserProfile, PipelineStage } from '../types';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Clock, 
  User, 
  Plus, 
  ArrowRight,
  MoreVertical,
  History,
  Paperclip,
  Send,
  MessageSquare
} from 'lucide-react';

interface LeadDetailsProps {
  lead: Lead;
  stages: PipelineStage[];
  visits: SiteVisit[];
  quotations: Quotation[];
  invoices: Invoice[];
  users: UserProfile[];
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
  onUpdateAssignment: (userId: string) => void;
  onAddVisit: () => void;
  onAddQuotation: () => void;
  onAddNote: (note: string) => void;
}

export function LeadDetails({ 
  lead, 
  stages,
  visits, 
  quotations, 
  invoices, 
  users,
  onClose, 
  onUpdateStatus,
  onUpdateAssignment,
  onAddVisit,
  onAddQuotation,
  onAddNote
}: LeadDetailsProps) {
  const [activeTab, setActiveTab] = React.useState<'OVERVIEW' | 'VISITS' | 'DOCUMENTS' | 'FINANCE'>('OVERVIEW');
  const [newNote, setNewNote] = React.useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full md:max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 truncate">{lead.name}</h2>
              <select 
                value={lead.status}
                onChange={(e) => onUpdateStatus(e.target.value)}
                className="px-2 py-0.5 md:py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold uppercase tracking-wider border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Phone size={12} className="md:w-[14px] md:h-[14px]" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="md:w-[14px] md:h-[14px]" />
                <span className="truncate">{lead.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="md:w-[14px] md:h-[14px]" />
                <span>{formatDate(lead.createdAt)}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-all ml-4"
          >
            <Plus className="rotate-45 md:w-6 md:h-6" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-2 md:px-6 overflow-x-auto no-scrollbar">
          {['OVERVIEW', 'VISITS', 'DOCUMENTS', 'FINANCE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
          {activeTab === 'OVERVIEW' && (
            <>
              <section>
                <h3 className="text-[10px] md:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 md:mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-blue-600 md:w-4 md:h-4" />
                    Lead Information
                  </div>
                </h3>
                <div className="grid grid-cols-2 gap-4 md:gap-6 bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Budget</p>
                    <p className="font-bold text-slate-900 text-base md:text-lg">{formatCurrency(lead.budget)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Source</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base">{lead.source}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Assigned To</p>
                    <select 
                      value={lead.assignedTo}
                      onChange={(e) => onUpdateAssignment(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-sm md:text-base border-none p-0 focus:ring-0 outline-none cursor-pointer"
                    >
                      {users.map(u => (
                        <option key={u.uid} value={u.uid}>{u.displayName} ({u.role.replace('_', ' ')})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Requirement</p>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{lead.requirement}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] md:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-2">
                  <MessageSquare size={14} className="text-blue-600 md:w-4 md:h-4" />
                  Follow-up Notes
                </h3>
                <form onSubmit={handleAddNote} className="mb-4">
                  <div className="relative">
                    <input 
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a follow-up note..."
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
                <div className="space-y-3">
                  {lead.followUpNotes?.map((note) => (
                    <div key={note.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-xs md:text-sm text-slate-700">{note.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-slate-400 font-bold">{note.userName}</p>
                        <p className="text-[10px] text-slate-400">{formatDate(note.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  {(!lead.followUpNotes || lead.followUpNotes.length === 0) && (
                    <p className="text-center py-4 text-xs text-slate-400 italic">No follow-up notes yet</p>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="text-[10px] md:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <History size={14} className="text-blue-600 md:w-4 md:h-4" />
                    Recent Activity
                  </h3>
                  <button className="text-[10px] md:text-xs font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3 md:gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Phone size={12} className="md:w-[14px] md:h-[14px]" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-100 mt-2" />
                    </div>
                    <div className="pb-4 md:pb-6">
                      <p className="text-xs md:text-sm font-bold text-slate-900">Follow-up Call Completed</p>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">By Sales Executive • 2 hours ago</p>
                      <p className="text-xs md:text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100 italic">
                        "Client is interested in the 3BHK unit. Requested a site visit next Sunday."
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'VISITS' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-bold text-slate-900">Site Visits</h3>
                <button 
                  onClick={onAddVisit}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] md:text-xs font-bold hover:bg-blue-700 transition-all"
                >
                  <Plus size={12} className="md:w-[14px] md:h-[14px]" />
                  Schedule
                </button>
              </div>
              {visits.length === 0 ? (
                <div className="text-center py-8 md:py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Calendar size={32} className="mx-auto text-slate-300 mb-3 md:w-12 md:h-12 md:mb-4" />
                  <p className="text-xs md:text-sm text-slate-500 font-medium">No visits scheduled yet</p>
                </div>
              ) : (
                visits.map((visit) => (
                  <div key={visit.id} className="p-3 md:p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm md:text-base font-bold text-slate-900">{visit.title || 'Site Visit'}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">{formatDate(visit.plannedDate)}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 md:py-1 rounded text-[8px] md:text-[10px] font-bold uppercase",
                        visit.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {visit.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-bold text-slate-900">Documents</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={onAddQuotation}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] md:text-xs font-bold hover:bg-blue-700 transition-all"
                  >
                    <Plus size={12} className="md:w-[14px] md:h-[14px]" />
                    Quotation
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] md:text-xs font-bold hover:bg-slate-800 transition-all">
                    <Paperclip size={12} className="md:w-[14px] md:h-[14px]" />
                    Upload
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {quotations.map(q => (
                  <div key={q.id} className="p-3 md:p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <FileText className="text-slate-400 group-hover:text-blue-600 mb-2 md:w-6 md:h-6" size={20} />
                    <p className="text-xs md:text-sm font-bold text-slate-900 truncate">Quotation #{q.id.slice(-4)}</p>
                    <p className="text-[8px] md:text-[10px] text-slate-500 mt-1 uppercase font-bold">{formatCurrency(q.totalAmount)} • {q.status}</p>
                  </div>
                ))}
                <div className="p-3 md:p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <FileText className="text-slate-400 group-hover:text-blue-600 mb-2 md:w-6 md:h-6" size={20} />
                  <p className="text-xs md:text-sm font-bold text-slate-900 truncate">KYC_Document.pdf</p>
                  <p className="text-[8px] md:text-[10px] text-slate-500 mt-1 uppercase font-bold">PDF • 2.4 MB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-3 md:gap-4">
          <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs md:text-sm font-bold hover:bg-slate-50 transition-all">
            <Phone size={16} className="md:w-[18px] md:h-[18px]" />
            Log Call
          </button>
          <button 
            onClick={onAddQuotation}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all"
          >
            <FileText size={16} className="md:w-[18px] md:h-[18px]" />
            Create Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
