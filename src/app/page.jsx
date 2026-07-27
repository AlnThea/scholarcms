'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFeatured from '@/components/blog/HeroFeatured';
import PostCard from '@/components/blog/PostCard';
import TrendingTopicsWidget from '@/components/blog/TrendingTopicsWidget';
import { dbService } from '@/services/dbService';
import { Search, BookOpen, Flame } from 'lucide-react';
import Link from 'next/link';
import ThemeRenderer from '@/components/blog/ThemeRenderer';

function BlogHomeContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState(false);

  useEffect(() => {
    const paramCat = searchParams.get('category');
    const paramQuery = searchParams.get('search') || searchParams.get('tag');
    if (paramCat) setSelectedCategory(paramCat);
    if (paramQuery) setSearchQuery(paramQuery);
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const isReal = dbService.isRealFirebase();
      setDbStatus(isReal);

      const [loadedPosts, loadedCats] = await Promise.all([
        dbService.getPosts({ status: 'published' }),
        dbService.getCategories()
      ]);

      setPosts(loadedPosts);
      setCategories(loadedCats);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();

    let matchesSearch = true;
    if (query) {
      const inTitle = post.title?.toLowerCase().includes(query);
      const inExcerpt = post.excerpt?.toLowerCase().includes(query);
      const inCategory = post.category?.toLowerCase().includes(query);
      const inTags = Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(query));
      const inContent = post.content?.toLowerCase().includes(query);
      const inBlocks = Array.isArray(post.blocks) && post.blocks.some(b => b.content?.toLowerCase().includes(query));

      matchesSearch = inTitle || inExcerpt || inCategory || inTags || inContent || inBlocks;
    }

    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts[0];
  const gridPosts = searchQuery || selectedCategory !== 'All' ? filteredPosts : filteredPosts.slice(1);
  const popularPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  return (
    <ThemeRenderer
      posts={posts}
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      loading={loading}
    />
  );
}

export default function BlogHome() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
      <BlogHomeContent />
    </Suspense>
  );
}
