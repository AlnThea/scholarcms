'use client';

import { useState, useEffect } from 'react';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Sparkles, X, Globe, Tag, BookOpen, ShieldCheck, Feather, Cpu, Search, TrendingUp, DollarSign, CheckCircle2, MessageSquareCode, SlidersHorizontal, FileText, AlertTriangle, Key } from 'lucide-react';
import { useAiGenerateState } from './useAiGenerateState';
import AiPromptForm from './AiPromptForm';

export default function AiGenerateModal({ isOpen, onClose, onGenerateSuccess }) {
  const { user } = useAuth();
  const { t, language: appLang } = useLanguage();
  const state = useAiGenerateState(isOpen, appLang);
  const {
    inputMode, setInputMode,
    topic, setTopic,
    customPrompt, setCustomPrompt,
    niche, setNiche,
    subCategory, setSubCategory,
    language, setLanguage,
    tone, setTone,
    length, setLength,
    loading, setLoading,
    analyzingNiches, setAnalyzingNiches,
    recommendedNiches, setRecommendedNiches,
    selectedNicheId, setSelectedNicheId,
    isFirstArticle, setIsFirstArticle,
    provider,
    errorType, setErrorType,
    errorMessage, setErrorMessage,
    apiKeyInput, setApiKeyInput,
    openRouterKeyInput, setOpenRouterKeyInput,
    showApiKeyInput, setShowApiKeyInput,
    selectedModel,
    isCustomModel,
    customModelInput,
    selectedOpenRouterModel,
    isCustomOpenRouterModel,
    customOpenRouterModelInput,
    handleProviderChange,
    handleModelChange,
    handleCustomModelSave,
    handleOpenRouterModelChange,
    handleCustomOpenRouterModelSave,
  } = state;

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    if (provider === 'openrouter') {
      if (!openRouterKeyInput.trim()) return;
      if (typeof window !== 'undefined') {
        localStorage.setItem('openrouter_api_key', openRouterKeyInput.trim());
      }
    } else {
      if (!apiKeyInput.trim()) return;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gemini_api_key', apiKeyInput.trim());
      }
    }
    setErrorType(null);
    setErrorMessage('');
    setShowApiKeyInput(false);
  };

  const processError = (err) => {
    console.error('AI Error:', err);
    const isEn = language === 'english' || appLang === 'en';
    if (err.message === 'OPENROUTER_API_KEY_MISSING') {
      setErrorType('OPENROUTER_API_KEY_MISSING');
      setErrorMessage(
        isEn
          ? 'OpenRouter API Key is missing. Please enter your OpenRouter Key below (Get a free key at openrouter.ai/keys).'
          : 'OpenRouter API Key belum dimasukkan. Silakan masukkan API Key OpenRouter Anda di bawah ini (Dapatkan gratis di openrouter.ai/keys).'
      );
      setShowApiKeyInput(true);
    } else if (err.message === 'API_KEY_MISSING') {
      setErrorType('API_KEY_MISSING');
      setErrorMessage(
        isEn
          ? 'Google Gemini API Key is missing. Please enter your API Key below.'
          : 'Google Gemini API Key belum dimasukkan. Silakan masukkan API Key Anda di bawah ini.'
      );
      setShowApiKeyInput(true);
    } else if (err.message === 'QUOTA_EXCEEDED') {
      setErrorType('QUOTA_EXCEEDED');
      setErrorMessage(
        isEn
          ? 'Google Gemini API quota exceeded or rate limited (Error 429: Rate Limit Exceeded). Please wait a moment or update your API Key.'
          : 'Kuota Google Gemini API telah habis / terlalu banyak permintaan (Error 429: Rate Limit Exceeded). Silakan tunggu beberapa saat atau perbarui API Key Anda.'
      );
    } else if (err.message === 'INVALID_API_KEY') {
      setErrorType('INVALID_API_KEY');
      setErrorMessage(
        isEn
          ? 'Google Gemini API Key is invalid or rejected (Error 400/403). Please verify your API Key.'
          : 'Gemini API Key tidak valid atau ditolak oleh Google (Error 400/403). Silakan periksa kembali API Key Anda.'
      );
      setShowApiKeyInput(true);
    } else if (err.message === 'SERVICE_OVERLOADED_503') {
      setErrorType('SERVICE_OVERLOADED_503');
      setErrorMessage(
        isEn
          ? 'Google Gemini API servers are temporarily overloaded (Error 503: Service Unavailable). Please wait a few seconds and try again.'
          : 'Layanan server Google Gemini sedang sibuk / overloaded (Error 503: Service Unavailable). Silakan tunggu beberapa detik dan klik coba lagi.'
      );
    } else if (err.message === 'OPENROUTER_CREDITS_REQUIRED') {
      setErrorType('OPENROUTER_CREDITS_REQUIRED');
      setErrorMessage(
        isEn
          ? 'OpenRouter free credits limit reached for this model (Error 402). Please select "OpenRouter Auto Router" or switch to "Google Gemini SDK (Free Tier)".'
          : 'Batas kredit gratis OpenRouter tercapai untuk model ini (Error 402). Silakan pilih "OpenRouter Auto Router" atau beralih ke "Google Gemini SDK (Free Tier)".'
      );
    } else {
      setErrorType('API_ERROR');
      setErrorMessage(
        isEn
          ? (err.message || 'Failed to connect to Google Gemini API. Please check your internet connection or API Key.')
          : (err.message || 'Gagal menghubungi Google Gemini API. Silakan periksa koneksi internet atau masukan API Key Anda.')
      );
    }
  };

  const handleAnalyzeNiches = async (selectedLang = language) => {
    setAnalyzingNiches(true);
    setErrorType(null);
    setErrorMessage('');
    try {
      const targetSearchNiche = isFirstArticle ? '' : niche;
      const niches = await aiService.analyzeTrendingNiches(targetSearchNiche, selectedLang);
      setRecommendedNiches(niches || []);
    } catch (err) {
      processError(err);
    } finally {
      setAnalyzingNiches(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setNiche(prev => aiService.normalizeParentNiche(prev, newLang));
    if (recommendedNiches.length > 0) {
      handleAnalyzeNiches(newLang);
    }
  };

  const detectToneFromTopic = (text) => {
    const t = (text || '').toLowerCase();
    if (t.includes('panduan') || t.includes('tutorial') || t.includes('cara') || t.includes('step')) {
      return 'Edukatif & Tutorial Step-by-Step';
    }
    if (t.includes('analisis') || t.includes('prediksi') || t.includes('studi') || t.includes('riset') || t.includes('pasar') || t.includes('tren')) {
      return 'Analitis & Mendalam';
    }
    if (t.includes('tips') || t.includes('rahasia') || t.includes('trik') || t.includes('santai') || t.includes('opini') || t.includes('gaya')) {
      return 'Casual & Komunikatif';
    }
    return 'Professional & Informatif';
  };

  const handleTopicChange = (newTopic) => {
    setTopic(newTopic);
  };

  const handleSelectRecommendedNiche = (item) => {
    setSelectedNicheId(item.id);
    const parentNiche = aiService.normalizeParentNiche(item.niche);
    setNiche(parentNiche);
    if (item.subBranch) {
      setSubCategory(item.subBranch);
    }
    setTopic(item.sampleTopic);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetTopic = inputMode === 'prompt' ? customPrompt : topic;
    if (!targetTopic.trim()) return;

    setLoading(true);
    setErrorType(null);
    setErrorMessage('');
    try {
      const parentNiche = aiService.normalizeParentNiche(niche);
      const finalTone = tone === 'auto' ? detectToneFromTopic(targetTopic) : tone;
      
      const authorObj = user ? {
        name: user.name || 'Penulis ScholarCMS',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: user.titleRole || (user.role === 'admin' ? 'Chief Software Architect' : 'Senior Tech Writer')
      } : null;

      const result = await aiService.generateArticle({
        topic: targetTopic,
        customPrompt: inputMode === 'prompt' ? customPrompt : '',
        niche: parentNiche,
        subCategory,
        language,
        tone: finalTone,
        length,
        author: authorObj
      });

      if (result && onGenerateSuccess) {
        onGenerateSuccess(result);
        onClose();
      }
    } catch (err) {
      processError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
                {t('aiModalTitle')}
              </h3>
              <p className="text-xs text-[var(--text-subtle)]">{t('aiModalSubtitle')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Banner & API Key Input */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-snug">{errorMessage}</p>
              </div>
              <button onClick={() => setErrorMessage('')} className="p-1 text-rose-400 hover:text-rose-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {showApiKeyInput && (
              <div className="pt-2 border-t border-rose-500/20 space-y-2">
                <label className="block text-[11px] font-bold uppercase text-[var(--text-main)] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-500" />
                  {provider === 'openrouter'
                    ? (language === 'english' || appLang === 'en' ? 'Enter Your OpenRouter API Key:' : 'Masukkan OpenRouter API Key Anda:')
                    : (language === 'english' || appLang === 'en' ? 'Enter Your Google Gemini API Key:' : 'Masukkan Google Gemini API Key Anda:')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder={provider === 'openrouter' ? 'sk-or-v1-...' : 'AIzaSy...'}
                    value={provider === 'openrouter' ? openRouterKeyInput : apiKeyInput}
                    onChange={(e) => provider === 'openrouter' ? setOpenRouterKeyInput(e.target.value) : setApiKeyInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shrink-0"
                  >
                    {language === 'english' || appLang === 'en' ? 'Save API Key' : 'Simpan API Key'}
                  </button>
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {provider === 'openrouter' ? (
                    <>
                      {language === 'english' || appLang === 'en'
                        ? 'Get a free OpenRouter API Key at '
                        : 'Dapatkan OpenRouter API Key gratis di '}
                      <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline font-bold">
                        openrouter.ai/keys
                      </a>
                      {language === 'english' || appLang === 'en' ? '. Key will be stored securely in your browser.' : '. Key akan tersimpan aman di browser Anda.'}
                    </>
                  ) : (
                    <>
                      {language === 'english' || appLang === 'en'
                        ? 'Get a free official Gemini API Key at '
                        : 'Dapatkan Gemini API Key resmi secara gratis di '}
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline font-bold">
                        Google AI Studio
                      </a>
                      {language === 'english' || appLang === 'en' ? '. Key will be stored securely in your browser.' : '. Key akan tersimpan aman di browser Anda.'}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status Badge: Artikel Pertama vs Niche Situs Terkunci */}
        <div className="px-5 pt-3">
          {isFirstArticle ? (
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-[11px]">
                {t('aiFirstArticleNotice')}
              </span>
              <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-md font-semibold">{t('aiFirstArticleBadge')}</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-[11px]">
                {t('aiLockedNicheNotice')} {niche || 'Teknologi'}
              </span>
              <button
                type="button"
                onClick={() => {
                  aiService.clearEstablishedNiche();
                  setIsFirstArticle(true);
                }}
                className="text-[10px] text-amber-500 underline hover:text-amber-400 font-semibold"
              >
                {t('aiChangeNicheBtn')}
              </button>
            </div>
          )}
        </div>

        {/* Mode Selector Tabs: Niche Recommendation vs Custom Prompt */}
        <div className="px-5 pt-3">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setInputMode('niche')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                inputMode === 'niche'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> {t('aiModeNicheTab')}
            </button>
            <button
              type="button"
              onClick={() => setInputMode('prompt')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                inputMode === 'prompt'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <MessageSquareCode className="w-4 h-4" /> {t('aiModePromptTab')}
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Provider & Model Selector Banner */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-color)]">
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-500" /> AI Provider Engine:
              </span>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleProviderChange('gemini')}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    provider === 'gemini'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  ⚡ Google Gemini
                </button>
                <button
                  type="button"
                  onClick={() => handleProviderChange('openrouter')}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    provider === 'openrouter'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  🌐 OpenRouter (Free Tier)
                </button>
              </div>
            </div>

            {provider === 'openrouter' ? (
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="block font-bold text-xs text-[var(--text-main)]">OpenRouter Model (Free)</span>
                    <span className="block text-[10px] text-[var(--text-muted)]">
                      {language === 'english' || appLang === 'en'
                        ? 'Select free model via OpenRouter API network'
                        : 'Pilihan model gratis dari jaringan OpenRouter'}
                    </span>
                  </div>
                  <select
                    value={isCustomOpenRouterModel ? 'custom' : selectedOpenRouterModel}
                    onChange={(e) => handleOpenRouterModelChange(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0 cursor-pointer"
                  >
                    <option value="openrouter/auto">🤖 OpenRouter Auto Router (Rekomendasi Auto Free)</option>
                    <option value="google/gemini-2.5-flash">⚡ Gemini 2.5 Flash</option>
                    <option value="meta-llama/llama-3.3-70b-instruct">🦙 Meta Llama 3.3 70B</option>
                    <option value="deepseek/deepseek-r1">🐳 DeepSeek R1 Reasoning</option>
                    <option value="qwen/qwen-2.5-72b-instruct">🌐 Qwen 2.5 72B</option>
                    <option value="custom">✏️ {language === 'english' || appLang === 'en' ? 'Custom OpenRouter Model...' : 'Input Custom Model (Ketik Manual)...'}</option>
                  </select>
                </div>

                {isCustomOpenRouterModel && (
                  <div className="pt-2 border-t border-[var(--border-color)] flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. google/gemini-2.0-flash-exp:free"
                      value={customOpenRouterModelInput}
                      onChange={(e) => handleCustomOpenRouterModelSave(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] font-bold text-emerald-500">{language === 'english' || appLang === 'en' ? 'Active Model' : 'Model Aktif'}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="block font-bold text-xs text-[var(--text-main)]">Google Gemini Model (SDK)</span>
                    <span className="block text-[10px] text-[var(--text-muted)]">
                      {language === 'english' || appLang === 'en'
                        ? 'Select model version to process topic research & article generation'
                        : 'Pilihan versi model yang akan memproses riset & generasi artikel'}
                    </span>
                  </div>
                  <select
                    value={isCustomModel ? 'custom' : selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0 cursor-pointer"
                  >
                    <option value="gemini-1.5-flash">🌐 Gemini 1.5 Flash ({language === 'english' || appLang === 'en' ? 'Standard Free Quota' : 'Efisien Standard'})</option>
                    <option value="gemini-1.5-pro">🧠 Gemini 1.5 Pro ({language === 'english' || appLang === 'en' ? 'Deep Reasoning' : 'Penalaran Mendalam'})</option>
                    <option value="gemini-2.5-flash">⚡ Gemini 2.5 Flash ({language === 'english' || appLang === 'en' ? 'Fastest & Main' : 'Tercepat & Utama'})</option>
                    <option value="gemini-2.0-flash">🚀 Gemini 2.0 Flash</option>
                    <option value="gemini-2.0-flash-lite">💨 Gemini 2.0 Flash Lite ({language === 'english' || appLang === 'en' ? 'Light & Fast' : 'Ringan & Cepat'})</option>
                    <option value="gemini-flash-latest">✨ Gemini Flash Latest ({language === 'english' || appLang === 'en' ? 'Auto Latest Flash' : 'Versi Terbaru Otomatis'})</option>
                    <option value="gemini-pro-latest">🔮 Gemini Pro Latest ({language === 'english' || appLang === 'en' ? 'Auto Latest Pro' : 'Versi Pro Terbaru Otomatis'})</option>
                    <option value="custom">✏️ {language === 'english' || appLang === 'en' ? 'Custom Model Input (Type Manual)...' : 'Input Custom Model (Ketik Manual)...'}</option>
                  </select>
                </div>

                {isCustomModel && (
                  <div className="pt-2 border-t border-[var(--border-color)] flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={language === 'english' || appLang === 'en' ? 'Type model name (e.g. gemini-1.5-flash)...' : 'Ketik nama model (cth: gemini-1.5-flash)...'}
                      value={customModelInput}
                      onChange={(e) => handleCustomModelSave(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-[10px] font-bold text-purple-500">{language === 'english' || appLang === 'en' ? 'Active Model' : 'Model Aktif'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <AiPromptForm
            t={t}
            language={language}
            appLang={appLang}
            state={state}
            handleAnalyzeNiches={handleAnalyzeNiches}
            handleSelectRecommendedNiche={handleSelectRecommendedNiche}
            handleLanguageChange={handleLanguageChange}
          />

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              {t('cancel')}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              icon={Sparkles}
              loading={loading}
              onClick={handleSubmit}
            >
              {loading ? t('aiGenerating') : t('aiGenerateBtn')}
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
