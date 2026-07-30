'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdSenseBanner from '@/components/blog/AdSenseBanner';
import { dbService } from '@/services/dbService';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import TrendingTopicsWidget, { RandomArticlesWidget } from '@/components/blog/TrendingTopicsWidget';
import { Clock, Eye, ArrowLeft, ArrowRight, Share2, MessageSquare, Send, Check, Home, ChevronRight, Flame, Layers } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostDetail({ params }) {
  const { slug } = params;
  const { user } = useAuth();
  const { t } = useLanguage();

  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [siteTitle, setSiteTitle] = useState('ByteLab');
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
    if (user) {
      if (user.name) setCommentName(user.name);
      if (user.email) setCommentEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    async function loadPostAndDetails() {
      setLoading(true);
      try {
        const [fetchedPost, fetchedPosts, fetchedCategories, genSettings] = await Promise.all([
          dbService.getPostBySlug(slug),
          dbService.getPosts(),
          dbService.getCategories(),
          dbService.getGeneralSettings()
        ]);

        if (genSettings?.siteTitle) {
          setSiteTitle(genSettings.siteTitle);
        }

        if (fetchedCategories) {
          setCategories(fetchedCategories);
        }

        if (fetchedPosts && fetchedPosts.length > 0) {
          setAllPosts(fetchedPosts);
        }

        if (fetchedPost) {
          setPost(fetchedPost);
          const currentSiteTitle = genSettings?.siteTitle || siteTitle;
          if (typeof document !== 'undefined') {
            document.title = currentSiteTitle ? `${fetchedPost.title} - ${currentSiteTitle}` : fetchedPost.title;
          }

          // Prev / Next article navigation lookup
          if (fetchedPosts && fetchedPosts.length > 0) {
            const idx = fetchedPosts.findIndex(p => p.id === fetchedPost.id || p.slug === fetchedPost.slug);
            if (idx !== -1) {
              setPrevPost(idx > 0 ? fetchedPosts[idx - 1] : null);
              setNextPost(idx < fetchedPosts.length - 1 ? fetchedPosts[idx + 1] : null);
            }
          }

          const fetchedComments = await dbService.getComments(fetchedPost.id);
          setComments(fetchedComments);
        }
      } catch (err) {
        console.error('Error loading post details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPostAndDetails();
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

  // Related posts with same category
  const relatedPosts = post
    ? allPosts
        .filter(p => p.id !== post.id && (p.category === post.category || (Array.isArray(p.categories) && p.categories.includes(post.category))))
        .slice(0, 3)
    : [];

  // Popular posts sorted by views
  const popularPosts = [...allPosts]
    .filter(p => p.id !== post?.id)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 w-full animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-6 w-32 bg-[var(--bg-surface)] rounded-full" />
            <div className="h-12 w-full bg-[var(--bg-surface)] rounded-2xl" />
            <div className="h-96 w-full bg-[var(--bg-surface)] rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-6 hidden lg:block">
            <div className="h-48 bg-[var(--bg-surface)] rounded-3xl" />
            <div className="h-48 bg-[var(--bg-surface)] rounded-3xl" />
          </div>
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
      {/* Schema.org Article JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            image: [post.featuredImage],
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: {
              '@type': 'Person',
              name: post.author?.name || 'Ernst Senior Dev',
            },
            publisher: {
              '@type': 'Organization',
              name: siteTitle || 'ByteLab',
              logo: {
                '@type': 'ImageObject',
                url: post.featuredImage,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://scholarcms.com/post/${post.slug}`,
            },
          }),
        }}
      />

      {/* Schema.org BreadcrumbList JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Beranda',
                item: typeof window !== 'undefined' ? window.location.origin : 'https://scholarcms.com'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: post.category,
                item: typeof window !== 'undefined' ? `${window.location.origin}/?category=${encodeURIComponent(post.category)}` : `https://scholarcms.com/?category=${encodeURIComponent(post.category)}`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: typeof window !== 'undefined' ? window.location.href : `https://scholarcms.com/post/${post.slug}`
              }
            ]
          }),
        }}
      />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-500 transition-colors flex items-center gap-1 font-medium">
            <Home className="w-3.5 h-3.5" />
            <span>{t('breadcrumbHome') || 'Beranda'}</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
          <Link href={`/?category=${encodeURIComponent(post.category)}`} className="hover:text-blue-500 transition-colors font-medium">
            {post.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
          <span className="text-[var(--text-main)] font-semibold truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        {/* 2-Column Responsive Layout: Left (Main Post), Right (Sidebar Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Article Content Column */}
          <div className="lg:col-span-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-blue-500 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda Blog
            </Link>

            <header className="mb-8">
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

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight mb-4 leading-tight">
                {post.title}
              </h1>

              <p className="text-base text-[var(--text-muted)] mb-6 leading-relaxed font-normal">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={post.author?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30"
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

            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-8 border border-[var(--border-color)] shadow-xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* AdSense Top Header Banner Placement */}
            <AdSenseBanner placement="header-banner" className="mb-8" />

            {/* Main Article Text Content */}
            <article className="article-content mb-10 border-b border-[var(--border-color)] pb-10">
              {post.content ? (
                <div 
                  className="prose dark:prose-invert max-w-none text-sm text-[var(--text-main)] leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              ) : post.blocks && post.blocks.length > 0 ? (
                post.blocks.map((block, i) => {
                  if (block.type === 'heading') return <h2 key={i}>{block.content}</h2>;
                  if (block.type === 'quote') return <blockquote key={i}>{block.content}</blockquote>;
                  if (block.type === 'code') return <pre key={i}><code>{block.content}</code></pre>;
                  if (block.type === 'callout') return <div key={i} className="callout-box font-medium text-[var(--text-main)]">{block.content}</div>;
                  return <p key={i}>{block.content}</p>;
                })
              ) : (
                <p>{post.excerpt}</p>
              )}

              {/* AdSense In-Article Placement */}
              <AdSenseBanner placement="in-article" className="mt-8" />
            </article>

            {/* Tags (Wrapped nicely, no horizontal scrollbar) */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-10">
                <span className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider mr-2">Tags:</span>
                {post.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    href={`/?search=${encodeURIComponent(tag)}`}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-500 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex items-center gap-1 group"
                    title={`Cari semua artikel terkait #${tag}`}
                  >
                    <span className="text-blue-500 group-hover:scale-110 transition-transform">#</span>
                    <span>{tag}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Previous & Next Post Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {prevPost ? (
                <Link
                  href={`/post/${prevPost.slug}`}
                  className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-blue-500/50 transition-all group flex flex-col justify-between"
                >
                  <span className="text-[11px] font-bold text-blue-500 flex items-center gap-1 uppercase tracking-wider mb-2">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> {t('prevArticle') || 'Artikel Sebelumnya'}
                  </span>
                  <h4 className="text-xs font-bold text-[var(--text-main)] group-hover:text-blue-500 line-clamp-2 transition-colors">
                    {prevPost.title}
                  </h4>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link
                  href={`/post/${nextPost.slug}`}
                  className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-blue-500/50 transition-all group flex flex-col justify-between text-right"
                >
                  <span className="text-[11px] font-bold text-blue-500 flex items-center justify-end gap-1 uppercase tracking-wider mb-2">
                    {t('nextArticle') || 'Artikel Selanjutnya'} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <h4 className="text-xs font-bold text-[var(--text-main)] group-hover:text-blue-500 line-clamp-2 transition-colors">
                    {nextPost.title}
                  </h4>
                </Link>
              ) : <div />}
            </div>

            {/* Visitor Comments Section */}
            <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> Komentar Pengunjung ({comments.length})
              </h3>

              <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
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

              <div className="space-y-4 border-t border-[var(--border-color)] pt-6">
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

          </div>

          {/* Right Sidebar Column: Recommendation Cards */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Widget 1: Artikel Terkait (Related Posts in Same Category) */}
            {relatedPosts.length > 0 && (
              <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-main)]">{t('relatedArticlesTitle') || 'Artikel Terkait'}</h3>
                      <p className="text-[11px] text-[var(--text-muted)]">Kategori {post.category}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {relatedPosts.map((relPost) => (
                    <Link
                      key={relPost.id}
                      href={`/post/${relPost.slug}`}
                      className="group flex gap-3 items-center p-2 rounded-2xl hover:bg-[var(--bg-primary)] transition-all border border-transparent hover:border-[var(--border-color)]"
                    >
                      {relPost.featuredImage ? (
                        <img
                          src={relPost.featuredImage}
                          alt={relPost.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[var(--border-color)] group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                          <Layers className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[var(--text-main)] group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                          {relPost.title}
                        </h4>
                        <p className="text-[10px] text-[var(--text-subtle)] mt-1">{relPost.readTime || '3 min read'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 2: Popular Articles */}
            {popularPosts.length > 0 && (
              <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
                <h3 className="text-base font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" /> {t('popularArticlesTitle') || 'Artikel Populer'}
                </h3>
                <div className="space-y-4">
                  {popularPosts.map((popPost, idx) => (
                    <Link key={popPost.id} href={`/post/${popPost.slug}`} className="group flex gap-3 items-center">
                      <span className="text-xl font-extrabold text-[var(--text-subtle)] group-hover:text-blue-500 w-6">
                        0{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[var(--text-main)] group-hover:text-blue-500 transition-colors line-clamp-2">
                          {popPost.title}
                        </h4>
                        <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">{popPost.views || 0} {t('readersCount')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 3: Random Articles Widget */}
            <RandomArticlesWidget posts={allPosts} currentPostId={post.id} limit={3} />

            {/* Widget 4: Topics & Tags Widget */}
            <TrendingTopicsWidget
              categories={categories}
              posts={allPosts}
              onSelectTag={(tag) => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/?search=${encodeURIComponent(tag)}`;
                }
              }}
              onSelectCategory={(catName) => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/?category=${encodeURIComponent(catName)}`;
                }
              }}
              currentPostId={post.id}
            />

          </aside>

        </div>

      </main>

      <Footer />
    </div>
  );
}
