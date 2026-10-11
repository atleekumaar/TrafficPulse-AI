'use client';

import React from 'react';
import { hourlyCongestionData } from '@/lib/mockData';
import { formatNumber } from '@/lib/utils';
import { Clock } from 'lucide-react';

export const HourlyHeatmap: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm shadow-sm flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            24-Hour Congestion Diurnal Distribution
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Thresholds: Low &lt;2.5k | Med 2.5k–4.5k | High &gt;4.5k
        </span>
      </div>

      <p className="text-xs text-slate-400 mt-2 mb-4">
        Average corridor flow across diurnal cycles. Highlights morning (07:00–09:00) and evening (16:00–19:00) rush-hour bottlenecks.
      </p>

      {/* Grid of 24 Hour Blocks */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
        {hourlyCongestionData.map((slot) => {
          const isHigh = slot.congestionLevel === 'High';
          const isMed = slot.congestionLevel === 'Medium';
          const bgClass = isHigh
            ? 'bg-rose-950/70 border-rose-800/60 text-rose-200 hover:bg-rose-900/80'
            : isMed
            ? 'bg-amber-950/60 border-amber-800/60 text-amber-200 hover:bg-amber-900/80'
            : 'bg-emerald-950/50 border-emerald-800/50 text-emerald-200 hover:bg-emerald-900/70';

          return (
            <div
              key={slot.hour}
              className={`flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all cursor-default ${bgClass}`}
              title={`Hour ${slot.label}: ~${formatNumber(slot.avgVolume)} vehicles/hr (${slot.congestionLevel})`}
            >
              <span className="text-[11px] font-mono font-medium opacity-80">{slot.label}</span>
              <span className="text-xs font-bold font-mono my-1">{Math.round(slot.avgVolume / 100) / 10}k</span>
              <span className={`text-[9px] uppercase font-bold tracking-wider px-1 rounded ${
                isHigh ? 'bg-rose-500/20 text-rose-300' : isMed ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {slot.congestionLevel[0]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Low Congestion
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" /> High (Rush Hour)
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">17,520 Synthetic Observations</span>
      </div>
    </div>
  );
};
