'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { dbService } from '@/services/dbService';
import { Clock, Eye, ArrowLeft, Share2, MessageSquare, Send, Check } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostDetail({ params }) {
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Comment Form State
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    async function loadPostAndComments() {
      setLoading(true);
      const fetchedPost = await dbService.getPostBySlug(slug);
      if (fetchedPost) {
        setPost(fetchedPost);
        const fetchedComments = await dbService.getComments(fetchedPost.id);
        setComments(fetchedComments);
      }
      setLoading(false);
    }
    loadPostAndComments();
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName || !commentBody || !post) return;

    setSubmittingComment(true);
    const newComm = await dbService.addComment({
      postId: post.id,
      authorName: commentName,
      authorEmail: commentEmail,
      content: commentBody
    });

    setComments([newComm, ...comments]);
    setCommentBody('');
    setSubmittingComment(false);
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-[var(--text-muted)] mb-8">Maaf, artikel yang Anda cari mungkin telah dihapus atau URL-nya salah.</p>
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
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-blue-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda Blog
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              {post.category}
            </span>
            <span className="text-xs text-[var(--text-subtle)] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="text-xs text-[var(--text-subtle)] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-400" /> {post.views || 0} pembaca
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={post.author?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--text-main)]">{post.author?.name}</h4>
                <p className="text-xs text-[var(--text-subtle)]">{post.author?.role || 'CMS Author'} • {new Date(post.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-primary)] transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-blue-500" />}
              {copied ? 'Tautan Disalin!' : 'Bagikan Artikel'}
            </button>
          </div>
        </header>

        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-[var(--border-color)] shadow-xl">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="gutenberg-content mb-16 border-b border-[var(--border-color)] pb-12">
          {post.blocks && post.blocks.length > 0 ? (
            post.blocks.map((block, i) => {
              if (block.type === 'heading') {
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
            <p>{post.excerpt}</p>
          )}
        </article>

        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-16">
            <span className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider mr-2">Tags:</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <section className="p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" /> Komentar Pengunjung ({comments.length})
          </h3>

          <form onSubmit={handleCommentSubmit} className="mb-10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Tulis Komentar *</label>
              <textarea
                rows={3}
                required
                placeholder="Tulis tanggapan atau komentar Anda di sini..."
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              {commentSuccess ? (
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Komentar Anda berhasil diterbitkan!
                </span>
              ) : <span />}
              <button
                type="submit"
                disabled={submittingComment}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
              </button>
            </div>
          </form>

          <div className="space-y-4 border-t border-[var(--border-color)] pt-8">
            {comments.length > 0 ? (
              comments.map((comm) => (
                <div key={comm.id} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[var(--text-main)]">{comm.authorName}</span>
                    <span className="text-[11px] text-[var(--text-subtle)]">
                      {new Date(comm.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{comm.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--text-subtle)] text-center py-4">Belum ada komentar. Jadilah yang pertama memberikan komentar!</p>
            )}
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
