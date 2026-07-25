'use client';

import { createContext, useContext, useState } from 'react';

const MetaSidebarContext = createContext();

const DEFAULT_AUTHOR = {
  name: 'Ernst Senior Dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'CMS Administrator',
};

export function MetaSidebarProvider({ children }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState('published');
  const [readTime, setReadTime] = useState('5 min read');
  const [publishedAt, setPublishedAt] = useState('');
  const [views, setViews] = useState(0);
  const [author, setAuthor] = useState(DEFAULT_AUTHOR);

  // SEO Pro States
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [noIndex, setNoIndex] = useState(false);

  // Google AdSense & Monetization States
  const [enableAds, setEnableAds] = useState(true);
  const [adPlacement, setAdPlacement] = useState('all');
  const [adClient, setAdClient] = useState('ca-pub-9999999999999999');
  const [adSlot, setAdSlot] = useState('1234567890');
  const [isSponsored, setIsSponsored] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editorViewMode, setEditorViewMode] = useState('editor'); // 'editor' | 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [saveAction, setSaveAction] = useState(null);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  const registerSaveAction = (fn) => {
    setSaveAction(() => fn);
  };

  const triggerSave = (shouldExit = true) => {
    if (saveAction) {
      saveAction(shouldExit);
    }
  };

  const resetMeta = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCategory('Web Development');
    setTags('');
    setFeaturedImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
    setStatus('published');
    setReadTime('5 min read');
    setPublishedAt(new Date().toISOString().slice(0, 16));
    setViews(0);
    setAuthor(DEFAULT_AUTHOR);
    setEditorViewMode('editor');

    // Reset SEO & AdSense
    setSeoTitle('');
    setSeoDescription('');
    setFocusKeyword('');
    setCanonicalUrl('');
    setNoIndex(false);
    setEnableAds(true);
    setAdPlacement('all');
    setAdClient('ca-pub-9999999999999999');
    setAdSlot('1234567890');
    setIsSponsored(false);
  };

  const loadPostMeta = (post) => {
    if (!post) return;
    setTitle(post.title || '');
    setSlug(post.slug || '');
    setExcerpt(post.excerpt || '');
    setCategory(post.category || 'Web Development');
    setTags(Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''));
    setFeaturedImage(post.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
    setStatus(post.status || 'published');
    setReadTime(post.readTime || '5 min read');
    setPublishedAt(post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
    setViews(post.views || 0);
    setAuthor(post.author || DEFAULT_AUTHOR);

    // Load SEO & AdSense
    setSeoTitle(post.seoTitle || post.title || '');
    setSeoDescription(post.seoDescription || post.excerpt || '');
    setFocusKeyword(post.focusKeyword || '');
    setCanonicalUrl(post.canonicalUrl || '');
    setNoIndex(post.noIndex || false);
    setEnableAds(post.enableAds !== undefined ? post.enableAds : true);
    setAdPlacement(post.adPlacement || 'all');
    setAdClient(post.adClient || 'ca-pub-9999999999999999');
    setAdSlot(post.adSlot || '1234567890');
    setIsSponsored(post.isSponsored || false);
  };

  return (
    <MetaSidebarContext.Provider
      value={{
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
        setViews,
        author,
        setAuthor,

        // SEO Pro
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

        // AdSense & Monetization
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

        isOpen,
        openSidebar,
        closeSidebar,
        resetMeta,
        loadPostMeta,
        editorViewMode,
        setEditorViewMode,
        isSaving,
        setIsSaving,
        registerSaveAction,
        triggerSave,
      }}
    >
      {children}
    </MetaSidebarContext.Provider>
  );
}

export const useMetaSidebar = () => useContext(MetaSidebarContext);

