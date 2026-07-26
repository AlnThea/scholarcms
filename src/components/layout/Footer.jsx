'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Feather, Heart, Database, ShieldCheck } from 'lucide-react';
import { dbService } from '@/services/dbService';

export default function Footer() {
  const [siteTitle, setSiteTitle] = useState('ScholarCMS');
  const [footerLinks, setFooterLinks] = useState([]);

  useEffect(() => {
    async function loadFooterData() {
      try {
        const [items, genSettings] = await Promise.all([
          dbService.getMenu('footer'),
          dbService.getGeneralSettings()
        ]);
        if (Array.isArray(items) && items.length > 0) {
          setFooterLinks(items);
        }
        if (genSettings && genSettings.siteTitle) {
          setSiteTitle(genSettings.siteTitle);
        }
      } catch (err) {
        console.error('Footer data loading error:', err);
      }
    }
    loadFooterData();
  }, []);

  const renderBrandTitle = (title) => {
    if (!title) return 'ScholarCMS';
    if (title.toLowerCase().endsWith('cms')) {
      const mainPart = title.slice(0, -3);
      return <>{mainPart}<span className="gradient-text">CMS</span></>;
    }
    return title;
  };

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Feather className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">{renderBrandTitle(siteTitle)}</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
              Platform Website Blog Modern & Portal Publikasi Edukasi Berkecepatan Tinggi dengan Pengalaman Membaca Terbaik.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.length > 0 ? (
                footerLinks.map((link) => {
                  const href = link.type === 'category'
                    ? `/?category=${encodeURIComponent(link.target)}`
                    : link.type === 'page'
                    ? `/page/${link.target}`
                    : link.url || '/';

                  return (
                    <li key={link.id}>
                      <Link href={href} className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <>
                  <li><Link href="/" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">Beranda Blog</Link></li>
                  <li><Link href="/dashboard" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">Dashboard</Link></li>
                  <li><Link href="/dashboard/posts/new" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">Tulis Artikel Baru</Link></li>
                  <li><Link href="/dashboard/categories" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">Kelola Kategori</Link></li>
                </>
              )}
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} ScholarCMS Engine. Didesain secara profesional.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk memberikan pengalaman membaca blog terbaik.
          </p>
        </div>
      </div>
    </footer>
  );
}
