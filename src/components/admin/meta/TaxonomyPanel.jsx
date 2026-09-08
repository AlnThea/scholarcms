'use client';

import { useState } from 'react';
import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { useLanguage } from '@/context/LanguageContext';
import { Folder, Tag } from 'lucide-react';

export default function TaxonomyPanel({ categoriesList = [] }) {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  
  const {
    category,
    setCategory,
    subCategory,
    setSubCategory,
    tags,
    setTags,
  } = useMetaSidebar();

  const [tagInput, setTagInput] = useState('');

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

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
          <Folder className="w-4 h-4 text-purple-500" />
          {isEn ? 'Taxonomy Categories & Tags' : 'Kategori & Tag Taksonomi'}
        </h4>

        {/* Category Input */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{isEn ? 'Main Category' : 'Kategori Utama'}</label>
          <input
            type="text"
            list="main-categories-list"
            placeholder={isEn ? "e.g. Technology, Lifestyle..." : "Misal: Teknologi, Gaya Hidup..."}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory(''); // Reset subcategory when main category changes
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors"
          />
          <datalist id="main-categories-list">
            {categoriesList.filter(c => !c.parentCategory).map(cat => (
              <option key={cat.id} value={cat.name} />
            ))}
          </datalist>
        </div>

        {/* Sub-Category Input Option */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{isEn ? 'Sub-Category' : 'Sub-Kategori'}</label>
          <input
            type="text"
            list="sub-categories-list"
            placeholder={isEn ? "e.g. Next.js, React, Tailwind..." : "Misal: Next.js, React, Tailwind..."}
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-purple-500 transition-colors"
          />
          <datalist id="sub-categories-list">
            {category 
              ? categoriesList.filter(c => c.parentCategory === category).map(sub => (
                  <option key={sub.id} value={sub.name} />
                ))
              : categoriesList.filter(c => c.parentCategory).map(sub => (
                  <option key={sub.id} value={sub.name} />
                ))
            }
          </datalist>
        </div>

        {/* Tags Input & Chips */}
        <div className="pt-2 border-t border-[var(--border-color)]/50">
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1.5">{isEn ? 'Article Tags (Chips)' : 'Tag Artikel (Chips)'}</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder={isEn ? "Add tag (Press Enter)..." : "Tambah tag (Tekan Enter)..."}
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
              {isEn ? 'Add' : 'Tambah'}
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
              <span className="text-[10px] text-[var(--text-subtle)] italic">{isEn ? 'No tags added yet' : 'Belum ada tag ditambahkan'}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
