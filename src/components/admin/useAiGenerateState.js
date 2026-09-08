import { useState, useEffect } from 'react';
import { aiService } from '@/services/aiService';

export function useAiGenerateState(isOpen, appLang) {
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

  return {
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
    provider, setProvider,
    errorType, setErrorType,
    errorMessage, setErrorMessage,
    apiKeyInput, setApiKeyInput,
    openRouterKeyInput, setOpenRouterKeyInput,
    showApiKeyInput, setShowApiKeyInput,
    selectedModel, setSelectedModel,
    isCustomModel, setIsCustomModel,
    customModelInput, setCustomModelInput,
    selectedOpenRouterModel, setSelectedOpenRouterModel,
    isCustomOpenRouterModel, setIsCustomOpenRouterModel,
    customOpenRouterModelInput, setCustomOpenRouterModelInput,
    handleProviderChange,
    handleModelChange,
    handleCustomModelSave,
    handleOpenRouterModelChange,
    handleCustomOpenRouterModelSave,
  };
}
