'use client';

import { useState, useEffect } from 'react';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Sparkles, X, Globe, Tag, BookOpen, ShieldCheck, Feather, Cpu, Search, TrendingUp, DollarSign, CheckCircle2, MessageSquareCode, SlidersHorizontal, FileText } from 'lucide-react';

export default function AiGenerateModal({ isOpen, onClose, onGenerateSuccess }) {
  const { user } = useAuth();
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

  useEffect(() => {
    if (isOpen) {
      const prefs = aiService.getPreferences();
      if (prefs.niche) setNiche(aiService.normalizeParentNiche(prefs.niche));
      const initLang = prefs.language || 'indonesia';
      setLanguage(initLang);
      if (prefs.tone) setTone(prefs.tone);
      if (prefs.length) setLength(prefs.length);
      setIsFirstArticle(prefs.isFirstArticle);
      setRecommendedNiches([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAnalyzeNiches = async (selectedLang = language) => {
    setAnalyzingNiches(true);
    try {
      // If first article, pass empty targetNiche to search across all sectors. If established, pass niche.
      const targetSearchNiche = isFirstArticle ? '' : niche;
      const niches = await aiService.analyzeTrendingNiches(targetSearchNiche, selectedLang);
      setRecommendedNiches(niches || []);
    } catch (err) {
      console.error('Failed to analyze trending niches:', err);
    } finally {
      setAnalyzingNiches(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
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
    if (tone === 'auto' || tone === '') {
      // Auto detected tone will be used dynamically
    }
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
      console.error('Failed to generate AI article:', err);
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
                Buat Artikel AI &amp; Riset Niche 💰
              </h3>
              <p className="text-xs text-[var(--text-subtle)]">Analisis tren niche populer &amp; generasi artikel lolos verifikasi Google AdSense</p>
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

        {/* Status Badge: Artikel Pertama vs Niche Situs Terkunci */}
        <div className="px-5 pt-3">
          {isFirstArticle ? (
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-[11px]">
                🚀 <strong>Artikel Pertama Situs:</strong> Cari Niche Terbaik Dari Semua Sektor
              </span>
              <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-md font-semibold">Penentuan Niche Website</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-[11px]">
                🔒 <strong>Niche Utama Situs Terkunci:</strong> {niche || 'Teknologi'}
              </span>
              <button
                type="button"
                onClick={() => {
                  aiService.clearEstablishedNiche();
                  setIsFirstArticle(true);
                }}
                className="text-[10px] text-amber-500 underline hover:text-amber-400 font-semibold"
                title="Reset Niche situs jika ingin ganti Niche utama"
              >
                Ganti Niche Utama
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
              <TrendingUp className="w-4 h-4" /> 🔍 Mode Riset Topik Viral AI
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
              <MessageSquareCode className="w-4 h-4" /> ✍️ Mode Prompt Bebas User
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {inputMode === 'niche' ? (
            /* Mode 1: Topik Artikel Riset */
            <div className="space-y-4">
              {/* AdSense Compliance & Manual Riset Button */}
              <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-500" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Bebas Penolakan AdSense &quot;Low Value Content&quot;:</strong> AI menghasilkan konten terstruktur (&lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;blockquote&gt;) gaya bahasa manusia natural.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Search}
                  loading={analyzingNiches}
                  onClick={handleAnalyzeNiches}
                  title={isFirstArticle ? "Cari & bandingkan Niche dari semua sektor" : `Cari topik viral khusus Niche ${niche}`}
                  className="shrink-0 bg-[var(--bg-surface)] hover:bg-blue-500/10 border-blue-500/30 text-blue-500 text-[11px]"
                >
                  {analyzingNiches ? 'Menganalisis...' : (isFirstArticle ? '🔍 Cari Niche (Semua Sektor)' : `🔍 Cari Topik Viral (${niche || 'Niche'})`)}
                </Button>
              </div>

              {/* Recommended Niche Cards Comparison Grid */}
              {recommendedNiches.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> {isFirstArticle ? 'Rekomendasi Niche Sektor Utama' : `Rekomendasi Topik Viral (${niche})`}
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)]">Klik kartu untuk memilih</span>
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
                  Topik Utama / Judul Target Artikel *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Contoh: Panduan Belajar Next.js 14 &amp; Firestore untuk Pemula"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  icon={BookOpen}
                  helperText="Tulis topik spesifik atau klik tombol '🔍 Cari Topik Viral' jika ingin bantuan AI."
                />
              </div>
            </div>
          ) : (
            /* Mode 2: Prompt Bebas User */
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1 flex items-center justify-between">
                <span>Instruksi Khusus / Prompt Bebas Anda *</span>
                <span className="text-[10px] text-purple-400 font-normal">Tulis detail instruksi artikel yang Anda inginkan</span>
              </label>
              <Textarea
                rows={3}
                required
                placeholder="Contoh: Buatkan tutorial pembuatan website dinamis menggunakan PHP 8 &amp; MySQL untuk pemula dari nol sampai online. Sertakan cara install XAMPP, struktur folder, kodingan index.php, &amp; database SQL."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                💡 <strong>Tips Prompt:</strong> Semakin spesifik instruksi Anda (misal sebutkan bahasa PHP/Python/React, langkah install, atau poin bab), AI akan menghasilkan tutorial yang semakin akurat.
              </p>
            </div>
          )}

          {/* Grid: Niche & Sub-Kategori & Bahasa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Niche Target */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                Niche Utama Situs
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
                Sub-Kategori Target
              </label>
              <Select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">🤖 Otomatis (Ditentukan AI)</option>
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
                Bahasa Konten
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
                Gaya Penulisan (Tone)
              </label>
              <Select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="auto">🤖 Otomatis (Disesuaikan AI dengan Topik Judul)</option>
                <option value="🎓 Kursus Tutorial Elearning Pemula (2000+ Kata)">🎓 Kursus Elearning Pemula dari Nol (2000+ Kata)</option>
                <option value="Edukatif & Tutorial Step-by-Step">📚 Edukatif &amp; Step-by-Step</option>
                <option value="Professional & Informatif">💼 Profesional &amp; Informatif</option>
                <option value="Casual & Komunikatif">💬 Casual &amp; Komunikatif</option>
                <option value="Analitis & Mendalam">📊 Analitis &amp; Mendalam</option>
              </Select>
            </div>

            {/* Target Length */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                Kedalaman Konten
              </label>
              <Select
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                <option value="deep">⭐ Mendalam (1000+ Kata - Lolos AdSense)</option>
                <option value="elearning">🚀 Kursus &amp; Tutorial Elearning (2000+ Kata)</option>
                <option value="standard">📝 Standar (700+ Kata)</option>
              </Select>
            </div>

          </div>

          {/* Target Word Count Badge */}
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Estimasi Target Kata Artikel:</span>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 font-mono font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
              {tone.includes('2000') || length === 'elearning'
                ? '📊 2.000 - 2.500+ Kata (Masterclass Elearning)'
                : length === 'deep'
                ? '📊 1.000 - 1.500+ Kata (Lolos AdSense)'
                : '📊 700 - 1.000+ Kata'}
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
              Batal
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              icon={Sparkles}
              loading={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Generasi Artikel AI...' : '✨ Hasilkan Artikel Berkualitas'}
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
