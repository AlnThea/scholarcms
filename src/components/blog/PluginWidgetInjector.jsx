'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { MessageCircle, Mail, X, Send, Check } from 'lucide-react';

export default function PluginWidgetInjector() {
  const [pluginStates, setPluginStates] = useState({});
  const [waSettings, setWaSettings] = useState({});
  const [newsletterSettings, setNewsletterSettings] = useState({});
  const [showNewsletterBanner, setShowNewsletterBanner] = useState(false);

  // Form states
  const [subEmail, setSubEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPluginWidgets() {
      try {
        const [states, waConfig, newsConfig] = await Promise.all([
          dbService.getPluginStates(),
          dbService.getPluginSettings('whatsapp-float'),
          dbService.getPluginSettings('newsletter')
        ]);

        setPluginStates(states || {});
        setWaSettings(waConfig || {});
        setNewsletterSettings(newsConfig || {});

        // Show newsletter banner after 4 seconds delay if enabled
        if (states?.['newsletter'] !== false) {
          const timer = setTimeout(() => setShowNewsletterBanner(true), 4000);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.warn('Error loading plugin widgets:', err);
      }
    }
    loadPluginWidgets();
  }, []);

  const isWaEnabled = pluginStates['whatsapp-float'] !== false;
  const isNewsletterEnabled = pluginStates['newsletter'] !== false;

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!subEmail) return;
    setSubmitting(true);
    await dbService.addSubscriber({ email: subEmail, name: subName || 'Pembaca' });
    setSubmitting(false);
    setSubSuccess(true);
    setTimeout(() => {
      setSubSuccess(false);
      setShowNewsletterBanner(false);
    }, 3000);
  }

  const phoneNumber = (waSettings.phoneNumber || '6281234567890').replace(/[^0-9]/g, '');
  const welcomeMsg = encodeURIComponent(waSettings.welcomeMessage || 'Halo Admin ScholarCMS!');
  const waUrl = `https://wa.me/${phoneNumber}?text=${welcomeMsg}`;
  const positionClass = waSettings.buttonPosition === 'bottom-left' ? 'left-6' : 'right-6';

  return (
    <>
      {/* 1. WHATSAPP FLOATING BUTTON WIDGET */}
      {isWaEnabled && (
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className={`fixed bottom-6 ${positionClass} z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-2 border-white/20`}
          title="Tanya via WhatsApp"
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
            Hubungi via WhatsApp
          </span>
        </a>
      )}

      {/* 2. NEWSLETTER FLOATING BANNER WIDGET */}
      {isNewsletterEnabled && showNewsletterBanner && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl animate-slideUp space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Mail className="w-3 h-3" /> Subskripsi Blog
            </span>
            <button
              onClick={() => setShowNewsletterBanner(false)}
              className="p-1 rounded-lg text-[var(--text-subtle)] hover:text-[var(--text-main)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[var(--text-main)] leading-snug">
              {newsletterSettings.headingTitle || 'Dapatkan Artikel Terbaru di Email Anda'}
            </h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Berlangganan newsletter gratis untuk menerima ringkasan berita & tutorial terbaik setiap minggu.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
            <input
              type="text"
              placeholder="Nama Anda (opsional)"
              value={subName}
              onChange={e => setSubName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Alamat Email Anda"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all shrink-0 disabled:opacity-50"
              >
                {submitting ? '...' : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
            {subSuccess && (
              <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 pt-1">
                <Check className="w-3.5 h-3.5" /> Berhasil berlangganan! Terima kasih.
              </p>
            )}
          </form>
        </div>
      )}
    </>
  );
}
