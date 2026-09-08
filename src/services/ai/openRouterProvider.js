import { parseSafeJson } from './aiHelpers';

export const getOpenRouterApiKey = () => {
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('openrouter_api_key');
    if (localKey && localKey.trim()) return localKey.trim();
  }
  return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
};

export const getSelectedOpenRouterModel = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('openrouter_selected_model') || 'openrouter/auto';
  }
  return 'openrouter/auto';
};

export const saveSelectedOpenRouterModel = (modelName) => {
  if (typeof window !== 'undefined' && modelName) {
    localStorage.setItem('openrouter_selected_model', modelName);
  }
};

export const callOpenRouterApi = async ({ prompt, apiKey, modelName = 'openrouter/auto' }) => {
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY_MISSING');
  }

  const freeModels = [
    'openrouter/auto',
    'google/gemini-2.0-flash-lite-001:free',
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-2.5-flash',
    'meta-llama/llama-3.3-70b-instruct',
    'deepseek/deepseek-r1',
    'qwen/qwen-2.5-72b-instruct'
  ];

  const cleanInputModel = (modelName || '').replace(/:free$/i, '').trim();
  const modelsToTry = Array.from(new Set([modelName, cleanInputModel, ...freeModels].filter(Boolean)));

  let lastError = null;
  let is402Error = false;

  for (let i = 0; i < modelsToTry.length; i++) {
    const m = modelsToTry[i];
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'ScholarCMS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: m,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 4096
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = String(errJson?.error?.message || response.statusText || '').toLowerCase();

        if (response.status === 401 || errMsg.includes('api key') || errMsg.includes('unauthorized') || errMsg.includes('invalid key')) {
          throw new Error('INVALID_API_KEY');
        }

        if (response.status === 402 || errMsg.includes('credits') || errMsg.includes('max_tokens') || errMsg.includes('afford')) {
          console.warn(`OpenRouter Model [${m}] 402 Payment/Credits Required, trying fallback model...`);
          is402Error = true;
          continue;
        }

        const rawMsg = String(errJson?.error?.message || '');
        const suggestMatch = rawMsg.match(/use this slug instead:\s*([a-zA-Z0-9_\-\.\/]+)/i);
        if (suggestMatch && suggestMatch[1]) {
          const suggestedSlug = suggestMatch[1].trim();
          if (!modelsToTry.includes(suggestedSlug)) {
            modelsToTry.splice(i + 1, 0, suggestedSlug);
          }
        }

        if (response.status === 429 || errMsg.includes('rate limit') || errMsg.includes('quota')) {
          console.warn(`OpenRouter Model [${m}] rate limited, trying fallback model...`);
          continue;
        }
        console.warn(`OpenRouter Model [${m}] HTTP ${response.status}:`, errMsg);
        continue;
      }

      const data = await response.json();
      const contentText = data?.choices?.[0]?.message?.content;
      if (contentText) {
        const parsed = parseSafeJson(contentText);
        if (parsed) return parsed;
      }
    } catch (err) {
      if (err.message === 'INVALID_API_KEY') throw err;
      console.warn(`OpenRouter Call [${m}] failed:`, err?.message || err);
      lastError = err;
    }
  }

  if (is402Error) {
    throw new Error('OPENROUTER_CREDITS_REQUIRED');
  }
  if (lastError) throw lastError;
  throw new Error('OPENROUTER_RESPONSE_FAILED');
};
