'use client';

import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
