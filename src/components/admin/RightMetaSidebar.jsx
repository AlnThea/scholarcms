'use client';

import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { dbService } from '@/services/dbService';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  X, Copy, Check, Sparkles, Calendar, Eye, Tag, Folder, Image as ImageIcon,
  FileText, User, Clock, Link as LinkIcon, RefreshCw, LayoutGrid, Save, ArrowLeft,
  Search, DollarSign, Globe, ShieldAlert, CheckSquare, Share2, Settings as SettingsIcon, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import SeoPanel from './meta/SeoPanel';
import TaxonomyPanel from './meta/TaxonomyPanel';
import PublishPanel from './meta/PublishPanel';
import AdsensePanel from './meta/AdsensePanel';
import SlugPanel from './meta/SlugPanel';
import MediaPanel from './meta/MediaPanel';
import ExcerptPanel from './meta/ExcerptPanel';

export default function RightMetaSidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const { t, language } = useLanguage();
  const isEn = language === 'en';
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
    subCategory,
    setSubCategory,
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
    { id: 'publish', label: t('metaTabPublish'), icon: Calendar },
    { id: 'seo', label: t('metaTabSeo'), icon: Search },
    { id: 'adsense', label: 'AdSense', icon: DollarSign },
    { id: 'slug', label: t('metaTabSlug'), icon: LinkIcon },
    { id: 'taxonomy', label: t('metaTabTaxonomy'), icon: Folder },
    { id: 'media', label: t('metaTabCover'), icon: ImageIcon },
    { id: 'excerpt', label: t('metaTabExcerpt'), icon: FileText },
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
            <h3 className="font-bold text-sm text-[var(--text-main)]">{t('metaSidebarTitle')}</h3>
            <p className="text-[10px] text-[var(--text-subtle)]">{t('metaSidebarSubtitle')}</p>
          </div>
        </div>
        <button
          onClick={closeSidebar}
          className="p-1.5 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          title={t('metaClose')}
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
        {activeTab === 'publish' && <PublishPanel />}

        {/* TAB SEO PRO: META TITLE, DESCRIPTION, FOCUS KEYWORD, GOOGLE SNIPPET PREVIEW */}
        {activeTab === 'seo' && <SeoPanel />}

        {/* TAB ADSENSE & MONETISASI: ADSENSE SWITCH, PLACEMENT, SLOT ID, SPONSORED TAG */}
        {activeTab === 'adsense' && (
          <AdsensePanel
            isEn={isEn}
            globalAdSettings={globalAdSettings}
            adClient={adClient}
            enableAds={enableAds}
            setEnableAds={setEnableAds}
            adPlacement={adPlacement}
            setAdPlacement={setAdPlacement}
            isSponsored={isSponsored}
            setIsSponsored={setIsSponsored}
          />
        )}

        {/* TAB 2: SLUG & PERMALINK */}
        {activeTab === 'slug' && (
          <SlugPanel
            isEn={isEn}
            t={t}
            isPageEditor={isPageEditor}
            title={title}
            handleTitleChange={handleTitleChange}
            handleGenerateSlug={handleGenerateSlug}
            slug={slug}
            setSlug={setSlug}
            handleCopyLink={handleCopyLink}
            copied={copied}
          />
        )}

        {/* TAB 3: TAKSONOMI (KATEGORI & TAG) */}
        {activeTab === 'taxonomy' && <TaxonomyPanel categoriesList={categoriesList} />}

        {/* TAB 4: MEDIA COVER */}
        {activeTab === 'media' && (
          <MediaPanel
            isEn={isEn}
            featuredImage={featuredImage}
            setFeaturedImage={setFeaturedImage}
          />
        )}

        {/* TAB 5: RINGKASAN (EXCERPT) */}
        {activeTab === 'excerpt' && (
          <ExcerptPanel
            isEn={isEn}
            excerpt={excerpt}
            setExcerpt={setExcerpt}
          />
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

