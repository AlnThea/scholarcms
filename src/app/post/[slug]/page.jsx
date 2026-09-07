import { dbService } from '@/services/dbService';
import PostClient from './PostClient';
import { notFound } from 'next/navigation';

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
