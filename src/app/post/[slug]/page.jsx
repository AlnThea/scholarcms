import { dbService } from '@/services/dbService';
import PostClient from './PostClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const post = await dbService.getPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };
    
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarcms.com';
    if (!siteUrl.startsWith('http')) {
      siteUrl = `https://${siteUrl}`;
    }
    
    const postUrl = `${siteUrl}/post/${slug}`;
    const seoTitle = post.seoTitle || post.title || 'Baca Artikel';
    const seoDesc = post.seoDescription || post.excerpt || 'Artikel terbaru';
    const keywordsArray = (post.tags || []).concat(post.focusKeyword ? [post.focusKeyword] : []);
    
    return {
      title: seoTitle,
      description: seoDesc,
      keywords: keywordsArray,
      openGraph: {
        title: seoTitle,
        description: seoDesc,
        url: postUrl,
        type: 'article',
        publishedTime: post.createdAt,
        images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      },
      alternates: {
        canonical: postUrl,
      }
    };
  } catch (error) {
    return { title: 'Post' };
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;

  try {
    // Fetch all necessary data on the server in parallel for SSR speed
    const [fetchedPost, fetchedPosts, fetchedCategories, genSettings] = await Promise.all([
      dbService.getPostBySlug(slug, true), // incrementView = true on the server page
      dbService.getPosts(),
      dbService.getCategories(),
      dbService.getGeneralSettings()
    ]);

    if (!fetchedPost) {
      notFound();
    }

    const fetchedComments = await dbService.getComments(fetchedPost.id);

    return (
      <PostClient 
        params={params}
        initialPost={fetchedPost}
        initialAllPosts={fetchedPosts}
        initialCategories={fetchedCategories}
        initialSiteTitle={genSettings?.siteTitle || 'ByteLab'}
        initialComments={fetchedComments}
      />
    );
  } catch (error) {
    console.error('Error fetching data for BlogPostPage:', error);
    
    // Hybrid Fallback: If Firebase SDK fails on Next.js server (e.g. timeout), 
    // we fall back to rendering the client component without initial data, 
    // so it can fetch the data itself via CSR (useEffect).
    return <PostClient params={params} />;
  }
}
