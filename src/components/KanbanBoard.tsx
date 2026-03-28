import React from 'react';
import { Lead } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { MoreVertical, Phone, MapPin, User } from 'lucide-react';
import { MOCK_USERS } from '../mockData';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface KanbanColumnProps {
  status: string;
  label: string;
  color: string;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  isAdmin?: boolean;
  onRename?: (newLabel: string) => void;
  onDelete?: () => void;
  dragHandleProps?: any;
}

export function KanbanColumn({ status, label, color, leads, onLeadClick, isAdmin, onRename, onDelete, dragHandleProps }: KanbanColumnProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newLabel, setNewLabel] = React.useState(label);
  const [showMenu, setShowMenu] = React.useState(false);

  const handleRename = () => {
    if (onRename && newLabel.trim() !== '') {
      onRename(newLabel);
    }
    setIsEditing(false);
  };

  const getUserName = (uid: string) => {
    const user = MOCK_USERS.find(u => u.uid === uid);
    return user ? user.displayName : uid;
  };

  return (
    <div className="flex flex-col w-80 min-w-[320px] bg-slate-50/50 rounded-2xl p-4 border border-slate-100 h-full">
      <div 
        {...dragHandleProps}
        className="flex items-center justify-between mb-4 px-2 relative cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2 flex-1">
          <span className={cn("w-2 h-2 rounded-full", color.split(' ')[0])} />
          {isEditing ? (
            <input
              autoFocus
              className="flex-1 bg-white border border-blue-400 rounded px-2 py-1 text-sm font-semibold text-slate-700 outline-none"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
          ) : (
            <h3 className="font-semibold text-slate-700 truncate max-w-[180px]">{label}</h3>
          )}
          <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
            {leads.length}
          </span>
        </div>
        
        {isAdmin && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  >
                    Rename Stage
                  </button>
                  <button
                    onClick={() => {
                      if (onDelete) onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Delete Stage
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Droppable droppableId={status} type="LEAD">
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-[100px] transition-colors",
              snapshot.isDraggingOver && "bg-blue-50/50 rounded-xl"
            )}
          >
            {leads.map((lead, index) => (
              <Draggable key={lead.id} draggableId={lead.id} index={index}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onLeadClick(lead)}
                    className={cn(
                      "bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group",
                      snapshot.isDragging && "shadow-xl border-blue-400 ring-2 ring-blue-100"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.name}</h4>
                      <span className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border", color)}>
                        {lead.source}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span className="truncate">{lead.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span className="truncate">Assigned to: {getUserName(lead.assignedTo)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{formatCurrency(lead.budget)}</span>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {lead.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
