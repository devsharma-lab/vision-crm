import React from 'react';
import { Lead, UserProfile, PipelineStage } from '../types';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadSourceBadge } from './LeadSourceBadge';
import { LeadScoreBadge } from './LeadScoreBadge';
import { MoreVertical, Phone, MapPin, Calendar, User } from 'lucide-react';
import { MOCK_USERS } from '../mockData';

import { Droppable, Draggable } from '@hello-pangea/dnd';

interface LeadTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  stages: PipelineStage[];
}

export function LeadTable({ leads, onLeadClick, stages }: LeadTableProps) {
  const getUserName = (uid: string) => {
    const user = MOCK_USERS.find(u => u.uid === uid);
    return user ? user.displayName : uid;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lead Details</th>
              <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source</th>
              <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Budget</th>
              <th className="hidden lg:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned To</th>
              <th className="hidden sm:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</th>
              <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <Droppable droppableId="leads-table" type="LEAD">
            {(provided) => (
              <tbody 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="divide-y divide-slate-50"
              >
                {leads.map((lead, index) => (
                  <Draggable key={lead.id} draggableId={lead.id} index={index}>
                    {(provided, snapshot) => (
                      <tr 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => onLeadClick(lead)}
                        className={cn(
                          "hover:bg-slate-50 transition-colors cursor-pointer group",
                          snapshot.isDragging && "bg-blue-50/50 shadow-lg border-y-2 border-blue-200"
                        )}
                      >
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm md:text-base">{lead.name}</span>
                            <div className="flex items-center gap-3 mt-1 text-[10px] md:text-xs text-slate-400">
                              <div className="flex items-center gap-1">
                                <Phone size={10} className="md:w-3 md:h-3" />
                                <span>{lead.phone}</span>
                              </div>
                              <div className="hidden sm:flex items-center gap-1">
                                <MapPin size={10} className="md:w-3 md:h-3" />
                                <span className="truncate max-w-[120px]">{lead.location}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <LeadStatusBadge status={lead.status} stages={stages} />
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <LeadSourceBadge source={lead.source} />
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right">
                          <span className="font-bold text-slate-900 text-sm md:text-base">{formatCurrency(lead.budget)}</span>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                              {getUserName(lead.assignedTo).charAt(0)}
                            </div>
                            <span className="text-sm text-slate-600">{getUserName(lead.assignedTo)}</span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4">
                          <LeadScoreBadge score={lead.score || 0} />
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Showing {leads.length} leads</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Prev</button>
          <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
