import React from 'react';
import { Lead } from '../types';
import { AlertCircle, ArrowRight, X } from 'lucide-react';

interface LeadDuplicateAlertProps {
  duplicates: Lead[];
  onClose: () => void;
  onViewLead: (lead: Lead) => void;
}

export function LeadDuplicateAlert({ duplicates, onClose, onViewLead }: LeadDuplicateAlertProps) {
  if (duplicates.length === 0) return null;

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 animate-in slide-in-from-top duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 md:gap-3 text-rose-700">
          <AlertCircle size={20} className="md:w-6 md:h-6" />
          <div>
            <h3 className="text-base md:text-lg font-bold">Potential Duplicates Found</h3>
            <p className="text-[10px] md:text-sm font-medium opacity-80">We found {duplicates.length} existing leads with similar details.</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 text-rose-400 hover:text-rose-600 rounded-full hover:bg-rose-100 transition-all"
        >
          <X size={18} className="md:w-5 md:h-5" />
        </button>
      </div>

      <div className="space-y-2 md:space-y-3">
        {duplicates.map((lead) => (
          <div 
            key={lead.id} 
            className="bg-white p-3 md:p-4 rounded-xl border border-rose-100 flex items-center justify-between group hover:border-rose-300 transition-all cursor-pointer"
            onClick={() => onViewLead(lead)}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs md:text-sm font-bold">
                {lead.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm md:text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{lead.name}</p>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate max-w-[120px] md:max-w-none">{lead.phone} • {lead.location}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-right hidden sm:block">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold uppercase tracking-widest">
                  {lead.status.replace('_', ' ')}
                </span>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Assigned to: {lead.assignedTo}</p>
              </div>
              <ArrowRight size={16} className="md:w-[18px] md:h-[18px] text-rose-300 group-hover:text-rose-600 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
