import React from 'react';
import { PipelineStage } from '../types';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { cn } from '../lib/utils';

interface PipelineSettingsProps {
  stages: PipelineStage[];
  onUpdateStages: (stages: PipelineStage[]) => void;
}

const COLOR_OPTIONS = [
  'bg-slate-100 text-slate-600',
  'bg-blue-100 text-blue-600',
  'bg-indigo-100 text-indigo-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
  'bg-rose-100 text-rose-600',
  'bg-orange-100 text-orange-600',
  'bg-amber-100 text-amber-600',
  'bg-emerald-100 text-emerald-600',
  'bg-teal-100 text-teal-600',
];

export function PipelineSettings({ stages, onUpdateStages }: PipelineSettingsProps) {
  const [localStages, setLocalStages] = React.useState<PipelineStage[]>(stages);

  const handleAddStage = () => {
    const newStage: PipelineStage = {
      id: `STAGE_${Date.now()}`,
      label: 'New Stage',
      color: COLOR_OPTIONS[0],
      order: localStages.length,
    };
    setLocalStages([...localStages, newStage]);
  };

  const handleRemoveStage = (id: string) => {
    setLocalStages(localStages.filter(s => s.id !== id));
  };

  const handleUpdateStage = (id: string, updates: Partial<PipelineStage>) => {
    setLocalStages(localStages.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSave = () => {
    onUpdateStages(localStages);
    alert('Pipeline stages updated successfully!');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sales Pipeline Stages</h2>
          <p className="text-sm text-slate-500">Customize the stages of your sales funnel</p>
        </div>
        <button 
          onClick={handleAddStage}
          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {localStages.sort((a, b) => a.order - b.order).map((stage, index) => (
          <div key={stage.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
            <div className="cursor-grab text-slate-300 hover:text-slate-500">
              <GripVertical size={20} />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text"
                value={stage.label}
                onChange={(e) => handleUpdateStage(stage.id, { label: e.target.value })}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
              
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleUpdateStage(stage.id, { color })}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all shrink-0",
                      color.split(' ')[0],
                      stage.color === color ? "border-blue-500 scale-110 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={() => handleRemoveStage(stage.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <div className="pt-4">
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Pipeline Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
