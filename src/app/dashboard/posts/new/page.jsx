'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { dbService } from '@/services/dbService';

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
    <div className="animate-fade-in">
      <TiptapEditor onSave={handleSave} saving={saving} backLink="/dashboard/posts" />
    </div>
  );
}
