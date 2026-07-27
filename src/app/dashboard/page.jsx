'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '@/services/dbService';
import { 
  FileText, Eye, MessageSquare, FolderTree, PlusCircle, 
  Settings, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';

import StatsCard from '@/components/dashboard/StatsCard';
import Button from '@/components/ui/Button';

export default function DashboardOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await dbService.getAnalytics();
      setAnalytics(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[var(--text-subtle)]">
        Memuat data statistik dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white inline-block">
            Dashboard Analytics
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">Selamat Datang di ScholarCMS Engine</h2>
          <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
            Kelola postingan, analisis jumlah pembaca, moderasi komentar pengunjung, dan kelola kategori blog Anda dalam satu tempat.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Link href="/dashboard/posts/new">
            <Button icon={PlusCircle} className="bg-white text-blue-900 hover:bg-blue-50 shadow-md">
              Tulis Artikel Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid — Reusable Modular StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Artikel"
          value={analytics?.totalPosts || 0}
          subtitle={`${analytics?.publishedPosts || 0} Terbit • ${analytics?.draftPosts || 0} Draft`}
          icon={FileText}
          color="blue"
        />

        <StatsCard
          title="Total Pembaca"
          value={analytics?.totalViews || 0}
          subtitle="Akumulasi pembaca artikel"
          icon={Eye}
          color="emerald"
        />

        <StatsCard
          title="Komentar"
          value={analytics?.totalComments || 0}
          subtitle="Komentar pengunjung terdaftar"
          icon={MessageSquare}
          color="purple"
        />

        <StatsCard
          title="Kategori"
          value={analytics?.totalCategories || 0}
          subtitle="Taksonomi topik artikel"
          icon={FolderTree}
          color="amber"
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" /> Manajemen Artikel & Blok Visual
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Tulis artikel baru dengan Visual Block Editor (Paragraf, Heading, Quote, Callout box, Code snippet) atau kelola postingan yang sudah ada.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/dashboard/posts"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              Lihat Postingan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/posts/new"
              className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold text-xs hover:bg-[var(--bg-surface)] transition-all"
            >
              + Post Baru
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" /> Status Koneksi Firestore
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Periksa status integrasi database cloud Firebase Firestore atau perbarui konfigurasi `.env` proyek Anda.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold text-xs hover:bg-[var(--bg-surface)] transition-all flex items-center gap-1.5"
            >
              Cek Pengaturan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
