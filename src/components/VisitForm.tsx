import React from 'react';
import { Lead, SiteVisit } from '../types';
import { cn } from '../lib/utils';
import { X, Save, Calendar, MapPin, FileText, Clock, Navigation, Loader2 } from 'lucide-react';

interface VisitFormProps {
  lead: Lead;
  onClose: () => void;
  onSubmit: (data: Partial<SiteVisit>) => void;
}

export function VisitForm({ lead, onClose, onSubmit }: VisitFormProps) {
  const [formData, setFormData] = React.useState<Partial<SiteVisit>>({
    leadId: lead.id,
    title: '',
    plannedDate: new Date().toISOString().split('T')[0],
    status: 'PLANNED',
    notes: ''
  });

  const [isCapturing, setIsCapturing] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsCapturing(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
        setIsCapturing(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError("Unable to retrieve your location. Please ensure location permissions are granted.");
        setIsCapturing(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  React.useEffect(() => {
    if (formData.status === 'COMPLETED' && !formData.location) {
      captureLocation();
    }
  }, [formData.status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData };
    if (formData.status === 'COMPLETED') {
      submissionData.actualDate = new Date().toISOString();
    }
    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Calendar size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Schedule Site Visit</h2>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">For: {lead.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-all"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visit Title / Name</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="e.g., Initial Site Survey, Final Measurement..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              >
                <option value="PLANNED">Planned</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Planned Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  required
                  value={formData.plannedDate}
                  onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                />
                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          {formData.status === 'COMPLETED' && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Navigation size={18} />
                  <span className="text-sm font-bold">Geo-Location Capture</span>
                </div>
                <button 
                  type="button"
                  onClick={captureLocation}
                  disabled={isCapturing}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
                >
                  {isCapturing ? <Loader2 size={12} className="animate-spin" /> : null}
                  {formData.location ? 'Recapture' : 'Capture Now'}
                </button>
              </div>

              {isCapturing && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 animate-pulse">
                  <Loader2 size={14} className="animate-spin" />
                  Capturing precise coordinates...
                </div>
              )}

              {formData.location && !isCapturing && (
                <div className="bg-white/60 p-3 rounded-xl border border-emerald-100/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Latitude</p>
                      <p className="text-sm font-mono font-bold text-slate-700">{formData.location.latitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Longitude</p>
                      <p className="text-sm font-mono font-bold text-slate-700">{formData.location.longitude.toFixed(6)}</p>
                    </div>
                  </div>
                </div>
              )}

              {locationError && (
                <p className="text-xs text-rose-500 font-medium">{locationError}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
            <div className="relative">
              <input 
                type="text" 
                readOnly
                value={lead.location}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
              <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Notes</label>
            <div className="relative">
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium h-32 resize-none"
                placeholder="Add any specific instructions for the visit..."
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
              {formData.status === 'PLANNED' ? 'Schedule Visit' : 'Save Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
