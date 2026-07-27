'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { Search, CheckCircle, AlertTriangle, XCircle, FileText, ExternalLink, RefreshCw, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function SeoAnalyzerPluginPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const loadedPosts = await dbService.getPosts({ status: 'all' });
    setPosts(loadedPosts);
    if (loadedPosts.length > 0) {
      setSelectedPost(loadedPosts[0]);
    }
    setLoading(false);
  }

  function calculateSeoScore(post) {
    if (!post) return { score: 0, items: [] };

    let score = 0;
    const items = [];

    // Title Length Check (30-60 chars)
    const titleLen = post.title ? post.title.length : 0;
    if (titleLen >= 30 && titleLen <= 70) {
      score += 25;
      items.push({ type: 'pass', text: `Panjang Judul Artikel Baik (${titleLen} karakter)` });
    } else {
      score += 10;
      items.push({ type: 'warn', text: `Judul Artikel Kurang Ideal (${titleLen} karakter, idealnya 30-70)` });
    }

    // Excerpt / Meta Description Check
    const excerptLen = post.excerpt ? post.excerpt.length : 0;
    if (excerptLen >= 50 && excerptLen <= 160) {
      score += 25;
      items.push({ type: 'pass', text: `Meta Description / Excerpt Sempurna (${excerptLen} karakter)` });
    } else {
      score += 10;
      items.push({ type: 'warn', text: `Meta Description disarankan 50-160 karakter (${excerptLen} karakter saat ini)` });
    }

    // Featured Image Check
    if (post.featuredImage) {
      score += 25;
      items.push({ type: 'pass', text: 'Gambar Sampul Utama (Featured Image) Terpasang' });
    } else {
      items.push({ type: 'fail', text: 'Gambar Sampul Utama belum terpasang' });
    }

    // Tags & Keywords Check
    if (Array.isArray(post.tags) && post.tags.length > 0) {
      score += 25;
      items.push({ type: 'pass', text: `Tag SEO Terpasang (${post.tags.length} tag: ${post.tags.join(', ')})` });
    } else {
      items.push({ type: 'fail', text: 'Belum ada Tag SEO terpasang pada artikel ini' });
    }

    return { score, items };
  }

  const analysis = selectedPost ? calculateSeoScore(selectedPost) : { score: 0, items: [] };

  return (
    <div className="space-y-8">
      {/* Plugin Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 mb-2 inline-block">
            Plugin Active • ScholarCMS SEO Suite
          </span>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Search className="w-6 h-6" /> Audit SEO Artikel Real-time
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl mt-1">
            Analisis skor SEO, ketersediaan kata kunci, keterbacaan, dan kesehatan tag meta di seluruh artikel Anda.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Scan Ulang SEO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Post Selector Table */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500" /> Pilih Artikel ({posts.length})
          </h2>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {posts.map((post) => {
              const res = calculateSeoScore(post);
              const isSelected = selectedPost?.id === post.id;
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-emerald-500/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-[var(--text-main)] truncate">{post.title}</h3>
                    <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">{post.category}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                    res.score >= 80 ? 'bg-emerald-500/20 text-emerald-500' : res.score >= 50 ? 'bg-amber-500/20 text-amber-500' : 'bg-rose-500/20 text-rose-500'
                  }`}>
                    {res.score}/100
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed SEO Audit Dashboard */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
          {selectedPost ? (
            <>
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Hasil Audit SEO</span>
                  <h2 className="text-lg font-bold text-[var(--text-main)] line-clamp-1">{selectedPost.title}</h2>
                </div>
                <Link
                  href={`/dashboard/posts/edit/${selectedPost.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5"
                >
                  Edit Artikel <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Score Meter */}
              <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center gap-6">
                <div className={`w-24 h-24 rounded-full border-8 flex flex-col items-center justify-center font-black ${
                  analysis.score >= 80 ? 'border-emerald-500 text-emerald-500' : analysis.score >= 50 ? 'border-amber-500 text-amber-500' : 'border-rose-500 text-rose-500'
                }`}>
                  <span className="text-2xl">{analysis.score}</span>
                  <span className="text-[9px] uppercase font-bold text-[var(--text-subtle)]">Skor SEO</span>
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    {analysis.score >= 80 ? 'Kondisi SEO Sangat Baik! 🚀' : analysis.score >= 50 ? 'Kondisi SEO Cukup Baik ⚠️' : 'Perlu Perbaikan SEO ❌'}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Artikel ini memenuhi {analysis.items.filter(i => i.type === 'pass').length} dari {analysis.items.length} standar kriteria SEO Google.
                  </p>
                </div>
              </div>

              {/* Checklist Detail */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">Daftar Pemeriksaan SEO Detail</h3>
                {analysis.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-start gap-3 text-xs">
                    {item.type === 'pass' && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    {item.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    {item.type === 'fail' && <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                    <span className="text-[var(--text-main)] font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-[var(--text-muted)]">Pilih artikel untuk melihat hasil audit SEO.</div>
          )}
        </div>

      </div>
    </div>
  );
}
