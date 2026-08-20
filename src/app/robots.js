import { headers } from 'next/headers';

export default function robots() {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'scholarcms.com';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  let baseUrl = `${protocol}://${host}`;
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/login', '/register'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
