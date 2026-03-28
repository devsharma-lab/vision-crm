import React from 'react';
import { Lead, UserProfile, PipelineStage } from '../types';
import { cn } from '../lib/utils';
import { X, Save, UserPlus, Phone, MapPin, IndianRupee, FileText, User } from 'lucide-react';

interface LeadFormProps {
  onClose: () => void;
  onSubmit: (data: Partial<Lead>) => void;
  users: UserProfile[];
  stages: PipelineStage[];
}

export function LeadForm({ onClose, onSubmit, users, stages }: LeadFormProps) {
  const [formData, setFormData] = React.useState<Partial<Lead>>({
    name: '',
    phone: '',
    location: '',
    budget: 0,
    requirement: '',
    source: 'MANUAL',
    status: stages[0]?.id || '',
    assignedTo: users[0]?.uid || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-xl">
              <UserPlus size={20} className="md:w-6 md:h-6" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">Create New Lead</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-all"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="John Doe"
                />
                <UserPlus className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="+91 98765 43210"
                />
                <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="Mumbai, Maharashtra"
                />
                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget (INR)</label>
              <div className="relative">
                <input 
                  type="number" 
                  required
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="50,0,000"
                />
                <IndianRupee className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source</label>
              <select 
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
              >
                <option value="MANUAL">Manual Entry</option>
                <option value="INDIAMART">IndiaMART</option>
                <option value="WEBSITE">Website Form</option>
                <option value="WHATSAPP">WhatsApp Campaign</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
              >
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assign To</label>
              <div className="relative">
                <select 
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                >
                  {users.map(u => (
                    <option key={u.uid} value={u.uid}>{u.displayName} ({u.role.replace('_', ' ')})</option>
                  ))}
                </select>
                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirement Details</label>
            <div className="relative">
              <textarea 
                required
                value={formData.requirement}
                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium h-32 resize-none"
                placeholder="Describe the client's specific requirements..."
              />
              <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 md:py-4 bg-white border border-slate-200 text-slate-700 rounded-xl md:rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm md:text-base"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Save size={18} className="md:w-5 md:h-5" />
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
