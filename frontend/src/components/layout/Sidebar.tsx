'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  MapPin,
  History,
  Activity,
  Database,
  Radio,
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/traffic-forecast', label: 'Traffic Forecast', icon: TrendingUp },
  { href: '/congestion-map', label: 'Congestion Map', icon: MapPin },
  { href: '/historical-analysis', label: 'Historical Analysis', icon: History },
  { href: '/model-performance', label: 'Model Performance', icon: Activity },
  { href: '/data-sources', label: 'Data Sources', icon: Database },
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col bg-slate-950 border-r border-slate-800/80 h-full min-h-screen text-slate-200">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
            <Radio className="h-5 w-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="font-semibold text-base tracking-tight text-white flex items-center gap-1.5">
              TrafficPulse <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">AI</span>
            </div>
            <div className="text-[11px] text-slate-400">Smart-City Forecasting</div>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Intelligence Platform
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Architecture</span>
            <span className="font-mono text-cyan-400 font-semibold">Phase 1</span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Frontend foundation active. Python ML backend decoupling ready.
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <span>Legacy Streamlit</span>
            <span className="font-mono text-slate-400">Port :8501</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
