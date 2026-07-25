'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { dbService } from '@/services/dbService';
import { useMetaSidebar } from '@/context/MetaSidebarContext';
import Link from 'next/link';

export default function EditPagePage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { loadPostMeta } = useMetaSidebar();

  useEffect(() => {
    async function fetchPage() {
      setLoading(true);
      const data = await dbService.getPageById(id);
      if (data) {
        setPage(data);
        loadPostMeta(data);
      }
      setLoading(false);
    }
    fetchPage();
  }, [id]);

  const handleSave = async (pageData, shouldExit = true) => {
    setSaving(true);
    await dbService.savePage(pageData);
    setSaving(false);

    if (shouldExit) {
      router.push('/dashboard/pages');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-[var(--text-subtle)]">Memuat data halaman statis...</div>;
  }

  if (!page) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-[var(--text-muted)]">Halaman statis tidak ditemukan.</p>
        <Link href="/dashboard/pages" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
          Kembali ke Daftar Halaman
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <TiptapEditor isPage={true} initialPost={page} onSave={handleSave} saving={saving} backLink="/dashboard/pages" />
    </div>
  );
}
