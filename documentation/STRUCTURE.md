# Arsitektur & Struktur Proyek ScholarCMS

## 📦 Ringkasan Proyek Saat Ini

Proyek **ScholarCMS** adalah mesin blog & publishing platform berbasis **Next.js 14 App Router**, menggunakan **Firebase Firestore** untuk data dan **Role‑Based Access Control (RBAC)** serta dilengkapi **Sistem Tema** dan **Sistem Plugin**. Berikut adalah gambaran singkat struktur direktori utama (diperbarui pada 2026‑07‑27):

```text
scholarcms/
├─ src/
│  ├─ app/
│  │  ├─ dashboard/
│  │  ├─ login/
│  │  ├─ register/
│  │  ├─ post/
│  │  ├─ globals.css
│  │  ├─ layout.jsx
│  │  └─ page.jsx
│  ├─ themes/
│  ├─ plugins/
│  ├─ components/
│  ├─ context/
│  ├─ lib/
│  ├─ services/
│  └─ constants/
├─ documentation/
├─ .env
├─ next.config.js
└─ package.json
```

*(Catatan: direktori `node_modules`, `.next`, dan `.git` tidak termasuk dalam dokumen karena bersifat otomatis.)*

Panduan arsitektur folder dan struktur kode untuk **ScholarCMS** (Publishing Platform berbasis Next.js 14 App Router, Firebase, & Role-Based Access Control).

---

## 📁 Pohon Direktori Utama

```
scholarcms/
├── src/                          # Direktori Utama Kode Sumber
│   ├── app/                      # Next.js 14 App Router (Routing & Pages)
│   │   ├── admin/                # Legacy admin folder – contains only redirect components to `/dashboard/*`
│   │   ├── dashboard/            # Primary dashboard UI (admin, writer, user)
│   │   │   ├── categories/       # Kelola Kategori & Warna Aksen (page.jsx)
│   │   │   ├── comments/         # Moderasi Komentar Pengunjung (page.jsx)
│   │   │   ├── menus/            # Pengelola Menu Navigasi Drag & Drop 3 Level (page.jsx)
│   │   │   ├── pages/            # Tabel & Pengelola Halaman Statis (page.jsx, new/page.jsx, edit/[id]/page.jsx)
│   │   │   ├── posts/            # Tabel Postingan & Visual Block Editor
│   │   │   ├── edit/[id]/        # Mode Edit Artikel Dynamic Route (page.jsx)
│   │   │   ├── new/              # Mode Tambah Artikel Baru (page.jsx)
│   │   │   └── page.jsx          # Daftar Semua Artikel (Filtered by Role)
│   │   │   ├── themes/           # Pengelola Tema Blog & Visual Customizer (page.jsx)
│   │   │   ├── plugins/          # Pengelola Plugin Blog & Impor JSON (page.jsx)
│   │   │   ├── [...pluginRoute]/ # Dynamic Catch-All Plugin Router (page.jsx)
│   │   │   ├── settings/         # Status Koneksi DB & Settings CMS (page.jsx)
│   │   │   ├── users/            # Kelola Pengguna & Peran RBAC (page.jsx)
│   │   │   ├── layout.jsx        # Shell Layout Dashboard (Dynamic Sidebar & Header)
│   │   │   └── page.jsx          # Dashboard Overview (Analytics)
│   │   ├── login/                # Halaman Login Autentikasi (page.jsx)
│   │   ├── register/             # Halaman Pendaftaran Akun (page.jsx)
│   │   ├── page/[slug]/          # Reader Single Static Page Dynamic Route (page.jsx)
│   │   ├── post/[slug]/          # Reader Single Article View Dynamic Route (page.jsx)
│   │   ├── globals.css           # Styling System, CSS Tokens, & Visual Block Typo
│   │   ├── layout.jsx            # Root HTML, AuthProvider & Metadata SEO Layout
│   │   └── page.jsx              # Blog Homepage Feed (Dynamic Theme Renderer)
│   │
│   ├── themes/                   # Sistem Tema Blog (Modular Themes Engine)
│   │   ├── modern/               # Tema 1: Modern Glassmorphism (Default)
│   │   ├── editorial/            # Tema 2: Editorial News & Gazette (Portal Berita Layout)
│   │   ├── minimalist/           # Tema 3: Minimalist Tech & Essay (Medium-Style Layout)
│   │   └── index.js              # Unified Theme Resolver & Universal Dynamic Engine
│   │
│   ├── plugins/                  # Sistem Plugin Blog (Dynamic Plugin Engine)
│   │   ├── seo-analyzer/         # Plugin 1: SEO Analyzer & Realtime Auditor
│   │   ├── newsletter/           # Plugin 2: Newsletter & Subscriber Manager
│   │   ├── whatsapp-float/       # Plugin 3: WhatsApp Contact Floating Button Widget
│   │   └── index.js              # Unified Plugin Resolver & Navigation Injector
│   │
│   ├── components/               # Komponen UI Reusable
│   │   ├── admin/                # Komponen Khusus Admin/Editor (TiptapEditor.jsx, BlockPaletteSidebar.jsx, RightMetaSidebar.jsx)
│   │   ├── blog/                 # Komponen Pembaca Blog (ThemeRenderer.jsx, PluginWidgetInjector.jsx, HeroFeatured.jsx, PostCard.jsx)
│   │   ├── dashboard/            # Komponen Dashboard Modular (PageHeader.jsx, StatsCard.jsx, DataTable.jsx)
│   │   ├── layout/               # Komponen Layout Shell (Navbar.jsx, Footer.jsx)
│   │   └── ui/                   # Komponen Design System Modular (Input.jsx, Select.jsx, Textarea.jsx, Button.jsx, Badge.jsx)
│   │
│   ├── context/                  # Context State Management
│   │   ├── AuthContext.jsx       # Auth Provider (currentUser, role, login, register, logout, switchRole)
│   │   └── ThemeContext.jsx      # Theme Provider (isDark, toggleTheme, persistent localStorage)
│   │
│   ├── services/                 # Abstraksi Layer Bisnis & Data Service
│   │   ├── authService.js        # Autentikasi Firebase Auth & Auto Admin First User
      └── dbService.js          # Unified CRUD API (Posts, Pages, Menus, Themes, Plugins, Subscribers)
│   │
│   ├── lib/                      # SDK Configurations
│   │   └── firebase.js           # Firestore, Auth, & Storage SDK Auto-Detector
│   │
│   └── constants/                # Data Seeds & Konstanta
│       └── mockData.js           # Initial Categories, Posts, Comments, & Legal Pages
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
└── package.json                  # Manajemen Dependensi Proyek
```

---

## 🔐 Sistem Role-Based Access Control (RBAC)

- **Admin 👑**: Akses penuh ke seluruh menu (`/dashboard`, `/dashboard/posts`, `/dashboard/pages`, `/dashboard/categories`, `/dashboard/menus`, `/dashboard/themes`, `/dashboard/plugins`, `/dashboard/comments`, `/dashboard/users`, `/dashboard/settings`).
- **Writer ✍️**: Akses mengelola artikel milik penulis tersebut (`/dashboard`, `/dashboard/posts`, `/dashboard/posts/new`, `/dashboard/pages`, `/dashboard/comments`).
- **User 👤**: Pengunjung terdaftar dengan hak membaca artikel, mengunggah komentar, dan melihat profil.
