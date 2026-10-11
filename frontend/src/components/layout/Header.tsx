'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ShieldAlert } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const SECTION_TITLES: Record<string, string> = {
  '/': 'Overview & Congestion Forecast',
  '/traffic-forecast': 'Traffic Forecast Analysis',
  '/congestion-map': 'Corridor Congestion Map',
  '/historical-analysis': 'Historical Trend Analysis',
  '/model-performance': 'Model Performance & Benchmark Registry',
  '/data-sources': 'Data Sources & Provenance Status',
};

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const currentTitle = SECTION_TITLES[pathname] || 'TrafficPulse AI';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            {currentTitle}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            I-94 Minneapolis Corridor Intelligence Benchmark
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Transparent Data Integrity Indicators */}
        <div className="hidden lg:flex items-center gap-2">
          <StatusBadge label="DATA: SYNTHETIC BENCHMARK" variant="amber" />
          <StatusBadge label="API: NOT CONFIGURED" variant="slate" dot={false} />
        </div>

        <div className="flex lg:hidden items-center">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-950/70 border border-amber-800/50 text-[11px] text-amber-300 font-mono">
            <ShieldAlert className="h-3 w-3" />
            SYNTHETIC
          </span>
        </div>
      </div>
    </header>
  );
};
