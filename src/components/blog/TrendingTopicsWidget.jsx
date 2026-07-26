'use client';

import React from 'react';
import { Hash, FolderOpen } from 'lucide-react';

export function CategoryTopicsWidget({
  categories = [],
  posts = [],
  selectedCategory = 'All',
  onSelectCategory
}) {
  // Count articles per category
  const categoryCounts = categories.map((cat) => {
    const count = posts.filter((p) => p.category === cat.name).length;
    return { ...cat, count };
  });

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
      {/* Header Kartu Kategori */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">Topik Kategori Blog</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Eksplorasi artikel berdasarkan kategori favorit</p>
          </div>
        </div>
      </div>

      {/* List Kategori */}
      <div className="space-y-1.5 pt-1">
        {categoryCounts.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(isActive ? 'All' : cat.name)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-[var(--bg-primary)] text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-500 border border-[var(--border-color)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color || '#2563eb' }}
                />
                <span>{cat.name}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-surface)] text-[var(--text-subtle)]'
                }`}
              >
                {cat.count} Artikel
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
  onSelectTag
}) {
  // Extract real tags ONLY from published posts
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

  const sortedTags = Object.entries(allTagsMap)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
      {/* Header Kartu Tag Tren */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">Tag Tren Artikel</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Kata kunci asli dari artikel yang terbit</p>
          </div>
        </div>
      </div>

      {/* Tag Cloud Pills */}
      {sortedTags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {sortedTags.map(([tagName, count]) => (
            <button
              key={tagName}
              onClick={() => onSelectTag && onSelectTag(tagName)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-purple-500 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all flex items-center gap-1 group"
              title={`${count} artikel berkaitan`}
            >
              <span className="text-purple-500 group-hover:scale-110 transition-transform">#</span>
              <span>{tagName}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[var(--text-subtle)] pt-1">Belum ada tag artikel yang diterbitkan.</p>
      )}
    </div>
  );
}

export default function TrendingTopicsWidget({
  categories = [],
  posts = [],
  selectedCategory = 'All',
  onSelectCategory,
  onSelectTag
}) {
  return (
    <div className="space-y-8">
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
