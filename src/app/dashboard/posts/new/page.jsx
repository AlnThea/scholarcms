'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { dbService } from '@/services/dbService';
import { useMetaSidebar } from '@/context/MetaSidebarContext';

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { resetMeta } = useMetaSidebar();

  useEffect(() => {
    resetMeta();
  }, []);

  const handleSave = async (postData, shouldExit = true) => {
    setSaving(true);
    const savedPost = await dbService.savePost(postData);
    setSaving(false);

    // Otomatis kirim email notifikasi ke subscriber jika fitur aktif dan post diterbitkan
    if (savedPost && (savedPost.status === 'published' || postData.status === 'published')) {
      try {
        const [settings, subs] = await Promise.all([
          dbService.getPluginSettings('newsletter'),
          dbService.getSubscribers()
        ]);

        if (settings && settings.autoNotifyNewPost && subs && subs.length > 0) {
          const recipientEmails = subs.map(s => s.email).filter(Boolean);
          if (recipientEmails.length > 0) {
            fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: recipientEmails,
                subject: `📢 Artikel Baru Terbit: ${savedPost.title}`,
                body: `Halo Subscriber,\n\nArtikel baru berjudul "${savedPost.title}" telah terbit di ${settings.senderName || 'ScholarCMS'}.\n\nRingkasan:\n${savedPost.excerpt || 'Klik tautan untuk membaca artikel selengkapnya.'}\n\nSalam hangat,\n${settings.senderName || 'Redaksi ScholarCMS'}`,
                apiKey: settings.apiKey,
                senderName: settings.senderName,
                senderEmail: settings.senderEmail,
                provider: settings.provider
              })
            }).catch(e => console.warn('Auto-notify subscribers failed:', e));
          }
        }
      } catch (e) {
        console.warn('Auto notify error:', e);
      }
    }

    if (shouldExit) {
      router.push('/dashboard/posts');
    } else if (savedPost?.id && !postData.id) {
      router.replace(`/dashboard/posts/edit/${savedPost.id}`);
    }
  };

  return (
    <div className="animate-fade-in">
      <TiptapEditor onSave={handleSave} saving={saving} backLink="/dashboard/posts" />
    </div>
  );
}

