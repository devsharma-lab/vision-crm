import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Briefcase, 
  Target,
  BarChart3,
  Calendar,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserRole } from '../types';

interface MobileNavProps {
  role: UserRole;
}

export function MobileNav({ role }: MobileNavProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: Target, label: 'Perf', path: '/performance', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: UserPlus, label: 'Leads', path: '/leads', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: Briefcase, label: 'Pipe', path: '/pipeline', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: Calendar, label: 'Visits', path: '/visits', roles: ['ADMIN', 'VP', 'TEAM_LEADER', 'SALES_EXECUTIVE'] },
    { icon: Settings, label: 'Set', path: '/settings', roles: ['ADMIN'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 flex justify-around items-center z-50 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {filteredItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
            isActive 
              ? "text-blue-600" 
              : "text-slate-400"
          )}
        >
          <item.icon size={20} className={cn("transition-transform", "active:scale-90")} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
