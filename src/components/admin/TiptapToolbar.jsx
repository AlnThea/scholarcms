import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';
import {
  Save, Eye, Edit3, ArrowLeft, Sparkles, Box, Type, Heading, Quote, Code, 
  Undo, Redo, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Strikethrough, Code2, Link2, Eraser, Trash2
} from 'lucide-react';

export default function TiptapToolbar({ 
  editor, 
  activeTab, 
  isPage, 
  saving, 
  backLink, 
  setIsAiModalOpen, 
  setEditorViewMode, 
  handleSubmit, 
  handleToggleLink 
}) {
  const { t } = useLanguage();

  if (!editor) return null;

  return (
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

        {/* Right Workspace Actions */}
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
            onClick={() => handleSubmit(null, false, 'draft')}
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

          {/* Kanan: Formatting Teks */}
          <div className="flex flex-wrap items-center gap-1">
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'default') editor.chain().focus().unsetFontFamily().run();
                else editor.chain().focus().setFontFamily(val).run();
              }}
              className="bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] rounded-md text-[11px] font-medium py-1 px-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
              title={t('fmtFontFamily')}
            >
              <option value="default">Default</option>
              <option value="'Plus Jakarta Sans', sans-serif">Sans-Serif</option>
              <option value="Georgia, serif">Serif</option>
              <option value="'JetBrains Mono', monospace">Monospace</option>
            </select>

            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'default') editor.chain().focus().unsetFontSize().run();
                else editor.chain().focus().setFontSize(val).run();
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

            <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors" title={t('fmtUndo')}><Undo className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors" title={t('fmtRedo')}><Redo className="w-3.5 h-3.5" /></button>

            <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtAlignLeft')}><AlignLeft className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtAlignCenter')}><AlignCenter className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtAlignRight')}><AlignRight className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtAlignJustify')}><AlignJustify className="w-3.5 h-3.5" /></button>

            <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('bold') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtBold')}><Bold className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('italic') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtItalic')}><Italic className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('underline') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtUnderline')}><Underline className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('strike') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtStrike')}><Strikethrough className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('code') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtInlineCode')}><Code2 className="w-3.5 h-3.5" /></button>

            <div className="h-3.5 w-px bg-[var(--border-color)] mx-0.5" />

            <button type="button" onClick={handleToggleLink} className={`p-1.5 rounded-md text-xs transition-all ${editor.isActive('link') ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`} title={t('fmtAddLink')}><Link2 className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors hover:text-red-500" title={t('fmtClear')}><Eraser className="w-3.5 h-3.5" /></button>

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
  );
}
