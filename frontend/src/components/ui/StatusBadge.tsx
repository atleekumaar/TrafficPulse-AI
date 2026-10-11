import React from 'react';

interface StatusBadgeProps {
  label: string;
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate' | 'violet';
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'cyan',
  dot = true,
}) => {
  const variantStyles = {
    cyan: {
      bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40',
      dot: 'bg-cyan-400',
    },
    emerald: {
      bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
      dot: 'bg-emerald-400',
    },
    amber: {
      bg: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
      dot: 'bg-amber-400',
    },
    rose: {
      bg: 'bg-rose-950/60 text-rose-300 border-rose-800/40',
      dot: 'bg-rose-400',
    },
    slate: {
      bg: 'bg-slate-800/80 text-slate-300 border-slate-700/50',
      dot: 'bg-slate-400',
    },
    violet: {
      bg: 'bg-violet-950/60 text-violet-300 border-violet-800/40',
      dot: 'bg-violet-400',
    },
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variantStyles.bg}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${variantStyles.dot} animate-pulse`}
        />
      )}
      {label}
    </span>
  );
};
