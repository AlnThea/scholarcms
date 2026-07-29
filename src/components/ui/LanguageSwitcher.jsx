'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ variant = 'button' }) {
  const { language, toggleLanguage, mounted } = useLanguage();

  if (!mounted) {
    return (
      <div className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5" />
        <span>EN</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-blue-500/50 hover:bg-[var(--bg-surface)] transition-all text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
      title={language === 'en' ? "Switch language to Bahasa Indonesia" : "Switch language to English"}
    >
      <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
      <span>{language === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
    </button>
  );
}
