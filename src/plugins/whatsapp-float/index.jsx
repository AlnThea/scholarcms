'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { MessageCircle, Save, CheckCircle, Smartphone, ExternalLink } from 'lucide-react';

export default function WhatsAppPluginPage() {
  const [phoneNumber, setPhoneNumber] = useState('6281234567890');
  const [welcomeMessage, setWelcomeMessage] = useState('Halo Admin ScholarCMS, saya mau bertanya mengenai artikel blog!');
  const [buttonPosition, setButtonPosition] = useState('bottom-right');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const settings = await dbService.getPluginSettings('whatsapp-float');
    if (settings.phoneNumber) setPhoneNumber(settings.phoneNumber);
    if (settings.welcomeMessage) setWelcomeMessage(settings.welcomeMessage);
    if (settings.buttonPosition) setButtonPosition(settings.buttonPosition);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await dbService.savePluginSettings('whatsapp-float', {
      phoneNumber,
      welcomeMessage,
      buttonPosition
    });
    setSaving(false);
    setSuccessMsg('Pengaturan WhatsApp Live Chat berhasil disimpan!');
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  const encodedMsg = encodeURIComponent(welcomeMessage);
  const waUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMsg}`;

  return (
    <div className="space-y-8">
      {/* Plugin Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 mb-2 inline-block">
            Plugin Active • ScholarCMS WhatsApp Widget
          </span>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <MessageCircle className="w-6 h-6" /> Widget WhatsApp Contact Melayang
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl mt-1">
            Tampilkan tombol obrolan WhatsApp melayang di sudut blog pembaca agar pembaca dapat menghubungi Anda secara langsung.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Settings */}
        <form onSubmit={handleSave} className="lg:col-span-7 p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-500" /> Konfigurasi Nomor & Pesan
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Atur nomor telepon WhatsApp penerima dan pesan otomatis saat tombol diklik.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1">
                Nomor WhatsApp (dengan kode negara 62)
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="Misal: 6281234567890"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1">
                Pesan Pembuka Default (Greeting Message)
              </label>
              <textarea
                rows={3}
                required
                value={welcomeMessage}
                onChange={e => setWelcomeMessage(e.target.value)}
                placeholder="Tuliskan teks salam pembuka otomatis..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1">
                Posisi Tombol Melayang
              </label>
              <select
                value={buttonPosition}
                onChange={e => setButtonPosition(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:border-emerald-500"
              >
                <option value="bottom-right">Pojok Kanan Bawah (Bottom Right - Rekomendasi)</option>
                <option value="bottom-left">Pojok Kiri Bawah (Bottom Left)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Pengaturan WhatsApp'}
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--text-main)] mb-1">Pratinjau Live WhatsApp Widget</h2>
            <p className="text-xs text-[var(--text-muted)]">Tampilan tombol yang akan muncul di blog publik.</p>

            <div className="mt-6 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-pulse">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Tanya via WhatsApp</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Nomor: <code className="text-emerald-500 font-mono font-bold">+{phoneNumber}</code>
                </p>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all"
              >
                Uji Coba Tautan WhatsApp <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
