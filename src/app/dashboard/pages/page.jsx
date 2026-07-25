'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import Button from '@/components/ui/Button';
import { PlusCircle, Search, Trash2, Edit3, Eye, Layers } from 'lucide-react';

export default function DashboardPagesList() {
  const { user, role } = useAuth();
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, [role, user]);

  async function loadPages() {
    setLoading(true);
    let data = await dbService.getPages();
    setPages(data || []);
    setLoading(false);
  }

  const handleDelete = async (id, title) => {
    if (confirm(`Apakah Anda yakin ingin menghapus halaman statis "${title}"?`)) {
      await dbService.deletePage(id);
      loadPages();
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesSearch = !search || page.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      <PageHeader
        title="Halaman Statis (WordPress Pages)"
        subtitle="Kelola halaman statis independen seperti Tentang Kami, Kebijakan Privasi, Kontak, dll."
      >
        <Link href="/dashboard/pages/new">
          <Button icon={PlusCircle}>Buat Page Statis Baru</Button>
        </Link>
      </PageHeader>

      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            Semua ({pages.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            Terbit ({pages.filter(p => p.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            Draft ({pages.filter(p => p.status === 'draft').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder="Cari judul halaman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

      </div>

      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Memuat halaman statis...</div>
        ) : filteredPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-main)]">
              <thead className="bg-[var(--bg-primary)] text-xs uppercase text-[var(--text-muted)] font-semibold border-y border-[var(--border-color)]">
                <tr>
                  <th className="py-3 px-4">Judul Halaman</th>
                  <th className="py-3 px-4">Slug / Permalinks</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Terakhir Diperbarui</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold max-w-xs truncate flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                      <Link href={`/dashboard/pages/edit/${page.id}`} className="hover:text-blue-500">
                        {page.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-blue-400">
                      /page/{page.slug}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[var(--text-muted)]">
                      {page.author?.name || 'Ernst Dev'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        page.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {page.status === 'published' ? '🟢 Terbit' : '🟡 Konsep'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-muted)]">{page.views || 0}</td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-subtle)] font-medium">
                      {page.updatedAt || page.publishedAt ? new Date(page.updatedAt || page.publishedAt).toLocaleString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/dashboard/pages/edit/${page.id}`}
                        className="p-1.5 rounded-lg inline-block text-blue-500 hover:bg-blue-500/10 transition-colors"
                        title="Edit Halaman"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/page/${page.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg inline-block text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors"
                        title="Pratinjau Halaman Publik"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(page.id, page.title)}
                        className="p-1.5 rounded-lg inline-block text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Hapus Halaman"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Tidak ada halaman statis ditemukan.</div>
        )}
      </div>

    </div>
  );
}
