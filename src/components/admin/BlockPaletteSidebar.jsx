'use client';

import {
  Type, Heading, Quote, Code, Sparkles,
  List, ListOrdered, Image, Minus, Layers
} from 'lucide-react';

const TEXT_BLOCKS = [
  {
    type: 'paragraph',
    label: 'Paragraf',
    icon: Type,
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    type: 'heading2',
    label: 'Judul (H2)',
    icon: Heading,
    color: 'text-indigo-500 bg-indigo-500/10'
  },
  {
    type: 'heading3',
    label: 'Sub-Judul (H3)',
    icon: Heading,
    color: 'text-purple-500 bg-purple-500/10'
  }
];

const MEDIA_BLOCKS = [
  {
    type: 'quote',
    label: 'Kutipan',
    icon: Quote,
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    type: 'codeBlock',
    label: 'Kode',
    icon: Code,
    color: 'text-amber-500 bg-amber-500/10'
  },
  {
    type: 'callout',
    label: 'Callout Box',
    icon: Sparkles,
    color: 'text-pink-500 bg-pink-500/10'
  },
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
    type: 'image',
    label: 'Gambar',
    icon: Image,
    color: 'text-rose-500 bg-rose-500/10'
  },
  {
    type: 'horizontalRule',
    label: 'Pembatas',
    icon: Minus,
    color: 'text-gray-500 bg-gray-500/10'
  }
];

export default function BlockPaletteSidebar({ onInsertBlock }) {

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('text/plain', blockType);
    e.dataTransfer.setData('blockType', blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderGridSection = (title, blocks) => (
    <div className="space-y-2">
      <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1.5 px-0.5">
        {title}
      </h4>

      <div className="grid grid-cols-2 gap-2.5">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.type}
              draggable
              onDragStart={(e) => handleDragStart(e, block.type)}
              onClick={() => onInsertBlock && onInsertBlock(block.type)}
              className="group flex flex-col items-center justify-center p-3 rounded-2xl hover:border-blue-500/60 hover:bg-blue-500/5 hover:shadow-md cursor-grab active:cursor-grabbing transition-all select-none text-center"
              title={`Klik atau seret untuk menyisipkan ${block.label}`}
            >
              <div className={`p-2.5 rounded-xl ${block.color} mb-2 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-blue-500 transition-colors">
                {block.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 sm:w-72 bg-[var(--bg-surface)] border-r border-[var(--border-color)] p-4 flex flex-col shrink-0 space-y-5 sticky top-16 h-[calc(100vh-64px)] rounded-none shadow-none">

      {/* Header Palette (No "Sidebar 2:" prefix) */}
      <div className="border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <h3 className="font-extrabold text-sm text-[var(--text-main)] tracking-tight">Palet Komponen</h3>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
          Seret tombol atau klik untuk menyisipkan ke Canvas.
        </p>
      </div>

      {/* Grid Sections */}
      <div className="space-y-5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {renderGridSection('Teks & Judul', TEXT_BLOCKS)}
        {renderGridSection('Media & Format', MEDIA_BLOCKS)}
      </div>

    </aside>
  );
}
