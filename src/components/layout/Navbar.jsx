'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, LayoutDashboard, Sun, Moon, Feather } from 'lucide-react';

export default function Navbar({ onSearch, searchQuery }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-[var(--text-main)] flex items-center gap-1.5">
              Scholar<span className="gradient-text">CMS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Next.js
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">Modern WordPress Engine</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
            <input
              type="text"
              placeholder="Cari artikel, topik, atau kata kunci..."
              value={searchQuery || ''}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">WordPress Admin</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
