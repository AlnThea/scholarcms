'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import { useAuth } from '@/context/AuthContext';

import GeneralSettingsPanel from '@/components/admin/settings/GeneralSettingsPanel';
import AdsenseSettingsPanel from '@/components/admin/settings/AdsenseSettingsPanel';
import AiSettingsPanel from '@/components/admin/settings/AiSettingsPanel';
import DatabaseStatusPanel from '@/components/admin/settings/DatabaseStatusPanel';

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

  // AI Master Prompt, Model & Provider States
  const [aiProvider, setAiProvider] = useState('gemini');
  const [masterPrompt, setMasterPrompt] = useState('');
  const [promptSaving, setPromptSaving] = useState(false);
  const [promptSavedMessage, setPromptSavedMessage] = useState(false);

  const [selectedAiModel, setSelectedAiModel] = useState('gemini-1.5-flash');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const [selectedOpenRouterModel, setSelectedOpenRouterModel] = useState('google/gemini-2.0-flash-exp:free');
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');

  const [aiConfigSaving, setAiConfigSaving] = useState(false);
  const [aiConfigSavedMessage, setAiConfigSavedMessage] = useState(false);

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
      setAiProvider(aiService.getProvider());
      setMasterPrompt(aiService.getMasterPrompt());
      setSelectedAiModel(aiService.getSelectedModel());
      setGeminiApiKey(localStorage.getItem('gemini_api_key') || '');
      setSelectedOpenRouterModel(aiService.getOpenRouterModel());
      setOpenRouterApiKey(localStorage.getItem('openrouter_api_key') || '');
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

  const handleSaveAiConfig = (e) => {
    e.preventDefault();
    setAiConfigSaving(true);
    const { aiService } = require('@/services/aiService');
    aiService.saveProvider(aiProvider);
    aiService.saveSelectedModel(selectedAiModel);
    aiService.saveOpenRouterModel(selectedOpenRouterModel);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', geminiApiKey.trim());
      localStorage.setItem('openrouter_api_key', openRouterApiKey.trim());
    }
    setAiConfigSaving(false);
    setAiConfigSavedMessage(true);
    setTimeout(() => setAiConfigSavedMessage(false), 3000);
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

      <GeneralSettingsPanel 
        t={t}
        role={role}
        generalSettings={generalSettings}
        setGeneralSettings={setGeneralSettings}
        handleSaveGeneralSettings={handleSaveGeneralSettings}
        generalSaving={generalSaving}
        generalSavedMessage={generalSavedMessage}
      />

      <AdsenseSettingsPanel 
        t={t}
        role={role}
        adSettings={adSettings}
        setAdSettings={setAdSettings}
        handleSaveAdSense={handleSaveAdSense}
        adSaving={adSaving}
        adSavedMessage={adSavedMessage}
      />

      <AiSettingsPanel 
        t={t}
        role={role}
        aiProvider={aiProvider}
        setAiProvider={setAiProvider}
        selectedAiModel={selectedAiModel}
        setSelectedAiModel={setSelectedAiModel}
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
        selectedOpenRouterModel={selectedOpenRouterModel}
        setSelectedOpenRouterModel={setSelectedOpenRouterModel}
        openRouterApiKey={openRouterApiKey}
        setOpenRouterApiKey={setOpenRouterApiKey}
        handleSaveAiConfig={handleSaveAiConfig}
        aiConfigSaving={aiConfigSaving}
        aiConfigSavedMessage={aiConfigSavedMessage}
        masterPrompt={masterPrompt}
        setMasterPrompt={setMasterPrompt}
        handleSaveMasterPrompt={handleSaveMasterPrompt}
        promptSaving={promptSaving}
        promptSavedMessage={promptSavedMessage}
      />

      <DatabaseStatusPanel 
        t={t}
        isFirebaseActive={isFirebaseActive}
        handleResetDemo={handleResetDemo}
        resetMessage={resetMessage}
      />

    </div>
  );
}
