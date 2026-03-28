import React from 'react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { ChevronRight, Users, User, Shield, Briefcase, ArrowLeft } from 'lucide-react';

interface HierarchyDrilldownProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  viewingUser: UserProfile;
  onDrillDown: (user: UserProfile) => void;
  onGoBack: () => void;
}

export function HierarchyDrilldown({ 
  currentUser, 
  allUsers, 
  viewingUser, 
  onDrillDown, 
  onGoBack 
}: HierarchyDrilldownProps) {
  const subordinates = allUsers.filter(u => u.parentUid === viewingUser.uid);
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield size={16} className="text-rose-500" />;
      case 'VP': return <Briefcase size={16} className="text-indigo-500" />;
      case 'TEAM_LEADER': return <Users size={16} className="text-amber-500" />;
      default: return <User size={16} className="text-blue-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'VP': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'TEAM_LEADER': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          {viewingUser.uid !== currentUser.uid && (
            <button 
              onClick={onGoBack}
              className="p-1.5 md:p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500"
            >
              <ArrowLeft size={18} className="md:w-5 md:h-5" />
            </button>
          )}
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">Organization Hierarchy</h3>
            <p className="text-[10px] md:text-sm text-slate-500 mt-0.5">Viewing: <span className="font-bold text-slate-700">{viewingUser.displayName}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider w-fit">
          <Users size={12} className="md:w-[14px] md:h-[14px]" />
          {subordinates.length} Subordinates
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {subordinates.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <User size={24} />
            </div>
            <p className="text-slate-500 font-medium">No direct reports found for this user.</p>
          </div>
        ) : (
          subordinates.map((sub) => (
            <div 
              key={sub.uid}
              onClick={() => onDrillDown(sub)}
              className="p-4 hover:bg-slate-50 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                  {sub.photoURL ? (
                    <img src={sub.photoURL} alt={sub.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    sub.displayName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{sub.displayName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center gap-1", getRoleColor(sub.role))}>
                      {getRoleIcon(sub.role)}
                      {sub.role.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900">Team: {sub.teamId || 'N/A'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Joined {new Date(sub.createdAt).toLocaleDateString()}</p>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
