'use client';

import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'purple'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
  disabled,
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const widthStyle = fullWidth ? 'w-full' : '';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.98]',
    secondary: 'bg-[var(--bg-primary)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] active:scale-[0.98]',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 active:scale-[0.98]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 active:scale-[0.98]',
    outline: 'border border-[var(--border-color)] hover:border-blue-500 text-[var(--text-main)] hover:text-blue-500 bg-transparent',
    ghost: 'hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] bg-transparent',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 rounded-lg text-xs gap-1.5',
    md: 'px-4 py-2.5 rounded-xl text-xs gap-2',
    lg: 'px-5 py-3 rounded-2xl text-sm gap-2',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyle} ${widthStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
