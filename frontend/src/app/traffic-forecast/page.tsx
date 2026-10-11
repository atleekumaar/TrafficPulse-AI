'use client';

import React, { useState } from 'react';
import { TrafficForecastChart } from '@/components/charts/TrafficForecastChart';
import { ForecastHorizon } from '@/types/traffic';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  TrendingUp,
  Cpu,
  CloudRain,
  Sun,
  Calendar,
  AlertCircle,
  Code2,
} from 'lucide-react';

export default function TrafficForecastPage() {
  const [horizon, setHorizon] = useState<ForecastHorizon>(30);
  const [weatherCondition, setWeatherCondition] = useState<'Clear' | 'Rain' | 'Snow'>('Clear');
  const [hasEvent, setHasEvent] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Multi-Horizon Traffic Volume Forecasting
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate 15, 30, and 60-minute lookahead horizons on the Minneapolis I-94 interstate corridor
          </p>
        </div>
        <StatusBadge label="PHASE 2 BACKEND TARGET" variant="cyan" />
      </div>

      {/* Main Interactive Forecast Chart */}
      <TrafficForecastChart initialHorizon={horizon} onHorizonChange={setHorizon} />

      {/* Forecasting Architecture & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Controls Panel */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              Scenario Simulation
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Preview</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">
                Forecast Horizon Window
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([15, 30, 60] as ForecastHorizon[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                      horizon === h
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    +{h} mins
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">
                Simulated Weather Factor
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Clear', icon: Sun, label: 'Clear' },
                  { id: 'Rain', icon: CloudRain, label: 'Rain (-25%)' },
                  { id: 'Snow', icon: CloudRain, label: 'Snow (-35%)' },
                ].map((w) => {
                  const Icon = w.icon;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setWeatherCondition(w.id as 'Clear' | 'Rain' | 'Snow')}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                        weatherCondition === w.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-[11px]">{w.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">
                Major Metropolitan Event
              </label>
              <button
                onClick={() => setHasEvent(!hasEvent)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
                  hasEvent
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Concert / Stadium Event (+12%)
                </span>
                <span className="font-mono text-[11px]">{hasEvent ? 'ACTIVE' : 'NONE'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Horizon Mechanics Note */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-slate-100">
              <Code2 className="h-4 w-4 text-cyan-400" />
              Multi-Horizon Forecast Architecture
            </div>
            <div className="mt-3 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                The upstream model operates on 1-hour discretized steps utilizing autoregressive lag features (<code className="text-cyan-300 font-mono">traffic_prev_hour</code>, <code className="text-cyan-300 font-mono">traffic_prev_day</code>).
              </p>
              <p>
                In <strong>Phase 2</strong>, the FastAPI backend will introduce two complementary prediction pathways:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>
                  <strong className="text-slate-200">15-minute / 30-minute horizons:</strong> Direct interpolative step forecasting with decay coefficients on $t-1$ autoregressive variance.
                </li>
                <li>
                  <strong className="text-slate-200">60-minute horizon:</strong> Direct model inference matching the upstream 43-feature input vector with 95% confidence bounds.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 text-[11px] text-slate-400 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Phase 1 Status:</strong> Simulation controls demonstrate planned API parameters specified in <code className="text-cyan-400 font-mono">docs/ARCHITECTURE.md</code>. No live prediction API is currently deployed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
