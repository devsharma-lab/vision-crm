import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function DashboardCard({ title, value, icon: Icon, trend, className }: DashboardCardProps) {
  return (
    <div className={cn("bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-xl md:text-3xl font-bold text-slate-900 mt-1 md:mt-2">{value}</h3>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-1 md:mt-2 text-[10px] md:text-sm font-bold",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}>
              <span>{trend.isPositive ? '+' : '-'}{trend.value}%</span>
              <span className="text-slate-400 font-normal hidden md:inline">vs last month</span>
            </div>
          )}
        </div>
        
        <div className="p-2 md:p-3 bg-slate-50 rounded-xl text-slate-600">
          <Icon size={18} className="md:w-6 md:h-6" />
        </div>
      </div>
    </div>
  );
}
