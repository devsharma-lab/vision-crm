import React from 'react';
import { cn, formatCurrency } from '../lib/utils';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';

interface LeaderboardItem {
  id: string;
  name: string;
  role: string;
  conversions: number;
  revenue: number;
  photoURL?: string;
}

interface LeaderboardProps {
  items: LeaderboardItem[];
  title: string;
}

export function Leaderboard({ items, title }: LeaderboardProps) {
  const sortedItems = [...items].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
        <TrendingUp size={14} className="text-blue-600 md:w-4 md:h-4" />
      </div>

      <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {sortedItems.map((item, index) => (
          <div 
            key={item.id} 
            className={cn(
              "flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-xl transition-all duration-200",
              index === 0 ? "bg-blue-50/50 border border-blue-100" : "hover:bg-slate-50"
            )}
          >
            <div className="flex-shrink-0 w-6 md:w-8 flex justify-center">
              {index === 0 ? (
                <Trophy className="text-amber-500 md:w-5 md:h-5" size={16} />
              ) : index === 1 ? (
                <Medal className="text-slate-400 md:w-5 md:h-5" size={16} />
              ) : index === 2 ? (
                <Medal className="text-amber-700 md:w-5 md:h-5" size={16} />
              ) : (
                <span className="text-xs md:text-sm font-bold text-slate-400">#{index + 1}</span>
              )}
            </div>

            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs md:text-sm font-bold text-slate-600 overflow-hidden">
              {item.photoURL ? (
                <img src={item.photoURL} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                item.name.charAt(0)
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-bold text-slate-900 truncate">{item.name}</p>
              <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest truncate">{item.role}</p>
            </div>

            <div className="text-right">
              <p className="text-xs md:text-sm font-bold text-slate-900">{formatCurrency(item.revenue)}</p>
              <p className="text-[8px] md:text-[10px] text-emerald-600 font-bold uppercase">{item.conversions} Wins</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
