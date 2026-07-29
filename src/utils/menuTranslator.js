export function translateLabel(label, language) {
  if (!label || typeof label !== 'string') return label;
  if (language !== 'en') return label;

  const map = {
    'Beranda': 'Home',
    'Beranda Blog': 'Home Blog',
    'Tentang Kami': 'About Us',
    'Kebijakan Privasi': 'Privacy Policy',
    'Kebijakan Privasi (Privacy Policy)': 'Privacy Policy',
    'Syarat & Ketentuan': 'Terms & Conditions',
    'Hubungi Kami': 'Contact Us',
    'Disclaimer': 'Disclaimer',
    'Teknologi': 'Technology',
    'Keuangan & Bisnis': 'Finance & Business',
    'Kesehatan': 'Health',
    'Gaya Hidup': 'Lifestyle',
    'Edukasi & Tutorial': 'Education & Tutorials',
    'Pemasaran Digital': 'Digital Marketing',
    'Desain & Grafis': 'Design & Graphics',
    'Kecerdasan Buatan': 'Artificial Intelligence',
    'Kecerdasan Buatan (AI)': 'Artificial Intelligence (AI)',
    'Pengembangan Web': 'Web Development',
    'Tulis Artikel Baru': 'Write New Article',
    'Kelola Kategori': 'Manage Categories',
    'Navigasi Utama': 'Quick Navigation'
  };

  if (map[label]) return map[label];

  const lower = label.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (k.toLowerCase() === lower) return v;
  }

  return label;
}
