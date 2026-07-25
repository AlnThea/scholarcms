'use client';

import { useState, useEffect } from 'react';
import { X, Link2, Image as ImageIcon, Video, MousePointerClick, Check } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function InsertMediaModal({ isOpen, onClose, type, initialData = {}, onConfirm }) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialData.url || (type === 'image' ? 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80' : ''));
      setText(initialData.text || (type === 'button' ? 'Klik Di Sini Untuk Informasi Lebih Lanjut' : ''));
      setOpenInNewTab(initialData.openInNewTab !== undefined ? initialData.openInNewTab : true);
    }
  }, [isOpen, type, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url && type !== 'link_remove') return;
    onConfirm({ url, text, openInNewTab });
    onClose();
  };

  const getModalInfo = () => {
    if (type === 'link') {
      return {
        title: 'Sisipkan / Edit Tautan Link',
        icon: Link2,
        color: 'text-blue-500 bg-blue-500/10',
        confirmText: 'Sisipkan Link',
      };
    }
    if (type === 'image') {
      return {
        title: 'Sisipkan Gambar Web',
        icon: ImageIcon,
        color: 'text-rose-500 bg-rose-500/10',
        confirmText: 'Sisipkan Gambar',
      };
    }
    if (type === 'video') {
      return {
        title: 'Sematkan Video YouTube',
        icon: Video,
        color: 'text-red-500 bg-red-500/10',
        confirmText: 'Sematkan Video',
      };
    }
    if (type === 'button') {
      return {
        title: 'Sisipkan Tombol CTA Link',
        icon: MousePointerClick,
        color: 'text-purple-500 bg-purple-500/10',
        confirmText: 'Sisipkan Tombol CTA',
      };
    }
    return {
      title: 'Sisipkan Media',
      icon: Link2,
      color: 'text-blue-500 bg-blue-500/10',
      confirmText: 'Simpan',
    };
  };

  const info = getModalInfo();
  const Icon = info.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/40">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${info.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-main)] tracking-tight">{info.title}</h3>
              <p className="text-xs text-[var(--text-muted)]">Masukkan parameter media untuk disisipkan ke kanvas.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content Container */}
        <div
          className="p-5 space-y-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        >
          {type === 'button' && (
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
                Teks Tombol CTA
              </label>
              <Input
                type="text"
                placeholder="Contoh: Klik Di Sini Untuk Daftar"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
              {type === 'button' ? 'URL Tujuan (HTTPS)' : type === 'image' ? 'URL Gambar Web (HTTPS)' : type === 'video' ? 'URL Video YouTube' : 'URL Tautan Link (HTTPS)'}
            </label>
            <Input
              type="url"
              placeholder={type === 'image' ? 'https://images.unsplash.com/...' : type === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com'}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          {type === 'link' && (
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-main)] cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-[var(--border-color)] focus:ring-blue-500"
              />
              <span>Buka tautan ini di tab baru (`target="_blank"`)</span>
            </label>
          )}

          {/* Pratinjau Gambar jika tipe image dan ada URL */}
          {type === 'image' && url && (
            <div className="mt-2 rounded-xl overflow-hidden border border-[var(--border-color)] max-h-48 bg-black/5 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Pratinjau" className="max-h-44 object-contain rounded-lg shadow-sm" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Batal
            </Button>

            {type === 'link' && initialData.isEditing && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  onConfirm({ remove: true });
                  onClose();
                }}
              >
                Hapus Link
              </Button>
            )}

            <Button type="button" variant="primary" size="sm" icon={Check} onClick={handleSubmit}>
              {info.confirmText}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
