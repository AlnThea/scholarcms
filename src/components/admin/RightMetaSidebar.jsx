'use client';

import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { X, Settings } from 'lucide-react';

export default function RightMetaSidebar() {
  const {
    isOpen,
    closeSidebar,
    title,
    setTitle,
    slug,
    setSlug,
    excerpt,
    setExcerpt,
    category,
    setCategory,
    tags,
    setTags,
    featuredImage,
    setFeaturedImage,
    status,
    setStatus,
    readTime,
    setReadTime,
  } = useMetaSidebar();

  // Auto-generate slug when title changes and slug is empty
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
        <h3 className="font-bold text-[var(--text-main)]">Meta Artikel</h3>
        <button onClick={closeSidebar} className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors">
          <X className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-4rem)]">
        {/* Title */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Judul</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          />
        </div>
        {/* Slug */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          />
        </div>
        {/* Category */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Kategori</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          />
        </div>
        {/* Tags */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Tag (pisahkan dengan koma)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          />
        </div>
        {/* Excerpt */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Excerpt</label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          />
        </div>
        {/* Featured Image */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Gambar Unggulan (URL)</label>
          <input
            type="url"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          />
        </div>
        {/* Status */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          >
            <option value="published">Terbit (Published)</option>
            <option value="draft">Konsep (Draft)</option>
          </select>
        </div>
        {/* Read Time */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Estimasi Baca</label>
          <input
            type="text"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          />
        </div>
      </div>
    </div>
  );
}
