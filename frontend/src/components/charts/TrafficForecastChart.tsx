'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ForecastHorizon } from '@/types/traffic';
import { getForecastSeries } from '@/lib/mockData';
import { formatNumber } from '@/lib/utils';
import { Info } from 'lucide-react';

interface TrafficForecastChartProps {
  initialHorizon?: ForecastHorizon;
  onHorizonChange?: (horizon: ForecastHorizon) => void;
}

export const TrafficForecastChart: React.FC<TrafficForecastChartProps> = ({
  initialHorizon = 30,
  onHorizonChange,
}) => {
  const [horizon, setHorizon] = useState<ForecastHorizon>(initialHorizon);
  const data = getForecastSeries(horizon);

  const handleSelectHorizon = (val: ForecastHorizon) => {
    setHorizon(val);
    if (onHorizonChange) onHorizonChange(val);
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm shadow-sm flex flex-col">
      {/* Chart Header & Horizon Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100">
              Traffic Volume: Actual vs. Forecasted
            </h3>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              Corridor I-94
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly vehicle flow (vehicles/hr) with multi-horizon uncertainty bands
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 px-2 font-medium">Horizon:</span>
          {([15, 30, 60] as ForecastHorizon[]).map((val) => (
            <button
              key={val}
              onClick={() => handleSelectHorizon(val)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                horizon === val
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              +{val}m
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-72 sm:h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              domain={[0, 6000]}
              tickFormatter={(v) => `${v}`}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
                    <div className="font-semibold text-slate-200 pb-1 border-b border-slate-800">
                      Timestamp: {label} ({d.isForecastPeriod ? `Forecast +${horizon}m` : 'Observed'})
                    </div>
                    <div className="mt-2 space-y-1">
                      {d.actualVolume !== null && (
                        <div className="flex items-center justify-between gap-4 text-cyan-300">
                          <span>Actual Volume:</span>
                          <span className="font-mono font-semibold">{formatNumber(d.actualVolume)} veh/h</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-4 text-indigo-300">
                        <span>Predicted Volume:</span>
                        <span className="font-mono font-semibold">{formatNumber(d.predictedVolume)} veh/h</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-slate-400 text-[11px]">
                        <span>95% CI Range:</span>
                        <span className="font-mono">{formatNumber(d.confidenceLower)} – {formatNumber(d.confidenceUpper)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                        <span>Congestion Status:</span>
                        <span className={`font-semibold ${
                          d.congestionLevel === 'High' ? 'text-rose-400' : d.congestionLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {d.congestionLevel}
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
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
              formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
            />
            {/* Uncertainty Upper / Lower Area */}
            <Area
              type="monotone"
              dataKey="confidenceUpper"
              stroke="transparent"
              fill="url(#confidenceBand)"
              name="Confidence Bound (95%)"
            />
            {/* Actual Line */}
            <Line
              type="monotone"
              dataKey="actualVolume"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#38bdf8', strokeWidth: 1, stroke: '#0f172a' }}
              name="Observed Traffic (Vehicles/hr)"
              connectNulls={false}
            />
            {/* Predicted Line */}
            <Line
              type="monotone"
              dataKey="predictedVolume"
              stroke="#818cf8"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#818cf8', strokeWidth: 1, stroke: '#0f172a' }}
              name={`Predicted (+${horizon}m Horizon)`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Disclaimers & Integrity Notice */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>Solid line = Preserved test benchmark observations; Dashed line = Random Forest inference curve.</span>
        </div>
        <span className="font-mono text-amber-400/80 hidden sm:inline">SYNTHETIC BENCHMARK</span>
      </div>
    </div>
  );
};
