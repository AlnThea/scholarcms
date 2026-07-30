'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Hash, FolderOpen, Shuffle, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translateLabel } from '@/utils/menuTranslator';
import Link from 'next/link';

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function CategoryTopicsWidget({
  categories = [],
  posts = [],
  selectedCategory = 'All',
  onSelectCategory,
  limit = 10
}) {
  const { t, language } = useLanguage();

  // Count articles per category and filter out categories with 0 articles
  const activeCategories = useMemo(() => {
    const counts = categories
      .map((cat) => {
        const count = posts.filter((p) => {
          const pCats = Array.isArray(p.categories) && p.categories.length > 0
            ? p.categories
            : (typeof p.category === 'string' && p.category ? p.category.split(',').map(s => s.trim()) : [p.category]);
          return pCats.includes(cat.name) || p.category === cat.name;
        }).length;
        return { ...cat, count };
      })
      .filter((cat) => cat.count > 0);

    return shuffleArray(counts).slice(0, limit);
  }, [categories, posts, limit]);

  if (activeCategories.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
      {/* Header Kartu Kategori */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">{t('categoryTopicsTitle')}</h3>
            <p className="text-[11px] text-[var(--text-muted)]">{t('categoryTopicsSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* List Kategori dalam Tampilan Tag Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {activeCategories.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(isActive ? 'All' : cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-[var(--bg-primary)] text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 border border-[var(--border-color)]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color || '#2563eb' }}
              />
              <span>{translateLabel(cat.name, language)}</span>
              <span className={`text-[10px] opacity-80 ${isActive ? 'text-white' : 'text-[var(--text-subtle)]'}`}>
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TrendingTagsWidget({
  posts = [],
  onSelectTag,
  limit = 12
}) {
  const { t } = useLanguage();

  // Extract real tags ONLY from published posts with count > 0
  const activeTags = useMemo(() => {
    const allTagsMap = {};
    posts.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((tag) => {
          const cleanTag = tag.trim();
          if (cleanTag) {
            allTagsMap[cleanTag] = (allTagsMap[cleanTag] || 0) + 1;
          }
        });
      }
    });

    const entries = Object.entries(allTagsMap).filter(([_, count]) => count > 0);
    return shuffleArray(entries).slice(0, limit);
  }, [posts, limit]);

  if (activeTags.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
      {/* Header Kartu Tag Tren */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">{t('trendingTagsTitle')}</h3>
            <p className="text-[11px] text-[var(--text-muted)]">{t('trendingTagsSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Tag Cloud Pills Clean Style */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {activeTags.map(([tagName, count]) => (
          <button
            key={tagName}
            onClick={() => onSelectTag && onSelectTag(tagName)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-purple-500 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all flex items-center gap-1 group"
            title={`${count} ${t('articlesSuffix')}`}
          >
            <span className="text-purple-500 group-hover:scale-110 transition-transform">#</span>
            <span>{tagName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RandomArticlesWidget({
  posts = [],
  currentPostId = null,
  limit = 3
}) {
  const { t } = useLanguage();
  const [randomPosts, setRandomPosts] = useState([]);

  const generateRandomPosts = () => {
    const filtered = posts.filter(p => p.id !== currentPostId);
    setRandomPosts(shuffleArray(filtered).slice(0, limit));
  };

  useEffect(() => {
    generateRandomPosts();
  }, [posts, currentPostId, limit]);

  if (randomPosts.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
      {/* Header Kartu Artikel Acak */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">{t('randomArticlesTitle') || 'Artikel Acak'}</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Rekomendasi bacaan pilihan</p>
          </div>
        </div>
        <button
          onClick={generateRandomPosts}
          className="p-1.5 rounded-lg text-[var(--text-subtle)] hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
          title="Acak Ulang Artikel"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List Artikel Acak */}
      <div className="space-y-3 pt-1">
        {randomPosts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="group flex gap-3 items-center p-2 rounded-2xl hover:bg-[var(--bg-primary)] transition-all border border-transparent hover:border-[var(--border-color)]"
          >
            {post.featuredImage ? (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[var(--border-color)] group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-0.5">
                {post.category}
              </span>
              <h4 className="text-xs font-semibold text-[var(--text-main)] group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <p className="text-[10px] text-[var(--text-subtle)] mt-1">{post.readTime || '3 min read'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TrendingTopicsWidget({
  categories = [],
  posts = [],
  selectedCategory = 'All',
  onSelectCategory,
  onSelectTag,
  currentPostId = null
}) {
  return (
    <div className="space-y-8">
      <RandomArticlesWidget posts={posts} currentPostId={currentPostId} />
      <CategoryTopicsWidget
        categories={categories}
        posts={posts}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      <TrendingTagsWidget
        posts={posts}
        onSelectTag={onSelectTag}
      />
    </div>
  );
}
