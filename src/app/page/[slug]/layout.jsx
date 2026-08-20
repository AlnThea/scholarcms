import { dbService } from '@/services/dbService';

export const revalidate = 60; // ISR cache revalidation (60 detik)

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const pageData = await dbService.getPageBySlug(slug);
    
    if (!pageData) {
      return {
        title: 'Halaman Tidak Ditemukan',
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarcms.com';
    const pageUrl = `${siteUrl}/page/${slug}`;

    return {
      title: pageData.title,
      description: pageData.excerpt || 'Halaman informasi situs.',
      openGraph: {
        title: pageData.title,
        description: pageData.excerpt || 'Halaman informasi situs.',
        url: pageUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: pageData.title,
        description: pageData.excerpt || 'Halaman informasi situs.',
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (error) {
    return {
      title: 'Halaman',
    };
  }
}

export default function StaticPageLayout({ children }) {
  return <>{children}</>;
}
