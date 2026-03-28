import React from 'react';
import { cn } from '../lib/utils';
import { PipelineStage } from '../types';

interface LeadStatusBadgeProps {
  status: string;
  stages: PipelineStage[];
}

export function LeadStatusBadge({ status, stages }: LeadStatusBadgeProps) {
  const stage = stages.find(s => s.id === status);
  const color = stage?.color || 'bg-slate-100 text-slate-600 border-slate-200';
  const label = stage?.label || status;

  return (
    <div className={cn(
      "px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider",
      color
    )}>
      {label}
    </div>
  );
}
