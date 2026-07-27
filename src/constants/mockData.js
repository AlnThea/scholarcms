export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Web Development', slug: 'web-development', color: '#2563eb', description: 'Panduan dan tutorial seputar React, Next.js, & CSS modern.' },
  { id: 'cat-2', name: 'Firebase & Cloud', slug: 'firebase-cloud', color: '#f59e0b', description: 'Arsitektur database Firestore, Auth, dan Serverless Functions.' },
  { id: 'cat-3', name: 'UI & UX Design', slug: 'ui-ux-design', color: '#ec4899', description: 'Prinsip desain antarmuka, glassmorphism, dan sistem desain.' },
  { id: 'cat-4', name: 'AI & Machine Learning', slug: 'ai-machine-learning', color: '#8b5cf6', description: 'Penerapan AI Generatif dalam aplikasi web modern.' }
];

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Panduan Lengkap Membangun CMS Blog Modern Berkinerja Tinggi',
    slug: 'panduan-cms-modern-nextjs-firebase',
    excerpt: 'Pelajari bagaimana mengombinasikan kecepatan SSR Next.js dengan fleksibilitas database Firestore untuk membuat CMS Blog berkinerja tinggi.',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'Firebase', 'CMS'],
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    author: {
      name: 'Ernst Senior Dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Software Architect'
    },
    publishedAt: '2026-07-20T10:00:00.000Z',
    views: 342,
    readTime: '6 min read',
    blocks: [
      { id: 'b1', type: 'paragraph', content: 'WordPress telah menjadi standar industri CMS selama puluhan tahun. Namun, di era web modern saat ini, arsitektur headless CMS yang memisahkan frontend (Next.js) dan backend/database (Firebase) menawarkan kecepatan dan keandalan luar biasa.' },
      { id: 'b2', type: 'heading', level: 2, content: 'Mengapa Menggunakan Next.js App Router?' },
      { id: 'b3', type: 'paragraph', content: 'Next.js 14 App Router memungkinkan kita merender komponen di tingkat server (Server Components), yang berarti artikel blog Anda di-index secara instan oleh mesin pencari Google tanpa penundaan rendering di sisi klien.' },
      { id: 'b4', type: 'callout', content: '💡 **Tips Pro**: Selalu gunakan atribut metadata dynamic `generateMetadata()` pada file dynamic route `[slug]/page.jsx` untuk performa SEO maksimal.' },
      { id: 'b5', type: 'heading', level: 2, content: 'Integrasi Firebase Firestore Realtime' },
      { id: 'b6', type: 'paragraph', content: 'Dengan Firestore, postingan blog baru yang diterbitkan melalui Dashboard Admin akan langsung muncul di halaman utama pembaca dalam hitungan milidetik tanpa memerlukan server fisik yang mahal.' },
      { id: 'b7', type: 'code', content: '// Contoh Inisialisasi Firestore SDK v10\nimport { initializeApp } from "firebase/app";\nimport { getFirestore } from "firebase/firestore";\n\nconst db = getFirestore(app);' },
      { id: 'b8', type: 'quote', content: '"Kecepatan bukan sekadar fitur, melainkan pondasi dari pengalaman pengguna yang memikat."' }
    ]
  },
  {
    id: 'post-2',
    title: 'Desain Antarmuka Glassmorphism & Micro-Animations yang Memukau Pengunjung',
    slug: 'desain-antarmuka-glassmorphism-micro-animations',
    excerpt: 'Eksplorasi teknik CSS modern untuk menciptakan efek transparansi kaca (glassmorphism) dan animasi mikro yang halus untuk blog Anda.',
    category: 'UI & UX Design',
    tags: ['CSS', 'Glassmorphism', 'UI/UX', 'Animation'],
    featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    author: {
      name: 'Sarah Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'Lead UI/UX Engineer'
    },
    publishedAt: '2026-07-19T14:30:00.000Z',
    views: 215,
    readTime: '4 min read',
    blocks: [
      { id: 'b1', type: 'paragraph', content: 'Pengalaman visual pertama pengunjung menentukan apakah mereka akan bertahan membaca artikel Anda atau pergi. Menggabungkan efek glassmorphism dengan tipografi yang tepat menciptakan kesan mewah dan modern.' },
      { id: 'b2', type: 'heading', level: 2, content: 'Menerapkan Backdrop Blur dengan CSS Custom Properties' },
      { id: 'b3', type: 'paragraph', content: 'Gunakan `backdrop-filter: blur(16px)` dipadukan dengan latar belakang semi-transparan `rgba(255, 255, 255, 0.75)` untuk menciptakan efek panel kaca modern.' }
    ]
  },
  {
    id: 'post-3',
    title: 'Implementasi AI Assistant dalam Editor Artikel Visual Block Canvas',
    slug: 'implementasi-ai-assistant-editor-gutenberg',
    excerpt: 'Bagaimana kecerdasan buatan membantu kreator konten dalam menghasilkan draft artikel, memeriksa tata bahasa, dan membuat ringkasan otomatis.',
    category: 'AI & Machine Learning',
    tags: ['AI', 'Visual Editor', 'Content Creation'],
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    author: {
      name: 'Rian Kusuma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'Chief Editor'
    },
    publishedAt: '2026-07-22T14:15:00.000Z',
    views: 342,
    readTime: '5 min read',
    blocks: [
      { id: 'b1', type: 'paragraph', content: 'Editor berbasis blok memberikan struktur yang sangat ideal bagi AI untuk membantu menulis konten secara modular per-paragraf atau per-heading.' }
    ]
  }
];

export const INITIAL_COMMENTS = [
  {
    id: 'comm-1',
    postId: 'post-1',
    authorName: 'Budi Santoso',
    authorEmail: 'budi@example.com',
    content: 'Artikel yang sangat membuka wawasan! Kebetulan saya sedang migrasi dari WordPress PHP ke Next.js.',
    createdAt: '2026-07-20T11:20:00.000Z',
    status: 'approved'
  },
  {
    id: 'comm-2',
    postId: 'post-1',
    authorName: 'Rina Wijaya',
    authorEmail: 'rina@dev.id',
    content: 'Apakah arsitektur ini juga mendukung fitur multi-author seperti di WordPress?',
    createdAt: '2026-07-20T12:05:00.000Z',
    status: 'approved'
  }
];

export const INITIAL_PAGES = [
  {
    id: 'page-1',
    title: 'Tentang Kami',
    slug: 'tentang-kami',
    excerpt: 'Halaman profil dan informasi tentang pengembang serta filosofi platform ScholarCMS.',
    status: 'published',
    author: {
      name: 'Ernst Senior Dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Software Architect'
    },
    publishedAt: '2026-07-20T08:00:00.000Z',
    views: 128,
    seoTitle: 'Tentang Kami | ScholarCMS Engine',
    seoDescription: 'Informasi lengkap tentang platform ScholarCMS dan pengembang.',
    blocks: [
      { id: 'pb1', type: 'heading', level: 1, content: 'Tentang Platform ScholarCMS' },
      { id: 'pb2', type: 'paragraph', content: 'ScholarCMS adalah platform CMS blog independen yang dirancang untuk memberikan pengalaman membaca artikel teknologi, berita, dan pemprograman dengan kecepatan tinggi.' },
      { id: 'pb3', type: 'heading', level: 2, content: 'Standar Editorial & Kualitas' },
      { id: 'pb4', type: 'paragraph', content: 'Seluruh konten dan panduan yang dipublikasikan melalui platform ini ditulis serta ditinjau oleh pakar industri teknologi untuk memastikan keakuratan, orisinalitas, dan nilai manfaat tinggi bagi para pembaca.' },
      { id: 'pb5', type: 'callout', content: '✨ **Misi Kami**: Menyediakan artikel edukasi teknologi berkualitas tinggi yang dapat diakses secara gratis oleh komunitas pengembang web modern.' }
    ]
  },
  {
    id: 'page-2',
    title: 'Kebijakan Privasi',
    slug: 'kebijakan-privasi',
    excerpt: 'Kebijakan privasi resmi mengenai pengumpulan data anonim, penggunaan Google Cookies (DART Cookie), dan transparansi Google AdSense.',
    status: 'published',
    author: {
      name: 'Ernst Senior Dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Software Architect'
    },
    publishedAt: '2026-07-20T08:00:00.000Z',
    views: 195,
    seoTitle: 'Kebijakan Privasi (Privacy Policy) | ScholarCMS',
    seoDescription: 'Kebijakan privasi resmi ScholarCMS mengenai pengumpulan data, Cookie Google AdSense, dan hak privasi pengunjung.',
    blocks: [
      { id: 'pb1', type: 'heading', level: 1, content: 'Kebijakan Privasi (Privacy Policy)' },
      { id: 'pb2', type: 'paragraph', content: 'Di ScholarCMS, privasi pengunjung adalah prioritas utama kami. Dokumen Kebijakan Privasi ini menjelaskan jenis informasi yang dikumpulkan dan dicatat oleh ScholarCMS serta bagaimana kami menggunakannya.' },
      { id: 'pb3', type: 'heading', level: 2, content: 'Google DoubleClick DART Cookie & Iklan Pihak Ketiga' },
      { id: 'pb4', type: 'paragraph', content: 'Google adalah vendor pihak ketiga di situs kami. Google menggunakan cookie, yang dikenal sebagai DART cookie, untuk menayangkan iklan kepada pengunjung situs kami berdasarkan kunjungan mereka ke www.scholarcms.com dan situs lainnya di internet.' },
      { id: 'pb5', type: 'paragraph', content: 'Pengunjung dapat memilih untuk menolak penggunaan DART cookie dengan mengunjungi Kebijakan Privasi jaringan iklan dan konten Google di URL berikut: https://policies.google.com/technologies/ads' },
      { id: 'pb6', type: 'heading', level: 2, content: 'Mitra Periklanan Kami (Google AdSense)' },
      { id: 'pb7', type: 'paragraph', content: 'Beberapa pengiklan di situs kami mungkin menggunakan cookie dan web beacon. Mitra periklanan utama kami mencakup Google AdSense. Setiap mitra periklanan kami memiliki Kebijakan Privasi sendiri untuk kebijakan mereka tentang data pengguna.' },
      { id: 'pb8', type: 'heading', level: 2, content: 'Berkas Log (Log Files)' },
      { id: 'pb9', type: 'paragraph', content: 'ScholarCMS mengikuti prosedur standar penggunaan berkas log. Berkas ini mencatat pengunjung saat mereka mengunjungi situs web. Informasi yang dikumpulkan mencakup alamat IP, jenis peramban (browser), penyedia layanan internet (ISP), stempel tanggal/waktu, dan jumlah klik untuk menganalisis tren serta mengelola situs.' }
    ]
  },
  {
    id: 'page-3',
    title: 'Syarat & Ketentuan',
    slug: 'syarat-ketentuan',
    excerpt: 'Ketentuan dan aturan penggunaan materi serta layanan pada platform blog ScholarCMS.',
    status: 'published',
    author: {
      name: 'Ernst Senior Dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Software Architect'
    },
    publishedAt: '2026-07-20T08:00:00.000Z',
    views: 84,
    seoTitle: 'Syarat & Ketentuan (Terms of Service) | ScholarCMS',
    seoDescription: 'Aturan dan ketentuan penggunaan situs ScholarCMS.',
    blocks: [
      { id: 'pb1', type: 'heading', level: 1, content: 'Syarat & Ketentuan Penggunaan' },
      { id: 'pb2', type: 'paragraph', content: 'Selamat datang di ScholarCMS. Dengan mengakses dan menggunakan situs web ini, Anda dianggap telah menyetujui seluruh Syarat & Ketentuan yang berlaku di bawah ini.' },
      { id: 'pb3', type: 'heading', level: 2, content: 'Hak Cipta & Lisensi Konten' },
      { id: 'pb4', type: 'paragraph', content: 'Kecuali dinyatakan lain, ScholarCMS dan/atau pemberi lisensinya memegang hak kekayaan intelektual atas semua materi di ScholarCMS. Anda dapat mengakses materi ini untuk penggunaan pribadi dengan tunduk pada batasan dalam syarat dan ketentuan ini.' }
    ]
  },
  {
    id: 'page-4',
    title: 'Hubungi Kami',
    slug: 'hubungi-kami',
    excerpt: 'Informasi kontak resmi dan formulir komunikasi dengan tim redaksi ScholarCMS.',
    status: 'published',
    author: {
      name: 'Ernst Senior Dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Software Architect'
    },
    publishedAt: '2026-07-20T08:00:00.000Z',
    views: 110,
    seoTitle: 'Hubungi Kami (Contact Us) | ScholarCMS',
    seoDescription: 'Informasi kontak dan alamat komunikasi redaksi ScholarCMS.',
    blocks: [
      { id: 'pb1', type: 'heading', level: 1, content: 'Hubungi Tim Redaksi ScholarCMS' },
      { id: 'pb2', type: 'paragraph', content: 'Jika Anda memiliki pertanyaan, saran, kerja sama periklanan, atau pertanyaan umum terkait isi artikel, silakan hubungi tim kami melalui kontak berikut:' },
      { id: 'pb3', type: 'callout', content: '📧 **Email Redaksi Resmi**: admin@scholarcms.com\n🌐 **Alamat Situs**: https://scholarcms.com' }
    ]
  },
  {
    id: 'page-5',
    title: 'Disclaimer',
    slug: 'disclaimer',
    excerpt: 'Pernyataan penyangkalan tanggung jawab atas informasi dan materi tutorial pada blog.',
    status: 'published',
    author: {
      name: 'Ernst Senior Dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Software Architect'
    },
    publishedAt: '2026-07-20T08:00:00.000Z',
    views: 76,
    seoTitle: 'Disclaimer & Penyangkalan Tanggung Jawab | ScholarCMS',
    seoDescription: 'Batasan tanggung jawab informasi dan pengungkapan iklan sponsor.',
    blocks: [
      { id: 'pb1', type: 'heading', level: 1, content: 'Pernyataan Penyangkalan (Disclaimer)' },
      { id: 'pb2', type: 'paragraph', content: 'Seluruh informasi di situs web ini diterbitkan dengan niat baik dan hanya untuk tujuan informasi umum serta edukasi. ScholarCMS tidak memberikan jaminan tentang kelengkapan, keandalan, dan keakuratan informasi ini.' }
    ]
  }
];

export const INITIAL_MENUS = {
  header: [
    { id: 'm-1', label: 'Beranda', type: 'url', url: '/', level: 1, order: 1 },
    { id: 'm-2', label: 'Topik Blog', type: 'category', target: 'web-development', level: 1, order: 2 },
    { id: 'm-3', label: 'Web Development', type: 'category', target: 'web-development', level: 2, order: 3, parentId: 'm-2' },
    { id: 'm-4', label: 'UI & UX Design', type: 'category', target: 'ui-ux-design', level: 2, order: 4, parentId: 'm-2' },
    { id: 'm-5', label: 'Glassmorphism Design', type: 'url', url: '/post/desain-antarmuka-glassmorphism-micro-animations', level: 3, order: 5, parentId: 'm-4' },
    { id: 'm-6', label: 'Halaman Statis', type: 'page', target: 'tentang-kami', level: 1, order: 6 },
    { id: 'm-7', label: 'Tentang Kami', type: 'page', target: 'tentang-kami', level: 2, order: 7, parentId: 'm-6' },
    { id: 'm-8', label: 'Kebijakan Privasi', type: 'page', target: 'kebijakan-privasi', level: 2, order: 8, parentId: 'm-6' },
    { id: 'm-9', label: 'Syarat & Ketentuan', type: 'page', target: 'syarat-ketentuan', level: 2, order: 9, parentId: 'm-6' },
    { id: 'm-10', label: 'Hubungi Kami', type: 'page', target: 'hubungi-kami', level: 2, order: 10, parentId: 'm-6' }
  ],
  footer: [
    { id: 'f-1', label: 'Beranda', type: 'url', url: '/', level: 1, order: 1 },
    { id: 'f-2', label: 'Tentang Kami', type: 'page', target: 'tentang-kami', level: 1, order: 2 },
    { id: 'f-3', label: 'Kebijakan Privasi', type: 'page', target: 'kebijakan-privasi', level: 1, order: 3 },
    { id: 'f-4', label: 'Syarat & Ketentuan', type: 'page', target: 'syarat-ketentuan', level: 1, order: 4 },
    { id: 'f-5', label: 'Hubungi Kami', type: 'page', target: 'hubungi-kami', level: 1, order: 5 },
    { id: 'f-6', label: 'Disclaimer', type: 'page', target: 'disclaimer', level: 1, order: 6 },
    { id: 'f-7', label: 'Peta Situs (Sitemap)', type: 'url', url: '/sitemap.xml', level: 1, order: 7 }
  ]
};

