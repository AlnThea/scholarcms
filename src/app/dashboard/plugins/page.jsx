'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { PLUGINS_REGISTRY } from '@/plugins';
import {
  Puzzle, CheckCircle, ToggleLeft, ToggleRight, ExternalLink, Upload, Code, RefreshCw, Layers, Settings
} from 'lucide-react';
import Link from 'next/link';

export default function PluginsDashboardPage() {
  const [pluginStates, setPluginStates] = useState({});
  const [customPackages, setCustomPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('catalog');

  useEffect(() => {
    loadPluginData();
  }, []);

  async function loadPluginData() {
    setLoading(true);
    try {
      const [states, packages] = await Promise.all([
        dbService.getPluginStates(),
        dbService.getCustomPluginPackages()
      ]);
      setPluginStates(states || {});
      setCustomPackages(packages || []);
    } catch (e) {
      console.warn('Error loading plugin data:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePlugin(pluginId, currentStatus) {
    const nextStatus = !currentStatus;
    setToggling(prev => ({ ...prev, [pluginId]: true }));
    try {
      await dbService.togglePluginStatus(pluginId, nextStatus);
      setPluginStates(prev => ({ ...prev, [pluginId]: nextStatus }));
      setSuccessMsg(`Status plugin "${pluginId}" berhasil diubah menjadi ${nextStatus ? 'AKTIF (ON)' : 'NONAKTIF (OFF)'}!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Gagal mengubah status plugin: ' + err.message);
    } finally {
      setToggling(prev => ({ ...prev, [pluginId]: false }));
    }
  }

  // 1-Click JSON Plugin Import
  async function handleJsonImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!json.name || !json.id) {
        alert('File JSON plugin tidak valid. Membutuhkan field "name" dan "id".');
        return;
      }

      const newPkg = {
        id: json.id,
        name: json.name,
        description: json.description || 'Imported Custom Plugin Package',
        author: json.author || 'Anonymous',
        version: json.version || '1.0.0',
        category: json.category || 'Custom Extension',
        routePath: json.routePath || json.id,
        navLabel: json.navLabel || json.name
      };

      await dbService.saveCustomPluginPackage(newPkg);
      await loadPluginData();
      alert(`Paket plugin "${newPkg.name}" berhasil diimpor!`);
    } catch (err) {
      alert('Gagal mengimpor file JSON plugin: ' + err.message);
    }
  }

  const allPluginCards = [
    ...PLUGINS_REGISTRY,
    ...customPackages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      author: pkg.author,
      version: pkg.version,
      category: pkg.category || 'Custom Plugin',
      routePath: pkg.routePath || pkg.id,
      navLabel: pkg.navLabel || pkg.name,
      icon: Puzzle,
      isCustom: true
    }))
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Puzzle className="w-6 h-6" />
            <h1 className="text-2xl font-black">Pengelola Plugin Blog</h1>
          </div>
          <p className="text-xs text-purple-100 max-w-xl">
            Aktifkan atau matikan ekstensi plugin tambahan, tambahkan rute dashboard baru, atau impor paket plugin JSON langsung di Vercel.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5" /> {successMsg}
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
          }`}
        >
          <Layers className="w-4 h-4" /> Katalog Plugin ({allPluginCards.length})
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'import'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
          }`}
        >
          <Upload className="w-4 h-4" /> Upload Preset Plugin (.json)
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'guide'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
          }`}
        >
          <Code className="w-4 h-4" /> Panduan Developer
        </button>
      </div>

      {/* TAB 1: CATALOG GRID */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPluginCards.map((plugin) => {
            const isEnabled = pluginStates[plugin.id] !== false;
            const Icon = plugin.icon || Puzzle;
            const isBusy = toggling[plugin.id];

            return (
              <div
                key={plugin.id}
                className={`rounded-3xl border transition-all p-6 flex flex-col justify-between space-y-4 ${
                  isEnabled
                    ? 'border-purple-500/50 bg-[var(--bg-surface)] ring-2 ring-purple-500/10 shadow-lg'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] opacity-75 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => handleTogglePlugin(plugin.id, isEnabled)}
                      disabled={isBusy}
                      className="flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
                      title={isEnabled ? 'Klik untuk mematikan plugin' : 'Klik untuk mengaktifkan plugin'}
                    >
                      {isEnabled ? (
                        <ToggleRight className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-400" />
                      )}
                      <span className={`text-xs font-bold ${isEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {isEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 text-[10px] font-bold uppercase tracking-wider">
                      {plugin.category}
                    </span>
                    {plugin.isCustom && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                        Custom JSON
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-main)] mt-1 flex items-center justify-between">
                    {plugin.name}
                    <span className="text-xs font-normal text-[var(--text-subtle)]">v{plugin.version}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed mt-2">
                    {plugin.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-subtle)] font-medium">
                    Oleh: {plugin.author}
                  </span>

                  {isEnabled && plugin.routePath && (
                    <Link
                      href={`/dashboard/${plugin.routePath}`}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow hover:bg-purple-700 transition-all flex items-center gap-1"
                    >
                      Buka Page <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: IMPORT JSON PRESET */}
      {activeTab === 'import' && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-500" /> Upload Paket Plugin (.json)
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Impor paket plugin kustom (.json) buatan orang lain secara instan tanpa perlu rebuild di Vercel.
            </p>
          </div>

          <div className="border-2 border-dashed border-purple-500/30 rounded-3xl p-10 text-center bg-purple-500/5 hover:bg-purple-500/10 transition-all">
            <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-base font-bold text-[var(--text-main)] mb-1">Pilih File Paket Plugin (.json)</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-6">
              Klik tombol di bawah ini untuk memilih file JSON plugin dari komputer Anda.
            </p>
            <label className="px-6 py-3 rounded-xl bg-purple-600 text-white text-sm font-bold shadow-md hover:bg-purple-700 cursor-pointer inline-flex items-center gap-2 transition-all">
              <Upload className="w-4 h-4" /> Upload File JSON Plugin
              <input type="file" accept=".json" onChange={handleJsonImport} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* TAB 3: DEVELOPER GUIDE */}
      {activeTab === 'guide' && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm font-sans">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-500" /> Panduan Developer: Cara Membuat Plugin Baru
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Instruksi teknis bagi pengembang yang ingin membuat struktur komponen React plugin baru di ScholarCMS.
            </p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-[var(--text-muted)]">
            <p>1. Buat folder plugin baru di <code className="px-2 py-1 rounded bg-[var(--bg-primary)] font-mono text-purple-500">src/plugins/[nama-plugin]/index.jsx</code>.</p>
            <p>2. Buat komponen Halaman UI Plugin React:</p>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`export default function MyCustomPluginPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Plugin Kustom Saya</h1>
    </div>
  );
}`}
            </pre>
            <p>3. Daftarkan plugin Anda pada <code className="px-2 py-1 rounded bg-[var(--bg-primary)] font-mono text-purple-500">src/plugins/index.js</code> di dalam array <code className="font-mono text-purple-500">PLUGINS_REGISTRY</code>.</p>
            <p>4. Rute halaman plugin Anda secara otomatis tersedia di <code className="px-2 py-1 rounded bg-[var(--bg-primary)] font-mono text-purple-500">/dashboard/[routePath]</code> melalui Dynamic Catch-All Plugin Router!</p>
          </div>
        </div>
      )}

    </div>
  );
}
