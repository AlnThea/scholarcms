import Link from 'next/link';
import { Feather, Heart, Database, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Feather className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">Scholar<span className="gradient-text">CMS</span></span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
              Platform Website Blog modern bergaya WordPress yang mengombinasikan keandalan Next.js App Router, React 18, dan Firebase Firestore Database.
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--text-subtle)] pt-2">
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-amber-500" /> Firebase Firestore</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Next.js App Router</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">Beranda Blog</Link></li>
              <li><Link href="/admin" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">Dashboard Admin</Link></li>
              <li><Link href="/admin/posts/new" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">Tulis Artikel Baru</Link></li>
              <li><Link href="/admin/categories" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">Kelola Kategori</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Teknologi & Stack</h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
              <li>React 18 & Next.js 14</li>
              <li>Firebase Firestore DB</li>
              <li>Tailwind CSS & Gutenberg Styles</li>
              <li>Glassmorphic Modern UI</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} ScholarCMS Engine. Didesain secara profesional.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> menggunakan Next.js & Firebase.
          </p>
        </div>
      </div>
    </footer>
  );
}
