'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFeatured from '@/components/blog/HeroFeatured';
import PostCard from '@/components/blog/PostCard';
import TrendingTopicsWidget from '@/components/blog/TrendingTopicsWidget';
import { BookOpen, Search, Flame } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translateLabel } from '@/utils/menuTranslator';

export default function ModernGlassTheme({
  posts = [],
  categories = [],
  selectedCategory = 'All',
  onSelectCategory = () => {},
  searchQuery = '',
  onSearch = () => {},
  loading = false,
  customizations = {}
}) {
  const { t, language } = useLanguage();

  const filteredPosts = posts.filter(post => {
    const postCatArray = Array.isArray(post.categories) && post.categories.length > 0
      ? post.categories
      : (typeof post.category === 'string' && post.category
          ? post.category.split(',').map(s => s.trim()).filter(Boolean)
          : [post.category]);

    const matchesCategory = selectedCategory === 'All' || postCatArray.includes(selectedCategory) || post.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();

    let matchesSearch = true;
    if (query) {
      const inTitle = post.title?.toLowerCase().includes(query);
      const inExcerpt = post.excerpt?.toLowerCase().includes(query);
      const inCategory = post.category?.toLowerCase().includes(query);
      const inTags = Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(query));
      const inContent = post.content?.toLowerCase().includes(query);
      const inBlocks = Array.isArray(post.blocks) && post.blocks.some(b => b.content?.toLowerCase().includes(query));

      matchesSearch = inTitle || inExcerpt || inCategory || inTags || inContent || inBlocks;
    }

    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts[0];
  const gridPosts = searchQuery || selectedCategory !== 'All' ? filteredPosts : filteredPosts.slice(1);
  const popularPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors">
      <Navbar onSearch={onSearch} searchQuery={searchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
            }`}
          >
            {t('tabAll') || 'All'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
            >
              {translateLabel(cat.name, language)}
            </button>
          ))}
        </div>

        {/* Hero Featured Post */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <HeroFeatured post={featuredPost} />
        )}

        {/* Main Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                {searchQuery ? `${t('searchResultsFor')} "${searchQuery}"` : selectedCategory !== 'All' ? `${t('categoryArticles')} ${translateLabel(selectedCategory, language)}` : t('latestArticles')}
              </h2>
              <span className="text-xs text-[var(--text-subtle)] font-medium">
                {t('showingArticlesCount')} {gridPosts.length} {t('articlesSuffix')}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 4].map(i => (
                  <div key={i} className="h-80 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] animate-pulse" />
                ))}
              </div>
            ) : gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gridPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">{t('noArticlesFound')}</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-6">
                  {t('noArticlesFoundSub')}
                </p>
                <button
                  onClick={() => { onSearch(''); onSelectCategory('All'); }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 transition-all"
                >
                  {t('resetFilterBtn')}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Widgets */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
              <h3 className="text-base font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" /> {t('popularArticlesTitle')}
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post, idx) => (
                  <Link key={post.id} href={`/post/${post.slug}`} className="group flex gap-3 items-center">
                    <span className="text-2xl font-extrabold text-[var(--text-subtle)] group-hover:text-blue-500 w-6">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[var(--text-main)] group-hover:text-blue-500 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-[var(--text-subtle)] mt-1">{post.views || 0} {t('readersCount')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

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
