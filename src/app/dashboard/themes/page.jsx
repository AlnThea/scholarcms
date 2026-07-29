'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/services/dbService';
import { THEMES_REGISTRY } from '@/themes';
import {
  Palette, CheckCircle, Sparkles, Upload, Download, Code, RefreshCw, Eye, Sliders, Layers, Save, HelpCircle
} from 'lucide-react';

export default function ThemesDashboardPage() {
  const { t } = useLanguage();
  const [activeThemeId, setActiveThemeId] = useState('modern');
  const [customizations, setCustomizations] = useState({
    primaryColor: '#2563eb',
    fontFamily: 'Inter',
    cardStyle: 'glassmorphism',
    customCss: ''
  });
  const [customPackages, setCustomPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'customizer' | 'import' | 'guide'

  useEffect(() => {
    loadThemeData();
  }, []);

  async function loadThemeData() {
    setLoading(true);
    try {
      const [themeSetting, packages] = await Promise.all([
        dbService.getActiveTheme(),
        dbService.getCustomThemePackages()
      ]);

      if (themeSetting?.activeThemeId) {
        setActiveThemeId(themeSetting.activeThemeId);
      }
      if (themeSetting?.customizations) {
        setCustomizations(prev => ({ ...prev, ...themeSetting.customizations }));
      }
      if (Array.isArray(packages)) {
        setCustomPackages(packages);
      }
    } catch (e) {
      console.warn('Error loading theme data:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleActivateTheme(themeId) {
    setSaving(true);
    try {
      await dbService.setActiveTheme(themeId);
      setActiveThemeId(themeId);
      setSuccessMsg(`Tema "${themeId}" berhasil diaktifkan!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      alert('Gagal mengaktifkan tema: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCustomizations(e) {
    e?.preventDefault();
    setSaving(true);
    try {
      await dbService.saveThemeCustomizations(customizations);
      setSuccessMsg('Kustomisasi tema berhasil disimpan!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      alert('Gagal menyimpan kustomisasi: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  // 1-Click JSON Theme Import
  async function handleJsonImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!json.name) {
        alert('File JSON tidak valid. Membutuhkan minimal field "name".');
        return;
      }

      const newPkg = {
        id: json.id || `custom-${Date.now()}`,
        name: json.name,
        description: json.description || 'Imported Custom Theme Package',
        author: json.author || 'Anonymous',
        version: json.version || '1.0.0',
        category: json.category || 'Custom',
        customizations: json.customizations || {},
        layoutConfig: json.layoutConfig || {}
      };

      await dbService.saveCustomThemePackage(newPkg);
      await loadThemeData();
      alert(`Paket tema "${newPkg.name}" berhasil diimpor!`);
    } catch (err) {
      alert('Gagal mengimpor file JSON tema: ' + err.message);
    }
  }

  // Export JSON Theme Package
  function handleExportTheme() {
    const currentThemeInfo = THEMES_REGISTRY.find(t => t.id === activeThemeId) || { name: activeThemeId };
    const exportData = {
      id: activeThemeId,
      name: currentThemeInfo.name,
      description: currentThemeInfo.description,
      author: currentThemeInfo.author,
      exportedAt: new Date().toISOString(),
      customizations
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholarcms-theme-${activeThemeId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const allThemeCards = [
    ...THEMES_REGISTRY,
    ...customPackages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      author: pkg.author,
      version: pkg.version,
      category: pkg.category || 'Custom Importer',
      previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      isCustom: true
    }))
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-6 h-6" />
            <h1 className="text-2xl font-black">{t('themesTitle')}</h1>
          </div>
          <p className="text-xs text-blue-100 max-w-xl">
            {t('themesSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTheme}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> {t('exportJsonPreset')}
          </button>
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
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
          }`}
        >
          <Layers className="w-4 h-4" /> {t('tabThemeCatalog')} ({allThemeCards.length})
        </button>
        <button
          onClick={() => setActiveTab('customizer')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'customizer'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
          }`}
        >
          <Sliders className="w-4 h-4" /> {t('tabVisualCustomizer')}
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'import'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
          }`}
        >
          <Upload className="w-4 h-4" /> {t('tabUploadJson')}
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'guide'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
          }`}
        >
          <Code className="w-4 h-4" /> {t('tabDevGuide')}
        </button>
      </div>

      {/* TAB 1: CATALOG GRID */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allThemeCards.map((theme) => {
            const isActive = theme.id === activeThemeId;
            return (
              <div
                key={theme.id}
                className={`rounded-3xl border transition-all overflow-hidden flex flex-col ${
                  isActive
                    ? 'border-blue-500 bg-[var(--bg-surface)] ring-4 ring-blue-500/10 shadow-xl'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-blue-500/40 shadow-sm'
                }`}
              >
                {/* Image Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={theme.previewImage}
                    alt={theme.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider">
                      {theme.category}
                    </span>
                    {theme.isCustom && (
                      <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider">
                        Custom Preset
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                      <CheckCircle className="w-3.5 h-3.5" /> {t('activeThemeBadge')}
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-main)] mb-1 flex items-center justify-between">
                      {theme.name}
                      <span className="text-xs font-normal text-[var(--text-subtle)]">v{theme.version}</span>
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--text-subtle)] font-medium">
                      {t('byAuthor')} {theme.author}
                    </span>

                    {isActive ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20 cursor-default"
                      >
                        {t('currentActiveTheme')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateTheme(theme.id)}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {saving ? t('activatingTheme') : t('activateThemeBtn')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: VISUAL CUSTOMIZER */}
      {activeTab === 'customizer' && (
        <form onSubmit={handleSaveCustomizations} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-8 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-500" /> {t('visualCustomizerTitle')} ({activeThemeId})
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {t('visualCustomizerHelp')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Accent Color */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] block">
                {t('primaryAccentColor')}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customizations.primaryColor || '#2563eb'}
                  onChange={e => setCustomizations({ ...customizations, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border-0 cursor-pointer bg-transparent"
                />
                <div className="flex items-center gap-2">
                  {['#2563eb', '#be123c', '#059669', '#7c3aed', '#d97706', '#0284c7'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCustomizations({ ...customizations, primaryColor: color })}
                      className="w-8 h-8 rounded-full border-2 border-white shadow transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Typography Font Family */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] block">
                {t('typographyFont')}
              </label>
              <select
                value={customizations.fontFamily || 'Inter'}
                onChange={e => setCustomizations({ ...customizations, fontFamily: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              >
                <option value="Inter">Inter (Clean Modern Sans)</option>
                <option value="Serif">Georgia / Serif (Editorial Classic Newspaper)</option>
                <option value="Outfit">Outfit (Tech Futuristic)</option>
                <option value="Roboto">Roboto (Google Standard)</option>
                <option value="Fira Code">Fira Code (Developer / Code Style)</option>
              </select>
            </div>

            {/* Card Style */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] block">
                {t('cardStyleLabel')}
              </label>
              <select
                value={customizations.cardStyle || 'glassmorphism'}
                onChange={e => setCustomizations({ ...customizations, cardStyle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              >
                <option value="glassmorphism">Glassmorphism (Efek Translucent + Soft Shadow)</option>
                <option value="flat">Flat Minimalist (Border Halus + Tanpa Shadow)</option>
                <option value="elevated">Elevated Shadow (Kartu Melayang Tegas)</option>
                <option value="classic">Classic Newspaper Border (Gaya Kertas Koran)</option>
              </select>
            </div>

            {/* Custom CSS Injector */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] block">
                {t('customCssLabel')}
              </label>
              <textarea
                rows={4}
                value={customizations.customCss || ''}
                onChange={e => setCustomizations({ ...customizations, customCss: e.target.value })}
                placeholder={t('customCssPlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-[var(--border-color)]">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? t('saving') : t('saveThemeCustomization')}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: IMPORT JSON PRESET */}
      {activeTab === 'import' && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" /> {t('uploadJsonTitle')}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {t('uploadJsonHelp')}
            </p>
          </div>

          <div className="border-2 border-dashed border-blue-500/30 rounded-3xl p-10 text-center bg-blue-500/5 hover:bg-blue-500/10 transition-all">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-base font-bold text-[var(--text-main)] mb-1">{t('chooseJsonFile')}</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-6">
              {t('chooseJsonHelp')}
            </p>
            <label className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-md hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2 transition-all">
              <Upload className="w-4 h-4" /> {t('uploadJsonBtn')}
              <input type="file" accept=".json" onChange={handleJsonImport} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* TAB 4: DEVELOPER GUIDE */}
      {activeTab === 'guide' && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm font-sans">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-500" /> {t('devGuideTitle')}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {t('devGuideHelp')}
            </p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-[var(--text-muted)]">
            <p>{t('devGuideStep1')}</p>
            <p>{t('devGuideStep2')}</p>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`export default function MyCustomTheme({
  posts = [],
  categories = [],
  selectedCategory = 'All',
  onSelectCategory = () => {},
  searchQuery = '',
  onSearch = () => {},
  loading = false,
  customizations = {}
}) {
  return (
    <div>
      {/* Custom Layout Structure */}
    </div>
  );
}`}
            </pre>
            <p>{t('devGuideStep3')}</p>
            <p>{t('devGuideStep4')}</p>
          </div>
        </div>
      )}

    </div>
  );
}
