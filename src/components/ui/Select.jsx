'use client';

import React from 'react';

export default function Select({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  children,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      >
        {children || options.map((opt, i) => {
          if (typeof opt === 'string' || typeof opt === 'number') {
            return <option key={i} value={opt}>{opt}</option>;
          }
          return <option key={opt.value || i} value={opt.value}>{opt.label}</option>;
        })}
      </select>
      {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
      {helperText && !error && <p className="text-[10px] text-[var(--text-subtle)]">{helperText}</p>}
    </div>
  );
}
