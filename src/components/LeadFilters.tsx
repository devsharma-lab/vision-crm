import React from 'react';
import { PipelineStage } from '../types';
import { cn } from '../lib/utils';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

interface LeadFiltersProps {
  onSearch: (query: string) => void;
  onFilterStatus: (status: string | 'ALL') => void;
  onFilterSource: (source: string | 'ALL') => void;
  stages: PipelineStage[];
}

export function LeadFilters({ onSearch, onFilterStatus, onFilterSource, stages }: LeadFiltersProps) {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<string | 'ALL'>('ALL');
  const [source, setSource] = React.useState<string | 'ALL'>('ALL');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as any);
    onFilterStatus(e.target.value as any);
  };

  const handleSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSource(e.target.value as any);
    onFilterSource(e.target.value as any);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('ALL');
    setSource('ALL');
    onSearch('');
    onFilterStatus('ALL');
    onFilterSource('ALL');
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
      <div className="flex-1 relative">
        <input 
          type="text" 
          value={search}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
          placeholder="Search leads..."
        />
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2 md:gap-3">
        <div className="relative flex-1">
          <select 
            value={status}
            onChange={handleStatus}
            className="w-full md:w-auto pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs md:text-sm font-bold text-slate-600 appearance-none uppercase tracking-wider"
          >
            <option value="ALL">All Status</option>
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
        </div>

        <div className="relative flex-1">
          <select 
            value={source}
            onChange={handleSource}
            className="w-full md:w-auto pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs md:text-sm font-bold text-slate-600 appearance-none uppercase tracking-wider"
          >
            <option value="ALL">All Sources</option>
            <option value="MANUAL">Manual</option>
            <option value="INDIAMART">IndiaMART</option>
            <option value="WEBSITE">Website</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
        </div>

        {(search || status !== 'ALL' || source !== 'ALL') && (
          <button 
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs md:text-sm font-bold transition-all"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
