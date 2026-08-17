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

export default function AiGenerateModal({ isOpen, onClose, onGenerateSuccess }) {
  const { user } = useAuth();
  const { t, language: appLang } = useLanguage();
  const [inputMode, setInputMode] = useState('niche'); // 'niche' or 'prompt'
  const [topic, setTopic] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [niche, setNiche] = useState('Teknologi & Web Development');
  const [subCategory, setSubCategory] = useState('');
  const [language, setLanguage] = useState('indonesia');
  const [tone, setTone] = useState('Professional & Informatif');
  const [length, setLength] = useState('deep');
  const [loading, setLoading] = useState(false);

  // Trending Niche Analysis States
  const [analyzingNiches, setAnalyzingNiches] = useState(false);
  const [recommendedNiches, setRecommendedNiches] = useState([]);
  const [selectedNicheId, setSelectedNicheId] = useState(null);

  const [isFirstArticle, setIsFirstArticle] = useState(true);

  // Error & API Key & Model & Provider States
  const [provider, setProvider] = useState('gemini');
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [openRouterKeyInput, setOpenRouterKeyInput] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customModelInput, setCustomModelInput] = useState('');

  const [selectedOpenRouterModel, setSelectedOpenRouterModel] = useState('google/gemini-2.0-flash-exp:free');
  const [isCustomOpenRouterModel, setIsCustomOpenRouterModel] = useState(false);
  const [customOpenRouterModelInput, setCustomOpenRouterModelInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      const prefs = aiService.getPreferences();
      const initLang = appLang === 'en' ? 'english' : (prefs.language || 'indonesia');
      setLanguage(initLang);
      if (prefs.niche) setNiche(aiService.normalizeParentNiche(prefs.niche, initLang));
      if (prefs.tone) setTone(prefs.tone);
      if (prefs.length) setLength(prefs.length);
      setIsFirstArticle(prefs.isFirstArticle);
      setRecommendedNiches([]);

      const activeProv = aiService.getProvider();
      setProvider(activeProv);

      const storedGeminiKey = (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '') || '';
      setApiKeyInput(storedGeminiKey);

      const storedORKey = (typeof window !== 'undefined' ? localStorage.getItem('openrouter_api_key') : '') || '';
      setOpenRouterKeyInput(storedORKey);

      setErrorType(null);
      setErrorMessage('');

      if (activeProv === 'openrouter') {
        setShowApiKeyInput(!storedORKey && !process.env.NEXT_PUBLIC_OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY);
      } else {
        setShowApiKeyInput(!storedGeminiKey && !process.env.NEXT_PUBLIC_GEMINI_API_KEY && !process.env.GEMINI_API_KEY);
      }

      // Gemini Model Init
      const currentMod = aiService.getSelectedModel();
      const standardModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-pro-exp', 'gemini-flash-latest', 'gemini-pro-latest'];
      if (standardModels.includes(currentMod)) {
        setSelectedModel(currentMod);
        setIsCustomModel(false);
      } else {
        setSelectedModel('custom');
        setIsCustomModel(true);
        setCustomModelInput(currentMod);
      }

      // OpenRouter Model Init
      const currentORMod = aiService.getOpenRouterModel();
      const standardORModels = [
        'openrouter/auto',
        'google/gemini-2.5-flash',
        'meta-llama/llama-3.3-70b-instruct',
        'deepseek/deepseek-r1',
        'qwen/qwen-2.5-72b-instruct'
      ];
      if (standardORModels.includes(currentORMod)) {
        setSelectedOpenRouterModel(currentORMod);
        setIsCustomOpenRouterModel(false);
      } else {
        setSelectedOpenRouterModel('custom');
        setIsCustomOpenRouterModel(true);
        setCustomOpenRouterModelInput(currentORMod);
      }
    }
  }, [isOpen, appLang]);

  const handleProviderChange = (newProv) => {
    setProvider(newProv);
    aiService.saveProvider(newProv);
    setErrorType(null);
    setErrorMessage('');
    const isEn = language === 'english' || appLang === 'en';
    if (newProv === 'openrouter') {
      const storedORKey = (typeof window !== 'undefined' ? localStorage.getItem('openrouter_api_key') : '') || '';
      const hasORKey = Boolean(storedORKey.trim() || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY);
      setShowApiKeyInput(!hasORKey);
      if (!hasORKey) {
        setErrorType('OPENROUTER_API_KEY_MISSING');
        setErrorMessage(
          isEn
            ? 'OpenRouter API Key is required for OpenRouter Free Tier. Please enter your API Key below (Get a free key at openrouter.ai/keys).'
            : 'OpenRouter API Key diperlukan untuk memilih model OpenRouter Free Tier. Silakan masukkan API Key Anda di bawah ini (Dapatkan gratis di openrouter.ai/keys).'
        );
      }
    } else {
      const storedGeminiKey = (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '') || '';
      const hasGeminiKey = Boolean(storedGeminiKey.trim() || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
      setShowApiKeyInput(!hasGeminiKey);
      if (!hasGeminiKey) {
        setErrorType('API_KEY_MISSING');
        setErrorMessage(
          isEn
            ? 'Google Gemini API Key is required. Please enter your API Key below.'
            : 'Google Gemini API Key belum dimasukkan. Silakan masukkan API Key Anda di bawah ini.'
        );
      }
    }
  };

  const handleModelChange = (val) => {
    if (val === 'custom') {
      setIsCustomModel(true);
      setSelectedModel('custom');
      if (customModelInput.trim()) {
        aiService.saveSelectedModel(customModelInput.trim());
      }
    } else {
      setIsCustomModel(false);
      setSelectedModel(val);
      aiService.saveSelectedModel(val);
    }
  };

  const handleCustomModelSave = (val) => {
    setCustomModelInput(val);
    if (val.trim()) {
      aiService.saveSelectedModel(val.trim());
    }
  };

  const handleOpenRouterModelChange = (val) => {
    if (val === 'custom') {
      setIsCustomOpenRouterModel(true);
      setSelectedOpenRouterModel('custom');
      if (customOpenRouterModelInput.trim()) {
        aiService.saveOpenRouterModel(customOpenRouterModelInput.trim());
      }
    } else {
      setIsCustomOpenRouterModel(false);
      setSelectedOpenRouterModel(val);
      aiService.saveOpenRouterModel(val);
    }
  };

  const handleCustomOpenRouterModelSave = (val) => {
    setCustomOpenRouterModelInput(val);
    if (val.trim()) {
      aiService.saveOpenRouterModel(val.trim());
    }
  };

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
          
          {inputMode === 'niche' ? (
            /* Mode 1: Topik Artikel Riset */
            <div className="space-y-4">
              {/* AdSense Compliance & Manual Riset Button */}
              <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-500" />
                  <p className="text-[11px] leading-relaxed">
                    {t('aiAdsenseNotice')}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Search}
                  loading={analyzingNiches}
                  onClick={handleAnalyzeNiches}
                  className="shrink-0 bg-[var(--bg-surface)] hover:bg-blue-500/10 border-blue-500/30 text-blue-500 text-[11px]"
                >
                  {analyzingNiches ? t('aiAnalyzing') : (isFirstArticle ? t('aiFindNicheAll') : `${t('aiFindViralTopics')} (${niche || 'Niche'})`)}
                </Button>
              </div>

              {/* Recommended Niche Cards Comparison Grid */}
              {recommendedNiches.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> {isFirstArticle ? t('aiRecommendedNicheTitle') : `${t('aiRecommendedTopicsTitle')} (${niche})`}
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)]">{t('aiClickToSelect')}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {recommendedNiches.map((item) => {
                      const isSelected = selectedNicheId === item.id;
                      const displayTitle = item.subBranch ? `${item.niche} • ${item.subBranch}` : item.niche;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectRecommendedNiche(item)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all space-y-1.5 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/10 shadow-md ring-2 ring-blue-500/30'
                              : 'border-[var(--border-color)] bg-[var(--bg-primary)]/60 hover:bg-[var(--bg-surface)] hover:border-blue-400/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-[var(--text-main)] truncate flex items-center gap-1">
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                              {displayTitle}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {item.cpc}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{item.reason}</p>
                          <div className="text-[9px] font-medium text-blue-400 truncate pt-0.5 border-t border-[var(--border-color)]/40">
                            💡 {item.sampleTopic}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                  {t('aiTopicInputLabel')}
                </label>
                <Input
                  type="text"
                  required
                  placeholder={t('aiTopicInputPlaceholder')}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  icon={BookOpen}
                  helperText={t('aiTopicInputHelper')}
                />
              </div>
            </div>
          ) : (
            /* Mode 2: Prompt Bebas User */
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1 flex items-center justify-between">
                <span>{t('aiCustomPromptLabel')}</span>
              </label>
              <Textarea
                rows={3}
                required
                placeholder={t('aiCustomPromptPlaceholder')}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {t('aiCustomPromptTip')}
              </p>
            </div>
          )}

          {/* Grid: Niche & Sub-Kategori & Bahasa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Niche Target */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                {t('aiNicheLabel')}
              </label>
              <Input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                icon={Tag}
                placeholder="Teknologi"
              />
            </div>

            {/* Sub-Kategori Spesifik */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                {t('aiSubCategoryLabel')}
              </label>
              <Select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">{t('aiSubCategoryAuto')}</option>
                <option value="Artificial Intelligence">🤖 Artificial Intelligence</option>
                <option value="Web Development">🌐 Web Development</option>
                <option value="Cybersecurity & Privacy">🔒 Cybersecurity & Privacy</option>
                <option value="Cloud & Infrastructure">☁️ Cloud & Infrastructure</option>
                <option value="UI & UX Design">🎨 UI & UX Design</option>
                <option value="Fintech & Cryptography">💰 Fintech & Cryptography</option>
                <option value="DevOps & Platform">⚡ DevOps & Platform</option>
                <option value="Mobile Apps & Frameworks">📱 Mobile Apps & Frameworks</option>
              </Select>
            </div>

            {/* Bahasa Konten */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                {t('aiContentLangLabel')}
              </label>
              <Select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="indonesia">🇮🇩 Bahasa Indonesia</option>
                <option value="english">🇺🇸 English Tone</option>
              </Select>
            </div>

          </div>

          {/* Grid: Tone & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tone of Voice */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                {t('aiToneLabel')}
              </label>
              <Select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="auto">{t('aiToneAuto')}</option>
                <option value="🎓 Kursus Tutorial Elearning Pemula (2000+ Kata)">
                  {language === 'english' ? '🎓 Beginner Elearning Masterclass (2000+ Words)' : '🎓 Kursus Elearning Pemula dari Nol (2000+ Kata)'}
                </option>
                <option value="Edukatif & Tutorial Step-by-Step">
                  {language === 'english' ? '📚 Educational & Step-by-Step Tutorial' : '📚 Edukatif & Step-by-Step'}
                </option>
                <option value="Professional & Informatif">
                  {language === 'english' ? '💼 Professional & Informative' : '💼 Profesional & Informatif'}
                </option>
                <option value="Casual & Komunikatif">
                  {language === 'english' ? '💬 Casual & Conversational' : '💬 Casual & Komunikatif'}
                </option>
                <option value="Analitis & Mendalam">
                  {language === 'english' ? '📊 Analytical & Deep-Dive' : '📊 Analitis & Mendalam'}
                </option>
              </Select>
            </div>

            {/* Target Length */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                {t('aiLengthLabel')}
              </label>
              <Select
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                <option value="deep">{t('aiLengthDeep')}</option>
                <option value="elearning">{t('aiLengthElearning')}</option>
                <option value="standard">{t('aiLengthStandard')}</option>
              </Select>
            </div>

          </div>

          {/* Target Word Count Badge */}
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>{t('aiEstimatedWordCount')}</span>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 font-mono font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
              {tone.includes('2000') || length === 'elearning'
                ? (language === 'english' ? '📊 2,000 - 2,500+ Words (Elearning Masterclass)' : '📊 2.000 - 2.500+ Kata (Masterclass Elearning)')
                : length === 'deep'
                ? (language === 'english' ? '📊 1,000 - 1,500+ Words (AdSense Safe)' : '📊 1.000 - 1.500+ Kata (Lolos AdSense)')
                : (language === 'english' ? '📊 700 - 1,000+ Words' : '📊 700 - 1.000+ Kata')}
            </span>
          </div>

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
