'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GutenbergEditor from '@/components/admin/GutenbergEditor';
import { dbService } from '@/services/dbService';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (postData) => {
    setSaving(true);
    await dbService.savePost(postData);
    setSaving(false);
    router.push('/dashboard/posts');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/posts" className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-blue-500">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Postingan
        </Link>
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          Mode Gutenberg Editor
        </span>
      </div>

      <GutenbergEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
