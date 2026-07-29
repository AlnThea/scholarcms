'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { Database, RefreshCw, CheckCircle, AlertTriangle, DollarSign, Save, ShieldCheck, Sparkles } from 'lucide-react';

export default function DashboardSettingsPage() {
  const { t } = useLanguage();
  const { role } = useAuth();
  const isFirebaseActive = dbService.isRealFirebase();
  const [resetMessage, setResetMessage] = useState(false);

  // General Site & Registration States for Admin
  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: 'ByteLab',
    siteTagline: 'Empowering AI, Machine Learning & Modern Web Development',
    allowRegistration: true,
  });
  const [generalSaving, setGeneralSaving] = useState(false);
  const [generalSavedMessage, setGeneralSavedMessage] = useState(false);

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
    async function fetchSettingsData() {
      try {
        const [adData, genData] = await Promise.all([
          dbService.getAdSenseSettings(),
          dbService.getGeneralSettings()
        ]);
        if (adData) setAdSettings(adData);
        if (genData) setGeneralSettings(genData);
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    fetchSettingsData();
    if (typeof window !== 'undefined') {
      const { aiService } = require('@/services/aiService');
      setMasterPrompt(aiService.getMasterPrompt());
    }
  }, []);

  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    setGeneralSaving(true);
    await dbService.saveGeneralSettings(generalSettings);
    setGeneralSaving(false);
    setGeneralSavedMessage(true);
    setTimeout(() => setGeneralSavedMessage(false), 3000);
  };

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
    if (confirm(t('resetConfirm'))) {
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
        title={t('settingsTitle')}
        subtitle={t('settingsSubtitle')}
      />

      {/* ADMIN ONLY: GENERAL SITE & REGISTRATION SETTINGS */}
      {role === 'admin' && (
        <form onSubmit={handleSaveGeneralSettings} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
                  {t('siteIdentityHeader')}
                  <ShieldCheck className="w-4 h-4 text-blue-500" title={t('adminOnlyBadgeTitle')} />
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{t('siteIdentityHelp')}</p>
              </div>
            </div>

            <Badge variant={generalSettings.allowRegistration ? 'published' : 'draft'}>
              {generalSettings.allowRegistration ? t('regOpenBadge') : t('regClosedBadge')}
            </Badge>
          </div>

          <div className="space-y-5">
            
            {/* Grid Site Title & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                  {t('siteTitleLabel')}
                </label>
                <Input
                  type="text"
                  placeholder="ScholarCMS"
                  value={generalSettings.siteTitle || ''}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteTitle: e.target.value })}
                  helperText={t('siteTitleHelp')}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                  {t('siteTaglineLabel')}
                </label>
                <Input
                  type="text"
                  placeholder="Modern Publishing Platform"
                  value={generalSettings.siteTagline || ''}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteTagline: e.target.value })}
                  helperText={t('siteTaglineHelp')}
                />
              </div>
            </div>

            {/* Registration Switch */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] flex items-center justify-between gap-4">
              <div>
                <span className="block font-bold text-xs text-[var(--text-main)]">{t('allowRegLabel')}</span>
                <span className="block text-[11px] text-[var(--text-muted)]">{t('allowRegHelp')}</span>
              </div>
              <input
                type="checkbox"
                checked={generalSettings.allowRegistration}
                onChange={(e) => setGeneralSettings({ ...generalSettings, allowRegistration: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Save}
                loading={generalSaving}
              >
                {t('saveSiteIdentityBtn')}
              </Button>

              {generalSavedMessage && (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> {t('siteIdentitySavedSuccess')}
                </span>
              )}
            </div>
          </div>
        </form>
      )}

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
                  {t('globalAdSenseHeader')}
                  <ShieldCheck className="w-4 h-4 text-blue-500" title={t('adminOnlyBadgeTitle')} />
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{t('globalAdSenseHelp')}</p>
              </div>
            </div>

            <Badge variant={adSettings.globalEnableAds ? 'published' : 'draft'}>
              {adSettings.globalEnableAds ? t('globalAdsOn') : t('globalAdsOff')}
            </Badge>
          </div>

          <div className="space-y-5">
            
            {/* Global Ads Switch */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] flex items-center justify-between gap-4">
              <div>
                <span className="block font-bold text-xs text-[var(--text-main)]">{t('enableGlobalAdsLabel')}</span>
                <span className="block text-[11px] text-[var(--text-muted)]">{t('enableGlobalAdsHelp')}</span>
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
                {t('publisherIdLabel')}
              </label>
              <Input
                type="text"
                placeholder="ca-pub-9999999999999999"
                value={adSettings.adClient}
                onChange={(e) => setAdSettings({ ...adSettings, adClient: e.target.value })}
                icon={DollarSign}
                helperText={t('publisherIdHelp')}
              />
            </div>

            {/* Grid Ad Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              <div>
                <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                  {t('headerAdSlotLabel')}
                </label>
                <Input
                  type="text"
                  placeholder="1234567890"
                  value={adSettings.headerAdSlot}
                  onChange={(e) => setAdSettings({ ...adSettings, headerAdSlot: e.target.value })}
                  helperText={t('headerAdSlotHelp')}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                  {t('inArticleAdSlotLabel')}
                </label>
                <Input
                  type="text"
                  placeholder="0987654321"
                  value={adSettings.inArticleAdSlot}
                  onChange={(e) => setAdSettings({ ...adSettings, inArticleAdSlot: e.target.value })}
                  helperText={t('inArticleAdSlotHelp')}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                  {t('footerAdSlotLabel')}
                </label>
                <Input
                  type="text"
                  placeholder="1122334455"
                  value={adSettings.footerAdSlot}
                  onChange={(e) => setAdSettings({ ...adSettings, footerAdSlot: e.target.value })}
                  helperText={t('footerAdSlotHelp')}
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
                {t('saveAdSenseBtn')}
              </Button>

              {adSavedMessage && (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> {t('adSenseSavedSuccess')}
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
                  {t('masterPromptHeader')}
                  <ShieldCheck className="w-4 h-4 text-blue-500" title={t('adminOnlyBadgeTitle')} />
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{t('masterPromptSubtitle')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {t('masterPromptDesc')}
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                {t('masterPromptLabel')}
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
                {t('saveMasterPromptBtn')}
              </Button>

              {promptSavedMessage && (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> {t('promptSavedSuccess')}
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
              <h3 className="font-extrabold text-base text-[var(--text-main)]">{t('dbConnectionHeader')}</h3>
              <p className="text-xs text-[var(--text-muted)]">{t('dbStatusSub')}</p>
            </div>
          </div>

          <Badge variant={isFirebaseActive ? 'published' : 'draft'}>
            {isFirebaseActive ? 'Connected & Active' : 'Demo Local Mode'}
          </Badge>
        </div>

        <div className="space-y-4 text-xs text-[var(--text-muted)]">
          <p className="leading-relaxed">
            {isFirebaseActive
              ? t('dbActiveText')
              : t('dbDemoText')}
          </p>

          {!isFirebaseActive && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <h4 className="font-bold text-amber-500 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> {t('howToConnectFirebase')}
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--text-muted)]">
                <li>{t('firebaseStep1')}</li>
                <li>{t('firebaseStep2')}</li>
                <li>{t('firebaseStep3')}</li>
                <li>{t('firebaseStep4')}</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[var(--text-main)]">{t('resetDemoTitle')}</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('resetDemoDesc')}
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleResetDemo}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> {t('resetDemoBtn')}
          </button>

          {resetMessage && (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> {t('resetDemoSuccess')}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
