export const normalizeParentNiche = (inputNiche, lang = 'indonesia') => {
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
};

export const resolveSubCategory = ({ topic = '', niche = '' }) => {
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
};

export const extractCleanTitle = (topic, customPrompt, language = 'indonesia') => {
  const isEn = language === 'english';
  if (topic && !customPrompt) {
    return topic.trim();
  }
  const raw = customPrompt || topic || '';
  if (!raw) return isEn ? 'Dynamic Web Development Course' : 'Panduan Pembuatan Website Dinamis';

  let str = raw.trim();
  const lower = str.toLowerCase();

  const isPrompt = lower.startsWith('buatkan') || lower.startsWith('create') || lower.startsWith('write') || lower.startsWith('tulis') || lower.startsWith('generate') || str.length > 45;

  if (!isPrompt) {
    return str;
  }

  let clean = str.replace(/^(buatkan|tuliskan|tulis|create|write|generate|bikin|tolong buatkan)(\s+artikel|\s+blog|\s+postingan|\s+post)?(\s+tentang|\s+mengenai|\s+about)?/i, '').trim();
  
  const endMarkers = ['dengan tone', 'gunakan gaya', 'panjang kata', 'minimal', 'maksimal', 'yang menarik', 'untuk pemula'];
  for (const marker of endMarkers) {
    const idx = clean.toLowerCase().indexOf(marker);
    if (idx !== -1) {
      clean = clean.substring(0, idx).trim();
    }
  }

  if (clean.length > 60) {
    clean = clean.substring(0, 57).trim() + '...';
  }
  
  if (!clean) return isEn ? 'Dynamic Topic Article' : 'Artikel Topik Dinamis';
  
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

export const cleanHtmlContent = (htmlStr) => {
  if (!htmlStr) return '';
  let str = htmlStr;
  str = str.replace(/```html/gi, '').replace(/```/g, '').trim();
  str = str.replace(/^<div[^>]*>([\s\S]*?)<\/div>$/i, (match, p1) => {
    if (!match.includes('data-type="columns"') && !match.includes('data-type="accordion-group"')) {
      return p1;
    }
    return match;
  });
  return str;
};

export const fitSeoTitle = (inputTitle) => {
  let str = (inputTitle || '').trim();
  if (str.length > 60) {
    str = str.substring(0, 57).trim() + '...';
  }
  if (str.length < 30) {
    str = `${str} - Panduan Lengkap 2026`;
  }
  return str;
};

export const fitSeoExcerpt = (inputExcerpt, topic = '') => {
  let str = (inputExcerpt || '').trim();
  if (str.length > 150) {
    str = str.substring(0, 147).trim() + '...';
  }
  if (str.length < 50) {
    str = `Pelajari panduan lengkap mengenai ${topic || 'topik ini'} untuk meningkatkan wawasan dan strategi terbaik Anda.`;
  }
  return str;
};

export const parseSafeJson = (textResponse) => {
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
};
