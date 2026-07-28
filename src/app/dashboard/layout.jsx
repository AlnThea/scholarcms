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
  Settings, ExternalLink, Feather, Menu, X, Users, User, LogOut, Sun, Moon,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, Layers, ListTree, Palette, Puzzle,
  Sparkles, Folder, ChevronDown
} from 'lucide-react';
import { dbService } from '@/services/dbService';
import { getEnabledPluginNavItems } from '@/plugins';
import Button from '@/components/ui/Button';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();
  const { openSidebar, title, setTitle, slug, setSlug } = useMetaSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pluginStates, setPluginStates] = useState({});
  const [customPlugins, setCustomPlugins] = useState([]);
  const [expandedSubMenus, setExpandedSubMenus] = useState({});
  const isRealDB = dbService.isRealFirebase();

  const toggleSubMenu = (label) => {
    setExpandedSubMenus(prev => ({
      ...prev,
      [label]: prev[label] === undefined ? false : !prev[label]
    }));
  };

  const isSubMenuOpen = (label) => {
    return expandedSubMenus[label] !== false; // Default is true (expanded)
  };

  const isPageEditor = pathname.includes('/pages/new') || pathname.includes('/pages/edit');
  const isEditorPage = pathname.includes('/posts/new') || pathname.includes('/posts/edit') || isPageEditor;

  useEffect(() => {
    async function loadPluginsConfig() {
      try {
        const [states, packages] = await Promise.all([
          dbService.getPluginStates(),
          dbService.getCustomPluginPackages()
        ]);
        setPluginStates(states || {});
        setCustomPlugins(packages || []);
      } catch(e){}
    }
    loadPluginsConfig();
  }, [pathname]);

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

  const enabledPluginItems = getEnabledPluginNavItems(pluginStates, customPlugins);

  // Professional Navigation Groups & Sub-tree Items
  const navGroups = [
    {
      groupLabel: 'Ikhtisar Utama',
      items: [
        { label: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'writer'] }
      ]
    },
    {
      groupLabel: 'Manajemen Konten & Media',
      items: [
        {
          label: 'Manajemen Artikel',
          icon: FileText,
          roles: ['admin', 'writer'],
          children: [
            { label: role === 'writer' ? 'Postingan Saya' : 'Semua Postingan', href: '/dashboard/posts', icon: FileText, roles: ['admin', 'writer'] },
            { label: 'Tambah Post Baru', href: '/dashboard/posts/new', icon: PlusCircle, roles: ['admin', 'writer'] },
            { label: 'Kategori & Tag SEO', href: '/dashboard/categories', icon: FolderTree, roles: ['admin'] }
          ]
        },
        {
          label: 'Halaman Statis & Menu',
          icon: Layers,
          roles: ['admin', 'writer'],
          children: [
            { label: 'Semua Halaman', href: '/dashboard/pages', icon: Layers, roles: ['admin', 'writer'] },
            { label: 'Buat Halaman Baru', href: '/dashboard/pages/new', icon: PlusCircle, roles: ['admin', 'writer'] },
            { label: 'Navigasi & Menu Site', href: '/dashboard/menus', icon: ListTree, roles: ['admin'] }
          ]
        }
      ]
    },
    {
      groupLabel: 'Interaksi Pembaca',
      items: [
        { label: 'Moderasi Komentar', href: '/dashboard/comments', icon: MessageSquare, roles: ['admin', 'writer'] }
      ]
    },
    {
      groupLabel: 'Ekstensi & Visual',
      items: [
        { label: 'Katalog Tema (Themes)', href: '/dashboard/themes', icon: Palette, roles: ['admin'] },
        { label: 'Pengelola Plugin CMS', href: '/dashboard/plugins', icon: Puzzle, roles: ['admin'] },
        ...(enabledPluginItems.length > 0
          ? [
              {
                label: 'Fitur Plugin Aktif',
                icon: Sparkles,
                roles: ['admin', 'writer'],
                children: enabledPluginItems
              }
            ]
          : [])
      ]
    },
    {
      groupLabel: 'Administrasi System',
      items: [
        { label: 'Profil & Akun Saya', href: '/dashboard/profile', icon: User, roles: ['admin', 'writer', 'user'] },
        { label: 'Kelola Pengguna & Role', href: '/dashboard/users', icon: Users, roles: ['admin'] },
        { label: 'Pengaturan CMS Global', href: '/dashboard/settings', icon: Settings, roles: ['admin'] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">

      {/* Dark Sidebar Layout */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#1d2327] text-gray-300 flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        } ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Header & Collapse Toggle */}
          <div className="h-16 px-4 bg-[#101517] flex items-center justify-between border-b border-gray-800 shrink-0">
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
          <div className="p-3 bg-gray-900/60 border-b border-gray-800/60 flex items-center justify-center shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isRealDB ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {!isCollapsed && (
                <span className="text-gray-300 font-medium truncate text-[11px]">
                  {isRealDB ? 'Firestore Cloud' : 'Demo DB Mode'}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="p-2 space-y-4 overflow-y-auto flex-1 no-scrollbar">
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 flex items-center justify-between border-b border-gray-800/60 pb-2">
                <span>Hak Akses Anda</span>
                <span className="text-blue-400 font-bold uppercase text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20">
                  {role}
                </span>
              </div>
            )}

            {navGroups.map((group, gIdx) => {
              // Filter items inside group by role
              const filteredItems = group.items.filter(item => {
                if (item.roles && !item.roles.includes(role)) return false;
                return true;
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={gIdx} className="space-y-1">
                  {!isCollapsed && (
                    <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-400/70 pt-1 pb-0.5">
                      {group.groupLabel}
                    </div>
                  )}

                  {filteredItems.map((item, iIdx) => {
                    const Icon = item.icon || Folder;
                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

                    if (!hasChildren) {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          title={isCollapsed ? item.label : undefined}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isCollapsed ? 'justify-center' : ''
                          } ${
                            isActive
                              ? 'bg-[#2271b1] text-white shadow-md font-bold'
                              : 'hover:bg-[#2c3338] text-gray-300 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                      );
                    }

                    // Item with Sub-Tree Grouping
                    const allowedChildren = item.children.filter(c => !c.roles || c.roles.includes(role));
                    if (allowedChildren.length === 0) return null;

                    const isOpen = isSubMenuOpen(item.label);

                    return (
                      <div key={iIdx} className="space-y-1">
                        {!isCollapsed ? (
                          <>
                            {/* Parent Category Header (Collapsible / Expandable) */}
                            <button
                              type="button"
                              onClick={() => toggleSubMenu(item.label)}
                              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold text-gray-200/90 hover:bg-[#2c3338]/60 rounded-lg transition-colors mt-1 select-none"
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>{item.label}</span>
                              </div>
                              {isOpen ? (
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              )}
                            </button>
                            {/* Nested Sub-Tree Items */}
                            {isOpen && (
                              <div className="ml-4 pl-3 border-l-2 border-gray-800 space-y-0.5 my-1 transition-all">
                                {allowedChildren.map(child => {
                                  const ChildIcon = child.icon;
                                  const isChildActive = pathname === child.href;
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileOpen(false)}
                                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        isChildActive
                                          ? 'bg-[#2271b1] text-white shadow-sm font-bold'
                                          : 'text-gray-400 hover:text-white hover:bg-[#2c3338]/60'
                                      }`}
                                    >
                                      {ChildIcon && <ChildIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                                      <span>{child.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        ) : (
                          // Collapsed Icons
                          allowedChildren.map(child => {
                            const ChildIcon = child.icon || Icon;
                            const isChildActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                title={child.label}
                                className={`flex items-center justify-center py-2 rounded-lg text-xs font-medium transition-all ${
                                  isChildActive
                                    ? 'bg-[#2271b1] text-white'
                                    : 'hover:bg-[#2c3338] text-gray-300 hover:text-white'
                                }`}
                              >
                                <ChildIcon className="w-4 h-4 shrink-0" />
                              </Link>
                            );
                          })
                        )}
                      </div>
                    );
                  })}
                </div>
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
          <div className="flex items-center gap-3 flex-1">
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
            <h1 className="text-base font-bold text-[var(--text-main)] capitalize shrink-0">
              {pathname === '/dashboard' ? 'Dashboard Overview' : pathname.split('/').pop()?.replace('-', ' ') ?? 'Dashboard'}
            </h1>
            {isEditorPage && (
              <>
                <input
                  type="text"
                  placeholder={isPageEditor ? "Judul Halaman Statis..." : "Judul Artikel Blog..."}
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
                  className="flex-1 mt-1 ml-4 pl-0 text-xl sm:text-2xl font-extrabold bg-transparent text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none border-b border-transparent focus:border-blue-500 pb-1 transition-all"
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

              <Button
                type="button"
                variant="purple"
                size="sm"
                icon={Settings}
                onClick={openSidebar}
                title="Buka Pengaturan Meta Artikel"
              >
                Meta Artikel
              </Button>
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
