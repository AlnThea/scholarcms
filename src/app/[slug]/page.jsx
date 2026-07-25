'use client';

import StaticPageDetail from '@/app/page/[slug]/page';
import BlogPostDetail from '@/app/post/[slug]/page';
import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';

export default function GenericSlugPage({ params }) {
  const { slug } = params;
  const [contentType, setContentType] = useState(null); // 'page' | 'post' | 'not_found'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolveSlug() {
      setLoading(true);
      // First try to find a static page
      const foundPage = await dbService.getPageBySlug(slug);
      if (foundPage) {
        setContentType('page');
        setLoading(false);
        return;
      }
      // Second try to find a blog post
      const foundPost = await dbService.getPostBySlug(slug);
      if (foundPost) {
        setContentType('post');
        setLoading(false);
        return;
      }
      setContentType('not_found');
      setLoading(false);
    }
    resolveSlug();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-xs text-[var(--text-muted)] font-semibold">
        Memuat konten...
      </div>
    );
  }

  if (contentType === 'page') {
    return <StaticPageDetail params={params} />;
  }

  if (contentType === 'post') {
    return <BlogPostDetail params={params} />;
  }

  return <StaticPageDetail params={params} />;
}
