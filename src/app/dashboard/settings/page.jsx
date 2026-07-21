'use client';

import { useState } from 'react';
import { dbService } from '@/services/dbService';
import { Database, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DashboardSettingsPage() {
  const isFirebaseActive = dbService.isRealFirebase();
  const [resetMessage, setResetMessage] = useState(false);

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
      
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--text-main)]">Pengaturan CMS & Database</h2>
        <p className="text-xs text-[var(--text-muted)]">Periksa status koneksi Firebase dan atur preferensi situs blog Anda.</p>
      </div>

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

          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
            isFirebaseActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}>
            {isFirebaseActive ? 'Connected & Active' : 'Demo Local Mode'}
          </span>
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
