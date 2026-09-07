'use client';

import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PostStatusStackedWidget({ recentPosts = [] }) {
  const { t, language } = useLanguage();

  const today = new Date();
  const months = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      m: d.toLocaleString(language === 'en' ? 'en-US' : 'id-ID', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      pub: 0,
      draft: 0,
      sched: 0
    });
  }

  recentPosts.forEach(p => {
    const d = new Date(p.createdAt?.seconds ? p.createdAt.seconds * 1000 : p.createdAt || Date.now());
    const y = d.getFullYear();
    const m = d.getMonth();
    const targetMonth = months.find(col => col.year === y && col.month === m);
    if (targetMonth) {
      if (p.status === 'published') targetMonth.pub++;
      else if (p.status === 'draft') targetMonth.draft++;
      else if (p.status === 'scheduled') targetMonth.sched++;
    }
  });

  const colData = months.map(col => {
    const total = col.pub + col.draft + col.sched;
    if (total === 0) return { ...col, pubPct: 0, draftPct: 0, schedPct: 0, total: 0 };
    return {
      ...col,
      pubPct: Math.round((col.pub / total) * 100),
      draftPct: Math.round((col.draft / total) * 100),
      schedPct: Math.round((col.sched / total) * 100),
      total
    };
  });

  const grandTotal = colData.reduce((acc, c) => acc + c.total, 0);
  const overallPub = grandTotal ? Math.round((colData.reduce((acc, c) => acc + c.pub, 0) / grandTotal) * 100) : 0;
  const overallDraft = grandTotal ? Math.round((colData.reduce((acc, c) => acc + c.draft, 0) / grandTotal) * 100) : 0;
  const overallSched = grandTotal ? Math.round((colData.reduce((acc, c) => acc + c.sched, 0) / grandTotal) * 100) : 0;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" /> {t('widgetHeaderPostStatus') || 'Status Artikel'}
          </h3>
          <span className="text-[10px] font-bold text-[var(--text-subtle)]">{t('widgetContentLast3Months') || '3 Bulan Terakhir'}</span>
        </div>

        <div className="pt-2 flex items-end justify-between gap-3 h-28 border-b border-[var(--border-color)] pb-2">
          {colData.map((col, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden h-24 bg-[var(--bg-primary)]">
                <div className="w-full bg-emerald-500 transition-all" style={{ height: `${col.pubPct}%` }} title={`${t('filterPublished') || 'Dipublikasikan'}: ${col.pub} (${col.pubPct}%)`} />
                <div className="w-full bg-blue-500 transition-all" style={{ height: `${col.draftPct}%` }} title={`${t('filterDraft') || 'Konsep'}: ${col.draft} (${col.draftPct}%)`} />
                <div className="w-full bg-amber-500 transition-all" style={{ height: `${col.schedPct}%` }} title={`${t('filterScheduled') || 'Terjadwal'}: ${col.sched} (${col.schedPct}%)`} />
              </div>
              <span className="text-[10px] font-bold text-[var(--text-subtle)]">{col.m}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)] font-bold">
        <span className="text-emerald-400">🟢 {t('filterPublished') || 'Publikasi'} ({overallPub}%)</span>
        <span className="text-blue-400">🔵 {t('filterDraft') || 'Konsep'} ({overallDraft}%)</span>
        <span className="text-amber-400">🟡 {t('filterScheduled') || 'Terjadwal'} ({overallSched}%)</span>
      </div>
    </div>
  );
}
