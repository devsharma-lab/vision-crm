import React from 'react';
import { UserProfile, UserRole } from '../types';
import { cn, formatDate } from '../lib/utils';
import { Users, UserPlus, Mail, Shield, ChevronRight, MoreVertical, Search, Filter } from 'lucide-react';

interface TeamManagementProps {
  users: UserProfile[];
  onAddUser: () => void;
  onEditUser: (user: UserProfile) => void;
}

export function TeamManagement({ users, onAddUser, onEditUser }: TeamManagementProps) {
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<UserRole | 'ALL'>('ALL');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.displayName.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'VP': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'TEAM_LEADER': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Team Management</h2>
        <button 
          onClick={onAddUser}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all text-sm md:text-base"
        >
          <UserPlus size={18} />
          Add Team Member
        </button>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
            placeholder="Search team..."
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        </div>

        <div className="relative">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="w-full md:w-auto pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs md:text-sm font-bold text-slate-600 appearance-none uppercase tracking-wider"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="VP">VP</option>
            <option value="TEAM_LEADER">Team Leader</option>
            <option value="SALES_EXECUTIVE">Sales Executive</option>
          </select>
          <Filter className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredUsers.map((user) => (
          <div 
            key={user.uid} 
            onClick={() => onEditUser(user)}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white flex items-center justify-center text-lg font-bold text-slate-600 overflow-hidden shadow-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  user.displayName.charAt(0)
                )}
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.displayName}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Mail size={12} />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className={cn("px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest", getRoleBadgeColor(user.role))}>
                {user.role.replace('_', ' ')}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Joined {formatDate(user.createdAt)}
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
