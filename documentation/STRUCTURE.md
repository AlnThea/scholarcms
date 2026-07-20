# Arsitektur & Struktur Proyek ScholarCMS

Panduan arsitektur folder dan struktur kode untuk **ScholarCMS** (WordPress-style Blog Engine berbasis Next.js 14 App Router & Firebase).

---

## 📁 Pohon Direktori Utama

```
scholarcms/
├── src/                          # Direktori Utama Kode Sumber
│   ├── app/                      # Next.js 14 App Router (Routing & Pages)
│   │   ├── admin/                # Core Dashboard Admin WordPress
│   │   │   ├── categories/       # Kelola Kategori & Warna Aksen (page.jsx)
│   │   │   ├── comments/         # Moderasi Komentar Pengunjung (page.jsx)
│   │   │   ├── posts/            # Tabel Postingan & Gutenberg Editor
│   │   │   │   ├── edit/[id]/    # Mode Edit Artikel Dynamic Route (page.jsx)
│   │   │   │   ├── new/          # Mode Tambah Artikel Baru (page.jsx)
│   │   │   │   └── page.jsx      # Daftar Semua Artikel
│   │   │   ├── settings/         # Status Koneksi DB & Reset Demo (page.jsx)
│   │   │   ├── layout.jsx        # Shell Layout Admin (WordPress Dark Sidebar)
│   │   │   └── page.jsx          # Admin Analytics Dashboard Overview
│   │   ├── post/[slug]/          # Reader Single Article View Dynamic Route (page.jsx)
│   │   ├── globals.css           # Styling System, CSS Tokens, & Gutenberg Block Typo
│   │   ├── layout.jsx            # Root HTML & Metadata SEO Layout
│   │   └── page.jsx              # Blog Homepage Feed & Hero Featured Post
│   │
│   ├── components/               # Komponen UI Reusable
│   │   ├── admin/                # Komponen Khusus Admin
│   │   │   └── GutenbergEditor.jsx # Visual Gutenberg Block Editor Engine
│   │   ├── blog/                 # Komponen Khusus Pembaca Blog
│   │   │   ├── HeroFeatured.jsx  # Hero Banner Artikel Utama
│   │   │   └── PostCard.jsx      # Kartu Postingan Blog
│   │   └── layout/               # Komponen Layout Shell
│   │       ├── Navbar.jsx        # Header Navigasi & Dark Mode Toggle
│   │       └── Footer.jsx        # Footer Informasi Proyek
│   │
│   ├── services/                 # Abstraksi Layer Bisnis & Data Service
│   │   └── dbService.js          # Unified CRUD API (Firebase + Local Storage Fallback)
│   │
│   ├── lib/                      # SDK Configurations
│   │   └── firebase.js           # Firestore & Auth SDK Auto-Detector
│   │
│   └── constants/                # Data Seeds & Konstanta
│       └── mockData.js           # Initial Categories, Posts, & Comments
│
├── documentation/                # Dokumentasi Teknis Proyek
│   ├── STRUCTURE.md              # Penjelasan struktur direktori (File Ini)
│   ├── INSTALL.md                # Panduan pengoperasian & integrasi Firebase
│   ├── DATABASE.md               # Spesifikasi skema Firestore DB
│   ├── DEVOPS.md                 # Panduan deployment Vercel / Netlify
│   └── CHANGELOG.md              # Riwayat pembaruan & rilis kode
│
├── .env                          # Variabel Lingkungan / Kredensial Firebase
├── jsconfig.json                 # Path Aliases (@/* -> ./src/*)
├── next.config.js                # Konfigurasi Bundler Next.js
├── tailwind.config.js            # Konfigurasi Utility Styling & Theme
└── package.json                  # Manajemen Dependensi Proyek
```

---

## 🛠️ Penjelasan Modul Utama

### 1. `src/app/`
Menggunakan **Next.js 14 App Router**. Semua rute berbasis struktur folder:
- `/` (`src/app/page.jsx`): Beranda utama blog dengan feed artikel, search filter, dan sidebar populer.
- `/post/[slug]` (`src/app/post/[slug]/page.jsx`): Halaman pembaca artikel dengan Gutenberg block rendering dan sistem komentar.
- `/admin` (`src/app/admin/page.jsx`): Dashboard admin dengan visual statistik analitik.

### 2. `src/services/dbService.js`
Menyediakan interface terpadu (*Unified API Interface*) untuk melakukan operasi CRUD (Create, Read, Update, Delete). Service ini mampu secara otomatis mendeteksi status `.env`:
- Jika kredensial Firebase valid -> Terhubung langsung ke **Firebase Firestore Cloud DB**.
- Jika kredensial placeholder -> Berjalan pada **Demo Local Storage Mode**.

### 3. `src/components/admin/GutenbergEditor.jsx`
Editor visual berbasis blok ala WordPress Gutenberg. Mendukung penambahan, pengeditan, penyusunan ulang (*drag/reorder*), dan penataan blok paragraf, heading H2/H3, blockquote, code snippet, serta callout box.
