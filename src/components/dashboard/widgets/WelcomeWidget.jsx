'use client';

import Link from 'next/link';
import { Sparkles, PlusCircle, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WelcomeWidget() {
  const { t } = useLanguage();
  return (
    <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden flex flex-col justify-between gap-6 h-full group hover:shadow-2xl transition-all border border-white/20">
      {/* Background Glow Accent Overlay */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
      
      <div className="relative z-10 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white border border-white/30 backdrop-blur-md inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> ScholarCMS Engine v2.0 • Executive Suite
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
          {t('welcomeTitle')}
        </h2>
        <p className="text-xs text-blue-100 max-w-2xl leading-relaxed font-medium">
          {t('welcomeDesc')}
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0 pt-2 border-t border-white/20">
        <Link
          href="/dashboard/posts/new"
          className="px-5 py-2.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-900 font-black text-xs transition-all shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" /> {t('navAddNewPost')}
        </Link>
        <Link
          href="/dashboard/settings"
          className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-xs transition-all backdrop-blur-md flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
        >
          <Settings className="w-4 h-4 text-amber-300" /> {t('navGlobalSettings')}
        </Link>
      </div>
    </div>
  );
}
