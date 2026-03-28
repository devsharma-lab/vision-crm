import React from 'react';
import { UserProfile, Lead, SiteVisit, Quotation } from '../types';
import { getSubordinateUids, formatCurrency, cn } from '../lib/utils';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Target, 
  IndianRupee, 
  ChevronRight, 
  ChevronDown,
  ArrowLeft,
  Calendar,
  PhoneCall,
  Network,
  LayoutDashboard,
  BarChart3,
  History,
  Search
} from 'lucide-react';
import { HierarchyFlowChart } from './HierarchyFlowChart';

interface PerformanceMetrics {
  totalLeads: number;
  leadsContacted: number;
  leadsConverted: number;
  conversionRate: number;
  visitsPlanned: number;
  visitsCompleted: number;
  revenue: number;
}

interface PerformanceDrilldownProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  leads: Lead[];
  visits: SiteVisit[];
  quotations: Quotation[];
}

export function PerformanceDrilldown({
  currentUser,
  allUsers,
  leads,
  visits,
  quotations
}: PerformanceDrilldownProps) {
  const [viewingUser, setViewingUser] = React.useState<UserProfile>(currentUser);
  const [history, setHistory] = React.useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'team' | 'tree' | 'leads'>('overview');
  const [teamSubTab, setTeamSubTab] = React.useState<'direct' | 'full'>('direct');
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const toggleRow = (uid: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(uid)) newSet.delete(uid);
    else newSet.add(uid);
    setExpandedRows(newSet);
  };

  const calculateMetrics = (targetUser?: UserProfile): PerformanceMetrics => {
    let allRelevantUids: string[];
    
    if (targetUser) {
      const subordinateUids = getSubordinateUids(targetUser.uid, allUsers);
      allRelevantUids = [targetUser.uid, ...subordinateUids];
    } else {
      allRelevantUids = allUsers.map(u => u.uid);
    }

    const userLeads = leads.filter(l => allRelevantUids.includes(l.assignedTo));
    const userVisits = visits.filter(v => allRelevantUids.includes(v.userId));
    const userQuotations = quotations.filter(q => allRelevantUids.includes(q.userId));

    const convertedLeads = userLeads.filter(l => l.status === 'WON');
    const contactedLeads = userLeads.filter(l => l.status !== 'NEW');

    return {
      totalLeads: userLeads.length,
      leadsContacted: contactedLeads.length,
      leadsConverted: convertedLeads.length,
      conversionRate: userLeads.length > 0 ? (convertedLeads.length / userLeads.length) * 100 : 0,
      visitsPlanned: userVisits.filter(v => v.status === 'PLANNED' || v.status === 'COMPLETED').length,
      visitsCompleted: userVisits.filter(v => v.status === 'COMPLETED').length,
      revenue: userQuotations.filter(q => q.status === 'ACCEPTED' || q.status === 'SENT').reduce((sum, q) => sum + q.totalAmount, 0)
    };
  };

  const handleDrillDown = (user: UserProfile) => {
    setHistory([...history, viewingUser]);
    setViewingUser(user);
  };

  const handleGoBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevUser = newHistory.pop();
    if (prevUser) {
      setViewingUser(prevUser);
      setHistory(newHistory);
    }
  };

  const currentMetrics = calculateMetrics(viewingUser);
  const subordinates = allUsers.filter(u => u.parentUid === viewingUser.uid);
  
  // Get all descendants for the "Full Team" view
  const allSubordinateUids = getSubordinateUids(viewingUser.uid, allUsers);
  const allTeamMembers = allUsers.filter(u => allSubordinateUids.includes(u.uid));
  
  // Get leads for the entire team
  const teamLeads = leads.filter(l => [viewingUser.uid, ...allSubordinateUids].includes(l.assignedTo))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          {history.length > 0 && (
            <button 
              onClick={handleGoBack}
              className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-900">Performance Drilldown</h1>
            <p className="text-slate-500 mt-0.5 text-xs md:text-sm">
              Viewing: <span className="font-bold text-slate-700">{viewingUser.displayName}</span>
            </p>
          </div>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === 'overview' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === 'team' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <BarChart3 size={18} />
            Team Performance
          </button>
          <button 
            onClick={() => setActiveTab('tree')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === 'tree' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Network size={18} />
            Hierarchy Tree
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === 'leads' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <History size={18} />
            Lead Logs
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <MetricCard 
                label="Leads" 
                value={currentMetrics.totalLeads} 
                icon={Users} 
                color="blue" 
                subValue={`${currentMetrics.leadsContacted} Cont.`}
              />
              <MetricCard 
                label="Conv." 
                value={currentMetrics.leadsConverted} 
                icon={Target} 
                color="emerald" 
                subValue={`${currentMetrics.conversionRate.toFixed(0)}% Rate`}
              />
              <MetricCard 
                label="Visits" 
                value={currentMetrics.visitsCompleted} 
                icon={Calendar} 
                color="amber" 
                subValue={`${currentMetrics.visitsPlanned} Plan`}
              />
              <MetricCard 
                label="Revenue" 
                value={formatCurrency(currentMetrics.revenue)} 
                icon={IndianRupee} 
                color="indigo" 
                subValue="Total"
              />
            </div>

            {/* Activity Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-6 md:mb-8 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  Activity Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <ActivityItem label="Leads Contacted" value={currentMetrics.leadsContacted} icon={PhoneCall} color="blue" />
                  <ActivityItem label="Visits Done" value={currentMetrics.visitsCompleted} icon={CheckCircle2} color="emerald" />
                </div>
              </div>

              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl shadow-slate-900/20 flex flex-col justify-between min-h-[200px]">
                <div>
                  <h3 className="text-lg font-bold opacity-80 mb-2">Conversion Rate</h3>
                  <p className="text-4xl font-bold">{currentMetrics.conversionRate.toFixed(1)}%</p>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-1000" 
                      style={{ width: `${currentMetrics.conversionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Target: 25.0% • {currentMetrics.conversionRate >= 25 ? 'Above' : 'Below'} Target
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sub Tabs for Team Performance */}
            <div className="flex gap-4 border-b border-slate-100 pb-4">
              <button 
                onClick={() => setTeamSubTab('direct')}
                className={cn(
                  "px-4 py-2 text-sm font-bold transition-all relative",
                  teamSubTab === 'direct' ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Direct Reports
                {teamSubTab === 'direct' && <div className="absolute bottom-[-17px] left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
              </button>
              <button 
                onClick={() => setTeamSubTab('full')}
                className={cn(
                  "px-4 py-2 text-sm font-bold transition-all relative",
                  teamSubTab === 'full' ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Full Team Breakdown
                {teamSubTab === 'full' && <div className="absolute bottom-[-17px] left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
              </button>
            </div>

            {teamSubTab === 'direct' ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">
                    {viewingUser.role === 'ADMIN' ? 'VP Performance' : 
                     viewingUser.role === 'VP' ? 'Team Leader Performance' : 
                     'Sales Team Performance'}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leads</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversions</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visits</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {subordinates.length > 0 ? subordinates.map(sub => {
                        const subMetrics = calculateMetrics(sub);
                        return (
                          <tr key={sub.uid} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                  {sub.displayName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{sub.displayName}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub.role.replace('_', ' ')}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-700">{subMetrics.totalLeads}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{subMetrics.leadsContacted} Contacted</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-emerald-600">{subMetrics.leadsConverted}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{subMetrics.conversionRate.toFixed(1)}% Rate</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-amber-600">{subMetrics.visitsCompleted}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{subMetrics.visitsPlanned} Planned</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-900">{formatCurrency(subMetrics.revenue)}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDrillDown(sub)}
                                className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">No direct reports found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    Full Team Performance Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Consolidated TL performance with agent breakdown</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-10"></th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Member</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leads</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversions</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {subordinates.length > 0 ? subordinates.map(sub => (
                        <React.Fragment key={sub.uid}>
                          <tr 
                            className={cn(
                              "hover:bg-slate-50/50 transition-colors cursor-pointer",
                              expandedRows.has(sub.uid) && "bg-blue-50/30"
                            )}
                            onClick={() => toggleRow(sub.uid)}
                          >
                            <td className="px-6 py-4">
                              {allUsers.some(u => u.parentUid === sub.uid) && (
                                expandedRows.has(sub.uid) ? <ChevronDown size={16} className="text-blue-600" /> : <ChevronRight size={16} className="text-slate-400" />
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900 text-sm">{sub.displayName}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                {sub.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-700 text-sm">{calculateMetrics(sub).totalLeads}</td>
                            <td className="px-6 py-4 font-bold text-emerald-600 text-sm">{calculateMetrics(sub).leadsConverted}</td>
                            <td className="px-6 py-4 font-bold text-slate-900 text-sm">{formatCurrency(calculateMetrics(sub).revenue)}</td>
                          </tr>
                          {expandedRows.has(sub.uid) && allUsers.filter(u => u.parentUid === sub.uid).map(agent => (
                            <tr key={agent.uid} className="bg-slate-50/30 border-l-4 border-blue-500">
                              <td className="px-6 py-3"></td>
                              <td className="px-10 py-3">
                                <p className="text-slate-700 text-sm font-medium">{agent.displayName}</p>
                              </td>
                              <td className="px-6 py-3">
                                <span className="px-2 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                  {agent.role.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-slate-500 text-sm">{calculateMetrics(agent).totalLeads}</td>
                              <td className="px-6 py-3 text-emerald-500 text-sm">{calculateMetrics(agent).leadsConverted}</td>
                              <td className="px-6 py-3 text-slate-500 text-sm">{formatCurrency(calculateMetrics(agent).revenue)}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      )) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No team members found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tree' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <HierarchyFlowChart 
              allUsers={allUsers}
              onUserClick={(user) => {
                if (user.uid !== viewingUser.uid) {
                  setHistory([...history, viewingUser]);
                  setViewingUser(user);
                }
              }}
              calculateMetrics={calculateMetrics}
            />

            {/* Selected User Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Selected Member</p>
                  <h4 className="text-lg font-bold truncate">{viewingUser.displayName}</h4>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">{viewingUser.role.replace('_', ' ')}</p>
                </div>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart3 size={12} />
                  View Full Performance
                </button>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                <h4 className="text-xl font-bold text-slate-900">{formatCurrency(currentMetrics.revenue)}</h4>
                <p className="text-[10px] text-slate-400 mt-1">Consolidated Team Revenue</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Leads & Conv.</p>
                <h4 className="text-xl font-bold text-slate-900">{currentMetrics.totalLeads} / {currentMetrics.leadsConverted}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{currentMetrics.conversionRate.toFixed(1)}% Conversion Rate</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Site Visits</p>
                <h4 className="text-xl font-bold text-slate-900">{currentMetrics.visitsCompleted}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{currentMetrics.visitsPlanned} Planned Visits</p>
              </div>
            </div>

            {/* Subordinate Performance List for the selected node */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  Subordinates of {viewingUser.displayName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Direct reports and their key performance metrics</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Member</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Leads</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Conv.</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {subordinates.length > 0 ? subordinates.map(sub => {
                      const subMetrics = calculateMetrics(sub);
                      return (
                        <tr key={sub.uid} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900 text-sm">{sub.displayName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                              {sub.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-700 text-sm">{subMetrics.totalLeads}</td>
                          <td className="px-6 py-4 text-center font-bold text-emerald-600 text-sm">{subMetrics.leadsConverted}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">{formatCurrency(subMetrics.revenue)}</td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No direct reports found for this user</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Target size={18} className="text-blue-600" />
                    Recent Team Leads & Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Latest lead activity across the entire team</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned To</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teamLeads.length > 0 ? teamLeads.slice(0, 15).map(lead => {
                      const assignedUser = allUsers.find(u => u.uid === lead.assignedTo);
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900 text-sm">{lead.name}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest",
                              lead.status === 'WON' ? "bg-emerald-50 text-emerald-600" :
                              lead.status === 'LOST' ? "bg-rose-50 text-rose-600" :
                              "bg-blue-50 text-blue-600"
                            )}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                            {assignedUser?.displayName || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No recent leads found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subValue }: { 
  label: string; 
  value: string | number; 
  icon: any; 
  color: 'blue' | 'emerald' | 'amber' | 'indigo';
  subValue: string;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", colors[color])}>
        <Icon size={24} />
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-xs text-slate-500 mt-2 font-medium">{subValue}</p>
    </div>
  );
}

function ActivityItem({ label, value, icon: Icon, color }: {
  label: string;
  value: number;
  icon: any;
  color: 'blue' | 'emerald' | 'indigo' | 'rose';
}) {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    rose: 'text-rose-600 bg-rose-50',
  };

  return (
    <div className="text-center">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3", colors[color])}>
        <Icon size={20} />
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}
