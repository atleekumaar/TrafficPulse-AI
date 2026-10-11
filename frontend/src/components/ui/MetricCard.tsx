import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeVariant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate';
  icon?: React.ReactNode;
  hint?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  badge,
  badgeVariant = 'cyan',
  icon,
  hint,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm shadow-sm hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          {title}
        </span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          {value}
        </span>
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
              badgeVariant === 'emerald'
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                : badgeVariant === 'amber'
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                : badgeVariant === 'rose'
                ? 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {(subtext || hint) && (
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between gap-2">
          {subtext && <span>{subtext}</span>}
          {hint && (
            <span className="text-[11px] text-slate-400 font-mono italic">
              {hint}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
