'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { dbService } from '@/services/dbService';
import { useMetaSidebar } from '@/context/MetaSidebarContext';

export default function NewPagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { resetMeta } = useMetaSidebar();

  useEffect(() => {
    resetMeta();
  }, []);

  const handleSave = async (pageData, shouldExit = true) => {
    setSaving(true);
    const savedPage = await dbService.savePage(pageData);
    setSaving(false);

    if (shouldExit) {
      router.push('/dashboard/pages');
    } else if (savedPage?.id && !pageData.id) {
      router.replace(`/dashboard/pages/edit/${savedPage.id}`);
    }
  };

  return (
    <div className="animate-fade-in">
      <TiptapEditor isPage={true} onSave={handleSave} saving={saving} backLink="/dashboard/pages" />
    </div>
  );
}
