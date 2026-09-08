import { Cpu, Key, ShieldCheck, Save, CheckCircle, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

export default function AiSettingsPanel({
  t,
  role,
  aiProvider,
  setAiProvider,
  selectedAiModel,
  setSelectedAiModel,
  geminiApiKey,
  setGeminiApiKey,
  selectedOpenRouterModel,
  setSelectedOpenRouterModel,
  openRouterApiKey,
  setOpenRouterApiKey,
  handleSaveAiConfig,
  aiConfigSaving,
  aiConfigSavedMessage,
  masterPrompt,
  setMasterPrompt,
  handleSaveMasterPrompt,
  promptSaving,
  promptSavedMessage
}) {
  if (role !== 'admin') return null;

  return (
    <>
      <form onSubmit={handleSaveAiConfig} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
                Pengaturan Provider AI & API Key (Google Gemini & OpenRouter Free)
                <ShieldCheck className="w-4 h-4 text-blue-500" title={t('adminOnlyBadgeTitle')} />
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Pilih penyedia AI (Google Gemini SDK atau OpenRouter Free Tier) serta kunci API resmi Anda</p>
            </div>
          </div>

          <Badge variant="published">
            Multi-Provider AI Active
          </Badge>
        </div>

        <div className="space-y-5">
          
          {/* Provider Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-500" /> Utama AI Provider Engine:
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setAiProvider('gemini')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  aiProvider === 'gemini'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                ⚡ Google Gemini (SDK Resmi)
              </button>
              <button
                type="button"
                onClick={() => setAiProvider('openrouter')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  aiProvider === 'openrouter'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                🌐 OpenRouter AI (Free Tier)
              </button>
            </div>
          </div>

          {/* Grid Model Selection & API Key Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-500" /> Model Utama Gemini AI:
              </label>
              <Select
                value={selectedAiModel}
                onChange={(e) => setSelectedAiModel(e.target.value)}
              >
                <option value="gemini-1.5-flash">🌐 Gemini 1.5 Flash (Gratis & Stabil - Rekomendasi)</option>
                <option value="gemini-1.5-pro">🧠 Gemini 1.5 Pro (Penalaran Mendalam)</option>
                <option value="gemini-2.5-flash">⚡ Gemini 2.5 Flash (Tercepat & Utama)</option>
                <option value="gemini-2.0-flash">🚀 Gemini 2.0 Flash</option>
                <option value="gemini-2.0-flash-lite">💨 Gemini 2.0 Flash Lite (Ringan & Cepat)</option>
                <option value="gemini-flash-latest">✨ Gemini Flash Latest (Versi Terbaru Otomatis)</option>
                <option value="gemini-pro-latest">🔮 Gemini Pro Latest (Versi Pro Terbaru Otomatis)</option>
              </Select>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Model terpilih untuk provider Google Gemini.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-500" /> Google Gemini API Key:
              </label>
              <Input
                type="password"
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                helperText="Dapatkan API Key gratis di aistudio.google.com/app/apikey"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" /> Model OpenRouter (Free):
              </label>
              <Select
                value={selectedOpenRouterModel}
                onChange={(e) => setSelectedOpenRouterModel(e.target.value)}
              >
                <option value="openrouter/auto">🤖 OpenRouter Auto Router (Rekomendasi Auto Free)</option>
                <option value="google/gemini-2.5-flash">⚡ Gemini 2.5 Flash</option>
                <option value="meta-llama/llama-3.3-70b-instruct">🦙 Meta Llama 3.3 70B</option>
                <option value="deepseek/deepseek-r1">🐳 DeepSeek R1 Reasoning</option>
                <option value="qwen/qwen-2.5-72b-instruct">🌐 Qwen 2.5 72B</option>
              </Select>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Model terpilih untuk provider OpenRouter Free Tier.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-500" /> OpenRouter API Key:
              </label>
              <Input
                type="password"
                placeholder="sk-or-v1-..."
                value={openRouterApiKey}
                onChange={(e) => setOpenRouterApiKey(e.target.value)}
                helperText="Dapatkan API Key gratis di openrouter.ai/keys"
              />
            </div>

          </div>

          {/* Save AI Config Button */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
            <Button
              type="submit"
              variant="purple"
              size="md"
              icon={Save}
              loading={aiConfigSaving}
            >
              Simpan Konfigurasi AI & Model
            </Button>

            {aiConfigSavedMessage && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Konfigurasi Model AI Berhasil Disimpan!
              </span>
            )}
          </div>

        </div>
      </form>

      <form onSubmit={handleSaveMasterPrompt} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
                {t('masterPromptHeader')}
                <ShieldCheck className="w-4 h-4 text-blue-500" title={t('adminOnlyBadgeTitle')} />
              </h3>
              <p className="text-xs text-[var(--text-muted)]">{t('masterPromptSubtitle')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {t('masterPromptDesc')}
          </p>

          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('masterPromptLabel')}
            </label>
            <textarea
              rows={10}
              value={masterPrompt}
              onChange={(e) => setMasterPrompt(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono leading-relaxed focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="submit"
              variant="purple"
              size="md"
              icon={Save}
              loading={promptSaving}
            >
              {t('saveMasterPromptBtn')}
            </Button>

            {promptSavedMessage && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> {t('promptSavedSuccess')}
              </span>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
