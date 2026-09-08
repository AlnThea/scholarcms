import { dbService } from '@/services/dbService';
import PageClient from './PageClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const page = await dbService.getPageBySlug(slug);
    if (!page) return { title: 'Page Not Found' };
    
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarcms.com';
    if (!siteUrl.startsWith('http')) {
      siteUrl = `https://${siteUrl}`;
    }
    
    const pageUrl = `${siteUrl}/page/${slug}`;
    const seoTitle = page.seoTitle || page.title || 'Baca Halaman';
    const seoDesc = page.seoDescription || page.excerpt || 'Halaman statis';
    
    return {
      title: seoTitle,
      description: seoDesc,
      openGraph: {
        title: seoTitle,
        description: seoDesc,
        url: pageUrl,
        type: 'website',
        publishedTime: page.publishedAt,
        images: page.featuredImage ? [{ url: page.featuredImage }] : [],
      },
      alternates: {
        canonical: pageUrl,
      }
    };
  } catch (error) {
    return { title: 'Page' };
  }
}

export default async function StaticPage({ params }) {
  const { slug } = params;

  try {
    const [fetchedPage, genSettings] = await Promise.all([
      dbService.getPageBySlug(slug),
      dbService.getGeneralSettings()
    ]);

    if (!fetchedPage) {
      notFound();
    }

    return (
      <PageClient 
        params={params}
        initialPage={fetchedPage}
        initialSiteTitle={genSettings?.siteTitle || 'ByteLab'}
      />
    );
  } catch (error) {
    console.error('Error fetching data for StaticPage:', error);
    return <PageClient params={params} />;
  }
}
