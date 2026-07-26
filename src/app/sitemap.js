import { dbService } from '@/services/dbService';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarcms.com';

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

  // Category routes (filtered view on homepage/post)
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/?category=${encodeURIComponent(cat.slug)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...pageRoutes, ...postRoutes, ...categoryRoutes];
}
