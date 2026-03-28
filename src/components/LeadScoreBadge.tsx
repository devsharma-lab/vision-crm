import React from 'react';
import { cn } from '../lib/utils';
import { Sparkles } from 'lucide-react';

interface LeadScoreBadgeProps {
  score: number;
}

export function LeadScoreBadge({ score }: LeadScoreBadgeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s >= 50) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Hot';
    if (s >= 50) return 'Warm';
    return 'Cold';
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider",
      getScoreColor(score)
    )}>
      <Sparkles size={10} />
      <span>{getScoreLabel(score)} ({score})</span>
    </div>
  );
}
