import React from 'react';
import { cn } from '../lib/utils';
import { Globe, MessageSquare, ShoppingCart, User } from 'lucide-react';

interface LeadSourceBadgeProps {
  source: 'INDIAMART' | 'WEBSITE' | 'WHATSAPP' | 'MANUAL';
}

export function LeadSourceBadge({ source }: LeadSourceBadgeProps) {
  const getSourceIcon = (s: string) => {
    switch (s) {
      case 'INDIAMART': return <ShoppingCart size={12} />;
      case 'WEBSITE': return <Globe size={12} />;
      case 'WHATSAPP': return <MessageSquare size={12} />;
      default: return <User size={12} />;
    }
  };

  const getSourceColor = (s: string) => {
    switch (s) {
      case 'INDIAMART': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'WEBSITE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'WHATSAPP': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider",
      getSourceColor(source)
    )}>
      {getSourceIcon(source)}
      <span>{source}</span>
    </div>
  );
}
