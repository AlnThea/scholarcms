import { 
  normalizeParentNiche, 
  resolveSubCategory, 
  extractCleanTitle, 
  cleanHtmlContent, 
  fitSeoTitle, 
  fitSeoExcerpt, 
  parseSafeJson 
} from './ai/aiHelpers';
import { 
  getMasterPrompt, 
  saveMasterPrompt, 
  getEstablishedNiche, 
  setEstablishedNiche, 
  clearEstablishedNiche, 
  getPreferences, 
  savePreferences 
} from './ai/aiPrompts';
import { 
  getGeminiApiKey, 
  getSelectedGeminiModel, 
  saveSelectedGeminiModel, 
  callGeminiApi 
} from './ai/geminiProvider';
import { 
  getOpenRouterApiKey, 
  getSelectedOpenRouterModel, 
  saveSelectedOpenRouterModel, 
  callOpenRouterApi 
} from './ai/openRouterProvider';
import { 
  getProvider, 
  saveProvider, 
  generateArticle, 
  analyzeTrendingNiches 
} from './ai/aiCore';

export const aiService = {
  // Prompts & Preferences
  getMasterPrompt,
  saveMasterPrompt,
  getEstablishedNiche,
  setEstablishedNiche,
  clearEstablishedNiche,
  getPreferences,
  savePreferences,

  // Provider config
  getProvider,
  saveProvider,

  // Gemini specific
  getApiKey: getGeminiApiKey,
  getSelectedModel: getSelectedGeminiModel,
  saveSelectedModel: saveSelectedGeminiModel,
  callGeminiApi,

  // OpenRouter specific
  getOpenRouterApiKey,
  getOpenRouterModel: getSelectedOpenRouterModel,
  saveOpenRouterModel: saveSelectedOpenRouterModel,
  callOpenRouterApi,

  // Core Actions
  generateArticle,
  analyzeTrendingNiches,

  // Helpers
  normalizeParentNiche,
  resolveSubCategory,
  extractCleanTitle,
  cleanHtmlContent,
  fitSeoTitle,
  fitSeoExcerpt,
  parseSafeJson
};
