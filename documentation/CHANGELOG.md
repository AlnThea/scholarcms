# Catatan Perubahan & Riwayat Rilis (CHANGELOG)

Seluruh perubahan penting pada proyek **ScholarCMS** dicatat dalam dokumen ini.

## [v1.1.0] - 2026-07-20

### 🚀 Peningkatan & Fitur Baru
- **Upgrade Tailwind CSS v4.3.3**: Pembaruan sistem styling ke Tailwind CSS v4 menggunakan `@tailwindcss/postcss` dan arsitektur CSS `@import "tailwindcss";`.
- **Sistem Tema Terpusat (`ThemeContext`)**: Sakelar Dark/Light mode yang tersimpan secara permanen di `localStorage` (`scholarcms_theme`) dengan pencegahan berkedip (*FOUC*) saat *refresh*.
- **Pengamanan Rute Admin (Auth Guard)**: Rute `/admin` terlindungi secara ketat. Pengunjung tanpa sesi akan otomatis dialihkan ke halaman `/login`.
- **Otomatisasi Role Admin Pertama**: Pengguna pertama yang mendaftar pada database Firestore otomatis menjadi `admin` 👑, sedangkan pendaftaran berikutnya menjadi `user` 👤.
- **Pembersihan Akun Dummy**: Menghapus tombol *Demo Login* dan *fallback Administrator* lokal untuk menjamin keamanan autentikasi murni Firebase Auth.

---

## [v1.0.0] - 2026-07-20

### 🚀 Fitur Baru Utama
- **Public Blog Feed**: Beranda blog dengan Hero Featured post, grid artikel modern, filter topik, pencarian real-time, dan Dark/Light theme toggle.
- **Single Article Reader View (`/post/[slug]`)**: Penataan tampilan artikel berbasis blok visual Gutenberg, view counter, tombol bagikan tautan, dan form komentar interaktif.
- **WordPress Admin Dashboard (`/admin`)**: Shell layout admin dengan sidebar gelap ala WordPress (`#1d2327`) dan analitik statistik artikel/pembaca/komentar.
- **Gutenberg Visual Block Editor (`/admin/posts/new` & `/admin/posts/edit/[id]`)**: Editor artikel berbasis blok (Paragraf, Heading, Quote, Code Snippet, Callout box) dengan kemampuan susun ulang (*reorder*).
- **Manajemen Kategori (`/admin/categories`)**: Pengelolaan kategori artikel lengkap dengan pemilih warna aksen Hex.
- **Moderasi Komentar (`/admin/comments`)**: Fitur setujui (*approve*), tolak (*reject*), dan hapus komentar dari pembaca.
- **Firebase Hybrid Service (`src/services/dbService.js`)**: Auto-fallback ke *Demo Local Storage Mode* saat kredensial `.env` belum terisi, dan otomatis terhubung ke Firestore Cloud DB saat kredensial valid.

### 🏗️ Arsitektur & Pengorganisasian Kode
- **Penerapan Struktur Enterprise `src/`**: Pengelompokan terstruktur untuk `src/app/`, `src/components/`, `src/services/`, `src/lib/`, dan `src/constants/`.
- **Pembersihan Root Folder**: Folder duplikat lama telah dibersihkan sehingga direktori utama 100% rapi.
- **Dokumentasi Lengkap**: Penambahan dan penyempurnaan file `STRUCTURE.md`, `INSTALL.md`, `DATABASE.md`, `DEVOPS.md`, dan `CHANGELOG.md`.

## [v1.2.0] - 2026-07-20

### 🔧 Perubahan & Fixes
- Migrated all `/admin/*` routes to `/dashboard/*` using redirect components.
- Updated navigation links, role‑based menu, and layout to reference `/dashboard` paths.
- Added `src/app/dashboard/` folder with primary UI; `src/app/admin/` now only contains redirect stubs.
- Updated `documentation/STRUCTURE.md` and this `CHANGELOG.md` to reflect the new route structure.
- Ensured build passes without errors.
# v1.2.1 - 2026-07-21

### 🛠️ Perbaikan & Penyempurnaan
- **Sinkronisasi Slug pada Dashboard**: Memperbaharui input judul di `src/app/dashboard/layout.jsx` sehingga slug selalu dihasilkan secara otomatis pada setiap perubahan judul, bukan hanya ketika slug kosong.
- **Tampilan Slug di TiptapEditor**: Mengubah tampilan slug menjadi ekspresi JSX dinamis `{`/post/${slug || 'judul-artikel'}`}` di `src/components/admin/TiptapEditor.jsx` agar selalu menampilkan nilai slug terkini.
- **Dokumentasi**: Memperbarui `CHANGELOG.md` dengan entri ini serta menyesuaikan referensi di dokumentasi terkait.

