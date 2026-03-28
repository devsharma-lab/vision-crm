import React from 'react';
import { Lead } from '../types';
import { DashboardCard } from './DashboardCard';
import { Users, UserPlus, CheckCircle2, XCircle, TrendingUp, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface LeadStatsProps {
  leads: Lead[];
}

export function LeadStats({ leads }: LeadStatsProps) {
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === 'WON').length;
  const lostLeads = leads.filter(l => l.status === 'LOST').length;
  const totalRevenue = leads.filter(l => l.status === 'WON').reduce((sum, l) => sum + l.budget, 0);
  const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <DashboardCard 
        title="Total Leads" 
        value={totalLeads} 
        icon={Users} 
        trend={{ value: 12, isPositive: true }} 
      />
      <DashboardCard 
        title="Conversions" 
        value={wonLeads} 
        icon={CheckCircle2} 
        trend={{ value: 8, isPositive: true }} 
      />
      <DashboardCard 
        title="Conversion Rate" 
        value={`${conversionRate.toFixed(1)}%`} 
        icon={TrendingUp} 
        trend={{ value: 2, isPositive: true }} 
      />
      <DashboardCard 
        title="Total Revenue" 
        value={formatCurrency(totalRevenue)} 
        icon={IndianRupee} 
        trend={{ value: 15, isPositive: true }} 
      />
    </div>
  );
}
