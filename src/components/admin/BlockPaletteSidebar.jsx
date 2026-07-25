'use client';

import { useState, useEffect } from 'react';
import {
  Type, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, TextQuote,
  List, ListOrdered, ListTodo, Table, Quote, Code, Sparkles, CheckCircle2, AlertTriangle, AlertOctagon,
  Image, Video, Link2, HelpCircle, Minus, Layers, ChevronLeft, ChevronRight, Columns, Grid, LayoutGrid,
  ChevronDown, ChevronUp
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

const LAYOUT_COLUMNS_BLOCKS = [
  {
    type: 'col-50-50',
    label: '50:50',
    icon: Columns,
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    type: 'col-30-70',
    label: '30:70',
    icon: Columns,
    color: 'text-indigo-500 bg-indigo-500/10'
  },
  {
    type: 'col-70-30',
    label: '70:30',
    icon: Columns,
    color: 'text-purple-500 bg-purple-500/10'
  },
  {
    type: 'col-20-80',
    label: '20:80',
    icon: Columns,
    color: 'text-cyan-500 bg-cyan-500/10'
  },
  {
    type: 'col-80-20',
    label: '80:20',
    icon: Columns,
    color: 'text-teal-500 bg-teal-500/10'
  },
  {
    type: 'col-40-60',
    label: '40:60',
    icon: Columns,
    color: 'text-violet-500 bg-violet-500/10'
  },
  {
    type: 'col-60-40',
    label: '60:40',
    icon: Columns,
    color: 'text-sky-500 bg-sky-500/10'
  },
  {
    type: 'col-10-90',
    label: '10:90',
    icon: Columns,
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    type: 'col-90-10',
    label: '90:10',
    icon: Columns,
    color: 'text-amber-500 bg-amber-500/10'
  },
  {
    type: 'col-33-33-33',
    label: '33:33:33',
    icon: Grid,
    color: 'text-rose-500 bg-rose-500/10'
  },
  {
    type: 'col-25-50-25',
    label: '25:50:25',
    icon: Grid,
    color: 'text-pink-500 bg-pink-500/10'
  },
  {
    type: 'col-25-25-50',
    label: '25:25:50',
    icon: Grid,
    color: 'text-fuchsia-500 bg-fuchsia-500/10'
  },
  {
    type: 'col-50-25-25',
    label: '50:25:25',
    icon: Grid,
    color: 'text-purple-600 bg-purple-600/10'
  },
  {
    type: 'col-25-25-25-25',
    label: '25:25:25:25',
    icon: LayoutGrid,
    color: 'text-blue-600 bg-blue-600/10'
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
  const [openSections, setOpenSections] = useState({
    text: true,
    columns: true,
    list: true,
    quote: true,
    callout: true,
    media: true,
  });

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

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('text/plain', blockType);
    e.dataTransfer.setData('blockType', blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderGridSection = (key, title, blocks) => {
    const isOpen = openSections[key] ?? true;

    return (
      <div className={isCollapsed ? 'space-y-1.5' : 'space-y-2'}>
        {!isCollapsed ? (
          <button
            type="button"
            onClick={() => toggleSection(key)}
            className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] hover:text-blue-500 border-b border-[var(--border-color)] pb-1.5 px-0.5 transition-colors cursor-pointer select-none"
          >
            <span>{title}</span>
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            )}
          </button>
        ) : (
          <div className="border-b border-[var(--border-color)] my-1 w-full" title={title} />
        )}

        {(isOpen || isCollapsed) && (
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
        )}
      </div>
    );
  };

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
        {renderGridSection('text', '🔤 Teks & Headings', TEXT_BLOCKS)}
        {renderGridSection('columns', '📐 Tata Letak & Kolom', LAYOUT_COLUMNS_BLOCKS)}
        {renderGridSection('list', '📑 Daftar & Penataan', LIST_TABLE_BLOCKS)}
        {renderGridSection('quote', '💬 Kutipan & Kode', QUOTE_CODE_BLOCKS)}
        {renderGridSection('callout', '💡 Callout & Notifikasi', CALLOUT_BLOCKS)}
        {renderGridSection('media', '🎨 Media & Interaktif', MEDIA_INTERACTIVE_BLOCKS)}
      </div>

    </aside>
  );
}
