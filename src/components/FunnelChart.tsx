import React from 'react';
import { cn, formatCurrency } from '../lib/utils';
import { ArrowDown } from 'lucide-react';

interface FunnelStep {
  label: string;
  count: number;
  value: number;
  color: string;
}

interface FunnelChartProps {
  steps: FunnelStep[];
  title: string;
}

export function FunnelChart({ steps, title }: FunnelChartProps) {
  const maxCount = Math.max(...steps.map(s => s.count));

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
      <h3 className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 md:mb-8">{title}</h3>
      
      <div className="flex-1 space-y-3 md:space-y-4">
        {steps.map((step, index) => {
          const width = (step.count / maxCount) * 100;
          const conversion = index > 0 ? (step.count / steps[index - 1].count) * 100 : 100;

          return (
            <div key={step.label} className="relative">
              {index > 0 && (
                <div className="absolute -top-3.5 md:-top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                  <div className="bg-slate-100 text-[8px] md:text-[10px] font-bold text-slate-500 px-1 md:px-1.5 py-0.5 rounded border border-slate-200">
                    {conversion.toFixed(1)}%
                  </div>
                  <ArrowDown size={10} className="text-slate-300 md:w-3 md:h-3" />
                </div>
              )}
              
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-16 md:w-24 text-right">
                  <p className="text-[10px] md:text-xs font-bold text-slate-900 truncate">{step.label}</p>
                  <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase">{step.count} Leads</p>
                </div>
                
                <div className="flex-1 h-8 md:h-10 bg-slate-50 rounded-lg overflow-hidden relative">
                  <div 
                    className={cn("h-full transition-all duration-1000 ease-out flex items-center justify-end px-2 md:px-4", step.color)}
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-[10px] md:text-xs font-bold text-white drop-shadow-sm truncate">
                      {formatCurrency(step.value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
