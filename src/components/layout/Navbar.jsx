'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Search, LayoutDashboard, Sun, Moon, Feather, LogIn, UserPlus, LogOut, User, ShieldCheck, PenTool, Settings } from 'lucide-react';
import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { usePathname } from 'next/navigation';

export default function Navbar({ onSearch, searchQuery }) {
  const { isDark, toggleTheme, mounted } = useTheme();
  const { user, role, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { openSidebar } = useMetaSidebar();
  // const pathname = usePathname(); // not needed in Navbar

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
{/* Title input moved to dashboard layout – removed from global Navbar */}

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
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title={mounted ? (isDark ? "Beralih ke Light Mode" : "Beralih ke Dark Mode") : "Beralih Tema"}
          >
            {mounted && !isDark ? (
              <Moon className="w-4 h-4 text-indigo-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
          {/* Settings / Meta Sidebar Toggle */}
          <button
            onClick={openSidebar}
            className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Buka Meta Sidebar"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Auth Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-blue-500/50 transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-[var(--text-main)] leading-tight">{user.name}</p>
                  <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                    {role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                    {role === 'writer' && <PenTool className="w-3 h-3" />}
                    {role === 'user' && <User className="w-3 h-3" />}
                    {role}
                  </p>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-2xl p-2 z-50 space-y-1 animate-fade-in border border-[var(--border-color)]">
                  <div className="px-3 py-2 border-b border-[var(--border-color)]">
                    <p className="text-xs font-bold text-[var(--text-main)] truncate">{user.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
                  </div>

                  {(role === 'admin' || role === 'writer') && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-main)] hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard Panel
                    </Link>
                  )}

                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-primary)] transition-all"
              >
                <LogIn className="w-4 h-4 text-blue-500" /> Masuk
              </Link>
              <Link
                href="/register"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
              >
                <UserPlus className="w-4 h-4" /> Daftar
              </Link>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
