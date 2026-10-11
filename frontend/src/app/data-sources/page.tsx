'use client';

import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { dataSourcesList } from '@/lib/mockData';
import {
  Database,
  ShieldCheck,
  FileText,
  Radio,
  Server,
  CloudSun,
} from 'lucide-react';

export default function DataSourcesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            Data Sources & Ingestion Provenance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete inventory of datasets, training corpora, and planned real-time integration channels
          </p>
        </div>
        <StatusBadge label="DATA INTEGRITY DISCLOSED" variant="emerald" />
      </div>

      {/* Provenance Integrity Charter */}
      <div className="rounded-xl border border-cyan-900/60 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 p-5 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          Data Integrity Declaration
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          TrafficPulse AI adheres to transparent data provenance standards. As documented in the Phase 1 ML Audit (<code className="text-cyan-300 font-mono">docs/PHASE_1_AUDIT.md</code>), the current traffic observations were <strong>programmatically generated to replicate UCI Interstate Traffic Volume patterns</strong>. They are preserved for reproducible benchmarking and are NOT presented as live or real-time IoT feeds.
        </p>
      </div>

      {/* Data Source Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dataSourcesList.map((src) => {
          const isConnected = src.status === 'connected';
          const isOffline = src.status === 'offline_file';

          return (
            <div
              key={src.id}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {src.category}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 mt-2">
                      {src.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      isOffline
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40'
                        : isConnected
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isOffline ? 'Offline File' : isConnected ? 'Connected' : 'Unconfigured'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {src.description}
                </p>

                <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Records:</span>
                    <span className="text-slate-200">{src.recordCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Storage:</span>
                    <span className="text-slate-200">{src.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-amber-300/90 italic">
                {src.provenanceNote}
              </div>
            </div>
          );
        })}
      </div>

      {/* Future Phase Ingestion Pipeline */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Server className="h-4 w-4 text-cyan-400" />
          Planned Real-Time Ingestion Architecture (Phase 3)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5" />
              1. DOT 511 / Loop Telemetry
            </div>
            <p className="text-slate-400 leading-relaxed">
              Periodic polling of highway loop sensors to ingest 15-minute rolling vehicle counts and average segment speeds.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <CloudSun className="h-3.5 w-3.5" />
              2. Open-Meteo Live API
            </div>
            <p className="text-slate-400 leading-relaxed">
              Real-time temperature, precipitation rate, and weather severity forecasts mapped automatically into the 43-column feature schema.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              3. Continuous Drift Monitor
            </div>
            <p className="text-slate-400 leading-relaxed">
              Automated divergence scoring between forecasted and observed flows to trigger model recalibration alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
