import { Cpu } from 'lucide-react';

export default function AiModelSelector({ state, language, appLang }) {
  const {
    provider,
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

  return (
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
  );
}
