'use client';

import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'published' | 'scheduled' | 'draft' | 'admin' | 'writer' | 'user' | 'default' | 'purple' | 'blue'
  className = '',
  icon: Icon,
  ...props
}) {
  const variants = {
    published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    scheduled: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    draft: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    admin: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    writer: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    user: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    default: 'bg-[var(--bg-primary)] text-[var(--text-muted)] border-[var(--border-color)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
        variants[variant] || variants.default
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
