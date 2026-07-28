'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Sparkles, BookOpen, Clock, Tag } from 'lucide-react';

export default function MinimalistTechTheme({
  posts = [],
  categories = [],
  selectedCategory = 'All',
  onSelectCategory = () => {},
  searchQuery = '',
  onSearch = () => {},
  loading = false,
  customizations = {}
}) {
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
      matchesSearch = inTitle || inExcerpt || inCategory || inTags;
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090a0f] text-slate-800 dark:text-slate-200 font-sans transition-colors">
      <Navbar onSearch={onSearch} searchQuery={searchQuery} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        
        {/* Minimalist Hero Header */}
        <div className="text-center space-y-3 mb-12 border-b border-slate-100 dark:border-slate-800 pb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" /> Minimalist Publishing Engine
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pemikiran, Ide, & Tulisan Mendalam.
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Ruang baca yang tenang, bersih, dan berfokus pada kualitas konten teknis serta artikel bermakna.
          </p>
        </div>

        {/* Minimalist Categories Filter */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.name
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Minimalist Article Feed (Medium-Style Clean List) */}
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredPosts.map((post) => (
              <article key={post.id} className="py-8 first:pt-0 group grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-8 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{post.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <Link href={`/post/${post.slug}`}>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={post.author?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {post.author?.name || 'Ernst Senior Dev'}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-4 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Tidak ada tulisan ditemukan.</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
