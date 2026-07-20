'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GutenbergEditor from '@/components/admin/GutenbergEditor';
import { dbService } from '@/services/dbService';
import { ArrowLeft } from 'lucide-react';
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
    router.push('/admin/posts');
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-[var(--text-subtle)]">Memuat data artikel...</div>;
  }

  if (!post) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-[var(--text-muted)]">Artikel tidak ditemukan.</p>
        <Link href="/admin/posts" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
          Kembali ke Daftar Post
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link href="/admin/posts" className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-blue-500">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Postingan
        </Link>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Mengedit Post #{id}
        </span>
      </div>

      <GutenbergEditor initialPost={post} onSave={handleSave} saving={saving} />
    </div>
  );
}
