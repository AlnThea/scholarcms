'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Extension } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { useState, useEffect, useCallback } from 'react';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Columns, Column } from './ColumnExtensions';
import { AccordionGroup, AccordionItem, AccordionHeader, AccordionContent } from './AccordionExtensions';

const BUBBLE_MENU_TIPPY_OPTIONS = {
  duration: 150,
  placement: 'bottom-start',
  fallbackPlacements: ['right-start', 'left-start', 'bottom'],
  offset: [0, 8],
};
import BlockPaletteSidebar from './BlockPaletteSidebar';
import Link from 'next/link';
import {
  Save, Eye, Edit3, ArrowLeft, Image as ImageIcon, Sparkles, Settings,
  Bold, Italic, Underline, Strikethrough, Code, Heading, List, ListOrdered, Quote, Undo, Redo,
  Trash2, Box, Type, Link2, Eraser, Code2, AlignLeft, AlignCenter, AlignRight, AlignJustify, GripVertical, ChevronUp, ChevronDown, CheckCircle2, X
} from 'lucide-react';
import AiGenerateModal from './AiGenerateModal';
import InsertMediaModal from './InsertMediaModal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { dbService } from '@/services/dbService';
import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { useLanguage } from '@/context/LanguageContext';

const FontSizeExtension = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

export default function TiptapEditor({ initialPost, onSave, saving, backLink = '/dashboard/posts', isPage = false }) {
  const { t } = useLanguage();
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
  const [saveToast, setSaveToast] = useState(null);
  const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState(false);
  const activeTab = editorViewMode || 'editor';

  const shouldShowTableMenu = useCallback(({ editor }) => {
    return editor ? editor.isActive('table') : false;
  }, []);

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
        link: false,
        underline: false,
        dropcursor: {
          color: '#3b82f6',
          width: 3,
        },
      }),
      TextStyle,
      FontFamily,
      FontSizeExtension,
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4 decoration-blue-500/40 hover:text-blue-700 hover:decoration-blue-700 transition-colors cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: isPage
          ? t('placeholderEditorPage')
          : t('placeholderEditorPost'),
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        inline: false,
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      Columns,
      Column,
      AccordionGroup,
      AccordionItem,
      AccordionHeader,
      AccordionContent,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[360px] p-6 text-sm text-[var(--text-main)] leading-relaxed',
      },
      handleDrop(view, event) {
        const fromPosData = event.dataTransfer?.getData('prosemirror-node-pos');
        const windowPos = typeof window !== 'undefined' ? window.__scholarcms_dragged_pos : undefined;
        const fromPosStr = windowPos !== undefined ? windowPos.toString() : fromPosData;

        // console.log('🎯 [DROP TRIGGERED]', { fromPosStr, windowPos, fromPosData, coords: { x: event.clientX, y: event.clientY } });

        if (!fromPosStr) return false;

        const fromPos = parseInt(fromPosStr, 10);
        if (isNaN(fromPos)) return false;

        const dropCoords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!dropCoords) {
          console.warn('⚠️ [DROP ERROR] Could not resolve drop coords');
          return false;
        }

        try {
          const doc = view.state.doc;
          const node = doc.nodeAt(fromPos);
          if (!node) {
            console.warn('⚠️ [DROP ERROR] No node found at fromPos', fromPos);
            return false;
          }

          const nodeSize = node.nodeSize;
          const $drop = doc.resolve(dropCoords.pos);
          let targetPos = $drop.depth > 0 ? $drop.after(Math.min(1, $drop.depth)) : dropCoords.pos;

          // console.log('🔄 [EXECUTING MOVE TRANSACTION]', { nodeName: node.type.name, fromPos, targetPos });

          let tr = view.state.tr;
          tr = tr.delete(fromPos, fromPos + nodeSize);

          if (targetPos > fromPos) {
            targetPos = Math.max(0, targetPos - nodeSize);
          }

          targetPos = Math.min(targetPos, tr.doc.content.size);
          tr = tr.insert(targetPos, node);
          view.dispatch(tr);

          if (typeof window !== 'undefined') {
            window.__scholarcms_dragged_pos = undefined;
          }

          // console.log('✅ [MOVE SUCCESS] Block moved cleanly to targetPos:', targetPos);
          return true;
        } catch (err) {
          console.error('❌ [MOVE FAILED] Custom node move drop error:', err);
          return false;
        }
      },
    },
  });

  const [mediaModalState, setMediaModalState] = useState({
    isOpen: false,
    type: 'link',
    initialData: {}
  });

  const handleToggleLink = () => {
    if (!editor) return;
    const currentHref = editor.getAttributes('link').href || '';
    setMediaModalState({
      isOpen: true,
      type: 'link',
      initialData: { url: currentHref, isEditing: !!currentHref }
    });
  };

  const handleMediaModalConfirm = (data) => {
    if (!editor) return;
    const { url, text, openInNewTab, remove } = data;
    const modalType = mediaModalState.type;

    if (modalType === 'link') {
      if (remove) {
        editor.chain().focus().unsetLink().run();
      } else if (url) {
        editor.chain().focus().setLink({ href: url, target: openInNewTab ? '_blank' : '_self' }).run();
      }
    } else if (modalType === 'image') {
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } else if (modalType === 'video') {
      if (url) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
    } else if (modalType === 'button') {
      if (url && text) {
        editor.chain().focus().insertContent(`<p class="my-4"><a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-5 py-2.5 font-bold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 transition-colors no-underline">${text} ↗</a></p>`).run();
      }
    }
  };

  const [, setSelectionTick] = useState(0);

  useEffect(() => {
    if (!editor || !editor.view) return;

    const handleProseMirrorDragOver = (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    };

    const handleProseMirrorDrop = (e) => {
      const windowPos = typeof window !== 'undefined' ? window.__scholarcms_dragged_pos : undefined;
      const textData = e.dataTransfer?.getData('text/plain') || '';
      let fromPosStr = windowPos !== undefined ? windowPos.toString() : '';

      if (!fromPosStr && textData.startsWith('scholarcms-move:')) {
        fromPosStr = textData.replace('scholarcms-move:', '');
      }

      // HANYA cegah event jika menyeret blok yang sudah ada
      if (fromPosStr !== undefined && fromPosStr !== null && fromPosStr !== '') {
        e.preventDefault();
        e.stopPropagation();

        // console.log('🎯 [PROSEMIRROR CAPTURE MOVE DROP]', { fromPosStr, windowPos, textData, x: e.clientX, y: e.clientY });

        const fromPos = parseInt(fromPosStr, 10);
        if (isNaN(fromPos)) return;

        const dropCoords = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
        if (!dropCoords) return;

        try {
          const doc = editor.state.doc;
          const node = doc.nodeAt(fromPos);
          if (!node) return;

          const nodeSize = node.nodeSize;
          const $drop = doc.resolve(dropCoords.pos);
          let targetPos = $drop.depth > 0 ? $drop.after(Math.min(1, $drop.depth)) : dropCoords.pos;

          // console.log('🔄 [DIRECT MOVE TRANSACTION]', { nodeName: node.type.name, fromPos, targetPos });

          let tr = editor.state.tr;
          tr = tr.delete(fromPos, fromPos + nodeSize);

          if (targetPos > fromPos) {
            targetPos = Math.max(0, targetPos - nodeSize);
          }

          targetPos = Math.min(targetPos, tr.doc.content.size);
          tr = tr.insert(targetPos, node);
          editor.view.dispatch(tr);

          if (typeof window !== 'undefined') {
            window.__scholarcms_dragged_pos = undefined;
          }

          // console.log('✅ [MOVE SUCCESS] Block moved cleanly to targetPos:', targetPos);
        } catch (err) {
          console.error('❌ [MOVE FAILED]', err);
        }
      }
      // Jika menyeret blok baru dari Palet Komponen Sidebar, biarkan event lolos ke handleDropOnCanvas!
    };

    const domEl = editor.view.dom;
    domEl.addEventListener('dragover', handleProseMirrorDragOver, true);
    domEl.addEventListener('drop', handleProseMirrorDrop, true);

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
      editor.chain().focus().insertContent('<ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p>Item poin checklist tugas 1</p></li><li data-type="taskItem" data-checked="true"><p>Item poin checklist tugas 2 (selesai)</p></li></ul>').run();
    } else if (type === 'table') {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    } else if (type === 'image') {
      setMediaModalState({ isOpen: true, type: 'image', initialData: {} });
    } else if (type === 'video') {
      setMediaModalState({ isOpen: true, type: 'video', initialData: { url: '' } });
    } else if (type === 'button') {
      setMediaModalState({ isOpen: true, type: 'button', initialData: {} });
    } else if (type === 'details') {
      editor.chain().focus().insertContent('<div data-type="accordion-group"><div data-type="accordion-item"><div data-type="accordion-header">❓ Pertanyaan / Judul Accordion 1</div><div data-type="accordion-content"><p>Tulis penjelasan detail atau jawaban untuk poin pertama di sini...</p></div></div><div data-type="accordion-item"><div data-type="accordion-header">❓ Pertanyaan / Judul Accordion 2</div><div data-type="accordion-content"><p>Tulis penjelasan detail atau jawaban untuk poin kedua di sini...</p></div></div></div>').run();
    } else if (type === 'horizontalRule') {
      editor.chain().focus().setHorizontalRule().run();
    } else if (type === 'col-50-50') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="50%"><p><strong>Kolom 1 (50%):</strong> Tulis atau seret blok di sini...</p></div><div data-type="column" data-width="50%"><p><strong>Kolom 2 (50%):</strong> Tulis atau seret blok di sini...</p></div></div>').run();
    } else if (type === 'col-30-70') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="30%"><p><strong>Kolom Kiri (30%):</strong> Tulis...</p></div><div data-type="column" data-width="70%"><p><strong>Kolom Kanan (70%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-70-30') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="70%"><p><strong>Kolom Kiri (70%):</strong> Tulis...</p></div><div data-type="column" data-width="30%"><p><strong>Kolom Kanan (30%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-20-80') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="20%"><p><strong>Kolom Kiri (20%):</strong> Tulis...</p></div><div data-type="column" data-width="80%"><p><strong>Kolom Kanan (80%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-80-20') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="80%"><p><strong>Kolom Kiri (80%):</strong> Tulis...</p></div><div data-type="column" data-width="20%"><p><strong>Kolom Kanan (20%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-40-60') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="40%"><p><strong>Kolom Kiri (40%):</strong> Tulis...</p></div><div data-type="column" data-width="60%"><p><strong>Kolom Kanan (60%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-60-40') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="60%"><p><strong>Kolom Kiri (60%):</strong> Tulis...</p></div><div data-type="column" data-width="40%"><p><strong>Kolom Kanan (40%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-10-90') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="10%"><p><strong>10%:</strong> Tulis...</p></div><div data-type="column" data-width="90%"><p><strong>Kolom Kanan (90%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-90-10') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="90%"><p><strong>Kolom Kiri (90%):</strong> Tulis...</p></div><div data-type="column" data-width="10%"><p><strong>10%:</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-33-33-33') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="33.33%"><p><strong>Kolom 1 (33%):</strong> Tulis...</p></div><div data-type="column" data-width="33.33%"><p><strong>Kolom 2 (33%):</strong> Tulis...</p></div><div data-type="column" data-width="33.33%"><p><strong>Kolom 3 (33%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-25-50-25') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="25%"><p><strong>Kolom 1 (25%):</strong> Tulis...</p></div><div data-type="column" data-width="50%"><p><strong>Kolom 2 (50%):</strong> Tulis konten utama...</p></div><div data-type="column" data-width="25%"><p><strong>Kolom 3 (25%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-25-25-50') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="25%"><p><strong>Kolom 1 (25%):</strong> Tulis...</p></div><div data-type="column" data-width="25%"><p><strong>Kolom 2 (25%):</strong> Tulis...</p></div><div data-type="column" data-width="50%"><p><strong>Kolom 3 (50%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-50-25-25') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="50%"><p><strong>Kolom 1 (50%):</strong> Tulis...</p></div><div data-type="column" data-width="25%"><p><strong>Kolom 2 (25%):</strong> Tulis...</p></div><div data-type="column" data-width="25%"><p><strong>Kolom 3 (25%):</strong> Tulis...</p></div></div>').run();
    } else if (type === 'col-25-25-25-25') {
      editor.chain().focus().insertContent('<div data-type="columns"><div data-type="column" data-width="25%"><p><strong>Kolom 1 (25%):</strong> Tulis...</p></div><div data-type="column" data-width="25%"><p><strong>Kolom 2 (25%):</strong> Tulis...</p></div><div data-type="column" data-width="25%"><p><strong>Kolom 3 (25%):</strong> Tulis...</p></div><div data-type="column" data-width="25%"><p><strong>Kolom 4 (25%):</strong> Tulis...</p></div></div>').run();
    }
  };

  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    setIsDraggingOverCanvas(false);

    // Prioritas 1: Periksa apakah sedang menyeret blok yang sudah ada via Grip Handle
    const windowPos = typeof window !== 'undefined' ? window.__scholarcms_dragged_pos : undefined;
    const fromPosData = e.dataTransfer?.getData('prosemirror-node-pos');
    const fromPosStr = windowPos !== undefined ? windowPos.toString() : fromPosData;

    // console.log('🎯 [CANVAS DROP HANDLER]', { fromPosStr, windowPos, fromPosData, x: e.clientX, y: e.clientY });

    if (fromPosStr !== undefined && fromPosStr !== null && fromPosStr !== '') {
      const fromPos = parseInt(fromPosStr, 10);
      if (!isNaN(fromPos) && editor && editor.view) {
        const dropCoords = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
        if (dropCoords) {
          try {
            const doc = editor.state.doc;
            const node = doc.nodeAt(fromPos);
            if (node) {
              const nodeSize = node.nodeSize;
              const $drop = doc.resolve(dropCoords.pos);
              let targetPos = $drop.depth > 0 ? $drop.after(Math.min(1, $drop.depth)) : dropCoords.pos;

              // console.log('🔄 [CANVAS MOVE TRANSACTION]', { nodeName: node.type.name, fromPos, targetPos });

              let tr = editor.state.tr;
              tr = tr.delete(fromPos, fromPos + nodeSize);

              if (targetPos > fromPos) {
                targetPos = Math.max(0, targetPos - nodeSize);
              }

              targetPos = Math.min(targetPos, tr.doc.content.size);
              tr = tr.insert(targetPos, node);
              editor.view.dispatch(tr);

              if (typeof window !== 'undefined') {
                window.__scholarcms_dragged_pos = undefined;
              }

              // console.log('✅ [CANVAS MOVE SUCCESS] Block moved cleanly to targetPos:', targetPos);
              return;
            }
          } catch (err) {
            console.error('❌ [CANVAS MOVE FAILED]', err);
          }
        }
      }
    }

    // Prioritas 2: Periksa apakah menyisipkan blok baru dari Palet Komponen
    const blockType = e.dataTransfer?.getData('blockType') || e.dataTransfer?.getData('text/plain');
    if (blockType) {
      // console.log('✨ [INSERT PALETTE BLOCK]', blockType);
      handleInsertBlock(blockType);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDraggingOverCanvas) {
      setIsDraggingOverCanvas(true);
    }
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget && e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDraggingOverCanvas(false);
  };

  const [dragHandleInfo, setDragHandleInfo] = useState({
    visible: false,
    top: 0,
    left: 0,
    pos: 0,
    targetEl: null,
  });

  const handleEditorMouseMove = (e) => {
    if (!editor || !editor.view) return;

    const targetEl = document.elementFromPoint(e.clientX, e.clientY);
    if (!targetEl) return;

    const blockEl = targetEl.closest('.ProseMirror > *, [data-type="column"] > *, [data-type="accordion-content"] > *');
    if (!blockEl || !blockEl.parentNode) return;

    try {
      const insidePos = editor.view.posAtDOM(blockEl, 0);
      if (insidePos === null || insidePos === undefined) return;

      const $pos = editor.state.doc.resolve(insidePos);
      const blockDepth = Math.max(1, $pos.depth);
      const blockStartPos = $pos.before(blockDepth);

      const containerEl = e.currentTarget;
      const containerRect = containerEl.getBoundingClientRect();
      const domRect = blockEl.getBoundingClientRect();

      setDragHandleInfo({
        visible: true,
        top: Math.max(0, domRect.top - containerRect.top + 4),
        left: Math.max(0, domRect.left - containerRect.left + 4),
        pos: blockStartPos,
        targetEl: blockEl,
      });
    } catch (err) {
      // Ignore resolution edge cases
    }
  };

  const handleEditorMouseLeave = () => {
    setDragHandleInfo((prev) => ({ ...prev, visible: false }));
  };

  const handleBlockDragStart = (e) => {
    if (!editor || !editor.view) return;
    try {
      const { pos, targetEl } = dragHandleInfo;

      if (typeof window !== 'undefined') {
        window.__scholarcms_dragged_pos = pos;
      }

      // console.log('🚀 [DRAG START]', { pos, targetTag: targetEl?.tagName });

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `scholarcms-move:${pos}`);
        e.dataTransfer.setData('prosemirror-node-pos', pos.toString());
        e.dataTransfer.setData('text/html', targetEl ? targetEl.outerHTML : '');
        if (targetEl && e.dataTransfer.setDragImage) {
          e.dataTransfer.setDragImage(targetEl, 15, 15);
        }
      }
    } catch (err) {
      console.warn('Drag handle selection error:', err);
    }
  };

  const handleMoveBlockUp = () => {
    if (!editor || !editor.view) return;
    try {
      const { pos } = dragHandleInfo;
      const doc = editor.state.doc;
      const $pos = doc.resolve(pos);

      const depth = Math.max(1, $pos.depth);
      const currentBlockPos = $pos.before(depth);
      const currentNode = doc.nodeAt(currentBlockPos);
      if (!currentNode) return;

      const index = $pos.index(depth - 1);
      if (index <= 0) return;

      const prevBlockPos = $pos.posAtIndex(index - 1, depth - 1);

      let tr = editor.state.tr;
      tr = tr.delete(currentBlockPos, currentBlockPos + currentNode.nodeSize);
      tr = tr.insert(prevBlockPos, currentNode);
      editor.view.dispatch(tr);

      setDragHandleInfo((prev) => ({ ...prev, pos: prevBlockPos }));
      // console.log('⬆️ [MOVE UP SUCCESS] Swapped block cleanly with previous sibling!');
    } catch (err) {
      console.warn('Move block up error:', err);
    }
  };

  const handleMoveBlockDown = () => {
    if (!editor || !editor.view) return;
    try {
      const { pos } = dragHandleInfo;
      const doc = editor.state.doc;
      const $pos = doc.resolve(pos);

      const depth = Math.max(1, $pos.depth);
      const currentBlockPos = $pos.before(depth);
      const currentNode = doc.nodeAt(currentBlockPos);
      if (!currentNode) return;

      const parent = $pos.node(depth - 1);
      const index = $pos.index(depth - 1);
      if (index >= parent.childCount - 1) return;

      const nextNode = parent.child(index + 1);

      let tr = editor.state.tr;
      tr = tr.delete(currentBlockPos, currentBlockPos + currentNode.nodeSize);
      const newPos = currentBlockPos + nextNode.nodeSize;
      tr = tr.insert(newPos, currentNode);
      editor.view.dispatch(tr);

      setDragHandleInfo((prev) => ({ ...prev, pos: newPos }));
      // console.log('⬇️ [MOVE DOWN SUCCESS] Swapped block cleanly with next sibling!');
    } catch (err) {
      console.warn('Move block down error:', err);
    }
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

    const extractNodeText = (nodes) => {
      if (!Array.isArray(nodes)) return '';
      return nodes.map(n => {
        if (n.text) return n.text;
        if (n.content) return extractNodeText(n.content);
        return '';
      }).filter(Boolean).join(' ');
    };

    let blocks = [];
    if (jsonContent && jsonContent.content) {
      blocks = jsonContent.content.map((node, index) => {
        const textContent = extractNodeText(node.content);

        let type = 'paragraph';
        if (node.type === 'heading') type = 'heading';
        if (node.type === 'blockquote') type = 'quote';
        if (node.type === 'codeBlock') type = 'code';
        if (node.type === 'bulletList' || node.type === 'orderedList') type = 'list';

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

    setSaveToast({
      type: 'success',
      message: shouldExit
        ? (isPage ? '✅ Halaman berhasil disimpan! Mengalihkan...' : '✅ Artikel berhasil disimpan! Mengalihkan...')
        : (isPage ? '✅ Halaman berhasil disimpan!' : '✅ Artikel berhasil disimpan!'),
    });

    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
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

        {/* Attached Top Unified Visual Block Canvas Header & Toolbar (Sticky melayang di top-16 saat scroll) */}
        {editor && (
          <div className="sticky top-16 z-20 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-color)] flex flex-col shadow-sm divide-y divide-[var(--border-color)]">

            {/* Baris 1: Aksi Navigasi & Publikasi Dokumen */}
            <div className="p-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Link href={backLink}>
                  <Button variant="ghost" size="sm" icon={ArrowLeft} title={t('editorBack')}>
                    {t('editorBack')}
                  </Button>
                </Link>
                {activeTab === 'preview' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] px-2 py-1">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>{t('editorPreviewView')}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      Live View
                    </span>
                  </div>
                )}
              </div>

              {/* Right Workspace Actions: Artikel AI + Pratinjau / Editor + Simpan + Simpan & Keluar */}
              <div className="flex flex-wrap items-center gap-1.5">
                {!isPage && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    icon={Sparkles}
                    onClick={() => setIsAiModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-md shadow-purple-500/20"
                  >
                    {t('editorAiArticleBtn')}
                  </Button>
                )}

                <Button
                  type="button"
                  variant={activeTab === 'preview' ? 'primary' : 'secondary'}
                  size="sm"
                  icon={activeTab === 'preview' ? Edit3 : Eye}
                  onClick={() => setEditorViewMode(activeTab === 'editor' ? 'preview' : 'editor')}
                >
                  {activeTab === 'editor' ? t('editorPreviewMode') : t('editorEditMode')}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Save}
                  loading={saving}
                  onClick={() => handleSubmit(null, false)}
                >
                  {t('editorSaveDraft')}
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={Save}
                  loading={saving}
                  onClick={() => handleSubmit(null, true)}
                >
                  {t('editorSaveExit')}
                </Button>
              </div>
            </div>

            {/* Baris 2: Unified Visual Canvas Block Action & Formatting Toolbar */}
            {activeTab === 'editor' && (
              <div className="p-2 px-3 bg-[var(--bg-primary)]/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Kiri: Detektor Blok Aktif & Converter Cepat */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-md text-[11px] font-extrabold shrink-0 border border-blue-500/20">
                    <Box className="w-3.5 h-3.5" />
                    <span>
                      {editor.isActive('heading', { level: 1 }) ? 'Blok H1' :
                        editor.isActive('heading', { level: 2 }) ? 'Blok H2' :
                          editor.isActive('heading', { level: 3 }) ? 'Blok H3' :
                            editor.isActive('heading', { level: 4 }) ? 'Blok H4' :
                              editor.isActive('heading', { level: 5 }) ? 'Blok H5' :
                                editor.isActive('heading', { level: 6 }) ? 'Blok H6' :
                                  editor.isActive('blockquote') ? 'Blok Kutipan' :
                                    editor.isActive('codeBlock') ? 'Blok Kode' :
                                      editor.isActive('table') ? 'Blok Tabel Data' :
                                        editor.isActive('bulletList') ? 'Blok Bullet' :
                                          editor.isActive('orderedList') ? 'Blok Angka' :
                                            'Blok Paragraf'}
                    </span>
                  </div>

                  {/* Detektor Blok Tabel */}

                  <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${editor.isActive('paragraph') ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtParagraph')}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Paragraf</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtH2')}
                  >
                    <Heading className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">H2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${editor.isActive('blockquote') ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtQuote')}
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Kutipan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${editor.isActive('codeBlock') ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtCode')}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Kode</span>
                  </button>
                </div>

                {/* Kanan: Formatting Teks (Font Family, Font Size, Undo, Redo, B, I, U, S, Code, Link, Clear Format, Hapus) */}
                <div className="flex flex-wrap items-center gap-1">
                  {/* Font Family Dropdown Picker */}
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'default') {
                        editor.chain().focus().unsetFontFamily().run();
                      } else {
                        editor.chain().focus().setFontFamily(val).run();
                      }
                    }}
                    className="bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] rounded-md text-[11px] font-medium py-1 px-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                    title={t('fmtFontFamily')}
                  >
                    <option value="default">Default</option>
                    <option value="'Plus Jakarta Sans', sans-serif">Sans-Serif</option>
                    <option value="Georgia, serif">Serif</option>
                    <option value="'JetBrains Mono', monospace">Monospace</option>
                  </select>

                  {/* Font Size Dropdown Picker */}
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'default') {
                        editor.chain().focus().unsetFontSize().run();
                      } else {
                        editor.chain().focus().setFontSize(val).run();
                      }
                    }}
                    className="bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] rounded-md text-[11px] font-medium py-1 px-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                    title={t('fmtFontSize')}
                  >
                    <option value="default">Default</option>
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="24px">24px</option>
                    <option value="32px">32px</option>
                  </select>

                  <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors"
                    title={t('fmtUndo')}
                  >
                    <Undo className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors"
                    title={t('fmtRedo')}
                  >
                    <Redo className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

                  {/* Tombol Penataan Teks: Rata Kiri, Rata Tengah, Rata Kanan, Rata Kiri Kanan (Justify) */}
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtAlignLeft')}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtAlignCenter')}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtAlignRight')}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtAlignJustify')}
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('bold') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtBold')}
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('italic') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtItalic')}
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('underline') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtUnderline')}
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('strike') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtStrike')}
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('code') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtInlineCode')}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

                  <button
                    type="button"
                    onClick={handleToggleLink}
                    className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('link') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
                    title={t('fmtAddLink')}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors"
                    title={t('fmtClearFormat')}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

                  <button
                    type="button"
                    onClick={() => {
                      if (editor) {
                        const { $from } = editor.state.selection;
                        const depth = Math.max(1, $from.depth);
                        const pos = $from.before(depth);
                        const node = editor.state.doc.nodeAt(pos);
                        if (node) {
                          editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
                        } else {
                          editor.chain().focus().deleteSelection().run();
                        }
                      }
                    }}
                    className="p-1.5 rounded-md text-rose-500 hover:bg-rose-500/10 font-bold transition-colors flex items-center gap-1"
                    title="Hapus Blok Terpilih"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attached Canvas Editor Area */}
        {activeTab === 'editor' ? (
          <div
            onDrop={handleDropOnCanvas}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onMouseMove={handleEditorMouseMove}
            onMouseLeave={handleEditorMouseLeave}
            className="flex-1 min-h-[500px] relative group/canvas"
          >
            {/* Notion / Visual Canvas Block Move Toolbar (Positioned outside on Left Margin) */}
            {dragHandleInfo.visible && (
              <div
                style={{ top: `${dragHandleInfo.top}px`, left: `-36px` }}
                className="absolute z-30 flex items-center gap-0.5 p-0.5 bg-[var(--bg-surface)] border border-blue-500/50 text-blue-500 rounded-lg shadow-md transition-all animate-fade-in"
              >
                <button
                  type="button"
                  onClick={handleMoveBlockUp}
                  className="p-1 hover:bg-blue-600 hover:text-white rounded transition-colors"
                  title="Klik untuk memindahkan blok 1 posisi ke atas"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleMoveBlockDown}
                  className="p-1 hover:bg-blue-600 hover:text-white rounded transition-colors"
                  title="Klik untuk memindahkan blok 1 posisi ke bawah"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-[var(--border-color)] mx-0.5" />
                <button
                  type="button"
                  onClick={() => {
                    if (editor && dragHandleInfo.pos !== undefined) {
                      const node = editor.state.doc.nodeAt(dragHandleInfo.pos);
                      if (node) {
                        editor.chain().focus().deleteRange({ from: dragHandleInfo.pos, to: dragHandleInfo.pos + node.nodeSize }).run();
                        setDragHandleInfo((prev) => ({ ...prev, visible: false }));
                      }
                    }
                  }}
                  className="p-1 text-rose-500 hover:bg-rose-600 hover:text-white rounded transition-colors"
                  title="Hapus Blok Ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={BUBBLE_MENU_TIPPY_OPTIONS}
                shouldShow={shouldShowTableMenu}
                className="bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-color)] p-2 rounded-2xl shadow-2xl flex flex-col w-56 space-y-1.5 z-[100] animate-fade-in text-xs max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar"
              >
                {/* Header Context Menu */}
                <div className="flex items-center justify-between px-2 py-1 border-b border-[var(--border-color)] pb-1.5">
                  <div className="flex items-center gap-1.5 font-extrabold text-[11px] text-blue-500 uppercase tracking-wider">
                    <Box className="w-3.5 h-3.5" />
                    <span>Kontrol Tabel Data</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                    Opsi
                  </span>
                </div>

                {/* Sub-grup Baris */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider px-2">Baris</span>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-left"
                    title="Tambah Baris di Atas"
                  >
                    <span>+ Baris di Atas</span>
                    <span className="text-[10px] opacity-60 font-mono">↑</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-left"
                    title="Tambah Baris di Bawah"
                  >
                    <span>+ Baris di Bawah</span>
                    <span className="text-[10px] opacity-60 font-mono">↓</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    title="Hapus Baris Aktif"
                  >
                    <span>- Hapus Baris Aktif</span>
                    <span className="text-[10px] opacity-60 font-mono">✕</span>
                  </button>
                </div>

                <div className="h-px bg-[var(--border-color)] w-full my-0.5" />

                {/* Sub-grup Kolom */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider px-2">Kolom</span>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-left"
                    title="Tambah Kolom di Kiri"
                  >
                    <span>+ Kolom di Kiri</span>
                    <span className="text-[10px] opacity-60 font-mono">←</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-left"
                    title="Tambah Kolom di Kanan"
                  >
                    <span>+ Kolom di Kanan</span>
                    <span className="text-[10px] opacity-60 font-mono">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    title="Hapus Kolom Aktif"
                  >
                    <span>- Hapus Kolom Aktif</span>
                    <span className="text-[10px] opacity-60 font-mono">✕</span>
                  </button>
                </div>

                <div className="h-px bg-[var(--border-color)] w-full my-0.5" />

                {/* Sub-grup Sel & Structure */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider px-2">Sel &amp; Struktur</span>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-left"
                    title="Gabungkan Sel Terpilih (Merge)"
                  >
                    <span>🔀 Gabungkan Sel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().splitCell().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-left"
                    title="Pisahkan Sel (Split)"
                  >
                    <span>✂️ Pisahkan Sel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-left"
                    title="Toggle Baris Header"
                  >
                    <span>👑 Toggle Header Row</span>
                  </button>
                </div>

                <div className="h-px bg-[var(--border-color)] w-full my-0.5" />

                {/* Hapus Tabel */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm text-left mt-1"
                  title="Hapus Seluruh Tabel"
                >
                  <span>🗑️ Hapus Seluruh Tabel</span>
                </button>
              </BubbleMenu>
            )}
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

      {/* Floating Toast Notification Simpan */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[var(--bg-surface)] border border-emerald-500/50 text-emerald-400 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in transition-all">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--text-main)]">{saveToast.message}</span>
            <span className="text-[10px] text-[var(--text-muted)]">Semua perubahan telah tersimpan ke database.</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveToast(null)}
            className="ml-2 text-gray-400 hover:text-gray-200 transition-colors p-1"
            title="Tutup Notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal Custom Insert Media / Link Popup */}
      <InsertMediaModal
        isOpen={mediaModalState.isOpen}
        type={mediaModalState.type}
        initialData={mediaModalState.initialData}
        onClose={() => setMediaModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleMediaModalConfirm}
      />

    </form>
  );
}
