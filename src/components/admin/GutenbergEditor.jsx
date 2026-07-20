'use client';

import { useState, useEffect } from 'react';
import { 
  Trash2, ArrowUp, ArrowDown, Type, Heading, Quote, Code, 
  AlertCircle, Save, Sparkles 
} from 'lucide-react';
import { dbService } from '@/services/dbService';

export default function GutenbergEditor({ initialPost, onSave, saving }) {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [category, setCategory] = useState(initialPost?.category || 'Web Development');
  const [tags, setTags] = useState(Array.isArray(initialPost?.tags) ? initialPost.tags.join(', ') : (initialPost?.tags || 'Next.js, React'));
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
  const [status, setStatus] = useState(initialPost?.status || 'published');
  const [readTime, setReadTime] = useState(initialPost?.readTime || '5 min read');

  const [categories, setCategories] = useState([]);
  const [blocks, setBlocks] = useState(
    initialPost?.blocks?.length > 0 
      ? initialPost.blocks 
      : [{ id: 'block-1', type: 'paragraph', content: 'Tulis paragraf pertama artikel Anda di sini...' }]
  );

  useEffect(() => {
    async function loadCats() {
      const cats = await dbService.getCategories();
      setCategories(cats);
    }
    loadCats();
  }, []);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialPost) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const addBlock = (type) => {
    let content = '';
    if (type === 'paragraph') content = 'Tulis teks paragraf di sini...';
    if (type === 'heading') content = 'Judul Sub-Topik Baru (Sub-heading)';
    if (type === 'quote') content = '"Kutipan penting atau kutipan inspiratif dari penulis."';
    if (type === 'code') content = '// Contoh potongan kode JavaScript / React\nconst greeting = "Hello World";';
    if (type === 'callout') content = '💡 Catatan Penting: Pastikan Anda memeriksa konfigurasi sebelum rilis.';

    setBlocks([...blocks, { id: `block-${Date.now()}`, type, content }]);
  };

  const updateBlockContent = (id, newContent) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const removeBlock = (id) => {
    if (blocks.length === 1) return;
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setBlocks(copy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initialPost?.id,
      title,
      slug,
      excerpt,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      featuredImage,
      status,
      readTime,
      blocks
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column: Visual Gutenberg Block Editor Area */}
      <div className="lg:col-span-8 space-y-6">
        
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <input
            type="text"
            required
            placeholder="Ketik Judul Artikel WordPress Di Sini..."
            value={title}
            onChange={handleTitleChange}
            className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none border-b border-dashed border-[var(--border-color)] pb-3"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--text-subtle)] mb-1">Permalink / Slug URL</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--text-subtle)] mb-1">Ringkasan / Excerpt</label>
              <input
                type="text"
                placeholder="Ringkasan singkat untuk kartu postingan..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
          </div>
        </div>

        {/* Blocks Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" /> Gutenberg Block Editor ({blocks.length} Blok)
            </h4>
          </div>

          {blocks.map((block, idx) => (
            <div key={block.id} className="group relative p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm hover:border-blue-500/50 transition-all space-y-2">
              
              <div className="flex items-center justify-between text-xs text-[var(--text-subtle)] pb-2 border-b border-[var(--border-color)]/60">
                <span className="font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1">
                  Blok {idx + 1}: {block.type}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveBlock(idx, -1)} disabled={idx === 0} className="p-1 hover:text-blue-500 disabled:opacity-30">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} className="p-1 hover:text-blue-500 disabled:opacity-30">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => removeBlock(block.id)} className="p-1 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {block.type === 'paragraph' && (
                <textarea
                  rows={3}
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  className="w-full bg-transparent text-sm text-[var(--text-main)] focus:outline-none resize-y"
                />
              )}

              {block.type === 'heading' && (
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  className="w-full bg-transparent font-bold text-lg text-[var(--text-main)] focus:outline-none"
                />
              )}

              {block.type === 'quote' && (
                <textarea
                  rows={2}
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  className="w-full bg-transparent italic text-sm text-blue-400 focus:outline-none"
                />
              )}

              {block.type === 'code' && (
                <textarea
                  rows={4}
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  className="w-full font-mono bg-[#0f172a] text-xs text-blue-200 p-3 rounded-xl focus:outline-none"
                />
              )}

              {block.type === 'callout' && (
                <textarea
                  rows={2}
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  className="w-full bg-blue-500/10 border-l-4 border-blue-500 p-3 rounded-r-xl text-sm font-medium text-[var(--text-main)] focus:outline-none"
                />
              )}

            </div>
          ))}

          {/* Add Block Toolbar */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-color)] flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] mr-2">Tambah Blok Baru:</span>
            <button type="button" onClick={() => addBlock('paragraph')} className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white text-xs font-medium border border-[var(--border-color)] transition-colors flex items-center gap-1">
              <Type className="w-3.5 h-3.5" /> Paragraf
            </button>
            <button type="button" onClick={() => addBlock('heading')} className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white text-xs font-medium border border-[var(--border-color)] transition-colors flex items-center gap-1">
              <Heading className="w-3.5 h-3.5" /> Sub-Heading
            </button>
            <button type="button" onClick={() => addBlock('quote')} className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white text-xs font-medium border border-[var(--border-color)] transition-colors flex items-center gap-1">
              <Quote className="w-3.5 h-3.5" /> Kutipan
            </button>
            <button type="button" onClick={() => addBlock('code')} className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white text-xs font-medium border border-[var(--border-color)] transition-colors flex items-center gap-1">
              <Code className="w-3.5 h-3.5" /> Kode
            </button>
            <button type="button" onClick={() => addBlock('callout')} className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white text-xs font-medium border border-[var(--border-color)] transition-colors flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Callout
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Publishing Sidebar Panel */}
      <div className="lg:col-span-4 space-y-6">
        
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">
            Penerbitan (Publish)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Status Artikel</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-semibold"
              >
                <option value="published">Published (Terbit)</option>
                <option value="draft">Draft (Konsep)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Waktu Baca</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : initialPost ? 'Perbarui Postingan' : 'Terbitkan Postingan'}
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">
            Kategori & Tags
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Pilih Kategori *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Tags (pisahkan koma)</label>
            <input
              type="text"
              placeholder="Next.js, React, Web"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">
            Gambar Unggulan (Featured Image)
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">URL Gambar Cover</label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
            />
          </div>

          {featuredImage && (
            <div className="aspect-[16/9] rounded-xl overflow-hidden border border-[var(--border-color)]">
              <img src={featuredImage} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

      </div>

    </form>
  );
}
