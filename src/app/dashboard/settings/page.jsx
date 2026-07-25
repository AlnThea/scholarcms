'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { Database, RefreshCw, CheckCircle, AlertTriangle, DollarSign, Save, ShieldCheck, Sparkles } from 'lucide-react';

export default function DashboardSettingsPage() {
  const { role } = useAuth();
  const isFirebaseActive = dbService.isRealFirebase();
  const [resetMessage, setResetMessage] = useState(false);

  // Global AdSense States for Admin
  const [adSettings, setAdSettings] = useState({
    globalEnableAds: true,
    adClient: 'ca-pub-9999999999999999',
    headerAdSlot: '1234567890',
    inArticleAdSlot: '0987654321',
    footerAdSlot: '1122334455',
    autoAdsEnabled: true,
  });
  const [adSaving, setAdSaving] = useState(false);
  const [adSavedMessage, setAdSavedMessage] = useState(false);

  // AI Master Prompt States
  const [masterPrompt, setMasterPrompt] = useState('');
  const [promptSaving, setPromptSaving] = useState(false);
  const [promptSavedMessage, setPromptSavedMessage] = useState(false);

  useEffect(() => {
    async function fetchAdSettings() {
      try {
        const data = await dbService.getAdSenseSettings();
        if (data) {
          setAdSettings(data);
        }
      } catch (err) {
        console.error('Failed to load AdSense settings:', err);
      }
    }
    fetchAdSettings();
    if (typeof window !== 'undefined') {
      const { aiService } = require('@/services/aiService');
      setMasterPrompt(aiService.getMasterPrompt());
    }
  }, []);

  const handleSaveMasterPrompt = (e) => {
    e.preventDefault();
    setPromptSaving(true);
    const { aiService } = require('@/services/aiService');
    aiService.saveMasterPrompt(masterPrompt);
    setPromptSaving(false);
    setPromptSavedMessage(true);
    setTimeout(() => setPromptSavedMessage(false), 3000);
  };

  const handleSaveAdSense = async (e) => {
    e.preventDefault();
    setAdSaving(true);
    await dbService.saveAdSenseSettings(adSettings);
    setAdSaving(false);
    setAdSavedMessage(true);
    setTimeout(() => setAdSavedMessage(false), 3000);
  };

  const handleResetDemo = async () => {
    if (confirm('Reset data ke kondisi default sampel?')) {
      await dbService.resetDemoData();
      setResetMessage(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      <PageHeader
        title="Pengaturan CMS & Monetisasi"
        subtitle="Periksa status koneksi Firebase, konfigurasi Google AdSense global, dan kelola preferensi situs blog Anda."
      />

      {/* ADMIN ONLY: GOOGLE ADSENSE & MONETIZATION GLOBAL SETTINGS */}
      {role === 'admin' && (
        <form onSubmit={handleSaveAdSense} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
                  Pengaturan Global Google AdSense 💰
                  <ShieldCheck className="w-4 h-4 text-blue-500" title="Khusus Role Admin" />
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Kredensial resmi AdSense Publisher ID & Slot Iklan Otomatis (Khusus Admin)</p>
              </div>
            </div>

            <Badge variant={adSettings.globalEnableAds ? 'published' : 'draft'}>
              {adSettings.globalEnableAds ? 'Iklan Global ON' : 'Iklan Global OFF'}
            </Badge>
          </div>

          <div className="space-y-5">
            
            {/* Global Ads Switch */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] flex items-center justify-between gap-4">
              <div>
                <span className="block font-bold text-xs text-[var(--text-main)]">Aktifkan Iklan Google AdSense di Seluruh Website</span>
                <span className="block text-[11px] text-[var(--text-muted)]">Sakelar penayangan iklan global untuk seluruh halaman blog dan artikel publik.</span>
              </div>
              <input
                type="checkbox"
                checked={adSettings.globalEnableAds}
                onChange={(e) => setAdSettings({ ...adSettings, globalEnableAds: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Google Publisher ID */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                ID Publisher Google AdSense Resmi (Publisher ID)
              </label>
              <Input
                type="text"
                placeholder="ca-pub-9999999999999999"
                value={adSettings.adClient}
                onChange={(e) => setAdSettings({ ...adSettings, adClient: e.target.value })}
                icon={DollarSign}
                helperText="ID Publisher dari akun Google AdSense resmi Anda (contoh: ca-pub-XXXXXXXXXXXXXXXX)."
              />
            </div>

            {/* Grid Ad Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              <div>
                <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                  Slot ID Iklan Atas (Header Ad)
                </label>
                <Input
                  type="text"
                  placeholder="1234567890"
                  value={adSettings.headerAdSlot}
                  onChange={(e) => setAdSettings({ ...adSettings, headerAdSlot: e.target.value })}
                  helperText="Unit Iklan Header Top Banner."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                  Slot ID Iklan Tengah (In-Article Ad)
                </label>
                <Input
                  type="text"
                  placeholder="0987654321"
                  value={adSettings.inArticleAdSlot}
                  onChange={(e) => setAdSettings({ ...adSettings, inArticleAdSlot: e.target.value })}
                  helperText="Unit Iklan Otomatis Tengah Artikel."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                  Slot ID Iklan Bawah (Footer Ad)
                </label>
                <Input
                  type="text"
                  placeholder="1122334455"
                  value={adSettings.footerAdSlot}
                  onChange={(e) => setAdSettings({ ...adSettings, footerAdSlot: e.target.value })}
                  helperText="Unit Iklan Footer Bottom Banner."
                />
              </div>

            </div>

            {/* Save AdSense Button */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Save}
                loading={adSaving}
              >
                Simpan Pengaturan AdSense Global
              </Button>

              {adSavedMessage && (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Kredensial AdSense berhasil disimpan!
                </span>
              )}
            </div>

          </div>
        </form>
      )}

      {/* ADMIN ONLY: MASTER PROMPT AI GENERATOR (ADSENSE COMPLIANCE) */}
      {role === 'admin' && (
        <form onSubmit={handleSaveMasterPrompt} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
                  Master Prompt AI Generator (AdSense Compliance) ✨
                  <ShieldCheck className="w-4 h-4 text-blue-500" title="Khusus Role Admin" />
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Kustomisasi sistem perintah AI untuk kelayakan penayangan iklan Google AdSense</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Master Prompt ini digunakan oleh generator AI saat penulis membuat artikel baru. Instruksi ini menjamin gaya bahasa manusia yang natural (Human-Like Tone) dan secara ketat menghindari pelanggaran Google AdSense <em>"Low value content"</em>.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                Template Master Prompt AI
              </label>
              <textarea
                rows={10}
                value={masterPrompt}
                onChange={(e) => setMasterPrompt(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono leading-relaxed focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="submit"
                variant="purple"
                size="md"
                icon={Save}
                loading={promptSaving}
              >
                Simpan Master Prompt AI
              </Button>

              {promptSavedMessage && (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Template Master Prompt berhasil disimpan!
                </span>
              )}
            </div>
          </div>
        </form>
      )}

      {/* DATABASE KONEKSI STATUS */}
      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isFirebaseActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-main)]">Koneksi Database Firebase</h3>
              <p className="text-xs text-[var(--text-muted)]">Firestore Cloud Database SDK Status</p>
            </div>
          </div>

          <Badge variant={isFirebaseActive ? 'published' : 'draft'}>
            {isFirebaseActive ? 'Connected & Active' : 'Demo Local Mode'}
          </Badge>
        </div>

        <div className="space-y-4 text-xs text-[var(--text-muted)]">
          <p className="leading-relaxed">
            {isFirebaseActive
              ? 'Selamat! Kredensial Firebase di file .env Anda telah dikonfigurasi secara lengkap. Aplikasi berjalan penuh pada cloud Firestore.'
              : 'Saat ini aplikasi berjalan dalam Demo Local Storage Mode karena file .env masih berisi kredensial placeholder. Anda dapat langsung mencoba seluruh fitur blog dan dashboard tanpa error.'}
          </p>

          {!isFirebaseActive && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <h4 className="font-bold text-amber-500 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Cara Menghubungkan Firebase Asli:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--text-muted)]">
                <li>Buka konsol Firebase di <a href="https://console.firebase.google.com" target="_blank" className="text-blue-500 underline">console.firebase.google.com</a>.</li>
                <li>Buat proyek baru dan tambahkan Web App.</li>
                <li>Salin API Key, Auth Domain, Project ID, dan Storage Bucket ke file <code className="font-mono bg-[var(--bg-primary)] px-1 py-0.5 rounded">.env</code> di root folder proyek ini.</li>
                <li>Restart dev server dengan <code className="font-mono bg-[var(--bg-primary)] px-1 py-0.5 rounded">npm run dev</code>.</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[var(--text-main)]">Reset Data Sampel Demo</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Jika Anda ingin mengembalikan artikel, kategori, dan komentar ke sampel data default awal saat mencoba demo lokal.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleResetDemo}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reset Data Demo
          </button>

          {resetMessage && (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Data berhasil di-reset! Memuat ulang...
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
