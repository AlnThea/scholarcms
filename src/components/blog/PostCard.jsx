import Link from 'next/link';
import { Clock, Eye, ArrowUpRight } from 'lucide-react';

export default function PostCard({ post }) {
  if (!post) return null;

  return (
    <article className="group flex flex-col h-full rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden hover-lift transition-all">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--bg-primary)]">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-blue-500 transition-colors line-clamp-2 mb-3 leading-snug">
            <Link href={`/post/${post.slug}`} className="flex items-start justify-between gap-2">
              <span>{post.title}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-500 mt-1" />
            </Link>
          </h3>

          <p className="text-sm text-[var(--text-muted)] line-clamp-3 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-subtle)]">
          <div className="flex items-center gap-2">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={post.author?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-medium text-[var(--text-main)]">{post.author?.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-blue-400" /> {post.views || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
