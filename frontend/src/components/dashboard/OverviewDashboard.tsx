'use client';

import React, { useState } from 'react';
import { ForecastHorizon } from '@/types/traffic';
import { MetricCard } from '@/components/ui/MetricCard';
import { TrafficForecastChart } from '@/components/charts/TrafficForecastChart';
import { HourlyHeatmap } from '@/components/charts/HourlyHeatmap';
import { RushHourTrendChart } from '@/components/charts/RushHourTrendChart';
import { upstreamModelBenchmarks, recentEvaluationRecords } from '@/lib/mockData';
import { formatNumber, formatPercentage, getCongestionBadgeProps } from '@/lib/utils';
import {
  Car,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

export const OverviewDashboard: React.FC = () => {
  const [horizon, setHorizon] = useState<ForecastHorizon>(30);

  // Derive estimated values based on active horizon
  const projectedVolume = horizon === 15 ? 4920 : horizon === 30 ? 5150 : 5380;
  const currentVolume = 4850;

  return (
    <div className="space-y-6">
      {/* Honest Data Integrity Notice */}
      <div className="rounded-xl border border-amber-900/60 bg-gradient-to-r from-amber-950/40 to-slate-900/60 p-4 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <span className="font-semibold text-amber-300">Phase 1 Foundation Mode:</span>{' '}
            Visualizing preserved upstream synthetic benchmark data (UCI Minneapolis interstate corridor).{' '}
            <span className="text-amber-300/80">Live streaming ingestion and FastAPI prediction endpoints are unconfigured.</span>
          </div>
        </div>
        <Link
          href="/data-sources"
          className="shrink-0 text-xs font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1"
        >
          View Data Provenance <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Corridor Baseline Flow"
          value={`${formatNumber(currentVolume)} veh/h`}
          subtext="I-94 Minneapolis cross-section"
          badge="HIGH CONGESTION"
          badgeVariant="rose"
          icon={<Car className="h-4 w-4 text-cyan-400" />}
          hint="Synthetic Base"
        />
        <MetricCard
          title={`Forecast (+${horizon}m Horizon)`}
          value={`${formatNumber(projectedVolume)} veh/h`}
          subtext={`Estimated change: +${formatNumber(projectedVolume - currentVolume)} veh/h`}
          badge={`+${horizon}m Selected`}
          badgeVariant="cyan"
          icon={<TrendingUp className="h-4 w-4 text-cyan-400" />}
          hint="RF Inference"
        />
        <MetricCard
          title="Peak Evening Rush Window"
          value="16:00 – 19:00"
          subtext="Max capacity utilization: 5,420 veh/h"
          badge="DIURNAL PEAK"
          badgeVariant="amber"
          icon={<Clock className="h-4 w-4 text-amber-400" />}
          hint="Corridor Model"
        />
        <MetricCard
          title="Best Model R² Score"
          value="0.9465"
          subtext="Random Forest Regressor (MAE: 341.77)"
          badge="UPSTREAM BENCH"
          badgeVariant="emerald"
          icon={<Sparkles className="h-4 w-4 text-emerald-400" />}
          hint="38.2 MB Recovered"
        />
      </div>

      {/* Primary Forecast Chart with Horizon Controls */}
      <TrafficForecastChart initialHorizon={horizon} onHorizonChange={setHorizon} />

      {/* Diurnal Heatmap & Rush Hour Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyHeatmap />
        <RushHourTrendChart />
      </div>

      {/* Model Benchmark Performance Summary */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Preserved Model Evaluation Benchmarks
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Audited upstream test-set metrics and artifact serialization status
            </p>
          </div>
          <Link
            href="/model-performance"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            Full Model Registry <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3">Task</th>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3 text-right">Primary Metric</th>
                <th className="py-2.5 px-3 text-right">Secondary Metric</th>
                <th className="py-2.5 px-3 text-center">Runtime Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {upstreamModelBenchmarks.slice(0, 4).map((m, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-100">{m.modelName}</td>
                  <td className="py-2.5 px-3 capitalize text-slate-400 font-mono">{m.task}</td>
                  <td className="py-2.5 px-3 text-slate-400">{m.algorithm}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-cyan-300">
                    {m.primaryMetricName}: {m.primaryMetricValue}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                    {m.secondaryMetricValue}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                        m.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                      }`}
                    >
                      {m.status === 'active' ? 'Artifact Ready' : 'Scikit Incompat'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Actual vs Predicted Observation Benchmark Records */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              Observed vs. Forecasted Evaluation Benchmark
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological test split observations compared against Random Forest outputs
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
            Datasets/test_data.csv
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Record ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Horizon</th>
                <th className="py-2.5 px-3 text-right">Actual Vol</th>
                <th className="py-2.5 px-3 text-right">Predicted Vol</th>
                <th className="py-2.5 px-3 text-right">Error (Veh)</th>
                <th className="py-2.5 px-3 text-center">Congestion Match</th>
                <th className="py-2.5 px-3 text-right">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {recentEvaluationRecords.map((rec) => {
                const badge = getCongestionBadgeProps(rec.predictedLevel);
                return (
                  <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400">{rec.id}</td>
                    <td className="py-2.5 px-3 text-slate-200">{rec.timestamp}</td>
                    <td className="py-2.5 px-3 text-cyan-400">+{rec.horizonMinutes}m</td>
                    <td className="py-2.5 px-3 text-right text-slate-100">
                      {formatNumber(rec.actualVolume)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-indigo-300 font-semibold">
                      {formatNumber(rec.predictedVolume)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      ±{rec.absoluteError} ({formatPercentage(rec.percentageError)})
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border ${badge.bg} ${badge.text} ${badge.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                        {rec.predictedLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[10px] text-amber-400/80">
                      SYNTHETIC
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
