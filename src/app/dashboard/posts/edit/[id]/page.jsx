'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { dbService } from '@/services/dbService';
import Link from 'next/link';

export default function EditPostPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const data = await dbService.getPostById(id);
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  const handleSave = async (postData) => {
    setSaving(true);
    await dbService.savePost(postData);
    setSaving(false);
    router.push('/dashboard/posts');
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-[var(--text-subtle)]">Memuat data artikel...</div>;
  }

  if (!post) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-[var(--text-muted)]">Artikel tidak ditemukan.</p>
        <Link href="/dashboard/posts" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
          Kembali ke Daftar Post
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <TiptapEditor initialPost={post} onSave={handleSave} saving={saving} backLink="/dashboard/posts" />
    </div>
  );
}
