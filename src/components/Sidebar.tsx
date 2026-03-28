import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  CheckSquare, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  MapPin,
  Briefcase,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
}

export function Sidebar({ role, onLogout }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: Target, label: 'Performance Drilldown', path: '/performance', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: UserPlus, label: 'Leads', path: '/leads', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: Briefcase, label: 'Pipeline', path: '/pipeline', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: Calendar, label: 'Visits', path: '/visits', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: FileText, label: 'Quotations', path: '/quotations', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: BarChart3, label: 'Reports', path: '/reports', roles: ['ADMIN', 'VP', 'TEAM_LEADER'] },
    { icon: Users, label: 'Team', path: '/team', roles: ['ADMIN', 'VP', 'TEAM_LEADER'] },
    { icon: MapPin, label: 'Field Tracking', path: '/tracking', roles: ['ADMIN', 'VP'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['ADMIN'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">Vision CRM</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{role.replace('_', ' ')}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
