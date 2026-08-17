import { dbService } from './dbService';
import { GoogleGenAI } from '@google/genai';

const DEFAULT_MASTER_PROMPT = `Anda adalah seorang penulis konten profesional berpengetahuan tinggi (Senior Managing Editor) dengan pengalaman lebih dari 15 tahun di bidang penerbitan digital dan SEO Google.

TUGAS UTAMA ANDA:
Buatlah artikel blog yang sangat mendalam, unik, bernilai tinggi (High Value Content), dan 100% lolos verifikasi kelayakan Google AdSense (memenuhi Webmaster Quality Guidelines & menghindari penolakan "Low Value Content" / "Thin Content").

PRINSIP PENULISAN & JUMLAH KATA TEKS (HUMAN TONE & DEEP LONG-FORM CONTENT):
1. JUMLAH KATA TEKS MURNI (MINIMAL 1200 - 1800+ KATA TEKS BACAAN MANUSIA):
   - PENTING: Hitungan 1200+ kata HARUS MURNI DARI KATA-KATA TEKS BACAAN PARAGRAF, JUDUL H2/H3, LIST <ul>/<li>, DAN QUOTE.
   - DILARANG MENGHITUNG TAG HTML GAMBAR (<img>), KODE DOKUMEN, DOKUMEN HTML, ATAU ATRIBUT MARKUP SEBAGAI KATA TEKS!
   - Uraikan setiap Sub-Judul (<h2> dan <h3>) menjadi 3-4 paragraf panjang yang mendalam, kaya informasi, serta dilengkapi contoh nyata, studi kasus, dan analisis praktis.
2. GUNAKAN BAHASA NATURAL MANUSIA: Hindari frasa klise robotik AI seperti "Di era digital yang serba cepat ini", "Sebagai model bahasa AI", "Mari kita bahas lebih dalam", "Bisa disimpulkan bahwa".
3. MANFAATKAN ELEMEN BLOK VISUAL LENGKAP SCHOLARCMS:
   - LAYOUT MULTI-KOLOM: Gunakan <div data-type="columns"><div data-type="column" data-width="50%"><p>...</p></div><div data-type="column" data-width="50%"><p>...</p></div></div> untuk perbandingan poin atau analisis 2 sisi.
   - ACCORDION FAQ: Buatlah sekumpulan pertanyaan umum di bagian akhir artikel menggunakan <div data-type="accordion-group"><div data-type="accordion-item"><div data-type="accordion-header">❓ Pertanyaan FAQ...</div><div data-type="accordion-content"><p>Jawaban detail...</p></div></div></div>.
   - CHECKLIST TUGAS / AKSI: Buatlah rincian tugas aksi menggunakan <ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p>Langkah 1...</p></li><li data-type="taskItem" data-checked="true"><p>Langkah 2 (selesai)...</p></li></ul>.
   - TABEL DATA: Sertakan 1 tabel matriks data/perbandingan menggunakan <table data-type="table" class="w-full border-collapse my-4"><thead><tr><th class="border p-2 bg-blue-500/10">Parameter</th><th class="border p-2 bg-blue-500/10">Detail</th></tr></thead><tbody><tr><td class="border p-2">Poin A</td><td class="border p-2">Keterangan A</td></tr></tbody></table>.
   - CALLOUT BOXES: Gunakan <blockquote class="p-4 my-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 text-blue-400 font-medium">💡 <strong>Catatan:</strong> ...</blockquote> dan <blockquote class="p-4 my-4 rounded-xl bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 font-medium">✅ <strong>Tips Sukses:</strong> ...</blockquote>.
4. STANDAR SEO KETAT (AKURASI AUDIT SEO 100/100):
   - PANJANG JUDUL ("title" & "seoTitle"): WAJIB BERKISAR 30 HINGGA 60 KARAKTER (IDEAL 30-70 KARAKTER GOOGLE).
   - PANJANG META DESCRIPTION / RINGKASAN ("excerpt" & "seoDescription"): WAJIB BERKISAR 50 HINGGA 150 KARAKTER (IDEAL 50-160 KARAKTER GOOGLE).
5. OUTPUT FORMAT: Kembalikan JSON murni tanpa markdown formatting backticks dengan struktur:
{
  "title": "Judul Artikel Menarik (30-60 Karakter)",
  "slug": "judul-artikel-menarik",
  "excerpt": "Ringkasan memikat 50-150 karakter untuk meta description...",
  "seoTitle": "Judul SEO Meta (30-60 Karakter)",
  "seoDescription": "Meta Deskripsi Google Snippet (50-150 Karakter)",
  "focusKeyword": "kata kunci utama",
  "category": "Kategori Artikel",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "featuredImage": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  "contentHtml": "<h2>Sub Judul 1</h2><p>Paragraf 1...</p>..."
}`;

export const aiService = {
  getMasterPrompt() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ai_master_prompt') || DEFAULT_MASTER_PROMPT;
    }
    return DEFAULT_MASTER_PROMPT;
  },

  saveMasterPrompt(prompt) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_master_prompt', prompt);
    }
  },

  getProvider() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ai_selected_provider') || 'gemini';
    }
    return 'gemini';
  },

  saveProvider(provider) {
    if (typeof window !== 'undefined' && provider) {
      localStorage.setItem('ai_selected_provider', provider);
    }
  },

  getOpenRouterApiKey() {
    if (typeof window !== 'undefined') {
      const localKey = localStorage.getItem('openrouter_api_key');
      if (localKey && localKey.trim()) return localKey.trim();
    }
    return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
  },

  getOpenRouterModel() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openrouter_selected_model') || 'openrouter/auto';
    }
    return 'openrouter/auto';
  },

  saveOpenRouterModel(modelName) {
    if (typeof window !== 'undefined' && modelName) {
      localStorage.setItem('openrouter_selected_model', modelName);
    }
  },

  getSelectedModel() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_selected_model') || 'gemini-1.5-flash';
    }
    return 'gemini-1.5-flash';
  },

  saveSelectedModel(modelName) {
    if (typeof window !== 'undefined' && modelName) {
      localStorage.setItem('gemini_selected_model', modelName);
    }
  },

  normalizeParentNiche(inputNiche, lang = 'indonesia') {
    const isEn = lang === 'english';
    if (!inputNiche) return isEn ? 'Technology' : 'Teknologi';

    let cleanInput = String(inputNiche).trim();
    if (cleanInput.includes(':')) {
      cleanInput = cleanInput.split(':')[0].trim();
    }

    const lower = cleanInput.toLowerCase();

    if (lower.startsWith('teknologi') || lower.startsWith('technology') || lower.includes('tekno') || lower.includes('ai') || lower.includes('cloud') || lower.includes('cyber') || lower.includes('program') || lower.includes('coding') || lower.includes('software') || lower.includes('devops') || lower.includes('web') || lower.includes('komputer') || lower.includes('tech') || lower.includes('data') || lower.includes('gadget') || lower.includes('saas')) {
      return isEn ? 'Technology' : 'Teknologi';
    }
    if (lower.startsWith('keuangan') || lower.startsWith('finance') || lower.includes('uang') || lower.includes('finan') || lower.includes('fintech') || lower.includes('invest') || lower.includes('saham') || lower.includes('bank') || lower.includes('kripto') || lower.includes('crypto')) {
      return isEn ? 'Finance' : 'Keuangan';
    }
    if (lower.startsWith('kesehatan') || lower.startsWith('health') || lower.includes('sehat') || lower.includes('bio') || lower.includes('longevity') || lower.includes('medis') || lower.includes('fit') || lower.includes('gaya hidup') || lower.includes('kesehatan')) {
      return isEn ? 'Health' : 'Kesehatan';
    }
    if (lower.startsWith('bisnis') || lower.startsWith('business') || lower.includes('market') || lower.includes('seo') || lower.includes('commerce') || lower.includes('bisnis') || lower.includes('digital') || lower.includes('pemasaran')) {
      return isEn ? 'Business & Marketing' : 'Bisnis & Marketing';
    }
    if (lower.startsWith('energi') || lower.startsWith('energy') || lower.includes('energi') || lower.includes('listrik') || lower.includes('surya') || lower.includes('green')) {
      return isEn ? 'Renewable Energy' : 'Energi Terbarukan';
    }
    if (lower.startsWith('pengembangan') || lower.startsWith('self') || lower.includes('diri') || lower.includes('produk') || lower.includes('karir') || lower.includes('kerja')) {
      return isEn ? 'Self Improvement' : 'Pengembangan Diri';
    }

    return cleanInput || (isEn ? 'Technology' : 'Teknologi');
  },

  getEstablishedNiche() {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('site_established_niche');
      return raw ? this.normalizeParentNiche(raw) : null;
    }
    return null;
  },

  setEstablishedNiche(niche) {
    if (typeof window !== 'undefined' && niche) {
      const parentNiche = this.normalizeParentNiche(niche);
      localStorage.setItem('site_established_niche', parentNiche);
      localStorage.setItem('ai_pref_niche', parentNiche);
    }
  },

  clearEstablishedNiche() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('site_established_niche');
    }
  },

  getApiKey() {
    if (typeof window !== 'undefined') {
      const localKey = localStorage.getItem('gemini_api_key');
      if (localKey && localKey.trim()) return localKey.trim();
    }
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  },

  getPreferences() {
    if (typeof window !== 'undefined') {
      const established = this.getEstablishedNiche();
      const rawNiche = established || localStorage.getItem('ai_pref_niche') || 'Teknologi';
      const niche = this.normalizeParentNiche(rawNiche);
      const language = localStorage.getItem('ai_pref_language') || 'indonesia';
      const tone = localStorage.getItem('ai_pref_tone') || 'auto';
      const length = localStorage.getItem('ai_pref_length') || 'deep';
      return { niche, language, tone, length, isFirstArticle: !established };
    }
    return { niche: 'Teknologi', language: 'indonesia', tone: 'auto', length: 'deep', isFirstArticle: true };
  },

  savePreferences(prefs) {
    if (typeof window !== 'undefined') {
      if (prefs.niche) {
        const parentNiche = this.normalizeParentNiche(prefs.niche);
        localStorage.setItem('ai_pref_niche', parentNiche);
        if (!this.getEstablishedNiche()) {
          this.setEstablishedNiche(parentNiche);
        }
      }
      if (prefs.language) localStorage.setItem('ai_pref_language', prefs.language);
      if (prefs.tone) localStorage.setItem('ai_pref_tone', prefs.tone);
      if (prefs.length) localStorage.setItem('ai_pref_length', prefs.length);
    }
  },

  resolveSubCategory({ topic = '', niche = '' }) {
    const t = (topic || '').toLowerCase();
    const n = (niche || '').toLowerCase();
    const results = [];

    if (t.includes('ai') || t.includes('agent') || t.includes('llm') || t.includes('generative') || t.includes('machine learning') || t.includes('gpt') || t.includes('claude') || t.includes('neural') || t.includes('sovereign')) {
      results.push('Artificial Intelligence');
    }
    if (t.includes('web') || t.includes('wasm') || t.includes('assembly') || t.includes('react') || t.includes('next') || t.includes('frontend') || t.includes('css') || t.includes('javascript') || t.includes('typescript') || t.includes('html')) {
      results.push('Web Development');
    }
    if (t.includes('security') || t.includes('cyber') || t.includes('auth') || t.includes('zero-trust') || t.includes('privacy') || t.includes('hack') || t.includes('encryption') || t.includes('token') || t.includes('post-quantum')) {
      results.push('Cybersecurity & Privacy');
    }
    if (t.includes('cloud') || t.includes('edge') || t.includes('devops') || t.includes('infrastructure') || t.includes('serverless') || t.includes('finops') || t.includes('idp') || t.includes('micro-services') || t.includes('docker') || t.includes('kubernetes')) {
      results.push('Cloud & Infrastructure');
    }
    if (t.includes('fintech') || t.includes('invest') || t.includes('crypto') || t.includes('keuangan') || t.includes('saham') || t.includes('bank') || t.includes('money') || t.includes('cpc')) {
      results.push('Fintech & Cryptography');
    }
    if (t.includes('design') || t.includes('ui') || t.includes('ux') || t.includes('glassmorphism') || t.includes('figma') || t.includes('style')) {
      results.push('UI & UX Design');
    }
    if (t.includes('mobile') || t.includes('ios') || t.includes('android') || t.includes('flutter') || t.includes('react native')) {
      results.push('Mobile Apps & Frameworks');
    }

    if (results.length === 0) {
      if (n && !n.includes('teknologi')) {
        results.push(niche);
      } else {
        results.push('Artificial Intelligence', 'Web Development');
      }
    } else if (results.length === 1) {
      if (results[0] === 'Artificial Intelligence') results.push('Cloud & Infrastructure');
      else if (results[0] === 'Web Development') results.push('Cloud & Infrastructure');
      else results.push('Artificial Intelligence');
    }

    return results;
  },

  extractCleanTitle(topic, customPrompt, language = 'indonesia') {
    const isEn = language === 'english';
    if (topic && !customPrompt) {
      return topic.trim();
    }
    const raw = customPrompt || topic || '';
    if (!raw) return isEn ? 'Dynamic Web Development Course' : 'Panduan Pembuatan Website Dinamis';

    let str = raw.trim();
    const lower = str.toLowerCase();

    // Check if raw is a long prompt or starts with prompt action words
    const isPrompt = lower.startsWith('buatkan') || lower.startsWith('create') || lower.startsWith('write') || lower.startsWith('tulis') || lower.startsWith('generate') || str.length > 45;

    if (!isPrompt) {
      return str;
    }

    // Clean prompt action prefixes
    let clean = str.replace(/^(buatkan|tuliskan|tulis|create|write|generate)\s+(artikel|tutorial|panduan|guide|post)?\s+(tentang|mengenai|about|for)?\s*/i, '');

    // Cut off at first period, newline, or instruction conjunctions like "sertakan", "include", "dengan fokus", "with focus"
    const cutMatch = clean.match(/(\.|\n|;\s*|\s+sertakan|\s+include|\s+dengan\s+fokus|\s+with\s+focus)/i);
    if (cutMatch && cutMatch.index > 8) {
      clean = clean.substring(0, cutMatch.index).trim();
    }

    if (clean.length > 60) {
      clean = clean.substring(0, 57).trim() + '...';
    }

    // Capitalize first letter
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    return clean;
  },

  cleanHtmlContent(htmlStr) {
    if (!htmlStr || typeof htmlStr !== 'string') return htmlStr;
    let clean = htmlStr;

    // Clean redundant bullet prefixes like • [x] or • [ ] or [x] inside p or li
    clean = clean.replace(/<p>\s*(?:•\s*)?\[[x\s]\]\s*/gi, '<p>');
    clean = clean.replace(/<li>\s*(?:•\s*)?\[[x\s]\]\s*/gi, '<li>');
    clean = clean.replace(/<p>\s*•\s*/gi, '<p>');

    // Clean empty columns, empty containers, empty blockquotes
    clean = clean.replace(/<div data-type="column"[^>]*>\s*<\/div>/gi, '');
    clean = clean.replace(/<div data-type="columns"[^>]*>\s*<\/div>/gi, '');
    clean = clean.replace(/<blockquote[^>]*>\s*<\/blockquote>/gi, '');

    return clean;
  },

  async generateArticle({ topic, niche, customPrompt, language, tone, length, subCategory, author }) {
    const parentNiche = this.normalizeParentNiche(niche || 'Teknologi');
    this.savePreferences({ niche: parentNiche, language, tone, length });

    const isCustomPrompt = Boolean(customPrompt && customPrompt.trim());
    const activeTopic = isCustomPrompt
      ? this.extractCleanTitle('', customPrompt, language)
      : (topic ? topic.trim() : 'Panduan Web Development');

    const detectedSubCat = subCategory || this.resolveSubCategory({ topic: activeTopic, niche });
    await dbService.ensureCategoryExists(detectedSubCat, parentNiche);

    const apiKey = this.getApiKey();

    const isEn = language === 'english';
    const langInstruction = isEn
      ? 'WRITE THE ENTIRE ARTICLE (INCLUDING TITLE, EXCERPT, SEO TITLE, SEO DESCRIPTION, FOCUS KEYWORD, TAGS, AND CONTENT) IN NATURAL, HIGH-QUALITY HUMAN ENGLISH.'
      : 'TULIS SELURUH ARTIKEL (TERMASUK JUDUL, RINGKASAN, SEO TITLE, META DESCRIPTION, FOCUS KEYWORD, TAGS, DAN KONTEN) DALAM BAHASA INDONESIA YANG NATURAL, FLUID, DAN SEPERTI PENULIS MANUSIA ASLI.';

    const isElearning = (tone || '').toLowerCase().includes('elearning') || (tone || '').toLowerCase().includes('kursus') || (length || '').toLowerCase().includes('2000');

    const lengthInstruction = isElearning
      ? (isEn
        ? 'TARGET CONTENT LENGTH: DEEP IN-DEPTH BEGINNER E-LEARNING TUTORIAL COURSE MINIMUM 2000 TO 2500+ WORDS OF PARAGRAPHS & COMPLETE CODE EXAMPLES (From scratch: Setup, Install Software/NPM/Framework, Folder Structure, Line-by-Line Code, Dev Server, Testing, & Deployment).'
        : 'TARGET PANJANG KONTEN: KURSUS TUTORIAL ELEARNING PEMULA SANGAT MENDALAM MINIMAL 2000 HINGGA 2500+ KATA TEKS BACAAN PARAGRAF & KODING LENGKAP (Dari Nol: Persiapan, Install Software/NPM/Framework, Struktur Folder, Kode Line-by-Line, Running Dev Server, Testing, & Deployment).')
      : (isEn
        ? 'TARGET CONTENT LENGTH: IN-DEPTH MINIMUM 1400 - 1800+ WORDS OF NATURAL HIGH QUALITY TEXT.'
        : 'Target Panjang Konten: SANGAT MENDALAM MINIMAL 1400 - 1800+ KATA TEKS BACAAN MURNI INDONESIA.');

    const customInstruction = isCustomPrompt ? `\n- PROMPT / INSTRUKSI BEBAS USER: "${customPrompt}"` : '';

    const titleInstruction = isCustomPrompt
      ? (isEn
        ? `ARTICLE TITLE: Generate a compelling, high-CTR article title in English (6-10 words) based on user prompt: "${customPrompt}".`
        : `JUDUL ARTIKEL: Buatkan judul artikel yang menarik & profesional (6-10 kata) berdasarkan instruksi prompt: "${customPrompt}".`)
      : (isEn
        ? `ARTICLE TITLE: Translate and format the selected topic title into compelling, high-CTR English (6-10 words): "${activeTopic}".`
        : `JUDUL ARTIKEL: Gunakan atau kembangkan judul topik pilihan ini: "${activeTopic}".`);

    const fullPrompt = `${masterPrompt}
BAHASA ARTIKEL: ${langInstruction}
GAYA PENULISAN: ${tone || 'Profesional & Informatif'}
SUB-KATEGORI: ${detectedSubCat} (Niche Induk: ${parentNiche})
${lengthInstruction}${customInstruction}

${titleInstruction}

ATURAN KOMPONEN BLOK PALET SCHOLARCMS (WAJIB INTEGRASI KE KANVAS EDITOR):
1. WAJIB GUNAKAN BLOK LAYOUT MULTI-KOLOM:
   <div data-type="columns"><div data-type="column" data-width="50%"><p><strong>Kolom Kiri:</strong> ...</p></div><div data-type="column" data-width="50%"><p><strong>Kolom Kanan:</strong> ...</p></div></div>
2. WAJIB GUNAKAN BLOK CHECKLIST TASKS:
   <ul data-type="taskList"><li data-type="taskItem" data-checked="true"><p>Langkah / Item Checklist...</p></li></ul>
3. WAJIB GUNAKAN BLOK ACCORDION FAQ DI AKHIR ARTIKEL:
   <div data-type="accordion-group"><div data-type="accordion-item"><div data-type="accordion-header">❓ Pertanyaan FAQ...</div><div data-type="accordion-content"><p>Jawaban detail...</p></div></div></div>
4. WAJIB GUNAKAN TABEL MATRIKS PERBANDINGAN / TROUBLESHOOTING:
   <table data-type="table" class="w-full border-collapse my-4"><thead><tr><th class="border p-2 bg-blue-500/10">Header 1</th><th class="border p-2 bg-blue-500/10">Header 2</th></tr></thead><tbody><tr><td class="border p-2">Data 1</td><td class="border p-2">Data 2</td></tr></tbody></table>
5. WAJIB GUNAKAN CALLOUT BOXES:
   <blockquote class="p-4 my-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 text-blue-400 font-medium">💡 <strong>Catatan Penting:</strong> ...</blockquote>

PENTING: KELUARKAN HANYA OBJEK JSON VALID TANPA FORMAT MARKDOWN CODEBLOCK. FORMAT JSON WAJIB:
{
  "title": "${isEn ? 'Catchy Professional English Article Title (6-10 Words)' : (isCustomPrompt ? 'Judul Artikel Menarik & Profesional (6-10 Kata)' : activeTopic)}",
  "slug": "short-relevant-url-slug",
  "excerpt": "${isEn ? 'Two sentence engaging summary...' : 'Ringkasan artikel 2 kalimat...'}",
  "seoTitle": "${isEn ? 'Google SEO Meta Title' : 'Judul SEO Google'}",
  "seoDescription": "${isEn ? 'Google Meta Description Snippet' : 'Meta Deskripsi Snippet'}",
  "focusKeyword": "${isEn ? 'primary keyword phrase' : 'kata kunci utama'}",
  "category": "${detectedSubCat}",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "featuredImage": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  "contentHtml": "<h2>...</h2><p>...</p>"
}`;

    const provider = this.getProvider();
    let parsed;

    if (provider === 'openrouter') {
      const openRouterKey = this.getOpenRouterApiKey();
      if (!openRouterKey) {
        throw new Error('OPENROUTER_API_KEY_MISSING');
      }
      const selectedModel = this.getOpenRouterModel();
      parsed = await this.callOpenRouterApi({ prompt: fullPrompt, apiKey: openRouterKey, modelName: selectedModel });
    } else {
      if (!apiKey) {
        throw new Error('API_KEY_MISSING');
      }
      const selectedModel = this.getSelectedModel();
      parsed = await this.callGeminiApi({ prompt: fullPrompt, apiKey, modelName: selectedModel });
    }
    if (parsed && parsed.contentHtml && typeof parsed.contentHtml === 'string' && !parsed.contentHtml.trim().startsWith('{')) {
      parsed.category = parsed.category || detectedSubCat;
      await dbService.ensureCategoryExists(parsed.category, parentNiche);
      let rawTitle = parsed.title || activeTopic;
      if (isCustomPrompt) {
        rawTitle = rawTitle.replace(/^(buatkan|tuliskan|tulis|create|write|generate)\s+(artikel|tutorial|panduan|guide|post)?\s+(tentang|mengenai|about|for)?\s*/i, '');
        rawTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      }
      parsed.title = this.fitSeoTitle(rawTitle);
      parsed.seoTitle = this.fitSeoTitle(parsed.seoTitle || parsed.title);
      parsed.excerpt = this.fitSeoExcerpt(parsed.excerpt || activeTopic, activeTopic);
      parsed.seoDescription = this.fitSeoExcerpt(parsed.seoDescription || parsed.excerpt, activeTopic);

      // Ensure Focus Keyword is a concise keyword phrase (max 4 words)
      let focusKw = parsed.focusKeyword || parsed.focus_keyword || '';
      if (!focusKw || focusKw.length > 40) {
        focusKw = (activeTopic || '').split(' ').slice(0, 4).join(' ').toLowerCase();
      }
      parsed.focusKeyword = focusKw.toLowerCase();

      // Ensure Tags array is populated properly
      if (!parsed.tags || (Array.isArray(parsed.tags) && parsed.tags.length === 0)) {
        const topicWords = (activeTopic || '').split(' ').filter(w => w.length > 3);
        parsed.tags = [detectedSubCat, ...topicWords.slice(0, 4)];
      } else if (typeof parsed.tags === 'string') {
        parsed.tags = parsed.tags.split(',').map(t => t.trim()).filter(Boolean);
      }

      parsed.contentHtml = this.cleanHtmlContent(parsed.contentHtml);
      if (author) parsed.author = author;
      return parsed;
    }

    throw new Error('Gagal merender respons JSON dari Gemini AI. Silakan coba lagi.');
  },

  fitSeoTitle(inputTitle) {
    let str = (inputTitle || '').trim();
    if (str.length > 60) {
      str = str.substring(0, 57).trim() + '...';
    }
    if (str.length < 30) {
      str = `${str} - Panduan Lengkap 2026`;
    }
    return str;
  },

  fitSeoExcerpt(inputExcerpt, topic = '') {
    let str = (inputExcerpt || '').trim();
    if (str.length > 150) {
      str = str.substring(0, 147).trim() + '...';
    }
    if (str.length < 50) {
      str = `Pelajari panduan lengkap mengenai ${topic || 'topik ini'} untuk meningkatkan wawasan dan strategi terbaik Anda.`;
    }
    return str;
  },

  parseSafeJson(textResponse) {
    if (!textResponse) return null;
    let clean = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(clean);
      if (parsed && typeof parsed.contentHtml === 'string') {
        return parsed;
      }
    } catch (e1) {
      try {
        const sanitized = clean.replace(/[\r\n]+/g, '\\n').replace(/\t/g, '\\t');
        const parsed = JSON.parse(sanitized);
        if (parsed && typeof parsed.contentHtml === 'string') {
          return parsed;
        }
      } catch (e2) {
        try {
          const titleMatch = clean.match(/"title"\s*:\s*"([^"]+)"/);
          const slugMatch = clean.match(/"slug"\s*:\s*"([^"]+)"/);
          const excerptMatch = clean.match(/"excerpt"\s*:\s*"([^"]+)"/);
          const categoryMatch = clean.match(/"category"\s*:\s*"([^"]+)"/);

          let extractedContent = '';
          const contentStartIdx = clean.indexOf('"contentHtml"');
          if (contentStartIdx !== -1) {
            const afterKey = clean.substring(contentStartIdx + 13);
            const quoteStart = afterKey.indexOf('"');
            if (quoteStart !== -1) {
              let rawContent = afterKey.substring(quoteStart + 1).trim();
              rawContent = rawContent.replace(/"\s*}\s*$/, '').replace(/"\s*,\s*"[a-zA-Z]+"\s*:[\s\S]*$/, '');
              extractedContent = rawContent.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            }
          }

          if (titleMatch && extractedContent && !extractedContent.startsWith('{')) {
            return {
              title: titleMatch[1],
              slug: slugMatch ? slugMatch[1] : '',
              excerpt: excerptMatch ? excerptMatch[1] : '',
              category: categoryMatch ? categoryMatch[1] : 'Teknologi',
              contentHtml: extractedContent
            };
          }
        } catch (e3) {
          console.warn('Regex fallback extraction failed:', e3);
        }
      }
    }
    return null;
  },

  async callGeminiApi({ prompt, apiKey, modelName = 'gemini-1.5-flash' }) {
    if (!apiKey) {
      throw new Error('API_KEY_MISSING');
    }

    const ai = new GoogleGenAI({ apiKey });
    // Prioritize gemini-1.5-flash which has guaranteed free tier quota (15 RPM / 1,500 RPD)
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
          const parsed = this.parseSafeJson(textResponse);
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
          continue; // Try next fallback model (e.g. gemini-1.5-flash) instead of stopping!
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
  },

  async callOpenRouterApi({ prompt, apiKey, modelName = 'openrouter/auto' }) {
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

          // Check if OpenRouter suggested a replacement slug (e.g. "use this slug instead: google/gemini-2.5-flash")
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
          const parsed = this.parseSafeJson(contentText);
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
  },

  async analyzeTrendingNiches(targetNiche, language = 'indonesia') {
    const establishedNiche = this.getEstablishedNiche();
    const rawNiche = targetNiche || establishedNiche || '';
    const currentNiche = rawNiche ? this.normalizeParentNiche(rawNiche, language) : '';
    const isEn = language === 'english';

    const langPromptInstruction = isEn
      ? 'CRITICAL REQUIREMENT: WRITE ALL TITLES, SAMPLE TOPICS, REASONS, AND SUB-BRANCHES ENTIRELY IN NATURAL HIGH-QUALITY HUMAN ENGLISH.'
      : 'TULIS SEMUA JUDUL, SAMPLE TOPIC, REASON, DAN SUB-BRANCH DALAM BAHASA INDONESIA YANG NATURAL.';

    const apiKey = this.getApiKey();

    if (!apiKey) {
      throw new Error('API_KEY_MISSING');
    }

    const timestamp = new Date().toISOString();
    let prompt = '';
    if (currentNiche) {
      prompt = isEn ? `Analyze and provide 6 fresh, diverse & trending Article Topics SPECIFICALLY UNDER THE PRIMARY NICHE "${currentNiche}" at timestamp ${timestamp} with high AdSense CPC potential. Topics MUST cover ALL WIDE SUB-BRANCHES OF THE NICHE (e.g. for Niche "${currentNiche}": provide variations across AI & Machine Learning, Cybersecurity, Web & Mobile Dev, Cloud Computing, DevOps, Hardware) so the content is diverse while staying under the single primary Niche umbrella "${currentNiche}".

${langPromptInstruction}

Format MUST be pure JSON array without markdown codeblocks:
[
  {
    "id": "unique_id_${Date.now()}_1",
    "niche": "${currentNiche}",
    "subBranch": "Sub-Category Name (e.g. AI & Machine Learning)",
    "cpc": "$3.00 - $12.00 / click",
    "trendScore": 95,
    "sampleTopic": "Specific Article Title Example for this Sub-Branch",
    "competition": "Medium",
    "reason": "AdSense advantage reason for this sub-branch"
  }
]` : `Analisis dan berikan 6 rekomendasi Topik Artikel segar, variatif & viral KHUSUS DALAM PAYUNG NICHE UTAMA "${currentNiche}" pada waktu ${timestamp} dengan potensi AdSense CPC tinggi. Topik HARUS mencakup SELURUH SUB-CABANG LUAS NICHE TERSEBUT (misal jika Niche "${currentNiche}": berikan variasi sub-topik AI & Machine Learning, Cybersecurity, Web & Mobile Dev, Cloud Computing, DevOps, Gadget/Hardware) agar konten variatif namun tetap berada dalam 1 payung Niche Utama "${currentNiche}" yang konsisten bagi Google AdSense.

${langPromptInstruction}

Format HARUS JSON array murni tanpa markdown triple backtick:
[
  {
    "id": "unique_id_${Date.now()}_1",
    "niche": "${currentNiche}",
    "subBranch": "Nama Sub-Cabang Niche (e.g. AI & Machine Learning)",
    "cpc": "$3.00 - $12.00 / klik",
    "trendScore": 95,
    "sampleTopic": "Contoh Judul Artikel Viral Spesifik Sub-Cabang Niche",
    "competition": "Sedang",
    "reason": "Alasan keunggulan sub-cabang AdSense"
  }
]`;
    } else {
      prompt = isEn ? `Analyze and provide 6 popular Primary Blog Niche recommendations from DIFFERENT SECTORS (e.g. Technology, Finance, Health, Business & Marketing, Renewable Energy, Self Improvement) at timestamp ${timestamp} with high AdSense CPC potential so the user can choose a Primary Niche for their new site.

${langPromptInstruction}

Format MUST be pure JSON array without markdown codeblocks:
[
  {
    "id": "unique_id_${Date.now()}_1",
    "niche": "Primary Sector Niche Name",
    "subBranch": "Main Sub-Sector",
    "cpc": "$3.00 - $12.00 / click",
    "trendScore": 95,
    "sampleTopic": "Top Article Title Example for this Sector",
    "competition": "Medium",
    "reason": "AdSense advantage reason"
  }
]` : `Analisis dan berikan 6 rekomendasi Niche Blog Utama terpopuler dari SEKTOR BERBEDA (misal: Teknologi, Keuangan, Kesehatan, Bisnis & Marketing, Energi Terbarukan, Pengembangan Diri) pada waktu ${timestamp} dengan potensi AdSense CPC tinggi agar pengguna bisa memilih Niche Utama situs barunya.

${langPromptInstruction}

Format HARUS JSON array murni tanpa markdown triple backtick:
[
  {
    "id": "unique_id_${Date.now()}_1",
    "niche": "Nama Niche Utama Sektor",
    "subBranch": "Sub-Sektor Utama",
    "cpc": "$3.00 - $12.00 / klik",
    "trendScore": 95,
    "sampleTopic": "Contoh Judul Artikel Unggulan Sektor Ini",
    "competition": "Sedang",
    "reason": "Alasan keunggulan AdSense"
  }
]`;
    }

    const provider = this.getProvider();
    let parsed;

    if (provider === 'openrouter') {
      const openRouterKey = this.getOpenRouterApiKey();
      if (!openRouterKey) {
        throw new Error('OPENROUTER_API_KEY_MISSING');
      }
      const selectedModel = this.getOpenRouterModel();
      parsed = await this.callOpenRouterApi({ prompt, apiKey: openRouterKey, modelName: selectedModel });
    } else {
      if (!apiKey) {
        throw new Error('API_KEY_MISSING');
      }
      const selectedModel = this.getSelectedModel();
      parsed = await this.callGeminiApi({ prompt, apiKey, modelName: selectedModel });
    }
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => {
        const rawNiche = item.niche || '';
        const normalized = this.normalizeParentNiche(rawNiche, language);

        let sub = item.subBranch || '';
        if (!sub && rawNiche && rawNiche !== normalized) {
          sub = rawNiche.replace(/^teknologi\s*/i, '').replace(/^technology\s*/i, '').replace(/^keuangan\s*/i, '').replace(/^finance\s*/i, '').replace(/^kesehatan\s*/i, '').replace(/^health\s*/i, '').trim();
        }

        return {
          ...item,
          id: item.id || `niche_rec_${Date.now()}_${idx}`,
          niche: currentNiche || normalized,
          subBranch: sub || item.sampleTopic || (isEn ? 'Featured Topic' : 'Topik Pilihan')
        };
      });
    }

    throw new Error('Gagal merender rekomendasi topik dari Google Gemini API. Silakan coba lagi.');
  }
};
