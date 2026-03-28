import React from 'react';
import { Lead, SiteVisit, UserProfile, PipelineStage } from '../types';
import { ReportChart } from './ReportChart';
import { FunnelChart } from './FunnelChart';
import { Leaderboard } from './Leaderboard';
import { DashboardCard } from './DashboardCard';
import { Users, IndianRupee, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface ReportDashboardProps {
  leads: Lead[];
  visits: SiteVisit[];
  users: UserProfile[];
  stages: PipelineStage[];
}

export function ReportDashboard({ leads, visits, users, stages }: ReportDashboardProps) {
  // Mock data for charts
  const monthlyRevenue = [
    { name: 'Jan', value: 4500000 },
    { name: 'Feb', value: 5200000 },
    { name: 'Mar', value: 4800000 },
    { name: 'Apr', value: 6100000 },
    { name: 'May', value: 5500000 },
    { name: 'Jun', value: 6700000 },
  ];

  const funnelData = stages.sort((a, b) => a.order - b.order).map(stage => {
    const stageLeads = leads.filter(l => l.status === stage.id);
    return {
      label: stage.label,
      count: stageLeads.length,
      value: stageLeads.reduce((sum, l) => sum + l.budget, 0),
      color: stage.color.split(' ')[0]
    };
  });

  const leaderboardItems = users.filter(u => u.role === 'SALES_EXECUTIVE').map(u => ({
    id: u.uid,
    name: u.displayName,
    role: u.role,
    conversions: Math.floor(Math.random() * 10) + 5,
    revenue: Math.floor(Math.random() * 5000000) + 1000000,
    photoURL: u.photoURL
  }));

  const visitEfficiency = [
    { name: 'Planned', value: visits.length },
    { name: 'Completed', value: visits.filter(v => v.status === 'COMPLETED').length },
    { name: 'Cancelled', value: visits.filter(v => v.status === 'CANCELLED').length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Analytics & Reports</h2>
        <div className="flex gap-2 md:gap-3">
          <select className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-bold text-slate-600 outline-none">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
          <button className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-slate-900 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-slate-800 transition-all">
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <DashboardCard title="Total Leads" value={leads.length} icon={Users} trend={{ value: 12, isPositive: true }} />
        <DashboardCard title="Revenue" value={formatCurrency(6745000)} icon={IndianRupee} trend={{ value: 8, isPositive: true }} />
        <DashboardCard title="Conv. Rate" value="4.2%" icon={TrendingUp} trend={{ value: 1.5, isPositive: true }} />
        <DashboardCard title="Visit Succ." value="78%" icon={Calendar} trend={{ value: 5, isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReportChart 
          type="AREA" 
          title="Revenue Forecasting" 
          data={monthlyRevenue} 
          dataKey="value" 
          colors={['#3b82f6']}
        />
        <FunnelChart 
          title="Sales Conversion Funnel" 
          steps={funnelData} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <Leaderboard title="Top Sales Executives" items={leaderboardItems} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ReportChart 
          type="BAR" 
          title="Visit Efficiency" 
          data={visitEfficiency} 
          dataKey="value" 
          colors={['#10b981']}
        />
      </div>
    </div>
  );
}
