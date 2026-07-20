# Arsitektur & Struktur Proyek ScholarCMS

Panduan arsitektur folder dan struktur kode untuk **ScholarCMS** (WordPress-style Blog Engine berbasis Next.js 14 App Router, Firebase, & Role-Based Access Control).

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
│   │   │   │   └── page.jsx      # Daftar Semua Artikel (Filtered by Role)
│   │   │   ├── settings/         # Status Koneksi DB & Reset Demo (page.jsx)
│   │   │   ├── users/            # Kelola Pengguna & Peran RBAC (page.jsx)
│   │   │   ├── layout.jsx        # Shell Layout Admin (Role Switcher Toolbar & Sidebar)
│   │   │   └── page.jsx          # Admin Analytics Dashboard Overview
│   │   ├── login/                # Halaman Login Autentikasi (page.jsx)
│   │   ├── register/             # Halaman Pendaftaran Akun (page.jsx)
│   │   ├── post/[slug]/          # Reader Single Article View Dynamic Route (page.jsx)
│   │   ├── globals.css           # Styling System, CSS Tokens, & Gutenberg Block Typo
│   │   ├── layout.jsx            # Root HTML, AuthProvider & Metadata SEO Layout
│   │   └── page.jsx              # Blog Homepage Feed & Hero Featured Post
│   │
│   ├── components/               # Komponen UI Reusable
│   │   ├── admin/                # Komponen Khusus Admin (GutenbergEditor.jsx)
│   │   ├── blog/                 # Komponen Khusus Pembaca Blog (HeroFeatured.jsx, PostCard.jsx)
│   │   └── layout/               # Komponen Layout Shell (Navbar.jsx, Footer.jsx)
│   │
│   ├── context/                  # Context State Management
│   │   ├── AuthContext.jsx       # Auth Provider (currentUser, role, login, register, logout, switchRole)
│   │   └── ThemeContext.jsx      # Theme Provider (isDark, toggleTheme, persistent localStorage)
│   │
│   ├── services/                 # Abstraksi Layer Bisnis & Data Service
│   │   ├── authService.js        # Autentikasi Firebase Auth & Auto Admin First User
│   │   └── dbService.js          # Unified CRUD API (Firebase + Local Storage Fallback)
│   │
│   ├── lib/                      # SDK Configurations
│   │   └── firebase.js           # Firestore, Auth, & Storage SDK Auto-Detector
│   │
│   └── constants/                # Data Seeds & Konstanta
│       └── mockData.js           # Initial Categories, Posts, & Comments
│
├── documentation/                # Dokumentasi Teknis Proyek
│   ├── STRUCTURE.md              # Penjelasan struktur direktori (File Ini)
│   ├── INSTALL.md                # Panduan pengoperasian & integrasi Firebase
│   ├── DATABASE.md               # Spesifikasi skema Firestore DB & Users collection
│   ├── DEVOPS.md                 # Panduan deployment Vercel / Netlify
│   └── CHANGELOG.md              # Riwayat pembaruan & rilis kode
│
├── .env                          # Variabel Lingkungan / Kredensial Firebase
├── jsconfig.json                 # Path Aliases (@/* -> ./src/*)
├── next.config.js                # Konfigurasi Bundler Next.js
├── postcss.config.js             # Konfigurasi Plugin @tailwindcss/postcss (Tailwind v4)
└── package.json                  # Manajemen Dependensi Proyek (Tailwind CSS v4.3.3)
```

---

## 🔐 Sistem Role-Based Access Control (RBAC)

- **Admin 👑**: Akses penuh ke seluruh menu (`/admin`, `/admin/posts`, `/admin/categories`, `/admin/comments`, `/admin/users`, `/admin/settings`).
- **Writer ✍️**: Akses mengelola artikel milik penulis tersebut (`/admin`, `/admin/posts`, `/admin/posts/new`, `/admin/comments`).
- **User 👤**: Pengunjung terdaftar dengan hak membaca artikel, mengunggah komentar, dan melihat profil.
