import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

export default function HeroFeatured({ post }) {
  if (!post) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden mb-12 border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl group">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Artikel Utama
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-color)]">
                {post.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)] mb-4 group-hover:text-blue-500 transition-colors leading-tight">
              <Link href={`/post/${post.slug}`}>
                {post.title}
              </Link>
            </h1>

            <p className="text-base text-[var(--text-muted)] line-clamp-3 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={post.author?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30"
              />
              <div>
                <p className="text-sm font-bold text-[var(--text-main)]">{post.author?.name || 'Ernst Dev'}</p>
                <p className="text-xs text-[var(--text-subtle)] flex items-center gap-2">
                  <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </p>
              </div>
            </div>

            <Link
              href={`/post/${post.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all group-hover:translate-x-1"
            >
              Baca Artikel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent lg:hidden" />
        </div>

      </div>
    </div>
  );
}
