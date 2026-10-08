import { dbService } from '@/services/dbService';
import { headers } from 'next/headers';

export const revalidate = 60; // ISR for sitemap

export default async function sitemap() {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'scholarcms.com';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  
  // Base URL murni dinamis mengikuti address bar (otomatis ada www jika diakses dengan www, dan sebaliknya)
  let baseUrl = `${protocol}://${host}`;
  
  // Fallback ke env HANYA jika host default tidak valid (misal saat build time/generate statis)
  if (host === 'scholarcms.com' && process.env.NEXT_PUBLIC_SITE_URL) {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    baseUrl = envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
  }
  
  // Hapus trailing slash jika ada agar tidak terjadi double slash
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // Fetch all published posts, pages, and categories from dbService
  let posts = [];
  let pages = [];
  let categories = [];

  try {
    posts = await dbService.getPosts();
    pages = await dbService.getPages();
    categories = await dbService.getCategories();
  } catch (error) {
    console.error('Sitemap generator fetch error:', error);
  }

  // Filter published posts & pages only
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const publishedPages = pages.filter((p) => p.status === 'published');

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Post routes
  const postRoutes = publishedPosts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post.publishedAt || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Page routes
  const pageRoutes = publishedPages.map((page) => ({
    url: `${baseUrl}/page/${page.slug}`,
    lastModified: page.publishedAt || new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Filter active categories that have at least one published post
  const activeCategories = categories.filter(cat => {
    return publishedPosts.some(post => {
      const postCatArray = Array.isArray(post.categories) && post.categories.length > 0
        ? post.categories
        : (typeof post.category === 'string' && post.category
            ? post.category.split(',').map(s => s.trim()).filter(Boolean)
            : [post.category]);
      return postCatArray.includes(cat.name) || post.category === cat.name || post.subCategory === cat.name;
    });
  });

  // Category routes (filtered view on homepage/post)
  const categoryRoutes = activeCategories.map((cat) => ({
    url: `${baseUrl}/?category=${encodeURIComponent(cat.slug)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...pageRoutes, ...postRoutes, ...categoryRoutes];
}
