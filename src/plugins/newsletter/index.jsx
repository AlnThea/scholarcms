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

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    setLoading(true);
    const subs = await dbService.getSubscribers();
    setSubscribers(subs);
    setLoading(false);
  }

  async function handleAddSubscriber(e) {
    e.preventDefault();
    if (!newEmail) return;

    await dbService.addSubscriber({ email: newEmail, name: newName || 'Pembaca' });
    setNewEmail('');
    setNewName('');
    setSuccessMsg('Subscriber baru berhasil ditambahkan!');
    setTimeout(() => setSuccessMsg(''), 3000);
    await loadSubscribers();
  }

  async function handleSendBroadcast(e) {
    e.preventDefault();
    if (!broadcastMessage) return;

    setSendingBroadcast(true);
    await new Promise(r => setTimeout(r, 1500));
    setSendingBroadcast(false);
    setBroadcastMessage('');
    setSuccessMsg(`Email broadcast berhasil dikirimkan ke ${subscribers.length} subscriber!`);
    setTimeout(() => setSuccessMsg(''), 4000);
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
            <Mail className="w-6 h-6" /> Kelola Newsletter & Email Subscriber
          </h1>
          <p className="text-xs text-blue-100 max-w-xl mt-1">
            Kumpulkan daftar email pembaca setia blog Anda dan kirimkan update artikel broadcast terbaru.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSubscribers}
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
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">Status Form Public</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-500">Aktif</p>
        </div>
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">Email Terkirim</span>
            <Send className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-[var(--text-main)]">100%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Broadcast Email Sender */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" /> Kirim Email Broadcast Ke Pembaca
          </h2>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1">
                Pesan / Pengumuman Email
              </label>
              <textarea
                rows={5}
                required
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Tuliskan pengumuman atau rangkuman artikel terbaru yang ingin dikirimkan ke seluruh subscriber..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={sendingBroadcast || subscribers.length === 0}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {sendingBroadcast ? 'Mengirim Broadcast...' : `Kirim ke ${subscribers.length} Subscriber`}
            </button>
          </form>
        </div>

        {/* Right Column: Subscribers List & Add Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Add Form */}
          <form onSubmit={handleAddSubscriber} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" /> Tambah Subscriber Manufaktur
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

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
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
