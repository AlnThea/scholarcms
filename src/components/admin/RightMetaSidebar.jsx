'use client';

import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { dbService } from '@/services/dbService';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  X, Copy, Check, Sparkles, Calendar, Eye, Tag, Folder, Image as ImageIcon,
  FileText, User, Clock, Link as LinkIcon, RefreshCw, LayoutGrid, Save, ArrowLeft,
  Search, DollarSign, Globe, ShieldAlert, CheckSquare, Share2, Settings as SettingsIcon, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RightMetaSidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const isPageEditor = pathname?.startsWith('/dashboard/pages/new') || pathname?.startsWith('/dashboard/pages/edit');
  const isPostEditor = pathname?.startsWith('/dashboard/posts/new') || pathname?.startsWith('/dashboard/posts/edit');
  const showMetaSidebar = isPostEditor || isPageEditor;

  const {
    isOpen,
    closeSidebar,
    title,
    setTitle,
    slug,
    setSlug,
    excerpt,
    setExcerpt,
    category,
    setCategory,
    tags,
    setTags,
    featuredImage,
    setFeaturedImage,
    status,
    setStatus,
    readTime,
    setReadTime,
    publishedAt,
    setPublishedAt,
    views,
    author,
    setAuthor,

    // SEO Pro States
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

    // AdSense & Monetization States
    enableAds,
    setEnableAds,
    adPlacement,
    setAdPlacement,
    adClient,
    setAdClient,
    adSlot,
    setAdSlot,
    isSponsored,
    setIsSponsored,

    editorViewMode,
    setEditorViewMode,
    isSaving,
    triggerSave,
  } = useMetaSidebar();

  const [categoriesList, setCategoriesList] = useState([]);
  const [globalAdSettings, setGlobalAdSettings] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('publish');

  useEffect(() => {
    async function loadMetaInitialData() {
      try {
        const cats = await dbService.getCategories();
        setCategoriesList(cats || []);
        const gAds = await dbService.getAdSenseSettings();
        if (gAds) {
          setGlobalAdSettings(gAds);
          if (!adClient && gAds.adClient) {
            setAdClient(gAds.adClient);
          }
        }
      } catch (err) {
        console.error('Failed to load sidebar metadata:', err);
      }
    }
    if (showMetaSidebar) {
      loadMetaInitialData();
    }
  }, [showMetaSidebar]);

  if (!showMetaSidebar) {
    return null;
  }

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleGenerateSlug = () => {
    if (title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/post/${slug || ''}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tag management
  const tagArray = Array.isArray(tags)
    ? tags
    : (typeof tags === 'string' && tags
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : []);

  const handleAddTag = (newTag) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (!tagArray.includes(trimmed)) {
      const updated = Array.isArray(tags)
        ? [...tagArray, trimmed]
        : [...tagArray, trimmed].join(', ');
      setTags(updated);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const filtered = tagArray.filter(t => t !== tagToRemove);
    const updated = Array.isArray(tags)
      ? filtered
      : filtered.join(', ');
    setTags(updated);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  // Presets for Featured Image
  const PRESET_IMAGES = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
  ];

  const TABS = [
    { id: 'publish', label: 'Publikasi', icon: Calendar },
    { id: 'seo', label: 'SEO Pro', icon: Search },
    { id: 'adsense', label: 'AdSense', icon: DollarSign },
    { id: 'slug', label: 'URL', icon: LinkIcon },
    { id: 'taxonomy', label: 'Kategori', icon: Folder },
    { id: 'media', label: 'Cover', icon: ImageIcon },
    { id: 'excerpt', label: 'Ringkasan', icon: FileText },
  ];

  return (
    <aside
      className={`fixed inset-y-0 right-0 w-80 sm:w-96 bg-[var(--bg-surface)]/95 backdrop-blur-2xl border-l border-[var(--border-color)] shadow-2xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--text-main)]">Meta Artikel</h3>
            <p className="text-[10px] text-[var(--text-subtle)]">Pengaturan & Informasi Publikasi</p>
          </div>
        </div>
        <button
          onClick={closeSidebar}
          className="p-1.5 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          title="Tutup Meta Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>



      {/* Navigation Tab Buttons Bar — Wrap otomatis ke bawah */}
      <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/40 flex flex-wrap items-center gap-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] bg-[var(--bg-surface)]/60 border border-[var(--border-color)]/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Body per Active Tab */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-[var(--text-main)]">

        {/* TAB 1: PUBLIKASI & AUTHOR */}
        {activeTab === 'publish' && (
          <div className="space-y-4 animate-fade-in">
            {/* Automatic Author Badge Card */}
            <div className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-blue-500/5 flex items-center gap-3">
              <img
                src={author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={author?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30 shadow-sm shrink-0"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
              />
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-blue-500">Pengarang Artikel (Author):</span>
                <span className="block font-extrabold text-xs text-[var(--text-main)] truncate">{author?.name || user?.name || 'Penulis ScholarCMS'}</span>
                <span className="block text-[10px] text-[var(--text-subtle)] truncate">{author?.role || user?.titleRole || user?.role || 'Author'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
              <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Status & Jadwal Publikasi
              </h4>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Status Posting</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="published">🟢 Terbit Instan (Published)</option>
                  <option value="scheduled">⏰ Terjadwal (Scheduled)</option>
                  <option value="draft">🟡 Konsep (Draft)</option>
                </select>
              </div>

              {/* Published At Date-Time */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Tanggal & Waktu Publikasi / Rilis</label>
                <input
                  type="datetime-local"
                  value={publishedAt || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPublishedAt(val);
                    if (val && new Date(val).getTime() > Date.now() && status !== 'draft') {
                      setStatus('scheduled');
                    } else if (val && new Date(val).getTime() <= Date.now() && status === 'scheduled') {
                      setStatus('published');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors font-medium"
                />
              </div>

              {/* Scheduled Information Badge */}
              {(status === 'scheduled' || (publishedAt && new Date(publishedAt).getTime() > Date.now() && status !== 'draft')) && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    <span>Penjadwalan Otomatis (Tanpa Cron)</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Artikel ini akan otomatis dapat diakses publik begitu waktu rilis tercapai (Just-In-Time evaluation).
                  </p>
                </div>
              )}

              {/* Views Stats & Read Time */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-[var(--text-subtle)]">Total Pembaca</span>
                    <span className="font-extrabold text-xs text-[var(--text-main)]">{views || 0} views</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="w-full">
                    <span className="block text-[9px] font-bold uppercase text-[var(--text-subtle)]">Durasi Baca</span>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full bg-transparent font-bold text-xs text-[var(--text-main)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB SEO PRO: META TITLE, DESCRIPTION, FOCUS KEYWORD, GOOGLE SNIPPET PREVIEW */}
        {activeTab === 'seo' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Live Google Search Preview Card Simulator */}
            <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between border-b border-blue-500/10 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Pratinjau Google Snippet
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 font-bold text-blue-400">
                  Google Search Live
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-500" />
                  <span>https://scholarcms.com › post › {slug || 'judul-artikel'}</span>
                </div>
                <h4 className="text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:underline leading-snug cursor-pointer">
                  {seoTitle || title || 'Judul Artikel Meta SEO - Google Snippet'}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {seoDescription || excerpt || 'Tulis ringkasan penjelas meta deskripsi di sini agar calon pembaca di Google tertarik mengklik artikel Anda.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
              
              {/* Judul SEO (Meta Title) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Judul SEO (Meta Title)</label>
                  <span className={`text-[10px] font-bold ${(seoTitle || title).length > 60 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {(seoTitle || title).length}/60 karakter
                  </span>
                </div>
                <Input
                  type="text"
                  placeholder={title || "Judul khusus mesin pencari..."}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  helperText="Kosongkan jika ingin sama persis dengan judul artikel utama."
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Deskripsi Meta (Google Snippet)</label>
                  <span className={`text-[10px] font-bold ${(seoDescription || excerpt).length > 160 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {(seoDescription || excerpt).length}/160 karakter
                  </span>
                </div>
                <Textarea
                  placeholder="Ringkasan khusus untuk snippet hasil pencarian Google..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  helperText="Rekomendasi 120 - 160 karakter untuk tingkat CTR pencarian tertinggi."
                />
              </div>

              {/* Focus Keyword */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Kata Kunci Utama (Focus Keyword)</label>
                <Input
                  type="text"
                  placeholder="Contoh: Next.js CMS, Tutorial React"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  icon={Tag}
                  helperText="Kata kunci target utama yang dioptimalkan untuk SEO artikel ini."
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">URL Canonical Kustom</label>
                <Input
                  type="url"
                  placeholder="https://domain-utama.com/post/original"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  icon={LinkIcon}
                  helperText="Gunakan jika artikel ini disadur dari sumber asli lain."
                />
              </div>

              {/* Robots NoIndex Switch */}
              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="block font-bold text-xs text-[var(--text-main)]">Pengindeksan Search Engine</span>
                    <span className="block text-[10px] text-[var(--text-muted)]">Sembunyikan dari pencarian Google (noindex)</span>
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
        )}

        {/* TAB ADSENSE & MONETISASI: ADSENSE SWITCH, PLACEMENT, SLOT ID, SPONSORED TAG */}
        {activeTab === 'adsense' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Global Inherited AdSense Info Card */}
            <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between border-b border-blue-500/10 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Kredensial AdSense Situs
                </span>
                {role === 'admin' && (
                  <Link href="/dashboard/settings" className="text-[9px] font-bold text-blue-500 hover:underline flex items-center gap-1">
                    <SettingsIcon className="w-3 h-3" /> Kelola (Admin)
                  </Link>
                )}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] space-y-1">
                <div className="flex items-center justify-between">
                  <span>ID Publisher Global:</span>
                  <span className="font-mono font-bold text-[var(--text-main)]">
                    {globalAdSettings?.adClient || adClient || 'ca-pub-9999999999999999'}
                  </span>
                </div>
                <p className="text-[10px] opacity-75">
                  Iklan disunting dan dikelola secara otomatis terpusat dari Halaman Pengaturan CMS.
                </p>
              </div>
            </div>

            {/* AdSense Live Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              enableAds
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                  enableAds ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs">
                    {enableAds ? 'Monetisasi Artikel Aktif 💰' : 'Iklan Artikel Dinonaktifkan'}
                  </h4>
                  <p className="text-[10px] opacity-80">
                    {enableAds ? 'Iklan banner otomatis tayang di artikel ini' : 'Artikel ini bersih dari tayangan iklan'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableAds}
                onChange={(e) => setEnableAds(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {enableAds && (
              <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
                
                {/* Posisi Penempatan Iklan */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Posisi Penempatan Iklan Artikel</label>
                  <Select
                    value={adPlacement}
                    onChange={(e) => setAdPlacement(e.target.value)}
                  >
                    <option value="all">🌟 Seluruh Posisi (Header, Tengah &amp; Footer)</option>
                    <option value="top">⬆️ Atas Artikel (Header Ad)</option>
                    <option value="in_article">↔️ Tengah Artikel (In-Article Auto Ad)</option>
                    <option value="bottom">⬇️ Bawah Artikel (Footer Ad)</option>
                  </Select>
                </div>

                {/* Sponsored Post Partnership Badge */}
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-3">
                  <div>
                    <span className="block font-bold text-xs text-[var(--text-main)]">Artikel Bersponsor (Paid Partnership)</span>
                    <span className="block text-[10px] text-[var(--text-muted)]">Tampilkan lencana sponsor resmi di atas artikel</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSponsored}
                    onChange={(e) => setIsSponsored(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: SLUG & PERMALINK */}
        {activeTab === 'slug' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
              <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-500" />
                Judul & Permalink Slug
              </h4>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">
                  {isPageEditor ? 'Judul Utama Halaman' : 'Judul Utama Artikel'}
                </label>
                <input
                  type="text"
                  placeholder={isPageEditor ? "Masukkan judul halaman..." : "Masukkan judul artikel..."}
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors font-medium"
                />
              </div>

              {/* Slug with Regenerate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">Slug Permalink</label>
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
                <span className="block text-[9px] font-bold uppercase text-[var(--text-subtle)]">URL Pratinjau Publik:</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-[var(--text-muted)] truncate">
                    /post/<strong className="text-blue-500">{slug || 'judul-artikel'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Tersalin' : 'Salin URL'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: TAKSONOMI (KATEGORI & TAG) */}
        {activeTab === 'taxonomy' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
              <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
                <Folder className="w-4 h-4 text-purple-500" />
                Kategori & Tag Taksonomi
              </h4>

              {/* Category Dropdown from DB */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Pilih Kategori Dari Database</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {categoriesList.length > 0 ? (
                    categoriesList.map(c => (
                      <option key={c.id || c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Web Development">Web Development</option>
                      <option value="Firebase & Cloud">Firebase & Cloud</option>
                      <option value="UI & UX Design">UI & UX Design</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                    </>
                  )}
                </select>
              </div>

              {/* Custom Category Input Option */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Atau Kategori Kustom</label>
                <input
                  type="text"
                  placeholder="Ketik nama kategori baru..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Tags Input & Chips */}
              <div className="pt-2 border-t border-[var(--border-color)]/50">
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1.5">Tag Artikel (Chips)</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Tambah tag (Tekan Enter)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                  >
                    Tambah
                  </button>
                </div>

                {/* Tag Pills Display */}
                <div className="flex flex-wrap gap-1.5">
                  {tagArray.length > 0 ? (
                    tagArray.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[11px] border border-purple-500/20"
                      >
                        <Tag className="w-3 h-3" />
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-red-500 ml-1 font-bold text-xs"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-[var(--text-subtle)] italic">Belum ada tag ditambahkan</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: MEDIA COVER */}
        {activeTab === 'media' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
              <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-pink-500" />
                Gambar Unggulan (Cover Image)
              </h4>

              {/* Live Preview Card */}
              {featuredImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] group aspect-video bg-black/20 shadow-md">
                  <img
                    src={featuredImage}
                    alt="Featured Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-red-700 transition-colors"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-center text-[var(--text-subtle)] text-[11px]">
                  Belum ada URL gambar dipilih
                </div>
              )}

              {/* URL Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">URL Gambar Cover</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              {/* Preset Sample Images */}
              <div>
                <span className="block text-[10px] font-bold uppercase text-[var(--text-subtle)] mb-2">Sampel Gambar Unsplash:</span>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFeaturedImage(img)}
                      className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all ${
                        featuredImage === img ? 'border-pink-500 ring-4 ring-pink-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: RINGKASAN (EXCERPT) */}
        {activeTab === 'excerpt' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-3">
              <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Ringkasan Excerpt
                </span>
                <span className="text-[10px] text-[var(--text-subtle)] font-mono">
                  {excerpt ? excerpt.length : 0} karakter
                </span>
              </h4>

              <textarea
                rows={5}
                placeholder="Tulis ringkasan singkat artikel untuk kartu pratinjau..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-amber-500 transition-colors leading-relaxed"
              />
              <p className="text-[10px] text-[var(--text-subtle)] italic">
                💡 Ringkasan ini akan tampil pada kartu artikel di halaman depan dan hasil pencarian.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer info */}
      <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-[var(--text-subtle)]">
        <span>ScholarCMS Meta Bar</span>
        <span className="text-emerald-500 font-bold">Firestore Sync Active ⚡</span>
      </div>
    </aside>
  );
}

