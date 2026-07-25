'use client';

import React from 'react';

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue', // 'blue' | 'emerald' | 'amber' | 'purple' | 'pink'
  className = '',
}) {
  const colors = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/20' },
  };

  const activeColor = colors[color] || colors.blue;

  return (
    <div className={`p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4 ${className}`}>
      <div className="space-y-1">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">
          {title}
        </span>
        <span className="block text-2xl font-black text-[var(--text-main)]">
          {value}
        </span>
        {subtitle && (
          <span className="block text-[10px] font-semibold text-[var(--text-muted)]">
            {subtitle}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-2xl ${activeColor.bg} ${activeColor.text} border ${activeColor.border} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
