import { dbService } from '@/services/dbService';
import StaticPage, { generateMetadata as pageMetadata } from '@/app/page/[slug]/page';
import BlogPostPage, { generateMetadata as postMetadata } from '@/app/post/[slug]/page';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  // 1. Try to find a Static Page
  const page = await dbService.getPageBySlug(slug);
  if (page) {
    return pageMetadata({ params });
  }

  // 2. Try to find a Blog Post
  const post = await dbService.getPostBySlug(slug);
  if (post) {
    return postMetadata({ params });
  }

  return { title: 'Not Found' };
}

export default async function GenericSlugPage({ params }) {
  const { slug } = params;

  // 1. Try to find a Static Page
  const foundPage = await dbService.getPageBySlug(slug);
  if (foundPage) {
    return <StaticPage params={params} />;
  }

  // 2. Try to find a Blog Post
  const foundPost = await dbService.getPostBySlug(slug);
  if (foundPost) {
    return <BlogPostPage params={params} />;
  }

  // 3. Fallback to 404
  notFound();
}
