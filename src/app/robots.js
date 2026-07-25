export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarcms.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/login', '/register'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
