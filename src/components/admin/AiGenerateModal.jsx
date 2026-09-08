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
import { useAiGenerateActions } from './useAiGenerateActions';
import AiPromptForm from './AiPromptForm';
import AiModelSelector from './AiModelSelector';

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

  const actions = useAiGenerateActions(state, user, appLang, onGenerateSuccess, onClose);
  const {
    handleSaveApiKey, handleAnalyzeNiches, handleLanguageChange,
    handleTopicChange, handleSelectRecommendedNiche, handleSubmit
  } = actions;

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
          <AiModelSelector state={state} language={language} appLang={appLang} />

          
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
