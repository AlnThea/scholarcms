import { Link as LinkIcon, RefreshCw, Check, Copy } from 'lucide-react';

export default function SlugPanel({
  isEn,
  t,
  isPageEditor,
  title,
  handleTitleChange,
  handleGenerateSlug,
  slug,
  setSlug,
  handleCopyLink,
  copied
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-emerald-500" />
          {isEn ? 'Title & Permalink Slug' : 'Judul & Permalink Slug'}
        </h4>

        {/* Title */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">
            {isPageEditor ? t('labelTitlePage') : t('labelTitlePost')}
          </label>
          <input
            type="text"
            placeholder={isPageEditor ? t('placeholderTitlePage') : t('placeholderTitlePost')}
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors font-medium"
          />
        </div>

        {/* Slug with Regenerate */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">{isEn ? 'Slug Permalink' : 'Slug Permalink'}</label>
            <button
              type="button"
              onClick={handleGenerateSlug}
              className="text-[10px] text-blue-500 font-semibold flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="w-3 h-3" /> Auto Slug
            </button>
          </div>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-xs text-blue-500 font-bold focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* URL Preview & Copy */}
        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
          <span className="block text-[9px] font-bold uppercase text-[var(--text-subtle)]">{isEn ? 'Public Preview URL:' : 'URL Pratinjau Publik:'}</span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-[var(--text-muted)] truncate">
              /post/<strong className="text-blue-500">{slug || (isEn ? 'article-slug' : 'judul-artikel')}</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-sm"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? (isEn ? 'Copied' : 'Tersalin') : (isEn ? 'Copy URL' : 'Salin URL')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
