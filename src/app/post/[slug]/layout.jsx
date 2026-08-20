import { dbService } from '@/services/dbService';

export const revalidate = 60; // ISR cache revalidation (60 detik)

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    // Ambil data artikel spesifik dari database tanpa memicu penambahan view count
    const post = await dbService.getPostBySlug(slug, false);
    
    if (!post) {
      return {
        title: 'Artikel Tidak Ditemukan',
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarcms.com';
    const postUrl = `${siteUrl}/post/${slug}`;

    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      keywords: post.seoKeywords ? post.seoKeywords.split(',').map(k => k.trim()) : [],
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        url: postUrl,
        type: 'article',
        publishedTime: post.publishedAt || new Date().toISOString(),
        authors: [post.author?.name || 'Redaksi'],
        images: post.featuredImage ? [
          {
            url: post.featuredImage,
            alt: post.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
      alternates: {
        canonical: postUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for post:', error);
    return {
      title: 'Baca Artikel',
    };
  }
}

export default function PostLayout({ children }) {
  return <>{children}</>;
}
