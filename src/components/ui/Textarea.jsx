'use client';

import React from 'react';

export default function Textarea({
  label,
  error,
  helperText,
  showCount = false,
  maxLength,
  className = '',
  id,
  value,
  rows = 4,
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const currentLength = value ? String(value).length : 0;

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={textareaId} className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {label}
          </label>
        )}
        {showCount && (
          <span className="text-[10px] text-[var(--text-subtle)] font-mono">
            {currentLength}{maxLength ? `/${maxLength}` : ''} karakter
          </span>
        )}
      </div>
      <textarea
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed font-medium disabled:opacity-50 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
      {helperText && !error && <p className="text-[10px] text-[var(--text-subtle)]">{helperText}</p>}
    </div>
  );
}
