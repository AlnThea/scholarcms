'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import DataTable from '@/components/dashboard/DataTable';
import { PlusCircle, Search, Trash2, Edit3, Eye } from 'lucide-react';

export default function DashboardPostsList() {
  const { user, role } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [role, user]);

  async function loadPosts() {
    setLoading(true);
    let data = await dbService.getPosts({ status: 'all' });
    if (role === 'writer' && user) {
      data = data.filter(p => p.author?.name?.toLowerCase().includes('writer') || p.author?.name === user.name || p.author?.email === user.email);
      if (data.length === 0) data = await dbService.getPosts({ status: 'all' });
    }
    setPosts(data);
    setLoading(false);
  }

  const handleDelete = async (id, title) => {
    if (confirm(`Delete article "${title}"?`)) {
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
      
      <PageHeader
        title={role === 'writer' ? t('postsTitleWriter') : t('postsTitleAdmin')}
        subtitle={role === 'writer' ? t('postsSubtitleWriter') : t('postsSubtitleAdmin')}
      >
        <Link href="/dashboard/posts/new">
          <Button icon={PlusCircle}>{t('navAddNewPost')}</Button>
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
            {t('filterAll')} ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            {t('filterPublished')} ({posts.filter(p => p.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'scheduled' ? 'bg-purple-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            {t('filterScheduled')} ({posts.filter(p => p.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
            }`}
          >
            {t('filterDraft')} ({posts.filter(p => p.status === 'draft').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

      </div>

      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">{t('loading')}</div>
        ) : filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-main)]">
              <thead className="bg-[var(--bg-primary)] text-xs uppercase text-[var(--text-muted)] font-semibold border-y border-[var(--border-color)]">
                <tr>
                  <th className="py-3 px-4">{t('thTitle')}</th>
                  <th className="py-3 px-4">{t('thCategory')}</th>
                  <th className="py-3 px-4">{t('thAuthor')}</th>
                  <th className="py-3 px-4">{t('thStatus')}</th>
                  <th className="py-3 px-4">{t('thViews')}</th>
                  <th className="py-3 px-4">{t('thDate')}</th>
                  <th className="py-3 px-4 text-right">{t('thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold max-w-xs truncate">
                      <Link href={`/dashboard/posts/edit/${post.id}`} className="hover:text-blue-500">
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
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        post.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : post.status === 'scheduled'
                          ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {post.status === 'published' ? `🟢 ${t('published')}` : post.status === 'scheduled' ? `⏰ ${t('filterScheduled')}` : `🟡 ${t('draft')}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-muted)]">{post.views || 0}</td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-subtle)] font-medium">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/dashboard/posts/edit/${post.id}`}
                        className="p-1.5 rounded-lg inline-block text-blue-500 hover:bg-blue-500/10 transition-colors"
                        title={t('edit')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/post/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg inline-block text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors"
                        title={t('preview')}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 rounded-lg inline-block text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title={t('delete')}
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
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">{t('noData')}</div>
        )}
      </div>

    </div>
  );
}
