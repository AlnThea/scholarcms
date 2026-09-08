import { GoogleGenAI } from '@google/genai';
import { parseSafeJson } from './aiHelpers';

export const getGeminiApiKey = () => {
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('gemini_api_key');
    if (localKey && localKey.trim()) return localKey.trim();
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
};

export const getSelectedGeminiModel = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gemini_selected_model') || 'gemini-1.5-flash';
  }
  return 'gemini-1.5-flash';
};

export const saveSelectedGeminiModel = (modelName) => {
  if (typeof window !== 'undefined' && modelName) {
    localStorage.setItem('gemini_selected_model', modelName);
  }
};

export const callGeminiApi = async ({ prompt, apiKey, modelName = 'gemini-1.5-flash' }) => {
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const ai = new GoogleGenAI({ apiKey });
  const liveModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
  const modelsToTry = Array.from(new Set([modelName, ...liveModels].filter(Boolean)));

  let lastError = null;
  let isQuotaError = false;
  let is503Error = false;

  for (const m of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: m,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const textResponse = response?.text;
      if (textResponse) {
        const parsed = parseSafeJson(textResponse);
        if (parsed) return parsed;
      }
    } catch (err) {
      console.warn(`Gemini Model [${m}] call failed:`, err?.message || err);
      const errMsg = String(err?.message || err).toLowerCase();

      if (errMsg.includes('api key') || errMsg.includes('api_key_invalid') || errMsg.includes('unauthorized') || (errMsg.includes('403') && !errMsg.includes('quota'))) {
        throw new Error('INVALID_API_KEY');
      }

      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('rate limit') || errMsg.includes('resource_exhausted')) {
        isQuotaError = true;
        lastError = err;
        continue;
      }

      if (errMsg.includes('503') || errMsg.includes('unavailable') || errMsg.includes('overloaded') || errMsg.includes('high demand')) {
        is503Error = true;
        lastError = err;
        continue;
      }

      lastError = err;
    }
  }

  if (isQuotaError) {
    throw new Error('QUOTA_EXCEEDED');
  }
  if (is503Error) {
    throw new Error('SERVICE_OVERLOADED_503');
  }
  if (lastError) throw lastError;
  throw new Error('GEMINI_RESPONSE_FAILED');
};
