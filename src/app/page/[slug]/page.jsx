'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { dbService } from '@/services/dbService';
import { Clock, Eye, ArrowLeft, Share2, Check, Layers } from 'lucide-react';
import Link from 'next/link';

export default function StaticPageDetail({ params }) {
  const { slug } = params;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPageData() {
      setLoading(true);
      const fetchedPage = await dbService.getPageBySlug(slug);
      if (fetchedPage) {
        setPage(fetchedPage);
      }
      setLoading(false);
    }
    loadPageData();
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 w-full animate-pulse space-y-6">
          <div className="h-6 w-32 bg-[var(--bg-surface)] rounded-full" />
          <div className="h-12 w-full bg-[var(--bg-surface)] rounded-2xl" />
          <div className="h-96 w-full bg-[var(--bg-surface)] rounded-3xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-4">Halaman Tidak Ditemukan</h1>
          <p className="text-[var(--text-muted)] mb-8">Maaf, halaman statis yang Anda cari mungkin telah dihapus atau URL-nya salah.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25">
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Schema.org WebPage Structured Data */}
      {page && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: page.seoTitle || page.title,
              description: page.seoDescription || page.excerpt,
              datePublished: page.publishedAt,
              dateModified: page.updatedAt || page.publishedAt,
              publisher: {
                '@type': 'Organization',
                name: 'ScholarCMS',
              },
            }),
          }}
        />
      )}

      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-blue-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Halaman Statis
            </span>
            <span className="text-xs text-[var(--text-subtle)] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-400" /> {page.views || 0} pembaca
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight mb-6 leading-tight">
            {page.title}
          </h1>

          {page.excerpt && (
            <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed font-normal">
              {page.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <img
                src={page.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={page.author?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--text-main)]">{page.author?.name}</h4>
                <p className="text-xs text-[var(--text-subtle)]">ScholarCMS Engine • {new Date(page.updatedAt || page.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-primary)] transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-blue-500" />}
              {copied ? 'Tautan Disalin!' : 'Bagikan Halaman'}
            </button>
          </div>
        </header>

        <article className="gutenberg-content mb-16 border-b border-[var(--border-color)] pb-12">
          {page.content ? (
            <div 
              className="prose dark:prose-invert max-w-none text-sm text-[var(--text-main)] leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: page.content }} 
            />
          ) : page.blocks && page.blocks.length > 0 ? (
            page.blocks.map((block, i) => {
              if (block.type === 'heading') {
                if (block.level === 1) return <h1 key={i}>{block.content}</h1>;
                if (block.level === 3) return <h3 key={i}>{block.content}</h3>;
                return <h2 key={i}>{block.content}</h2>;
              }
              if (block.type === 'quote') {
                return <blockquote key={i}>{block.content}</blockquote>;
              }
              if (block.type === 'code') {
                return (
                  <pre key={i}>
                    <code>{block.content}</code>
                  </pre>
                );
              }
              if (block.type === 'callout') {
                return (
                  <div key={i} className="callout-box font-medium text-[var(--text-main)]">
                    {block.content}
                  </div>
                );
              }
              return <p key={i}>{block.content}</p>;
            })
          ) : (
            <p>{page.excerpt}</p>
          )}
        </article>

      </main>

      <Footer />
    </div>
  );
}
