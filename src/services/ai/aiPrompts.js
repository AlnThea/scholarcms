import { normalizeParentNiche } from './aiHelpers';

export const DEFAULT_MASTER_PROMPT = `Anda adalah seorang penulis konten profesional berpengetahuan tinggi (Senior Managing Editor) dengan pengalaman lebih dari 15 tahun di bidang penerbitan digital dan SEO Google.

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

export const getMasterPrompt = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ai_master_prompt') || DEFAULT_MASTER_PROMPT;
  }
  return DEFAULT_MASTER_PROMPT;
};

export const saveMasterPrompt = (prompt) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ai_master_prompt', prompt);
  }
};

export const getEstablishedNiche = () => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('site_established_niche');
    return raw ? normalizeParentNiche(raw) : null;
  }
  return null;
};

export const setEstablishedNiche = (niche) => {
  if (typeof window !== 'undefined' && niche) {
    const parentNiche = normalizeParentNiche(niche);
    localStorage.setItem('site_established_niche', parentNiche);
    localStorage.setItem('ai_pref_niche', parentNiche);
  }
};

export const clearEstablishedNiche = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('site_established_niche');
  }
};

export const getPreferences = () => {
  if (typeof window !== 'undefined') {
    const established = getEstablishedNiche();
    const rawNiche = established || localStorage.getItem('ai_pref_niche') || 'Teknologi';
    const niche = normalizeParentNiche(rawNiche);
    const language = localStorage.getItem('ai_pref_language') || 'indonesia';
    const tone = localStorage.getItem('ai_pref_tone') || 'auto';
    const length = localStorage.getItem('ai_pref_length') || 'deep';
    return { niche, language, tone, length, isFirstArticle: !established };
  }
  return { niche: 'Teknologi', language: 'indonesia', tone: 'auto', length: 'deep', isFirstArticle: true };
};

export const savePreferences = (prefs) => {
  if (typeof window !== 'undefined') {
    if (prefs.niche) {
      const parentNiche = normalizeParentNiche(prefs.niche);
      localStorage.setItem('ai_pref_niche', parentNiche);
      if (!getEstablishedNiche()) {
        setEstablishedNiche(parentNiche);
      }
    }
    if (prefs.language) localStorage.setItem('ai_pref_language', prefs.language);
    if (prefs.tone) localStorage.setItem('ai_pref_tone', prefs.tone);
    if (prefs.length) localStorage.setItem('ai_pref_length', prefs.length);
  }
};
