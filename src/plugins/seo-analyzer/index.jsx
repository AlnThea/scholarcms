'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import {
  Search, CheckCircle, AlertTriangle, XCircle, FileText, ExternalLink, RefreshCw, BarChart2,
  PieChart, Calendar, Award, ShieldCheck, CheckSquare, Layers, Clock
} from 'lucide-react';
import Link from 'next/link';

export default function SeoAnalyzerPluginPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [statusFilter, setStatusFilter] = useState('published'); // 'published' (default), 'scheduled', 'draft', 'all'

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const loadedPosts = await dbService.getPosts({ status: 'all' });
    setPosts(loadedPosts || []);
    
    // Default select first published post or first available post
    const published = (loadedPosts || []).filter(p => p.status === 'published');
    if (published.length > 0) {
      setSelectedPost(published[0]);
    } else if (loadedPosts && loadedPosts.length > 0) {
      setSelectedPost(loadedPosts[0]);
    }
    setLoading(false);
  }

  function calculateSeoScore(post) {
    if (!post) return { score: 0, items: [] };

    let score = 0;
    const items = [];

    // Title Length Check (30-70 chars)
    const titleLen = post.title ? post.title.length : 0;
    if (titleLen >= 30 && titleLen <= 70) {
      score += 25;
      items.push({ type: 'pass', text: `Panjang Judul Artikel Sangat Baik (${titleLen} karakter)` });
    } else {
      score += 10;
      items.push({ type: 'warn', text: `Judul Artikel Kurang Ideal (${titleLen} karakter, disarankan 30–70)` });
    }

    // Excerpt / Meta Description Check (50-160 chars)
    const excerptLen = post.excerpt ? post.excerpt.length : 0;
    if (excerptLen >= 50 && excerptLen <= 160) {
      score += 25;
      items.push({ type: 'pass', text: `Meta Description / Excerpt Sempurna (${excerptLen} karakter)` });
    } else {
      score += 10;
      items.push({ type: 'warn', text: `Meta Description disarankan 50–160 karakter (${excerptLen} karakter saat ini)` });
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

  // Calculate Overall Analytics
  const nowIso = new Date().toISOString();

  const isPostScheduled = (p) => {
    if (p.status === 'draft') return false;
    if (p.status === 'scheduled') return true;
    return Boolean(p.publishedAt && p.publishedAt > nowIso);
  };

  const isPostPublished = (p) => {
    if (p.status === 'draft') return false;
    if (isPostScheduled(p)) return false;
    return p.status === 'published' || !p.publishedAt || p.publishedAt <= nowIso;
  };

  const publishedPosts = posts.filter(isPostPublished);
  const scheduledPosts = posts.filter(isPostScheduled);
  const draftPosts = posts.filter(p => p.status === 'draft');

  const filteredPosts = posts.filter(p => {
    if (statusFilter === 'published') return isPostPublished(p);
    if (statusFilter === 'scheduled') return isPostScheduled(p);
    if (statusFilter === 'draft') return p.status === 'draft';
    return true; // 'all'
  });

  // Calculate Average SEO Score
  const scores = posts.map(p => calculateSeoScore(p).score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Breakdown counts
  const highSeoCount = posts.filter(p => calculateSeoScore(p).score >= 80).length;
  const midSeoCount = posts.filter(p => {
    const s = calculateSeoScore(p).score;
    return s >= 50 && s < 80;
  }).length;
  const lowSeoCount = posts.filter(p => calculateSeoScore(p).score < 50).length;

  const totalPosts = posts.length || 1;
  const highPct = Math.round((highSeoCount / totalPosts) * 100);
  const midPct = Math.round((midSeoCount / totalPosts) * 100);
  const lowPct = Math.round((lowSeoCount / totalPosts) * 100);

  // Criteria Health percentages
  const titlePassPct = Math.round((posts.filter(p => (p.title?.length || 0) >= 30 && (p.title?.length || 0) <= 70).length / totalPosts) * 100);
  const excerptPassPct = Math.round((posts.filter(p => (p.excerpt?.length || 0) >= 50 && (p.excerpt?.length || 0) <= 160).length / totalPosts) * 100);
  const imagePassPct = Math.round((posts.filter(p => Boolean(p.featuredImage)).length / totalPosts) * 100);
  const tagsPassPct = Math.round((posts.filter(p => Array.isArray(p.tags) && p.tags.length > 0).length / totalPosts) * 100);

  const analysis = selectedPost ? calculateSeoScore(selectedPost) : { score: 0, items: [] };

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-2 inline-block">
            Plugin Active • ScholarCMS SEO Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3 tracking-tight">
            <Search className="w-7 h-7 text-emerald-200" /> Audit SEO Artikel Real-time
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1 leading-relaxed">
            Pantau kesehatan SEO artikel terpublikasi maupun terjadwal secara real-time dengan audit kata kunci, meta tag, dan visualisasi grafik performa.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Scan Ulang SEO
        </button>
      </div>

      {/* DASHBOARD CHARTS & ANALYTICS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1: Average SEO Score */}
        <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
            avgScore >= 80 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
            avgScore >= 50 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
            'bg-rose-500/10 text-rose-500 border border-rose-500/20'
          }`}>
            {avgScore}
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">Rata-Rata Skor SEO</p>
            <h3 className="text-lg font-black text-[var(--text-main)] mt-0.5">
              {avgScore >= 80 ? 'Sangat Optimal 🚀' : avgScore >= 50 ? 'Cukup Optimal ⚠️' : 'Perlu Perbaikan ❌'}
            </h3>
            <p className="text-[10px] text-[var(--text-muted)]">Audit dari total {posts.length} artikel</p>
          </div>
        </div>

        {/* Metric Card 2: Diterbitkan / Published */}
        <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">Artikel Diterbitkan</p>
            <h3 className="text-xl font-black text-[var(--text-main)] mt-0.5">{publishedPosts.length} <span className="text-xs font-normal text-[var(--text-muted)]">Artikel</span></h3>
            <p className="text-[10px] text-emerald-500 font-bold">Status Live & Terindeks</p>
          </div>
        </div>

        {/* Metric Card 3: Terjadwal / Scheduled */}
        <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">Artikel Terjadwal</p>
            <h3 className="text-xl font-black text-[var(--text-main)] mt-0.5">{scheduledPosts.length} <span className="text-xs font-normal text-[var(--text-muted)]">Artikel</span></h3>
            <p className="text-[10px] text-purple-500 font-bold">Siap Rilis Otomatis</p>
          </div>
        </div>

        {/* Metric Card 4: SEO 100/100 Sempurna */}
        <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">Skor SEO Sempurna</p>
            <h3 className="text-xl font-black text-[var(--text-main)] mt-0.5">{highSeoCount} <span className="text-xs font-normal text-[var(--text-muted)]">Artikel</span></h3>
            <p className="text-[10px] text-amber-500 font-bold">Lulus SEO 100/100</p>
          </div>
        </div>
      </div>

      {/* VISUAL CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visual Chart 1: Distribusi Skor SEO (Bar Chart) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-500" /> Grafik Distribusi Kualitas SEO Artikel
            </h2>
            <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)]">Skor SEO</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Bar 1: Excellent (80-100) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Sangat Optimal (80–100)
                </span>
                <span className="text-[var(--text-main)]">{highSeoCount} artikel ({highPct}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--bg-primary)] overflow-hidden p-0.5 border border-[var(--border-color)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{ width: `${highPct}%` }}
                ></div>
              </div>
            </div>

            {/* Bar 2: Medium (50-79) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  Cukup Optimal (50–79)
                </span>
                <span className="text-[var(--text-main)]">{midSeoCount} artikel ({midPct}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--bg-primary)] overflow-hidden p-0.5 border border-[var(--border-color)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                  style={{ width: `${midPct}%` }}
                ></div>
              </div>
            </div>

            {/* Bar 3: Low (<50) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  Perlu Perbaikan (&lt;50)
                </span>
                <span className="text-[var(--text-main)]">{lowSeoCount} artikel ({lowPct}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--bg-primary)] overflow-hidden p-0.5 border border-[var(--border-color)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700"
                  style={{ width: `${lowPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Chart 2: Kesehatan Kriteria SEO Global (Keterpasangan Meta Tag) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-500" /> Ringkasan Kesehatan Meta Tag & Kriteria SEO
            </h2>
            <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)]">Compliance Rate</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
              <p className="text-[11px] font-bold text-[var(--text-subtle)] truncate">Panjang Judul SEO</p>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-emerald-500">{titlePassPct}%</span>
                <span className="text-[10px] text-[var(--text-muted)]">30–70 kar</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-emerald-500/20 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${titlePassPct}%` }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
              <p className="text-[11px] font-bold text-[var(--text-subtle)] truncate">Meta Description</p>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-teal-500">{excerptPassPct}%</span>
                <span className="text-[10px] text-[var(--text-muted)]">50–160 kar</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-teal-500/20 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${excerptPassPct}%` }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
              <p className="text-[11px] font-bold text-[var(--text-subtle)] truncate">Gambar Sampul</p>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-cyan-500">{imagePassPct}%</span>
                <span className="text-[10px] text-[var(--text-muted)]">Featured Img</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-cyan-500/20 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${imagePassPct}%` }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
              <p className="text-[11px] font-bold text-[var(--text-subtle)] truncate">Tag Keyword SEO</p>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-blue-500">{tagsPassPct}%</span>
                <span className="text-[10px] text-[var(--text-muted)]">Tags Ready</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-blue-500/20 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${tagsPassPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ARTICLE AUDIT SECTION WITH FILTER TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Post Selector with Status Filtering Tabs */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" /> Daftar Artikel ({filteredPosts.length})
            </h2>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'published'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" /> Diterbitkan ({publishedPosts.length})
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'scheduled'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Terjadwal ({scheduledPosts.length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'draft'
                  ? 'bg-slate-600 text-white shadow-sm'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Draf ({draftPosts.length})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Semua ({posts.length})
            </button>
          </div>

          {/* Post Items */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const res = calculateSeoScore(post);
                const isSelected = selectedPost?.id === post.id;
                const isScheduled = isPostScheduled(post);
                const isPublished = isPostPublished(post);

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
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {isPublished && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase">
                            Published
                          </span>
                        )}
                        {isScheduled && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[9px] font-black uppercase flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Terjadwal
                          </span>
                        )}
                        {post.status === 'draft' && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-400 text-[9px] font-black uppercase">
                            Draft
                          </span>
                        )}
                        <span className="text-[10px] text-[var(--text-subtle)] truncate">{post.category}</span>
                      </div>

                      <h3 className="text-xs font-bold text-[var(--text-main)] truncate">{post.title}</h3>
                      {isScheduled && post.publishedAt && (
                        <p className="text-[10px] text-purple-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Rilis: {new Date(post.publishedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      )}
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                      res.score >= 80 ? 'bg-emerald-500/20 text-emerald-500' : res.score >= 50 ? 'bg-amber-500/20 text-amber-500' : 'bg-rose-500/20 text-rose-500'
                    }`}>
                      {res.score}/100
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12 text-[var(--text-muted)] text-xs">
                Tidak ada artikel dalam kategori filter ini.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed SEO Audit Dashboard */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
          {selectedPost ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Hasil Audit SEO Real-time</span>
                    {isPostScheduled(selectedPost) && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold">
                        Terjadwal
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] line-clamp-1">{selectedPost.title}</h2>
                </div>
                <Link
                  href={`/dashboard/posts/edit/${selectedPost.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-sm"
                >
                  Edit Artikel <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Score Gauge Meter */}
              <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-6">
                <div className={`w-28 h-28 rounded-full border-[10px] flex flex-col items-center justify-center font-black shrink-0 shadow-inner ${
                  analysis.score >= 80 ? 'border-emerald-500 text-emerald-500 shadow-emerald-500/20' :
                  analysis.score >= 50 ? 'border-amber-500 text-amber-500 shadow-amber-500/20' :
                  'border-rose-500 text-rose-500 shadow-rose-500/20'
                }`}>
                  <span className="text-3xl tracking-tight">{analysis.score}</span>
                  <span className="text-[9px] uppercase font-bold text-[var(--text-subtle)]">Skor SEO</span>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    {analysis.score >= 80 ? 'Kondisi SEO Artikel Sangat Optimal! 🚀' : analysis.score >= 50 ? 'Kondisi SEO Artikel Cukup Baik ⚠️' : 'Perlu Perbaikan SEO ❌'}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Artikel ini memenuhi <strong className="text-[var(--text-main)]">{analysis.items.filter(i => i.type === 'pass').length} dari {analysis.items.length}</strong> standar kriteria SEO Google modern.
                  </p>
                  {selectedPost.status === 'scheduled' && selectedPost.publishedAt && (
                    <p className="text-xs text-purple-400 font-medium pt-1 flex items-center justify-center sm:justify-start gap-1">
                      <Clock className="w-3.5 h-3.5" /> Dijadwalkan otomatis terbit pada {new Date(selectedPost.publishedAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                  )}
                </div>
              </div>

              {/* Checklist Detail */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500" /> Rincian Pemeriksaan Parameter SEO
                </h3>
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
            <div className="text-center py-20 text-[var(--text-muted)]">Pilih artikel untuk melihat hasil audit SEO detail.</div>
          )}
        </div>

      </div>
    </div>
  );
}
