'use client';

import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { upstreamModelBenchmarks } from '@/lib/mockData';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react';

export default function ModelPerformancePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            Model Performance & Artifact Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audited evaluation benchmarks for all 8 machine learning models on the chronological test split
          </p>
        </div>
        <StatusBadge label="AUDITED FROM GIT LFS" variant="emerald" />
      </div>

      {/* Scikit-Learn Compatibility Alert */}
      <div className="rounded-xl border border-amber-900/60 bg-gradient-to-r from-amber-950/40 to-slate-900/60 p-5 backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          Technical Audit Finding: Scikit-Learn Version Serialization
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The upstream models were serialized using <code className="text-amber-300 font-mono">scikit-learn 1.7.2</code>. While Random Forest (38.2 MB), Linear, Ridge, Lasso, and SVM artifacts unpickle correctly, the Gradient Boosting Regressor fails in newer environments (e.g. scikit-learn 1.9+) due to an internal <code className="text-amber-300 font-mono">_loss</code> module refactor. In Phase 2, clean re-serialization or a pinned microservice environment (<code className="text-cyan-300 font-mono">scikit-learn==1.7.2</code>) will be enforced.
        </p>
      </div>

      {/* Model Benchmarks Table */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            Comparative Benchmark Results (Test Split: 3,504 Records)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Chronological Split: 2021-09-15 to 2022-01-01</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Model</th>
                <th className="py-3 px-3">Task</th>
                <th className="py-3 px-3">Algorithm</th>
                <th className="py-3 px-3 text-right">Primary Metric</th>
                <th className="py-3 px-3 text-right">Secondary Metric</th>
                <th className="py-3 px-3 text-center">Runtime State</th>
                <th className="py-3 px-3">Artifact Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {upstreamModelBenchmarks.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-100">{m.modelName}</td>
                  <td className="py-3 px-3 capitalize font-mono text-slate-400">{m.task}</td>
                  <td className="py-3 px-3 text-slate-400">{m.algorithm}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-cyan-300">
                    {m.primaryMetricName}: {m.primaryMetricValue}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    {m.secondaryMetricName}: {m.secondaryMetricValue}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-[10px] font-medium border ${
                        m.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                      }`}
                    >
                      {m.status === 'active' ? 'Binary Intact' : 'Version Incompatible'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Input Requirements & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100 border-b border-slate-800 pb-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            Top Predictive Features (Random Forest Importance)
          </div>
          <div className="space-y-2.5 text-xs pt-1">
            {[
              { name: 'traffic_rolling_mean_24h', imp: 0.28, desc: '24-hour moving volume average' },
              { name: 'traffic_prev_hour', imp: 0.22, desc: 'T-1 hour continuous traffic volume' },
              { name: 'hour', imp: 0.15, desc: 'Hour of day (0 to 23)' },
              { name: 'day_of_week', imp: 0.09, desc: 'Weekday index (0=Monday, 6=Sunday)' },
              { name: 'is_rush_hour', imp: 0.05, desc: 'Binary peak morning/evening flag' },
              { name: 'total_precipitation', imp: 0.03, desc: 'Combined rain & snow volume (mm/h)' },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-cyan-300 font-semibold">{f.name}</div>
                  <div className="text-[11px] text-slate-400">{f.desc}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-100">{(f.imp * 100).toFixed(0)}%</div>
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${f.imp * 100 * 2.5}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100 border-b border-slate-800 pb-2">
            <Terminal className="h-4 w-4 text-indigo-400" />
            Inference Feature Vector Order (43 Features)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every model requires an exact 43-column aligned vector before prediction. Order matches training data columns:
          </p>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 overflow-x-auto max-h-48">
            <code>
              temp, rain_1h, snow_1h, clouds_all, temperature_2m, precipitation, windspeed_10m,
              cloudcover, expected_attendance, hour, day_of_week, day_of_month, month, year,
              week_of_year, is_weekend, is_holiday, is_rush_hour, temp_celsius, total_precipitation,
              bad_weather, traffic_prev_hour, traffic_prev_day, traffic_prev_week,
              traffic_rolling_mean_6h, traffic_rolling_std_6h, traffic_rolling_mean_24h,
              weather_main_Clouds, weather_main_Partly Cloudy, weather_main_Rain, weather_main_Snow,
              time_of_day_Morning, time_of_day_Afternoon, time_of_day_Evening, season_Spring,
              season_Summer, season_Fall, event_type_Conference, event_type_Fair, event_type_Festival,
              event_type_Sports, event_size_Medium, event_size_Small
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
