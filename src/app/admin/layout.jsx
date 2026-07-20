'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, FileText, PlusCircle, FolderTree, MessageSquare, 
  Settings, ExternalLink, Feather, Menu, X 
} from 'lucide-react';
import { dbService } from '@/services/dbService';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRealDB = dbService.isRealFirebase();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Semua Postingan', href: '/admin/posts', icon: FileText },
    { label: 'Tambah Post Baru', href: '/admin/posts/new', icon: PlusCircle },
    { label: 'Kategori & Tag', href: '/admin/categories', icon: FolderTree },
    { label: 'Moderasi Komentar', href: '/admin/comments', icon: MessageSquare },
    { label: 'Pengaturan CMS', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      
      {/* WordPress Dark Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1d2327] text-gray-300 flex flex-col justify-between transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div>
          <div className="h-16 px-6 bg-[#101517] flex items-center justify-between border-b border-gray-800">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">WordPress <span className="text-blue-400">CMS</span></span>
                <p className="text-[10px] text-gray-400">ScholarCMS Engine</p>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-gray-900/60 border-b border-gray-800/60">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${isRealDB ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-gray-300 font-medium truncate">
                {isRealDB ? 'Firebase Firestore: Active' : 'Demo Mode (LocalStorage)'}
              </span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
              Menu Utama
            </div>
            {navItems.map((item) => {
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

        <div className="p-4 border-t border-gray-800 bg-[#101517]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" /> Lihat Website Publik
          </Link>
        </div>

      </aside>

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-[var(--text-muted)]">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-[var(--text-main)] hidden sm:block">
              WordPress Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Post Baru
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
