export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Web Development', slug: 'web-development', color: '#2563eb', description: 'Panduan dan tutorial seputar React, Next.js, & CSS modern.' },
  { id: 'cat-2', name: 'Firebase & Cloud', slug: 'firebase-cloud', color: '#f59e0b', description: 'Arsitektur database Firestore, Auth, dan Serverless Functions.' },
  { id: 'cat-3', name: 'UI & UX Design', slug: 'ui-ux-design', color: '#ec4899', description: 'Prinsip desain antarmuka, glassmorphism, dan sistem desain.' },
  { id: 'cat-4', name: 'AI & Machine Learning', slug: 'ai-machine-learning', color: '#8b5cf6', description: 'Penerapan AI Generatif dalam aplikasi web modern.' }
];

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Panduan Lengkap Membangun CMS Modern Ala WordPress dengan Next.js 14 dan Firebase',
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
    title: 'Implementasi AI Assistant dalam Editor Artikel WordPress Gutenberg',
    slug: 'implementasi-ai-assistant-editor-gutenberg',
    excerpt: 'Bagaimana kecerdasan buatan membantu kreator konten dalam menghasilkan draft artikel, memeriksa tata bahasa, dan membuat ringkasan otomatis.',
    category: 'AI & Machine Learning',
    tags: ['AI', 'Gutenberg', 'Content Creation'],
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    author: {
      name: 'Alex AI Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'AI Researcher'
    },
    publishedAt: '2026-07-18T09:15:00.000Z',
    views: 489,
    readTime: '5 min read',
    blocks: [
      { id: 'b1', type: 'paragraph', content: 'Editor berbasis blok seperti Gutenberg memberikan struktur yang sangat ideal bagi AI untuk membantu menulis konten secara modular per-paragraf atau per-heading.' }
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
