import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ShieldCheck, Search, TrendingUp, CheckCircle2, BookOpen, Tag, FileText } from 'lucide-react';

export default function AiPromptForm({
  t,
  language,
  appLang,
  state,
  handleAnalyzeNiches,
  handleSelectRecommendedNiche,
  handleLanguageChange
}) {
  const {
    inputMode,
    topic, setTopic,
    customPrompt, setCustomPrompt,
    niche, setNiche,
    subCategory, setSubCategory,
    tone, setTone,
    length, setLength,
    analyzingNiches,
    recommendedNiches,
    selectedNicheId,
    isFirstArticle
  } = state;

  return (
    <>
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
    </>
  );
}
