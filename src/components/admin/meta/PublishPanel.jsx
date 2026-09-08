'use client';

import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, Eye } from 'lucide-react';

export default function PublishPanel() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isEn = language === 'en';

  const {
    status,
    setStatus,
    publishedAt,
    setPublishedAt,
    views,
    readTime,
    setReadTime,
    author,
  } = useMetaSidebar();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Automatic Author Badge Card */}
      <div className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-blue-500/5 flex items-center gap-3">
        <img
          src={author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
          alt={author?.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30 shadow-sm shrink-0"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
        />
        <div className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold uppercase tracking-wider text-blue-500">{isEn ? 'Article Author:' : 'Pengarang Artikel (Author):'}</span>
          <span className="block font-extrabold text-xs text-[var(--text-main)] truncate">{author?.name || user?.name || (isEn ? 'ScholarCMS Author' : 'Penulis ScholarCMS')}</span>
          <span className="block text-[10px] text-[var(--text-subtle)] truncate">{author?.role || user?.titleRole || user?.role || 'Author'}</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          {isEn ? 'Publishing Status & Schedule' : 'Status & Jadwal Publikasi'}
        </h4>

        {/* Status */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{isEn ? 'Posting Status' : 'Status Posting'}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="published">{isEn ? '🟢 Instant Publish (Published)' : '🟢 Terbit Instan (Published)'}</option>
            <option value="scheduled">{isEn ? '⏰ Scheduled' : '⏰ Terjadwal (Scheduled)'}</option>
            <option value="draft">{isEn ? '🟡 Draft' : '🟡 Konsep (Draft)'}</option>
          </select>
        </div>

        {/* Published At Date-Time */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{isEn ? 'Publication / Release Date & Time' : 'Tanggal & Waktu Publikasi / Rilis'}</label>
          <input
            type="datetime-local"
            value={publishedAt || ''}
            onChange={(e) => {
              const val = e.target.value;
              setPublishedAt(val);
              if (val && new Date(val).getTime() > Date.now() && status !== 'draft') {
                setStatus('scheduled');
              } else if (val && new Date(val).getTime() <= Date.now() && status === 'scheduled') {
                setStatus('published');
              }
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors font-medium"
          />
        </div>

        {/* Scheduled Information Badge */}
        {(status === 'scheduled' || (publishedAt && new Date(publishedAt).getTime() > Date.now() && status !== 'draft')) && (
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              <span>{isEn ? 'Auto Scheduling (Just-In-Time)' : 'Penjadwalan Otomatis (Tanpa Cron)'}</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isEn ? 'This post will become publicly visible automatically when release time is reached.' : 'Artikel ini akan otomatis dapat diakses publik begitu waktu rilis tercapai (Just-In-Time evaluation).'}
            </p>
          </div>
        )}

        {/* Views Stats & Read Time */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <span className="block text-[9px] font-bold uppercase text-[var(--text-subtle)]">{isEn ? 'Total Readers' : 'Total Pembaca'}</span>
              <span className="font-extrabold text-xs text-[var(--text-main)]">{views || 0} views</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="w-full">
              <span className="block text-[9px] font-bold uppercase text-[var(--text-subtle)]">{isEn ? 'Read Time' : 'Durasi Baca'}</span>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
