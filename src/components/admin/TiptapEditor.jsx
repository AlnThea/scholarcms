'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import { useState, useEffect } from 'react';
import BlockPaletteSidebar from './BlockPaletteSidebar';
import Link from 'next/link';
import {
  Save, Eye, ArrowLeft, Image as ImageIcon, Sparkles,
  Bold, Italic, Strikethrough, Code, Heading, List, ListOrdered, Quote, Undo, Redo
} from 'lucide-react';
import { dbService } from '@/services/dbService';
import { useMetaSidebar } from '@/context/MetaSidebarContext';

export default function TiptapEditor({ initialPost, onSave, saving, backLink = '/dashboard/posts' }) {
  const { title, setTitle, slug, setSlug } = useMetaSidebar();
  // slug and title are managed via MetaSidebarContext
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [category, setCategory] = useState(initialPost?.category || 'Web Development');
  const [tags, setTags] = useState(Array.isArray(initialPost?.tags) ? initialPost.tags.join(', ') : (initialPost?.tags || 'Next.js, React'));
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
  const [status, setStatus] = useState(initialPost?.status || 'published');
  const [readTime, setReadTime] = useState(initialPost?.readTime || '5 min read');
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'

  // Convert initialPost blocks array to HTML if initialPost has blocks
  const initialContent = initialPost?.content || (
    initialPost?.blocks?.length > 0
      ? initialPost.blocks.map(b => {
        if (b.type === 'heading') return `<h2>${b.content}</h2>`;
        if (b.type === 'quote') return `<blockquote>${b.content}</blockquote>`;
        if (b.type === 'code') return `<pre><code>${b.content}</code></pre>`;
        if (b.type === 'callout') return `<div class="p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl my-4">${b.content}</div>`;
        return `<p>${b.content}</p>`;
      }).join('')
      : '<p>Mulai tulis artikel modern Anda di sini atau tarik elemen dari Sidebar Palette...</p>'
  );

  useEffect(() => {
    async function loadCats() {
      const cats = await dbService.getCategories();
      setCategories(cats);
    }
    loadCats();
  }, []);

  // Initialize title and slug from initialPost if editing
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || '');
      setSlug(initialPost.slug || '');
    }
  }, [initialPost]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Ketik tulisan Anda di sini atau seret blok dari Sidebar 2...',
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[360px] p-6 text-sm text-[var(--text-main)] leading-relaxed',
      },
    },
  });

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialPost) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleInsertBlock = (type) => {
    if (!editor) return;

    if (type === 'paragraph') {
      editor.chain().focus().insertContent('<p>Paragraf teks baru di sini...</p>').run();
    } else if (type === 'heading2') {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (type === 'heading3') {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    } else if (type === 'quote') {
      editor.chain().focus().toggleBlockquote().run();
    } else if (type === 'codeBlock') {
      editor.chain().focus().toggleCodeBlock().run();
    } else if (type === 'callout') {
      editor.chain().focus().insertContent('<blockquote class="p-4 my-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 text-blue-400 font-medium">💡 <strong>Catatan Penting:</strong> Tulis poin penegasan informasi di sini.</blockquote>').run();
    } else if (type === 'bulletList') {
      editor.chain().focus().toggleBulletList().run();
    } else if (type === 'orderedList') {
      editor.chain().focus().toggleOrderedList().run();
    } else if (type === 'image') {
      const url = prompt('Masukkan URL Gambar:', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } else if (type === 'horizontalRule') {
      editor.chain().focus().setHorizontalRule().run();
    }
  };

  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType') || e.dataTransfer.getData('text/plain');
    if (blockType) {
      handleInsertBlock(blockType);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert('Judul artikel wajib diisi!');
      return;
    }

    const htmlContent = editor ? editor.getHTML() : '';

    const blocks = editor
      ? editor.getJSON().content?.map((b, idx) => ({
        id: `block-${idx}`,
        type: b.type === 'heading' ? 'heading' : b.type === 'blockquote' ? 'quote' : b.type === 'codeBlock' ? 'code' : 'paragraph',
        content: b.content?.[0]?.text || ''
      })) || []
      : [];

    const postPayload = {
      id: initialPost?.id,
      title,
      slug,
      excerpt,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      featuredImage,
      status,
      readTime,
      content: htmlContent,
      blocks: blocks.length > 0 ? blocks : [{ id: 'b1', type: 'paragraph', content: htmlContent }]
    };

    onSave(postPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-0 items-start">

      {/* Sidebar 2: Block Component Palette — Nempel di sebelah Sidebar 1 */}
      <BlockPaletteSidebar onInsertBlock={handleInsertBlock} />

      {/* Main Right Editor Column */}
      <div className="flex-1 w-full p-6 sm:p-2 space-y-6 min-w-0">

        {/* Top Header Bar: Back Link + Status + Preview + Save */}
        <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-20 z-30">

          <div className="flex items-center gap-3">
            <Link href={backLink} className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-blue-500 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Postingan
            </Link>
          </div>

          {/* Status, Preview & Save Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)]"
            >
              <option value="published">Status: Terbit (Published)</option>
              <option value="draft">Status: Konsep (Draft)</option>
            </select>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
              className="px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-all flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" /> {activeTab === 'editor' ? 'Pratinjau' : 'Kembali ke Editor'}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Artikel'}
            </button>
          </div>

        </div>

        {/* Artikel Blog Meta Card */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">

          {/* Title & Slug */}
          <div className="space-y-3">


            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="font-semibold">Permalink Slug:</span>
              <span className="font-mono bg-[var(--bg-primary)] px-2 py-0.5 rounded border border-[var(--border-color)] text-blue-500">
                {`/post/${slug || 'judul-artikel'}`}
              </span>
            </div>
          </div>

          {/* Category & Tags & ReadTime */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[var(--border-color)]">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-semibold"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                {categories.length === 0 && <option value="Web Development">Web Development</option>}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Tag Kata Kunci
              </label>
              <input
                type="text"
                placeholder="Next.js, React, Firebase"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Estimasi Baca
              </label>
              <input
                type="text"
                placeholder="5 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
          </div>

          {/* Excerpt & Featured Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Ringkasan Excerpt
              </label>
              <textarea
                rows={2}
                placeholder="Ringkasan artikel untuk preview kartu beranda..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                URL Gambar Unggulan (Cover)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
          </div>

        </div>

        {/* Tombol Formatting B I U H2 H3 List Quote Code */}
        {editor && activeTab === 'editor' && (
          <div className="p-2.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg text-xs font-bold transition-colors ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg text-xs transition-colors ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded-lg text-xs transition-colors ${editor.isActive('strike') ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded-lg text-xs transition-colors ${editor.isActive('code') ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Inline Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-[var(--border-color)] mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded-lg text-xs font-bold transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded-lg text-xs font-bold transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Heading 3"
            >
              H3
            </button>

            <div className="h-4 w-px bg-[var(--border-color)] mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg text-xs transition-colors ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg text-xs transition-colors ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Ordered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-lg text-xs transition-colors ${editor.isActive('blockquote') ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
              title="Quote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-[var(--border-color)] mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              className="p-2 rounded-lg text-xs text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors"
              title="Undo"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              className="p-2 rounded-lg text-xs text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors"
              title="Redo"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tiptap Editor Canvas Drop Zone */}
        {activeTab === 'editor' ? (
          <div
            onDrop={handleDropOnCanvas}
            onDragOver={handleDragOver}
            className="rounded-3xl bg-[var(--bg-surface)] border-2 border-dashed border-[var(--border-color)] hover:border-blue-500/50 shadow-sm transition-all overflow-hidden relative"
          >
            <div className="px-6 py-2 bg-[var(--bg-primary)] border-b border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
              <span>Tiptap Editor Canvas — Seret elemen dari Sidebar 2 di sini</span>
              <span className="text-blue-500 font-semibold">Drop Zone Ready 🎯</span>
            </div>
            <EditorContent editor={editor} />
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
            <h1 className="text-3xl font-extrabold text-[var(--text-main)]">{title || 'Judul Artikel'}</h1>
            <div
              className="prose dark:prose-invert max-w-none text-sm text-[var(--text-main)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: editor ? editor.getHTML() : '' }}
            />
          </div>
        )}

      </div>

    </form>
  );
}
