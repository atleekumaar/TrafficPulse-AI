'use client';

import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MetricCard } from '@/components/ui/MetricCard';
import { RushHourTrendChart } from '@/components/charts/RushHourTrendChart';
import { HourlyHeatmap } from '@/components/charts/HourlyHeatmap';
import {
  History,
  CloudRain,
  Snowflake,
  Calendar,
  Thermometer,
  BarChart2,
} from 'lucide-react';

export default function HistoricalAnalysisPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <History className="h-5 w-5 text-cyan-400" />
            Historical Traffic & Environmental Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Empirical findings derived from 17,520 hourly observations across two calendar years (2020–2022)
          </p>
        </div>
        <StatusBadge label="17,520 OBSERVATIONS" variant="cyan" />
      </div>

      {/* High-Level Impact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Heavy Rain Impact"
          value="-30%"
          subtext="Precipitation > 5mm/hour"
          badge="SUPPRESSED"
          badgeVariant="rose"
          icon={<CloudRain className="h-4 w-4 text-cyan-400" />}
          hint="Weather Effect"
        />
        <MetricCard
          title="Heavy Snow Impact"
          value="-40%"
          subtext="Snowfall > 1mm/hour"
          badge="MAJOR SHIFT"
          badgeVariant="rose"
          icon={<Snowflake className="h-4 w-4 text-cyan-400" />}
          hint="Winter Friction"
        />
        <MetricCard
          title="Average Holiday Effect"
          value="-24%"
          subtext="Christmas/New Year: -40%"
          badge="COMMUTER DIP"
          badgeVariant="amber"
          icon={<Calendar className="h-4 w-4 text-amber-400" />}
          hint="Calendar Pattern"
        />
        <MetricCard
          title="Busiest Days of Week"
          value="Thu / Fri"
          subtext="Avg ~4,350 veh/h vs Sunday ~2,600"
          badge="WEEKDAY PEAK"
          badgeVariant="cyan"
          icon={<BarChart2 className="h-4 w-4 text-cyan-400" />}
          hint="Weekly Cycle"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyHeatmap />
        <RushHourTrendChart />
      </div>

      {/* Detailed Weather & Temporal Correlation Findings */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-cyan-400" />
          Factor Sensitivity Analysis from Exploratory Research
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200 text-sm flex items-center justify-between">
              <span>Temperature Curves</span>
              <span className="font-mono text-cyan-400">15°C – 20°C</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Highest sustained highway volume occurs in mild temperatures. Sub-zero temperatures (&lt;0°C) reduce aggregate highway traffic by ~20% as non-essential travel is deferred.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200 text-sm flex items-center justify-between">
              <span>Event Magnitude</span>
              <span className="font-mono text-indigo-400">+3% to +15%</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Large evening concerts and stadium sporting events trigger localized secondary rush hours between 18:00 and 22:00, adding up to 800 additional vehicles per hour.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200 text-sm flex items-center justify-between">
              <span>Autoregressive Memory</span>
              <span className="font-mono text-emerald-400">R = 0.88</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The 24-hour rolling moving average and prior-hour volume account for over 50% of model feature importance, significantly outperforming instantaneous weather variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
