'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Newspaper, Flame, Zap, TrendingUp, Clock, Eye } from 'lucide-react';

export default function EditorialNewsTheme({
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

  const latestPosts = posts.slice(0, 5);
  const headlinePost = filteredPosts[0] || posts[0];
  const secondaryHeadlines = filteredPosts.slice(1, 4);
  const newsList = filteredPosts.slice(4);
  const popularPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#121417] text-[#1c1d21] dark:text-[#e4e6eb] font-serif transition-colors">
      <Navbar onSearch={onSearch} searchQuery={searchQuery} />

      {/* Editorial Top Breaking News Ticker */}
      <div className="bg-[#1e293b] text-white py-2.5 px-4 text-xs font-sans border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-full shrink-0">
            <Zap className="w-3.5 h-3.5" /> Breaking News
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="inline-flex gap-8 animate-marquee">
              {latestPosts.map((p) => (
                <Link key={p.id} href={`/post/${p.slug}`} className="hover:underline text-slate-200 hover:text-white">
                  • {p.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Newspaper Header Title Bar */}
        <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4 mb-6 text-center">
          <div className="flex items-center justify-between text-xs font-sans text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span>Edisi Digital Portal Berita</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span>ScholarCMS Editorial</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-slate-900 dark:text-white uppercase my-2">
            SCHOLAR NEWS GAZETTE
          </h1>
          <p className="text-xs italic text-slate-500 font-serif">"Informasi Terpercaya, Lugas, dan Mendalam"</p>
        </div>

        {/* Categories Bar (Editorial Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-300 dark:border-slate-800 font-sans text-xs uppercase font-bold tracking-wider no-scrollbar scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedCategory === 'All'
                ? 'bg-rose-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Semua Berita
          </button>
          {categories.filter(cat => posts.some(p => {
            const pCats = Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : (typeof p.category === 'string' && p.category ? p.category.split(',').map(s => s.trim()) : [p.category]);
            return pCats.includes(cat.name) || p.category === cat.name;
          })).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                selectedCategory === cat.name
                  ? 'bg-rose-700 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* HEADLINE SECTION (Portal Berita Grid) */}
        {!searchQuery && selectedCategory === 'All' && headlinePost && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 border-b border-slate-300 dark:border-slate-800 pb-10">
            {/* Main Headline Large Article */}
            <div className="lg:col-span-8 group">
              <Link href={`/post/${headlinePost.slug}`} className="block space-y-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-200">
                  <img
                    src={headlinePost.featuredImage}
                    alt={headlinePost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-rose-700 text-white text-xs font-sans font-bold px-3 py-1 uppercase tracking-widest rounded shadow">
                    UTAMA
                  </span>
                </div>
                <div>
                  <span className="text-xs font-sans font-bold text-rose-700 uppercase tracking-widest">
                    {headlinePost.category}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white group-hover:text-rose-700 transition-colors leading-tight mt-1">
                    {headlinePost.title}
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {headlinePost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-sans text-slate-400 mt-3">
                    <span>Oleh {headlinePost.author?.name || 'Redaksi'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {headlinePost.readTime}</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Secondary Headlines Column */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-300 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
              <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-300 dark:border-slate-800 pb-2">
                <TrendingUp className="w-4 h-4 text-rose-700" /> BERITA UTAMA LAINNYA
              </h3>
              {secondaryHeadlines.map((p) => (
                <Link key={p.id} href={`/post/${p.slug}`} className="group block space-y-1">
                  <span className="text-[10px] font-sans font-bold text-rose-700 uppercase tracking-widest">
                    {p.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-700 transition-colors line-clamp-2 leading-snug">
                    {p.title}
                  </h4>
                  <p className="text-xs font-sans text-slate-400 flex items-center gap-2 mt-1">
                    <Eye className="w-3 h-3" /> {p.views || 0} pembaca
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* MAIN NEWS FEED & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* News Feed List */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="text-sm font-sans font-extrabold uppercase tracking-widest text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-rose-700" />
              {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : selectedCategory !== 'All' ? `Kategori: ${selectedCategory}` : 'Laporan Berita Terbaru'}
            </h3>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : (newsList.length > 0 || (searchQuery || selectedCategory !== 'All')) ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {(searchQuery || selectedCategory !== 'All' ? filteredPosts : newsList).map((p) => (
                  <article key={p.id} className="py-6 first:pt-0 group grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div className="sm:col-span-4 aspect-[4/3] overflow-hidden rounded bg-slate-200">
                      <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="sm:col-span-8 space-y-2">
                      <span className="text-xs font-sans font-bold text-rose-700 uppercase tracking-widest">
                        {p.category}
                      </span>
                      <Link href={`/post/${p.slug}`}>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-700 transition-colors leading-snug">
                          {p.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {p.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-sans text-slate-400 pt-1">
                        <span>{p.author?.name || 'Redaksi'}</span>
                        <span>•</span>
                        <span>{p.readTime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-slate-300 dark:border-slate-800 rounded">
                <p className="text-sm font-sans text-slate-500">Tidak ada artikel berita ditemukan.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8 font-sans">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-slate-800">
                <Flame className="w-4 h-4 text-amber-500" /> TERPOPULER MINGGU INI
              </h4>
              <div className="space-y-4">
                {popularPosts.map((p, idx) => (
                  <Link key={p.id} href={`/post/${p.slug}`} className="group flex items-start gap-3">
                    <span className="text-xl font-black text-rose-700 w-5 text-right font-serif">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-700 transition-colors line-clamp-2">
                        {p.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{p.views || 0} pembaca</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>

      </main>

      <Footer />
    </div>
  );
}
