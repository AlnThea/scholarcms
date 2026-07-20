'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '@/services/dbService';
import { PlusCircle, Search, Trash2, Edit3, Eye } from 'lucide-react';

export default function AdminPostsList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    const data = await dbService.getPosts({ status: 'all' });
    setPosts(data);
    setLoading(false);
  }

  const handleDelete = async (id, title) => {
    if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      await dbService.deletePost(id);
      loadPosts();
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesSearch = !search || post.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)]">Semua Postingan</h2>
          <p className="text-xs text-[var(--text-muted)]">Kelola seluruh artikel, draft, dan status publikasi blog Anda.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Tulis Post Baru
        </Link>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            Semua ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            Published ({posts.filter(p => p.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            Draft ({posts.filter(p => p.status === 'draft').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

      </div>

      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Memuat postingan...</div>
        ) : filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-main)]">
              <thead className="bg-[var(--bg-primary)] text-xs uppercase text-[var(--text-muted)] font-semibold border-y border-[var(--border-color)]">
                <tr>
                  <th className="py-3 px-4">Judul</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold max-w-xs truncate">
                      <Link href={`/admin/posts/edit/${post.id}`} className="hover:text-blue-500">
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[var(--text-muted)]">
                      {post.author?.name || 'Ernst Dev'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        post.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-muted)]">{post.views || 0}</td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-subtle)]">
                      {new Date(post.publishedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="p-1.5 rounded-lg inline-block text-blue-500 hover:bg-blue-500/10 transition-colors"
                        title="Edit Post"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/post/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg inline-block text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors"
                        title="Pratinjau"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 rounded-lg inline-block text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Hapus Post"
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
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Tidak ada artikel ditemukan.</div>
        )}
      </div>

    </div>
  );
}
