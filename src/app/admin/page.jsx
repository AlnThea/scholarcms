'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '@/services/dbService';
import { 
  FileText, Eye, MessageSquare, FolderTree, PlusCircle, 
  Database 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalCategories: 0,
    isFirebaseActive: false
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const analytics = await dbService.getAnalytics();
      const posts = await dbService.getPosts({ limit: 5 });
      setStats(analytics);
      setRecentPosts(posts);
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
            WordPress CMS Admin Core
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Selamat Datang di ScholarCMS!</h2>
          <p className="text-sm text-blue-200 leading-relaxed">
            Platform blog CMS modern ala WordPress berbasis Next.js App Router & Firebase Firestore. Kelola postingan, kategori, dan komentar dengan mudah.
          </p>
        </div>
        <div className="flex gap-3 z-10">
          <Link
            href="/admin/posts/new"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Tulis Post Baru
          </Link>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${stats.isFirebaseActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-main)] text-sm">
              Status Database: {stats.isFirebaseActive ? 'Terhubung ke Firebase Firestore' : 'Demo Local Storage Mode'}
            </h4>
            <p className="text-[var(--text-muted)]">
              {stats.isFirebaseActive 
                ? 'Semua data tersimpan secara real-time di Firestore Cloud Database.'
                : 'Menjalankan data sampel lokal. Masukkan API Key Firebase di .env untuk beralih ke cloud.'}
            </p>
          </div>
        </div>
        <Link href="/admin/settings" className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] font-semibold text-[var(--text-main)] hover:bg-blue-600 hover:text-white transition-colors">
          Konfigurasi
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Artikel</span>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-main)]">{stats.totalPosts}</div>
          <p className="text-xs text-[var(--text-subtle)]">
            <span className="text-emerald-500 font-semibold">{stats.publishedPosts} Published</span> • {stats.draftPosts} Draft
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pembaca</span>
            <Eye className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-main)]">{stats.totalViews}</div>
          <p className="text-xs text-[var(--text-subtle)]">Total akumulasi pembaca artikel</p>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-bold uppercase tracking-wider">Komentar</span>
            <MessageSquare className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-main)]">{stats.totalComments}</div>
          <p className="text-xs text-[var(--text-subtle)]">Komentar pengunjung blog</p>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-bold uppercase tracking-wider">Kategori</span>
            <FolderTree className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-main)]">{stats.totalCategories}</div>
          <p className="text-xs text-[var(--text-subtle)]">Topik pembagian artikel</p>
        </div>

      </div>

      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)]">Postingan Terkini</h3>
          <Link href="/admin/posts" className="text-xs font-bold text-blue-500 hover:underline">
            Lihat Semua Artikel →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-main)]">
            <thead className="bg-[var(--bg-primary)] text-xs uppercase text-[var(--text-muted)] font-semibold border-y border-[var(--border-color)]">
              <tr>
                <th className="py-3 px-4">Judul Artikel</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Pembaca</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold max-w-md truncate">
                    {post.title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      post.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">{post.views || 0}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link href={`/admin/posts/edit/${post.id}`} className="text-xs font-semibold text-blue-500 hover:underline">
                      Edit
                    </Link>
                    <span>•</span>
                    <Link href={`/post/${post.slug}`} target="_blank" className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]">
                      Pratinjau
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
