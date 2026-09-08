'use client';

import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { useLanguage } from '@/context/LanguageContext';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Search, Globe, Tag, Link as LinkIcon, ShieldAlert } from 'lucide-react';

export default function SeoPanel() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const {
    title,
    slug,
    excerpt,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    focusKeyword,
    setFocusKeyword,
    canonicalUrl,
    setCanonicalUrl,
    noIndex,
    setNoIndex,
  } = useMetaSidebar();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Live Google Search Preview Card Simulator */}
      <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2">
        <div className="flex items-center justify-between border-b border-blue-500/10 pb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> {isEn ? 'Google Snippet Preview' : 'Pratinjau Google Snippet'}
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 font-bold text-blue-400">
            Google Search Live
          </span>
        </div>
        <div className="space-y-1 pt-1">
          <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-500" />
            <span>https://bytelab.web.id › post › {slug || 'article-slug'}</span>
          </div>
          <h4 className="text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:underline leading-snug cursor-pointer">
            {seoTitle || title || (isEn ? 'Article Meta SEO Title - Google Snippet' : 'Judul Artikel Meta SEO - Google Snippet')}
          </h4>
          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {seoDescription || excerpt || (isEn ? 'Write a concise meta description summary here so search readers on Google are compelled to click.' : 'Tulis ringkasan penjelas meta deskripsi di sini agar calon pembaca di Google tertarik mengklik artikel Anda.')}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
        {/* Judul SEO (Meta Title) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">{isEn ? 'SEO Title (Meta Title)' : 'Judul SEO (Meta Title)'}</label>
            <span className={`text-[10px] font-bold ${(seoTitle || title || '').length > 60 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {(seoTitle || title || '').length}/60 {isEn ? 'chars' : 'karakter'}
            </span>
          </div>
          <Input
            type="text"
            placeholder={title || (isEn ? "Title for search engines..." : "Judul khusus mesin pencari...")}
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            helperText={isEn ? "Leave empty to match main article title." : "Kosongkan jika ingin sama persis dengan judul artikel utama."}
          />
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">{isEn ? 'Meta Description (Google Snippet)' : 'Deskripsi Meta (Google Snippet)'}</label>
            <span className={`text-[10px] font-bold ${(seoDescription || excerpt || '').length > 160 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {(seoDescription || excerpt || '').length}/160 {isEn ? 'chars' : 'karakter'}
            </span>
          </div>
          <Textarea
            placeholder={isEn ? "Short summary for Google search snippet..." : "Ringkasan khusus untuk snippet hasil pencarian Google..."}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            helperText={isEn ? "Recommended 120 - 160 characters for highest search CTR." : "Rekomendasi 120 - 160 karakter untuk tingkat CTR pencarian tertinggi."}
          />
        </div>

        {/* Focus Keyword */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{isEn ? 'Focus Keyword' : 'Kata Kunci Utama (Focus Keyword)'}</label>
          <Input
            type="text"
            placeholder={isEn ? "e.g. Next.js CMS, React Tutorial" : "Contoh: Next.js CMS, Tutorial React"}
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            icon={Tag}
            helperText={isEn ? "Target primary keyword optimized for this article." : "Kata kunci target utama yang dioptimalkan untuk SEO artikel ini."}
          />
        </div>

        {/* Canonical URL */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{isEn ? 'Custom Canonical URL' : 'URL Canonical Kustom'}</label>
          <Input
            type="url"
            placeholder="https://main-domain.com/post/original"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            icon={LinkIcon}
            helperText={isEn ? "Use if this article is republished from another source." : "Gunakan jika artikel ini disadur dari sumber asli lain."}
          />
        </div>

        {/* Robots NoIndex Switch */}
        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="block font-bold text-xs text-[var(--text-main)]">{isEn ? 'Search Engine Indexing' : 'Pengindeksan Search Engine'}</span>
              <span className="block text-[10px] text-[var(--text-muted)]">{isEn ? 'Hide from Google Search (noindex)' : 'Sembunyikan dari pencarian Google (noindex)'}</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={noIndex}
            onChange={(e) => setNoIndex(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
