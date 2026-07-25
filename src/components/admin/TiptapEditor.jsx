'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image';
import { useState, useEffect } from 'react';
import BlockPaletteSidebar from './BlockPaletteSidebar';
import Link from 'next/link';
import {
  Save, Eye, Edit3, ArrowLeft, Image as ImageIcon, Sparkles, Settings,
  Bold, Italic, Strikethrough, Code, Heading, List, ListOrdered, Quote, Undo, Redo
} from 'lucide-react';
import AiGenerateModal from './AiGenerateModal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { dbService } from '@/services/dbService';
import { useMetaSidebar } from '@/context/MetaSidebarContext';

export default function TiptapEditor({ initialPost, onSave, saving, backLink = '/dashboard/posts', isPage = false }) {
  const {
    title, setTitle, slug, setSlug,
    excerpt, setExcerpt,
    category, setCategory,
    tags, setTags,
    featuredImage, setFeaturedImage,
    status, setStatus,
    readTime, setReadTime,
    publishedAt, setPublishedAt,
    views, setViews,
    author, setAuthor,
    seoTitle, setSeoTitle,
    seoDescription, setSeoDescription,
    focusKeyword, setFocusKeyword,
    canonicalUrl,
    noIndex,
    enableAds,
    adPlacement,
    adClient,
    adSlot,
    isSponsored,
    openSidebar,
    loadPostMeta,
    editorViewMode,
    setEditorViewMode,
    setIsSaving,
    registerSaveAction,
  } = useMetaSidebar();

  const [categories, setCategories] = useState([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const activeTab = editorViewMode || 'editor';

  const handleAiGenerateSuccess = async (data) => {
    if (!data) return;
    if (data.title) setTitle(data.title);
    if (data.slug) setSlug(data.slug);
    if (data.excerpt) setExcerpt(data.excerpt);
    if (data.seoTitle && setSeoTitle) setSeoTitle(data.seoTitle);
    if (data.seoDescription && setSeoDescription) setSeoDescription(data.seoDescription);
    if (data.focusKeyword && setFocusKeyword) setFocusKeyword(data.focusKeyword);
    if (data.featuredImage) setFeaturedImage(data.featuredImage);
    
    if (data.tags && setTags) {
      const tagArr = Array.isArray(data.tags) ? data.tags : String(data.tags).split(',').map(t => t.trim());
      setTags(tagArr);
    }
    
    // Category Auto-detection and Auto-creation
    if (data.category && setCategory) {
      const catName = data.category;
      setCategory(catName);
      
      const exists = categories.some(c => c.name.toLowerCase() === catName.toLowerCase());
      if (!exists) {
        try {
          const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          await dbService.createCategory({ name: catName, slug: catSlug });
          const updated = await dbService.getCategories();
          setCategories(updated);
        } catch (e) {
          console.warn('Failed to auto-create AI category:', e);
        }
      }
    }

    if (data.contentHtml && editor) {
      editor.commands.setContent(data.contentHtml);
    }
  };

  useEffect(() => {
    if (setIsSaving) {
      setIsSaving(saving);
    }
  }, [saving, setIsSaving]);

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
      : ''
  );

  useEffect(() => {
    async function loadCats() {
      const cats = await dbService.getCategories();
      setCategories(cats);
    }
    loadCats();
  }, []);

  // Initialize all meta fields from initialPost if editing
  useEffect(() => {
    if (initialPost) {
      loadPostMeta(initialPost);
    }
  }, [initialPost]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
      Placeholder.configure({
        placeholder: isPage
          ? 'Mulai ketik isi halaman statis Anda di sini atau seret blok dari Sidebar Palette...'
          : 'Mulai ketik isi artikel blog Anda di sini atau seret blok dari Sidebar Palette...',
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[360px] p-6 text-sm text-[var(--text-main)] leading-relaxed',
      },
    },
  });

  const [, setSelectionTick] = useState(0);

  useEffect(() => {
    if (!editor) return;

    // Synchronize editor content when initialPost is loaded or updated
    if (initialPost?.content && editor.getHTML() !== initialPost.content) {
      editor.commands.setContent(initialPost.content);
    }

    const updateActiveState = () => {
      setSelectionTick((prev) => prev + 1);
    };

    editor.on('selectionUpdate', updateActiveState);
    editor.on('transaction', updateActiveState);

    return () => {
      editor.off('selectionUpdate', updateActiveState);
      editor.off('transaction', updateActiveState);
    };
  }, [editor, initialPost]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleInsertBlock = (type) => {
    if (!editor) return;

    if (type === 'paragraph') {
      editor.chain().focus().insertContent('<p>Tulis paragraf teks baru di sini...</p>').run();
    } else if (type === 'leadParagraph') {
      editor.chain().focus().insertContent('<p class="text-lg font-medium text-[var(--text-main)] leading-relaxed my-3">Tulis paragraf pengantar / lead text dengan penekanan font lebih besar di sini...</p>').run();
    } else if (type === 'heading1') {
      editor.chain().focus().insertContent('<h1>Judul Dokumen Utama (Heading 1)</h1>').run();
    } else if (type === 'heading2') {
      editor.chain().focus().insertContent('<h2>Judul Sub-Topik (Heading 2)</h2>').run();
    } else if (type === 'heading3') {
      editor.chain().focus().insertContent('<h3>Judul Sub-Topik Detail (Heading 3)</h3>').run();
    } else if (type === 'heading4') {
      editor.chain().focus().insertContent('<h4>Judul Poin Tambahan (Heading 4)</h4>').run();
    } else if (type === 'heading5') {
      editor.chain().focus().insertContent('<h5>Judul Sub-Poin Ringkas (Heading 5)</h5>').run();
    } else if (type === 'heading6') {
      editor.chain().focus().insertContent('<h6>Judul Mikro / Sub-Keterangan (Heading 6)</h6>').run();
    } else if (type === 'quote') {
      editor.chain().focus().insertContent('<blockquote class="p-4 my-4 border-l-4 border-emerald-500 bg-emerald-500/10 italic rounded-r-xl">"Tulis kalimat kutipan inspiratif atau narasumber di sini."</blockquote>').run();
    } else if (type === 'codeBlock') {
      editor.chain().focus().insertContent('<pre><code>// Contoh Kode Pemrograman\nfunction helloWorld() {\n  console.log("Hello ScholarCMS!");\n}</code></pre>').run();
    } else if (type === 'callout') {
      editor.chain().focus().insertContent('<blockquote class="p-4 my-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 text-blue-400 font-medium">💡 <strong>Catatan Penting:</strong> Tulis poin penegasan informasi penting di sini.</blockquote>').run();
    } else if (type === 'alertSuccess') {
      editor.chain().focus().insertContent('<blockquote class="p-4 my-4 rounded-xl bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 font-medium">✅ <strong>Tips Sukses:</strong> Tulis informasi tips atau langkah keberhasilan di sini.</blockquote>').run();
    } else if (type === 'alertWarning') {
      editor.chain().focus().insertContent('<blockquote class="p-4 my-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-amber-400 font-medium">⚠️ <strong>Peringatan:</strong> Tulis instruksi perhatian khusus di sini.</blockquote>').run();
    } else if (type === 'alertDanger') {
      editor.chain().focus().insertContent('<blockquote class="p-4 my-4 rounded-xl bg-rose-500/10 border-l-4 border-rose-500 text-rose-400 font-medium">🛑 <strong>Perhatian Bahaya:</strong> Tulis instruksi penting yang harus dihindari di sini.</blockquote>').run();
    } else if (type === 'bulletList') {
      editor.chain().focus().insertContent('<ul><li>Poin daftar berbutir pertama</li><li>Poin daftar berbutir kedua</li></ul>').run();
    } else if (type === 'orderedList') {
      editor.chain().focus().insertContent('<ol><li>Langkah berurutan pertama</li><li>Langkah berurutan kedua</li></ol>').run();
    } else if (type === 'taskList') {
      editor.chain().focus().insertContent('<ul class="space-y-2 my-4"><li><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" class="rounded border-gray-400" /> <span>Poin tugas / checklist pertama</span></label></li><li><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" class="rounded border-gray-400" checked /> <span>Poin tugas / checklist kedua</span></label></li></ul>').run();
    } else if (type === 'table') {
      editor.chain().focus().insertContent('<table class="w-full text-sm border-collapse my-4"><thead class="bg-blue-500/10"><tr><th class="border border-gray-300 dark:border-gray-700 p-2 text-left">Header 1</th><th class="border border-gray-300 dark:border-gray-700 p-2 text-left">Header 2</th><th class="border border-gray-300 dark:border-gray-700 p-2 text-left">Header 3</th></tr></thead><tbody><tr><td class="border border-gray-300 dark:border-gray-700 p-2">Baris 1 Kolom 1</td><td class="border border-gray-300 dark:border-gray-700 p-2">Baris 1 Kolom 2</td><td class="border border-gray-300 dark:border-gray-700 p-2">Baris 1 Kolom 3</td></tr><tr><td class="border border-gray-300 dark:border-gray-700 p-2">Baris 2 Kolom 1</td><td class="border border-gray-300 dark:border-gray-700 p-2">Baris 2 Kolom 2</td><td class="border border-gray-300 dark:border-gray-700 p-2">Baris 2 Kolom 3</td></tr></tbody></table>').run();
    } else if (type === 'image') {
      const url = prompt('Masukkan URL Gambar Web (HTTPS):', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } else if (type === 'video') {
      const url = prompt('Masukkan URL Embed Video YouTube (atau HTTPS Video):', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
      if (url) {
        let embedUrl = url;
        if (url.includes('watch?v=')) {
          embedUrl = url.replace('watch?v=', 'embed/');
        }
        editor.chain().focus().insertContent(`<div class="relative w-full aspect-video rounded-xl overflow-hidden my-4 border border-[var(--border-color)] shadow-md"><iframe src="${embedUrl}" class="w-full h-full border-0" allowfullscreen></iframe></div>`).run();
      }
    } else if (type === 'button') {
      const text = prompt('Teks Tombol CTA:', 'Klik Di Sini Untuk Informasi Lebih Lanjut');
      const url = prompt('Tautan URL Tujuan (HTTPS):', 'https://example.com');
      if (text && url) {
        editor.chain().focus().insertContent(`<p class="my-4"><a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-5 py-2.5 font-bold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 transition-colors no-underline">${text} ↗</a></p>`).run();
      }
    } else if (type === 'details') {
      editor.chain().focus().insertContent('<details class="p-4 my-4 rounded-xl bg-blue-500/5 border border-blue-500/20 cursor-pointer"><summary class="font-bold text-base select-none text-[var(--text-main)]">❓ Tulis Pertanyaan / Judul Accordion Di Sini</summary><p class="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">Tulis penjelasan detail atau jawaban yang dapat dibuka dan ditutup oleh pembaca di sini.</p></details>').run();
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

  const handleSubmit = (e, shouldExit = true) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editor) return;

    const htmlContent = editor.getHTML();
    const jsonContent = editor.getJSON();

    let tagList = [];
    if (Array.isArray(tags)) {
      tagList = tags;
    } else if (typeof tags === 'string') {
      tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    let blocks = [];
    if (jsonContent && jsonContent.content) {
      blocks = jsonContent.content.map((node, index) => {
        let textContent = '';
        if (node.content) {
          textContent = node.content.map(c => c.text || '').join('');
        }

        let type = 'paragraph';
        if (node.type === 'heading') type = 'heading';
        if (node.type === 'blockquote') type = 'quote';
        if (node.type === 'codeBlock') type = 'code';

        return {
          id: `block-${index + 1}`,
          type,
          content: textContent || 'Empty block',
        };
      });
    }

    const postPayload = {
      id: initialPost?.id,
      title: title || 'Untitled Post',
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt,
      category: category || 'Web Development',
      tags: tagList,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      status: status || 'published',
      readTime: readTime || '5 min read',
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      views: views || 0,
      author: author || {
        name: 'Ernst Senior Dev',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'CMS Administrator',
      },
      seoTitle: seoTitle || title || 'Untitled Post',
      seoDescription: seoDescription || excerpt || '',
      focusKeyword,
      canonicalUrl,
      noIndex,
      enableAds,
      adPlacement,
      adClient,
      adSlot,
      isSponsored,
      content: htmlContent,
      blocks: blocks.length > 0 ? blocks : [{ id: 'b1', type: 'paragraph', content: htmlContent }]
    };

    onSave(postPayload, shouldExit);
  };

  useEffect(() => {
    registerSaveAction((shouldExit = true) => handleSubmit(null, shouldExit));
  }, [editor, title, slug, excerpt, category, tags, featuredImage, status, readTime, publishedAt, views, author, seoTitle, seoDescription, focusKeyword, canonicalUrl, noIndex, enableAds, adPlacement, adClient, adSlot, isSponsored]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-0 items-start w-full animate-fade-in bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-md">

      {/* Sidebar 2: Block Component Palette (Di Sebelah Kiri - Nempel Rapat) */}
      <BlockPaletteSidebar onInsertBlock={handleInsertBlock} />

      {/* Main Editor Column (Di Sebelah Kanan Palet Komponen - Nempel Rapat 0 Gap) */}
      <div className="flex-1 w-full min-w-0 flex flex-col">

        {/* Attached Top Formatting Toolbar Header (Sticky melayang saat scroll) */}
        {editor && (
          <div className="sticky top-16 z-20 p-3 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2 shadow-sm">
            {activeTab === 'editor' ? (
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  className="p-2 rounded text-xs text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors"
                  title="Undo"
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  className="p-2 rounded text-xs text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors"
                  title="Redo"
                >
                  <Redo className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-px bg-[var(--border-color)] mx-1" />

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded text-xs font-bold transition-all ${editor.isActive('bold') ? 'bg-blue-600 text-white font-extrabold shadow-md ring-2 ring-blue-400/40 scale-105' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded text-xs transition-all ${editor.isActive('italic') ? 'bg-blue-600 text-white font-extrabold shadow-md ring-2 ring-blue-400/40 scale-105' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`p-2 rounded text-xs transition-all ${editor.isActive('strike') ? 'bg-blue-600 text-white font-extrabold shadow-md ring-2 ring-blue-400/40 scale-105' : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)]'}`}
                  title="Strikethrough"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-px bg-[var(--border-color)] mx-1" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] px-2 py-1">
                <Eye className="w-4 h-4 text-blue-500" />
                <span>Pratinjau Tampilan {isPage ? 'Halaman Statis' : 'Artikel'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Live View
                </span>
              </div>
            )}

            {/* Right Workspace Actions: Kembali + Artikel AI + Pratinjau / Editor + Simpan + Simpan & Keluar */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Link href={backLink}>
                <Button variant="ghost" size="sm" icon={ArrowLeft} title="Kembali ke Daftar">
                  Kembali
                </Button>
              </Link>

              {/* Tombol Generasi AI Artikel */}
              {!isPage && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={Sparkles}
                  onClick={() => setIsAiModalOpen(true)}
                  title="Buat artikel bernilai tinggi (High Value Content) otomatis dengan AI"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-md shadow-purple-500/20"
                >
                  Buat Artikel AI ✨
                </Button>
              )}

              <Button
                type="button"
                variant={activeTab === 'preview' ? 'primary' : 'secondary'}
                size="sm"
                icon={activeTab === 'preview' ? Edit3 : Eye}
                onClick={() => setEditorViewMode(activeTab === 'editor' ? 'preview' : 'editor')}
                title="Beralih antara Mode Editor dan Pratinjau"
              >
                {activeTab === 'editor' ? 'Pratinjau' : 'Mode Editor'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Save}
                loading={saving}
                onClick={() => handleSubmit(null, false)}
                title="Simpan tanpa keluar dari editor"
              >
                Simpan
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={Save}
                loading={saving}
                onClick={() => handleSubmit(null, true)}
                title="Simpan dan kembali ke daftar"
              >
                Simpan &amp; Keluar
              </Button>
            </div>
          </div>
        )}

        {/* Attached Canvas Editor Area */}
        {activeTab === 'editor' ? (
          <div
            onDrop={handleDropOnCanvas}
            onDragOver={handleDragOver}
            className="flex-1 min-h-[500px]"
          >
            <EditorContent editor={editor} />
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <h1 className="text-3xl font-extrabold text-[var(--text-main)]">{title || 'Judul Artikel'}</h1>
            <div
              className="prose dark:prose-invert max-w-none text-sm text-[var(--text-main)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: editor ? editor.getHTML() : '' }}
            />
          </div>
        )}

      </div>

      {/* Modal AI Generator Modal */}
      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerateSuccess={handleAiGenerateSuccess}
      />

    </form>
  );
}
