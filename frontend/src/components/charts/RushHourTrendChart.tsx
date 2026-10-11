'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { rushHourComparisonData } from '@/lib/mockData';
import { formatNumber } from '@/lib/utils';

export const RushHourTrendChart: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm shadow-sm flex flex-col">
      <div className="pb-3 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-100">
          Rush-Hour Flow: Weekday vs. Weekend
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Comparative volume showing commuter peaks vs recreational weekend dispersion
        </p>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rushHourComparisonData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              interval={2}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              domain={[0, 6000]}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const weekday = payload.find((p) => p.dataKey === 'weekdayVolume')?.value as number;
                const weekend = payload.find((p) => p.dataKey === 'weekendVolume')?.value as number;
                return (
                  <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
                    <div className="font-semibold text-slate-200 pb-1 border-b border-slate-800">
                      Time: {label}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between gap-4 text-cyan-300">
                        <span>Weekday Flow:</span>
                        <span className="font-mono font-semibold">{formatNumber(weekday)} veh/h</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-indigo-300">
                        <span>Weekend Flow:</span>
                        <span className="font-mono font-semibold">{formatNumber(weekend)} veh/h</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                        <span>Commuter Lift:</span>
                        <span className="font-mono text-emerald-400">
                          +{formatNumber(Math.max(0, weekday - weekend))} veh/h
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
              formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
            />
            <Bar
              dataKey="weekdayVolume"
              name="Weekday Volume"
              fill="#06b6d4"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="weekendVolume"
              name="Weekend Volume"
              fill="#6366f1"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Weekdays peak +33% higher during 08:00 and 17:00 rush hours.</span>
        <span className="font-mono text-cyan-400">UCI Replication</span>
      </div>
    </div>
  );
};
