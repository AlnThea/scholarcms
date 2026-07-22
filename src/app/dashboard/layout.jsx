'use client';

import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard, FileText, PlusCircle, FolderTree, MessageSquare,
  Settings, ExternalLink, Feather, Menu, X, Users, LogOut, Sun, Moon,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { dbService } from '@/services/dbService';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();
  const { openSidebar, title, setTitle, slug, setSlug } = useMetaSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isRealDB = dbService.isRealFirebase();

  const isEditorPage = pathname.includes('/posts/new') || pathname.includes('/posts/edit');

  useEffect(() => {
    if (isEditorPage) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-sm font-semibold text-[var(--text-muted)]">
        Memuat status autentikasi...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Navigation Items per Role
  const allNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'writer'] },
    { label: role === 'writer' ? 'Postingan Saya' : 'Semua Postingan', href: '/dashboard/posts', icon: FileText, roles: ['admin', 'writer'] },
    { label: 'Tambah Post Baru', href: '/dashboard/posts/new', icon: PlusCircle, roles: ['admin', 'writer'] },
    { label: 'Kategori & Tag', href: '/dashboard/categories', icon: FolderTree, roles: ['admin'] },
    { label: 'Moderasi Komentar', href: '/dashboard/comments', icon: MessageSquare, roles: ['admin', 'writer'] },
    { label: 'Kelola Pengguna', href: '/dashboard/users', icon: Users, roles: ['admin'] },
    { label: 'Pengaturan CMS', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
  ];

  const allowedItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">

      {/* WordPress-style Dark Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#1d2327] text-gray-300 flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        } ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}>

        <div>
          {/* Logo Header & Collapse Toggle */}
          <div className="h-16 px-4 bg-[#101517] flex items-center justify-between border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                <Feather className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <span className="font-extrabold text-white text-base tracking-tight">ScholarCMS</span>
                  <p className="text-[10px] text-gray-400">Engine</p>
                </div>
              )}
            </Link>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                title={isCollapsed ? "Expand Sidebar Nav" : "Collapse Sidebar Nav"}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Connection Status */}
          <div className="p-3 bg-gray-900/60 border-b border-gray-800/60 flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isRealDB ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {!isCollapsed && (
                <span className="text-gray-300 font-medium truncate text-[11px]">
                  {isRealDB ? 'Firestore Cloud' : 'Demo DB Mode'}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 flex items-center justify-between">
                <span>Menu Hak Akses</span>
                <span className="text-blue-400 font-bold uppercase text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20">
                  {role}
                </span>
              </div>
            )}

            {allowedItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isCollapsed ? 'justify-center' : ''
                    } ${isActive
                      ? 'bg-[#2271b1] text-white shadow-md font-semibold'
                      : 'hover:bg-[#2c3338] text-gray-300 hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & View Public Blog */}
        <div className="p-3 border-t border-gray-800 bg-[#101517] space-y-2">

          <div className={`flex items-center justify-between p-1.5 rounded-lg bg-gray-900/80 border border-gray-800 ${isCollapsed ? 'justify-center' : ''
            }`}>
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover shrink-0"
              />
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.name || user?.email}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isCollapsed && (
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" /> Lihat Website Publik
            </Link>
          )}
        </div>

      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}>

        {/* Top Header Bar */}
        <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-[var(--text-muted)]">
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title={isCollapsed ? "Expand Sidebar Nav" : "Collapse Sidebar Nav"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
            <h1 className="text-base font-bold text-[var(--text-main)] capitalize">
              {pathname === '/dashboard' ? 'Dashboard Overview' : pathname.split('/').pop()?.replace('-', ' ') ?? 'Dashboard'}

            </h1>
            {isEditorPage && (
              <>
                <input
                  type="text"
                  placeholder="Judul Artikel Blog..."
                  value={title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTitle(val);
                    // Always generate slug from title
                    const generatedSlug = val.toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setSlug(generatedSlug);
                  }}
                  className="flex-1 mt-1 ml-4 pl-0 text-2xl sm:text-1xl font-extrabold bg-transparent text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none border-b border-transparent focus:border-blue-500 pb-1 transition-all"
                />
              </>
            )}
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title={mounted ? (isDark ? "Beralih ke Light Mode" : "Beralih ke Dark Mode") : "Beralih Tema"}
            >
              {mounted && !isDark ? (
                <Moon className="w-4 h-4 text-indigo-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
            {/* Meta Sidebar Toggle */}
            {isEditorPage && (
              <button
                onClick={openSidebar}
                className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                title="Buka Meta Sidebar"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Main Body */}
        <main className={`flex-1 w-full ${isEditorPage ? 'p-0 max-w-none' : 'p-4 sm:p-8 max-w-7xl mx-auto'}`}>
          {children}
        </main>

      </div>

    </div>
  );
}
