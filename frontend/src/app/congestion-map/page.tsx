'use client';

import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MapPin, AlertCircle, Compass, Radio, Layers, ArrowRight } from 'lucide-react';

export default function CongestionMapPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            Corridor Sensor Topology & Spatial Coverage
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Spatial monitoring layout for Interstate 94 (Minneapolis - St. Paul westbound segment)
          </p>
        </div>
        <StatusBadge label="CORRIDOR BENCHMARK TOPOLOGY" variant="amber" />
      </div>

      {/* Geospatial Integrity Notice */}
      <div className="rounded-xl border border-cyan-900/60 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 p-5 backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
          <AlertCircle className="h-4 w-4 text-cyan-400" />
          Engineering Integrity: Dataset Geospatial Scope
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The underlying dataset (inspired by the UCI Metro Interstate Traffic Volume dataset) represents <strong>a single aggregate highway cross-section</strong>. It does not contain lane-by-lane loop detectors, GPS road vectors, or citywide street network graph topologies. To prevent misleading representations, TrafficPulse AI displays honest corridor telemetry rather than fabricated street-level heatmaps.
        </p>
      </div>

      {/* Corridor Sensor Schematic */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              Interstate 94 Monitored Corridor Schematic
            </h3>
            <p className="text-xs text-slate-400">
              Coordinates: 44.9778° N, -93.2650° W • Reference: MnDOT Station 301
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/40">
            Station Status: Benchmark
          </span>
        </div>

        {/* Schematic Corridor Diagram */}
        <div className="relative py-8 px-4 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
          <div className="min-w-[600px] flex items-center justify-between relative">
            {/* Highway Centerline */}
            <div className="absolute left-0 right-0 h-1 bg-slate-800 top-1/2 -translate-y-1/2 z-0" />
            <div className="absolute left-0 right-0 h-0.5 border-t border-dashed border-cyan-500/40 top-1/2 -translate-y-1/2 z-0" />

            {/* Sensor Nodes */}
            {[
              { id: 'NODE-W1', label: 'West Approach', mile: 'MP 233.1', vol: '3,850 veh/h', status: 'Medium' },
              { id: 'NODE-C1', label: 'Central Bottleneck (UCI Benchmark)', mile: 'MP 235.4', vol: '5,120 veh/h', status: 'High' },
              { id: 'NODE-E1', label: 'East Dispersal', mile: 'MP 238.0', vol: '4,100 veh/h', status: 'Medium' },
            ].map((node, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  node.status === 'High'
                    ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/50'
                    : 'bg-amber-950 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/50'
                }`}>
                  <Radio className="h-4 w-4 animate-pulse" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-xs font-semibold text-slate-100">{node.label}</div>
                  <div className="text-[11px] font-mono text-slate-400">{node.mile}</div>
                  <div className={`text-xs font-mono font-bold mt-1 ${
                    node.status === 'High' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {node.vol}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 3 Roadmap Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              Phase 3 Geospatial GIS Integration Plan
            </div>
            <p className="text-slate-400 leading-relaxed">
              When live Minnesota DOT (MnDOT) API ingestion is connected in Phase 3, Mapbox GL / React Leaflet will render vector tile maps with geojson highway segments colored by real-time congestion scores.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
              Available Integration Points
            </div>
            <p className="text-slate-400 leading-relaxed">
              Open-Meteo weather station coords (44.9778°N, -93.2650°W) are already mapped to this corridor in the feature engineering pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
