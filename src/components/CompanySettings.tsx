import React from 'react';
import { CompanyInfo } from '../types';
import { Save, Building, Phone, Mail, Globe, MapPin, Upload } from 'lucide-react';

interface CompanySettingsProps {
  companyInfo: CompanyInfo;
  onUpdateCompany: (info: CompanyInfo) => void;
}

export function CompanySettings({ companyInfo, onUpdateCompany }: CompanySettingsProps) {
  const [formData, setFormData] = React.useState<CompanyInfo>(companyInfo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(formData);
    alert('Company information updated successfully!');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Company Information</h2>
        <p className="text-sm text-slate-500">Manage your organization's details and branding</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 group hover:border-blue-400 transition-all cursor-pointer">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:scale-105 transition-transform">
            <img 
              src={formData.logoUrl} 
              alt="Company Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Upload size={24} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Change Logo</p>
          <p className="text-xs text-slate-400 mt-1">Recommended size: 200x200px</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                placeholder="Vision CRM Ltd."
              />
              <Building className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                placeholder="123 Business St, City"
              />
              <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="+91 123 456 7890"
                />
                <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="contact@vision.com"
                />
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                placeholder="www.visioncrm.com"
              />
              <Globe className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Company Details
          </button>
        </div>
      </form>
    </div>
  );
}
