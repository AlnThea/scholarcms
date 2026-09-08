import { aiService } from '@/services/aiService';

export function useAiGenerateActions(state, user, appLang, onGenerateSuccess, onClose) {
  const {
    inputMode, topic, setTopic, customPrompt, niche, setNiche, subCategory, setSubCategory,
    language, setLanguage, tone, length,
    setLoading, setAnalyzingNiches, recommendedNiches, setRecommendedNiches,
    setSelectedNicheId, isFirstArticle, provider,
    setErrorType, setErrorMessage, apiKeyInput, openRouterKeyInput, setShowApiKeyInput
  } = state;

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

  return {
    handleSaveApiKey,
    handleAnalyzeNiches,
    handleLanguageChange,
    handleTopicChange,
    handleSelectRecommendedNiche,
    handleSubmit
  };
}
