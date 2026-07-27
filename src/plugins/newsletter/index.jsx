'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { Mail, Users, Send, Plus, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

export default function NewsletterPluginPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [settings, setSettings] = useState({
    senderName: process.env.NEXT_PUBLIC_NEWSLETTER_SENDER_NAME || 'ScholarCMS Editorial',
    senderEmail: process.env.NEXT_PUBLIC_NEWSLETTER_SENDER_EMAIL || 'newsletter@domain.com',
    provider: 'resend',
    apiKey: '',
    autoWelcome: true,
    welcomeSubject: 'Selamat Datang di Newsletter ScholarCMS!'
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    loadSubscribersAndSettings();
  }, []);

  async function loadSubscribersAndSettings() {
    setLoading(true);
    const [subs, loadedSettings] = await Promise.all([
      dbService.getSubscribers(),
      dbService.getPluginSettings('newsletter')
    ]);
    setSubscribers(subs || []);
    setSettings(prev => ({
      senderName: process.env.NEXT_PUBLIC_NEWSLETTER_SENDER_NAME || prev.senderName,
      senderEmail: process.env.NEXT_PUBLIC_NEWSLETTER_SENDER_EMAIL || prev.senderEmail,
      ...loadedSettings
    }));
    setLoading(false);
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await dbService.savePluginSettings('newsletter', settings);
      setSuccessMsg('Pengaturan email & provider newsletter berhasil disimpan!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      alert('Gagal menyimpan pengaturan: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleAddSubscriber(e) {
    e.preventDefault();
    if (!newEmail) return;

    await dbService.addSubscriber({ email: newEmail, name: newName || 'Pembaca' });
    setNewEmail('');
    setNewName('');
    setSuccessMsg('Subscriber baru berhasil ditambahkan!');
    setTimeout(() => setSuccessMsg(''), 3000);
    await loadSubscribersAndSettings();
  }

  async function handleSendBroadcast(e) {
    e.preventDefault();
    if (!broadcastMessage || subscribers.length === 0) return;

    setSendingBroadcast(true);
    try {
      const emailsList = subscribers.map(s => s.email).filter(Boolean);
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailsList,
          subject: `[ScholarCMS] ${settings.welcomeSubject || 'Artikel & Pengumuman Terbaru'}`,
          body: broadcastMessage,
          apiKey: settings.apiKey,
          senderName: settings.senderName,
          senderEmail: settings.senderEmail,
          provider: settings.provider
        })
      });

      const data = await res.json();

      if (data.success) {
        setBroadcastMessage('');
        const modeLabel = data.mode === 'production' ? ' (Produksi Asli)' : ' (Demo Simulation)';
        setSuccessMsg(`Email broadcast berhasil dikirimkan ke ${emailsList.length} subscriber${modeLabel}!`);
      } else {
        alert('Gagal mengirim broadcast: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error pengiriman broadcast: ' + err.message);
    } finally {
      setSendingBroadcast(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  }

  return (
    <div className="space-y-8">
      {/* Plugin Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 mb-2 inline-block">
            Plugin Active • ScholarCMS Newsletter Engine
          </span>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Mail className="w-6 h-6" /> Kelola Newsletter & Konfigurasi Email
          </h1>
          <p className="text-xs text-blue-100 max-w-xl mt-1">
            Kumpulkan daftar email pembaca setia blog Anda, atur alamat email pengirim, dan kirimkan broadcast pengumuman secara otomatis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSubscribersAndSettings}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5" /> {successMsg}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">Total Subscriber</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-[var(--text-main)]">{subscribers.length}</p>
        </div>
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">Email Pengirim</span>
            <Mail className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-emerald-500 truncate">{settings.senderEmail || 'Belum diatur'}</p>
        </div>
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">Provider Email</span>
            <Send className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-sm font-bold text-indigo-500 uppercase">{settings.provider || 'Resend / SMTP'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Email Configuration Settings */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" /> Pengaturan Email Pengirim & Provider API
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1">
                Nama Pengirim (Sender Name)
              </label>
              <input
                type="text"
                required
                value={settings.senderName}
                onChange={e => setSettings({ ...settings, senderName: e.target.value })}
                placeholder="Contoh: Redaksi ScholarCMS"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1">
                Alamat Email Pengirim (Sender / Reply-To Email)
              </label>
              <input
                type="email"
                required
                value={settings.senderEmail}
                onChange={e => setSettings({ ...settings, senderEmail: e.target.value })}
                placeholder="redaksi@domainanda.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1">
                  Provider Layanan Email
                </label>
                <select
                  value={settings.provider || 'gmail'}
                  onChange={e => setSettings({ ...settings, provider: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 font-bold"
                >
                  <option value="gmail">Google Mail / Gmail (Gmail App Password)</option>
                  <option value="resend">Resend API (HTTPS API)</option>
                  <option value="sendgrid">SendGrid API</option>
                  <option value="smtp">Custom SMTP Server</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1">
                  {settings.provider === 'gmail' ? 'Gmail App Password (16 Karakter)' : 'API Key / Password Provider'}
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder={settings.provider === 'gmail' ? 'xxxx xxxx xxxx xxxx' : 're_123456789...'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoWelcome}
                  onChange={e => setSettings({ ...settings, autoWelcome: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-[var(--text-main)]">
                  Kirim email ucapan selamat datang otomatis saat pengunjung mendaftar
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoNotifyNewPost || false}
                  onChange={e => setSettings({ ...settings, autoNotifyNewPost: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-[var(--text-main)]">
                  Otomatis kirim notifikasi email ke seluruh subscriber setiap kali artikel baru diterbitkan
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> {savingSettings ? 'Menyimpan...' : 'Simpan Konfigurasi Email'}
            </button>
          </form>

          {/* Broadcast Email Form */}
          <div className="pt-6 border-t border-[var(--border-color)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-500" /> Kirim Email Broadcast Pengumuman
            </h3>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Tuliskan isi pengumuman atau rangkuman artikel terbaru yang ingin dikirimkan..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={sendingBroadcast || subscribers.length === 0}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {sendingBroadcast ? 'Mengirim Broadcast...' : `Kirim Email Ke ${subscribers.length} Subscriber`}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Subscribers List & Add Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Add Form */}
          <form onSubmit={handleAddSubscriber} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" /> Tambah Subscriber Manual
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nama Pembaca"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-all"
            >
              Tambah Subscriber
            </button>
          </form>

          {/* Subscribers Table */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Daftar Subscriber Terdaftar ({subscribers.length})
            </h2>

            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {subscribers.map((sub) => (
                <div key={sub.id} className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[var(--text-main)] block">{sub.name}</span>
                    <span className="text-[var(--text-subtle)] text-[11px]">{sub.email}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-subtle)]">
                    {new Date(sub.subscribedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
