import React from 'react';
import { SiteVisit, Lead } from '../types';
import { cn, formatDate } from '../lib/utils';
import { Calendar, MapPin, CheckCircle2, XCircle, Clock, MoreVertical, Plus, Navigation, User } from 'lucide-react';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface VisitTrackingProps {
  visits: SiteVisit[];
  leads: Lead[];
  onAddVisit: () => void;
  onUpdateStatus: (visitId: string, status: string) => void;
}

export function VisitTracking({ visits, leads, onAddVisit, onUpdateStatus }: VisitTrackingProps) {
  const getLeadName = (leadId: string) => leads.find(l => l.id === leadId)?.name || 'Unknown Lead';
  const getLeadLocation = (leadId: string) => leads.find(l => l.id === leadId)?.location || 'Unknown Location';

  const plannedVisits = visits.filter(v => v.status === 'PLANNED');
  const completedVisits = visits.filter(v => v.status === 'COMPLETED');
  const cancelledVisits = visits.filter(v => v.status === 'CANCELLED');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Site Visit Tracking</h2>
        <button 
          onClick={onAddVisit}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all text-sm md:text-base"
        >
          <Plus size={18} />
          Plan New Visit
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Leads Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={18} className="text-slate-600" />
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Available Leads</h3>
              </div>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">{leads.length}</span>
            </div>
            
            <Droppable droppableId="leads-list" type="VISIT">
              {(provided, snapshot) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "flex-1 p-4 space-y-3 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-[200px] transition-colors",
                    snapshot.isDraggingOver && "bg-slate-100"
                  )}
                >
                  {leads.map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "p-3 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all bg-white shadow-sm",
                            snapshot.isDragging && "shadow-xl border-blue-400 ring-2 ring-blue-100"
                          )}
                        >
                          <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin size={10} />
                            {lead.location}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Planned Visists */}
        <Droppable droppableId="PLANNED" type="VISIT">
          {(provided, snapshot) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-colors",
                snapshot.isDraggingOver && "bg-blue-50/50 border-blue-200"
              )}
            >
              <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  <h3 className="font-bold text-blue-900 uppercase tracking-wider text-sm">Planned Visits</h3>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{plannedVisits.length}</span>
              </div>
              
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-[200px]">
                {plannedVisits.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-medium">No planned visits</p>
                  </div>
                ) : (
                  plannedVisits.map((visit, index) => (
                    <Draggable key={visit.id} draggableId={visit.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "p-4 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all group bg-white",
                            snapshot.isDragging && "shadow-xl border-blue-400 ring-2 ring-blue-100"
                          )}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{visit.title || getLeadName(visit.leadId)}</h4>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                <User size={12} className="text-slate-400" />
                                <span className="font-medium">{getLeadName(visit.leadId)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                <MapPin size={12} />
                                <span className="truncate max-w-[180px]">{getLeadLocation(visit.leadId)}</span>
                              </div>
                            </div>
                            <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <Clock size={14} className="text-blue-600" />
                              {formatDate(visit.plannedDate)}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => onUpdateStatus(visit.id, 'COMPLETED')}
                                className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                title="Mark Completed"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                              <button 
                                onClick={() => onUpdateStatus(visit.id, 'CANCELLED')}
                                className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                                title="Cancel Visit"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        {/* Completed Visits */}
        <Droppable droppableId="COMPLETED" type="VISIT">
          {(provided, snapshot) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-colors",
                snapshot.isDraggingOver && "bg-emerald-50/50 border-emerald-200"
              )}
            >
              <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <h3 className="font-bold text-emerald-900 uppercase tracking-wider text-sm">Completed</h3>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">{completedVisits.length}</span>
              </div>
              
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-[200px]">
                {completedVisits.map((visit, index) => (
                  <Draggable key={visit.id} draggableId={visit.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "p-4 border border-slate-100 rounded-xl opacity-70 hover:opacity-100 transition-all bg-white",
                          snapshot.isDragging && "shadow-xl border-emerald-400 ring-2 ring-emerald-100 opacity-100"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900">{getLeadName(visit.leadId)}</h4>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Done</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{getLeadLocation(visit.leadId)}</p>
                        {visit.location && (
                          <div className="mb-3 flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                            <Navigation size={10} />
                            {visit.location.latitude.toFixed(4)}, {visit.location.longitude.toFixed(4)}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Calendar size={14} />
                          {formatDate(visit.actualDate || visit.plannedDate)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        {/* Cancelled Visits */}
        <Droppable droppableId="CANCELLED" type="VISIT">
          {(provided, snapshot) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-colors",
                snapshot.isDraggingOver && "bg-rose-50/50 border-rose-200"
              )}
            >
              <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle size={18} className="text-rose-600" />
                  <h3 className="font-bold text-rose-900 uppercase tracking-wider text-sm">Cancelled</h3>
                </div>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">{cancelledVisits.length}</span>
              </div>
              
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-[200px]">
                {cancelledVisits.map((visit, index) => (
                  <Draggable key={visit.id} draggableId={visit.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "p-4 border border-slate-100 rounded-xl opacity-70 hover:opacity-100 transition-all bg-white",
                          snapshot.isDragging && "shadow-xl border-rose-400 ring-2 ring-rose-100 opacity-100"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900">{getLeadName(visit.leadId)}</h4>
                          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Cancelled</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{getLeadLocation(visit.leadId)}</p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 line-through">
                          <Calendar size={14} />
                          {formatDate(visit.plannedDate)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        </div>
      </div>
    </div>
  );
}
