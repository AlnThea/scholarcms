# Catatan Perubahan & Riwayat Rilis (CHANGELOG)

Seluruh perubahan penting pada proyek **ScholarCMS** dicatat dalam dokumen ini.

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
