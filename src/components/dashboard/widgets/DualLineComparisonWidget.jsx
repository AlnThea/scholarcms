'use client';

import { GitBranch } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DualLineComparisonWidget({ analyticsSeries = [], recentPosts = [] }) {
  const { t } = useLanguage();

  const trendData = [...analyticsSeries].slice(-7);
  const maxViews = Math.max(...trendData.map(d => d.views || 0), 1);
  
  const articlesPerDay = trendData.map(day => {
    return recentPosts.filter(p => {
      if (p.status !== 'published') return false;
      const dateToUse = p.publishedAt || p.createdAt;
      if (!dateToUse) return false;
      const postDate = new Date(dateToUse.seconds ? dateToUse.seconds * 1000 : dateToUse).toISOString().split('T')[0];
      return postDate === day.date;
    }).length;
  });
  
  const maxArticles = Math.max(...articlesPerDay, 1);
  
  const getPath = (data, max) => {
    if (data.length === 0) return '';
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * 300;
      const y = 80 - ((val / max) * 70) - 5; 
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const pathViews = getPath(trendData.map(d => d.views || 0), maxViews);
  const pathArticles = getPath(articlesPerDay, maxArticles);

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-500" /> {t('widgetHeaderArticleComparison') || 'Korelasi Pembaca & Artikel'}
          </h3>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"/> {t('widgetContentReaders') || 'Pembaca'}</span>
            <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"/> {t('widgetContentArticles') || 'Artikel'}</span>
          </div>
        </div>

        <div className="relative h-28 w-full pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
            <path d={pathViews} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathArticles} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">{t('widgetContentComparisonDesc') || 'Perbandingan grafik 7 hari terakhir.'}</p>
    </div>
  );
}
