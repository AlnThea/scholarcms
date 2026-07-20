'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  LayoutDashboard, FileText, PlusCircle, FolderTree, MessageSquare, 
  Settings, ExternalLink, Feather, Menu, X, Users, LogOut, ShieldCheck, PenTool, User, Sun, Moon
} from 'lucide-react';
import { dbService } from '@/services/dbService';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, switchRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRealDB = dbService.isRealFirebase();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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

  const handleRoleSwitch = (newRole) => {
    switchRole(newRole);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      
      {/* WordPress Dark Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1d2327] text-gray-300 flex flex-col justify-between transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div>
          {/* Logo Header */}
          <div className="h-16 px-6 bg-[#101517] flex items-center justify-between border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">ScholarCMS</span>
                <p className="text-[10px] text-gray-400">Engine</p>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Connection Status */}
          <div className="p-3.5 bg-gray-900/60 border-b border-gray-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${isRealDB ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-gray-300 font-medium truncate">
                {isRealDB ? 'Firestore Cloud' : 'Demo DB Mode'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 flex items-center justify-between">
              <span>Menu Hak Akses</span>
              <span className="text-blue-400 font-bold uppercase text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20">
                {role}
              </span>
            </div>
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2271b1] text-white shadow-md font-semibold'
                      : 'hover:bg-[#2c3338] text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & View Public Blog */}
        <div className="p-4 border-t border-gray-800 bg-[#101517] space-y-3">
          
          {/* Active User Card */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/80 border border-gray-800">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || user?.email}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" /> Lihat Website Publik
          </Link>
        </div>

      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Admin Header Bar with Quick Role Switcher */}
        <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-[var(--text-muted)]">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-[var(--text-main)] hidden sm:block">
              {pathname === '/dashboard' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ') ?? 'Dashboard'}
            </h1>
          </div>

          {/* Controls: Theme Switcher & Quick Role Switcher Toolbar */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title={isDark ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>


          </div>
        </header>

        {/* Admin Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {role === 'user' ? (
            <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center space-y-4 max-w-xl mx-auto my-12">
              <User className="w-12 h-12 text-purple-500 mx-auto" />
              <h2 className="text-xl font-bold text-[var(--text-main)]">Akun Pengunjung (Pembaca)</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Anda saat ini berada dalam peran **User (Pembaca)**. Untuk mengedit atau mempublikasikan artikel, beralihlah ke peran **Writer ✍️** atau **Admin 👑** menggunakan switcher di kanan atas.
              </p>
              <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md">
                Kembali ke Beranda Blog
              </Link>
            </div>
          ) : (
            children
          )}
        </main>

      </div>

    </div>
  );
}
