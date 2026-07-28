'use client';

import ModernTheme from './modern';
import EditorialNewsTheme from './editorial';
import MinimalistTechTheme from './minimalist';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/blog/PostCard';
import HeroFeatured from '@/components/blog/HeroFeatured';
import TrendingTopicsWidget from '@/components/blog/TrendingTopicsWidget';
import Link from 'next/link';

// BUILT-IN THEMES REGISTRY
export const THEMES_REGISTRY = [
  {
    id: 'modern',
    name: 'Modern Glassmorphism',
    description: 'Tema default ScholarCMS dengan tampilan bersih, efek kaca translucent, hero featured banner, dan widget sidebar modern.',
    author: 'ScholarCMS Team',
    version: '1.2.0',
    category: 'Blog & Corporate',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    component: ModernTheme,
    defaultCustomizations: {
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      fontFamily: 'Inter',
      cardStyle: 'glassmorphism',
      heroStyle: 'featured'
    }
  },
  {
    id: 'editorial',
    name: 'Editorial News & Gazette',
    description: 'Tema portal berita & koran klasik lengkap dengan Running Ticker / Breaking News, Headline Grid, dan seksi berita per kategori.',
    author: 'ScholarCMS Team',
    version: '2.0.0',
    category: 'News & Portal Berita',
    previewImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    component: EditorialNewsTheme,
    defaultCustomizations: {
      primaryColor: '#be123c',
      accentColor: '#e11d48',
      fontFamily: 'Serif',
      cardStyle: 'classic',
      heroStyle: 'headline'
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist Tech & Essay',
    description: 'Layout ringkas Medium-style berfokus pada kualitas teks, kecepatan baca tanpa gangguan, dan tipografi yang nyaman.',
    author: 'ScholarCMS Team',
    version: '1.1.0',
    category: 'Tech & Personal Blog',
    previewImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    component: MinimalistTechTheme,
    defaultCustomizations: {
      primaryColor: '#059669',
      accentColor: '#10b981',
      fontFamily: 'Outfit',
      cardStyle: 'flat',
      heroStyle: 'minimal'
    }
  }
];

// UNIVERSAL DYNAMIC THEME ENGINE (Jalut 2: Untuk Tema Kustom Baru yang Diupload di Vercel tanpa Folder Fisik)
function UniversalDynamicTheme({
  posts = [],
  categories = [],
  selectedCategory = 'All',
  onSelectCategory = () => {},
  searchQuery = '',
  onSearch = () => {},
  loading = false,
  customizations = {},
  themePackage = {}
}) {
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();

    let matchesSearch = true;
    if (query) {
      const inTitle = post.title?.toLowerCase().includes(query);
      const inExcerpt = post.excerpt?.toLowerCase().includes(query);
      matchesSearch = inTitle || inExcerpt;
    }

    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts[0];
  const gridPosts = searchQuery || selectedCategory !== 'All' ? filteredPosts : filteredPosts.slice(1);
  const primaryColor = customizations.primaryColor || themePackage?.customizations?.primaryColor || '#6366f1';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Inject Custom CSS from uploaded theme package if present */}
      {customizations.customCss && (
        <style dangerouslySetInnerHTML={{ __html: customizations.customCss }} />
      )}

      <Navbar onSearch={onSearch} searchQuery={searchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Header Banner */}
        <div className="p-8 rounded-3xl mb-8 border border-[var(--border-color)] bg-[var(--bg-surface)] text-center relative overflow-hidden">
          <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full text-white bg-indigo-600 mb-3 inline-block">
            {themePackage.name || 'Custom Theme Package'}
          </span>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">
            {themePackage.description || 'Tema Kustom Dinamis ScholarCMS'}
          </h1>
          <p className="text-xs text-[var(--text-muted)]">Diaktifkan via Dynamic Theme Engine • 100% Secure & Vercel Ready</p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]'
            }`}
          >
            Semua Topik
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Feed & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {featuredPost && !searchQuery && selectedCategory === 'All' && (
              <div className="mb-8">
                <HeroFeatured post={featuredPost} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gridPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 space-y-8">
            <TrendingTopicsWidget
              categories={categories}
              posts={posts}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              onSelectTag={(tag) => onSearch(tag)}
            />
          </aside>
        </div>

      </main>

      <Footer />
    </div>
  );
}

// UNIFIED THEME RESOLVER
export function getThemeComponent(themeId, customPackages = []) {
  const foundBuiltin = THEMES_REGISTRY.find(t => t.id === themeId);
  if (foundBuiltin) {
    return foundBuiltin.component;
  }

  // Check if it's an uploaded custom theme package
  const foundCustom = customPackages.find(p => p.id === themeId);
  if (foundCustom) {
    return function DynamicCustomThemeWrapper(props) {
      return <UniversalDynamicTheme {...props} themePackage={foundCustom} />;
    };
  }

  // Fallback default to ModernTheme
  return ModernTheme;
}
