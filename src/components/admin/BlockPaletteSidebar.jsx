'use client';

import { useState, useEffect } from 'react';
import {
  Type, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, TextQuote,
  List, ListOrdered, ListTodo, Table, Quote, Code, Sparkles, CheckCircle2, AlertTriangle, AlertOctagon,
  Image, Video, Link2, HelpCircle, Minus, Layers, ChevronLeft, ChevronRight
} from 'lucide-react';

const TEXT_BLOCKS = [
  {
    type: 'paragraph',
    label: 'Paragraf',
    icon: Type,
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    type: 'leadParagraph',
    label: 'Paragraf Lead',
    icon: TextQuote,
    color: 'text-teal-500 bg-teal-500/10'
  },
  {
    type: 'heading1',
    label: 'Judul Utama (H1)',
    icon: Heading1,
    color: 'text-blue-600 bg-blue-600/10'
  },
  {
    type: 'heading2',
    label: 'Judul Sub (H2)',
    icon: Heading2,
    color: 'text-indigo-500 bg-indigo-500/10'
  },
  {
    type: 'heading3',
    label: 'Sub-Judul (H3)',
    icon: Heading3,
    color: 'text-purple-500 bg-purple-500/10'
  },
  {
    type: 'heading4',
    label: 'Poin Judul (H4)',
    icon: Heading4,
    color: 'text-violet-500 bg-violet-500/10'
  },
  {
    type: 'heading5',
    label: 'Judul Kecil (H5)',
    icon: Heading5,
    color: 'text-sky-500 bg-sky-500/10'
  },
  {
    type: 'heading6',
    label: 'Mikro Judul (H6)',
    icon: Heading6,
    color: 'text-slate-500 bg-slate-500/10'
  }
];

const LIST_TABLE_BLOCKS = [
  {
    type: 'bulletList',
    label: 'Daftar Bullet',
    icon: List,
    color: 'text-cyan-500 bg-cyan-500/10'
  },
  {
    type: 'orderedList',
    label: 'Daftar Angka',
    icon: ListOrdered,
    color: 'text-teal-500 bg-teal-500/10'
  },
  {
    type: 'taskList',
    label: 'Checklist Tugas',
    icon: ListTodo,
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    type: 'table',
    label: 'Tabel Data',
    icon: Table,
    color: 'text-indigo-500 bg-indigo-500/10'
  }
];

const QUOTE_CODE_BLOCKS = [
  {
    type: 'quote',
    label: 'Kutipan Box',
    icon: Quote,
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    type: 'codeBlock',
    label: 'Kode Snippet',
    icon: Code,
    color: 'text-amber-500 bg-amber-500/10'
  }
];

const CALLOUT_BLOCKS = [
  {
    type: 'callout',
    label: 'Info Callout',
    icon: Sparkles,
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    type: 'alertSuccess',
    label: 'Tips Sukses',
    icon: CheckCircle2,
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    type: 'alertWarning',
    label: 'Peringatan',
    icon: AlertTriangle,
    color: 'text-amber-500 bg-amber-500/10'
  },
  {
    type: 'alertDanger',
    label: 'Perhatian Bahaya',
    icon: AlertOctagon,
    color: 'text-rose-500 bg-rose-500/10'
  }
];

const MEDIA_INTERACTIVE_BLOCKS = [
  {
    type: 'image',
    label: 'Gambar Web',
    icon: Image,
    color: 'text-rose-500 bg-rose-500/10'
  },
  {
    type: 'video',
    label: 'Video YouTube',
    icon: Video,
    color: 'text-red-500 bg-red-500/10'
  },
  {
    type: 'button',
    label: 'Tombol CTA Link',
    icon: Link2,
    color: 'text-blue-600 bg-blue-600/10'
  },
  {
    type: 'details',
    label: 'Accordion FAQ',
    icon: HelpCircle,
    color: 'text-purple-600 bg-purple-600/10'
  },
  {
    type: 'horizontalRule',
    label: 'Pembatas (HR)',
    icon: Minus,
    color: 'text-gray-500 bg-gray-500/10'
  }
];

export default function BlockPaletteSidebar({ onInsertBlock }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scholarcms_palette_collapsed');
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load palette collapse state:', e);
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('scholarcms_palette_collapsed', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save palette collapse state:', e);
      }
      return next;
    });
  };

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('text/plain', blockType);
    e.dataTransfer.setData('blockType', blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderGridSection = (title, blocks) => (
    <div className={isCollapsed ? 'space-y-1.5' : 'space-y-2'}>
      {!isCollapsed ? (
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1.5 px-0.5">
          {title}
        </h4>
      ) : (
        <div className="border-b border-[var(--border-color)] my-1 w-full" title={title} />
      )}

      <div className={isCollapsed ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-2 gap-2.5'}>
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.type}
              draggable
              onDragStart={(e) => handleDragStart(e, block.type)}
              onClick={() => onInsertBlock && onInsertBlock(block.type)}
              className={`group flex flex-col items-center justify-center rounded-2xl hover:border-blue-500/60 hover:bg-blue-500/5 hover:shadow-md cursor-grab active:cursor-grabbing transition-all select-none text-center ${
                isCollapsed ? 'p-2' : 'p-3'
              }`}
              title={`Klik atau seret untuk menyisipkan ${block.label}`}
            >
              <div className={`p-2.5 rounded-xl ${block.color} group-hover:scale-110 transition-transform ${isCollapsed ? 'mb-0' : 'mb-2'}`}>
                <Icon className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-blue-500 transition-colors">
                  {block.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`${isCollapsed ? 'w-16 p-2 space-y-4' : 'w-64 sm:w-72 p-4 space-y-5'} bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col shrink-0 sticky top-16 h-[calc(100vh-64px)] rounded-none shadow-none transition-all duration-300 ease-in-out`}>

      {/* Header Palette */}
      <div className={`border-b border-[var(--border-color)] ${isCollapsed ? 'pb-2.5 flex flex-col items-center gap-2' : 'pb-3'}`}>
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2 overflow-hidden">
            <Layers className="w-4 h-4 text-blue-500 shrink-0" />
            {!isCollapsed && (
              <h3 className="font-extrabold text-sm text-[var(--text-main)] tracking-tight whitespace-nowrap">Palet Komponen</h3>
            )}
          </div>
          <button
            type="button"
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 transition-colors shrink-0"
            title={isCollapsed ? 'Extend / Perluas Palet Komponen' : 'Collapse / Ciutkan Palet Komponen'}
            aria-label={isCollapsed ? 'Extend Palet Komponen' : 'Collapse Palet Komponen'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        {!isCollapsed && (
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
            Seret tombol atau klik untuk menyisipkan ke Canvas.
          </p>
        )}
      </div>

      {/* Grid Sections Grouped */}
      <div className="space-y-5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {renderGridSection('🔤 Teks & Headings', TEXT_BLOCKS)}
        {renderGridSection('📑 Daftar & Penataan', LIST_TABLE_BLOCKS)}
        {renderGridSection('💬 Kutipan & Kode', QUOTE_CODE_BLOCKS)}
        {renderGridSection('💡 Callout & Notifikasi', CALLOUT_BLOCKS)}
        {renderGridSection('🎨 Media & Interaktif', MEDIA_INTERACTIVE_BLOCKS)}
      </div>

    </aside>
  );
}


