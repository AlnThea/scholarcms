import { dbService } from '@/services/dbService';
import { 
  normalizeParentNiche, 
  resolveSubCategory, 
  extractCleanTitle, 
  cleanHtmlContent, 
  fitSeoTitle, 
  fitSeoExcerpt 
} from './aiHelpers';
import { 
  getMasterPrompt, 
  getEstablishedNiche, 
  setEstablishedNiche, 
  clearEstablishedNiche,
  getPreferences,
  savePreferences,
  saveMasterPrompt
} from './aiPrompts';
import { getGeminiApiKey, getSelectedGeminiModel, saveSelectedGeminiModel, callGeminiApi } from './geminiProvider';
import { getOpenRouterApiKey, getSelectedOpenRouterModel, saveSelectedOpenRouterModel, callOpenRouterApi } from './openRouterProvider';

export const getProvider = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ai_selected_provider') || 'gemini';
  }
  return 'gemini';
};

export const saveProvider = (provider) => {
  if (typeof window !== 'undefined' && provider) {
    localStorage.setItem('ai_selected_provider', provider);
  }
};

export const generateArticle = async ({ topic, niche, customPrompt, language, tone, length, subCategory, author }) => {
  const parentNiche = normalizeParentNiche(niche || 'Teknologi');
  savePreferences({ niche: parentNiche, language, tone, length });

  const isCustomPrompt = Boolean(customPrompt && customPrompt.trim());
  const activeTopic = isCustomPrompt
    ? extractCleanTitle('', customPrompt, language)
    : (topic ? topic.trim() : 'Panduan Web Development');

  const detectedSubCat = subCategory || resolveSubCategory({ topic: activeTopic, niche });
  await dbService.ensureCategoryExists(detectedSubCat, parentNiche);

  const apiKey = getGeminiApiKey();
  const masterPrompt = getMasterPrompt();

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
   <div data-type="accordion-group"><div data-type="accordion-item"><div data-type="accordion-header">? Pertanyaan FAQ...</div><div data-type="accordion-content"><p>Jawaban detail...</p></div></div></div>
4. WAJIB GUNAKAN TABEL MATRIKS PERBANDINGAN / TROUBLESHOOTING:
   <table data-type="table" class="w-full border-collapse my-4"><thead><tr><th class="border p-2 bg-blue-500/10">Header 1</th><th class="border p-2 bg-blue-500/10">Header 2</th></tr></thead><tbody><tr><td class="border p-2">Data 1</td><td class="border p-2">Data 2</td></tr></tbody></table>
5. WAJIB GUNAKAN CALLOUT BOXES:
   <blockquote class="p-4 my-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 text-blue-400 font-medium">?? <strong>Catatan Penting:</strong> ...</blockquote>

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

  const provider = getProvider();
  let parsed;

  if (provider === 'openrouter') {
    const openRouterKey = getOpenRouterApiKey();
    if (!openRouterKey) {
      throw new Error('OPENROUTER_API_KEY_MISSING');
    }
    const selectedModel = getSelectedOpenRouterModel();
    parsed = await callOpenRouterApi({ prompt: fullPrompt, apiKey: openRouterKey, modelName: selectedModel });
  } else {
    if (!apiKey) {
      throw new Error('API_KEY_MISSING');
    }
    const selectedModel = getSelectedGeminiModel();
    parsed = await callGeminiApi({ prompt: fullPrompt, apiKey, modelName: selectedModel });
  }

  if (parsed && parsed.contentHtml && typeof parsed.contentHtml === 'string' && !parsed.contentHtml.trim().startsWith('{')) {
    parsed.category = parsed.category || detectedSubCat;
    await dbService.ensureCategoryExists(parsed.category, parentNiche);
    
    let rawTitle = parsed.title || activeTopic;
    if (isCustomPrompt) {
      rawTitle = rawTitle.replace(/^(buatkan|tuliskan|tulis|create|write|generate)\s+(artikel|tutorial|panduan|guide|post)?\s+(tentang|mengenai|about|for)?\s*/i, '');
      rawTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
    }
    
    parsed.title = fitSeoTitle(rawTitle);
    parsed.seoTitle = fitSeoTitle(parsed.seoTitle || parsed.title);
    parsed.excerpt = fitSeoExcerpt(parsed.excerpt || activeTopic, activeTopic);
    parsed.seoDescription = fitSeoExcerpt(parsed.seoDescription || parsed.excerpt, activeTopic);

    let focusKw = parsed.focusKeyword || parsed.focus_keyword || '';
    if (!focusKw || focusKw.length > 40) {
      focusKw = (activeTopic || '').split(' ').slice(0, 4).join(' ').toLowerCase();
    }
    parsed.focusKeyword = focusKw.toLowerCase();

    if (!parsed.tags || (Array.isArray(parsed.tags) && parsed.tags.length === 0)) {
      const topicWords = (activeTopic || '').split(' ').filter(w => w.length > 3);
      parsed.tags = [detectedSubCat, ...topicWords.slice(0, 4)];
    } else if (typeof parsed.tags === 'string') {
      parsed.tags = parsed.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    parsed.contentHtml = cleanHtmlContent(parsed.contentHtml);
    if (author) parsed.author = author;
    
    return parsed;
  }

  throw new Error('Gagal merender respons JSON dari Gemini AI. Silakan coba lagi.');
};

export const analyzeTrendingNiches = async (targetNiche, language = 'indonesia') => {
  const establishedNiche = getEstablishedNiche();
  const rawNiche = targetNiche || establishedNiche || '';
  const currentNiche = rawNiche ? normalizeParentNiche(rawNiche, language) : '';
  const isEn = language === 'english';

  const langPromptInstruction = isEn
    ? 'CRITICAL REQUIREMENT: WRITE ALL TITLES, SAMPLE TOPICS, REASONS, AND SUB-BRANCHES ENTIRELY IN NATURAL HIGH-QUALITY HUMAN ENGLISH.'
    : 'TULIS SEMUA JUDUL, SAMPLE TOPIC, REASON, DAN SUB-BRANCH DALAM BAHASA INDONESIA YANG NATURAL.';

  const apiKey = getGeminiApiKey();
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

  const provider = getProvider();
  let parsed;

  if (provider === 'openrouter') {
    const openRouterKey = getOpenRouterApiKey();
    if (!openRouterKey) {
      throw new Error('OPENROUTER_API_KEY_MISSING');
    }
    const selectedModel = getSelectedOpenRouterModel();
    parsed = await callOpenRouterApi({ prompt, apiKey: openRouterKey, modelName: selectedModel });
  } else {
    if (!apiKey) {
      throw new Error('API_KEY_MISSING');
    }
    const selectedModel = getSelectedGeminiModel();
    parsed = await callGeminiApi({ prompt, apiKey, modelName: selectedModel });
  }

  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map((item, idx) => {
      const rawNiche = item.niche || '';
      const normalized = normalizeParentNiche(rawNiche, language);

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
};
