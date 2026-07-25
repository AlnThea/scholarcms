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

---

## [v1.2.2] - 2026-07-22

### 🛠️ Perbaikan & Pengondisian UI Editor
- **Tampilan Kondisional Meta Sidebar**: Mengkonfigurasi `RightMetaSidebar` dan tombol togglenya agar hanya muncul pada halaman pembuatan artikel baru (`/dashboard/posts/new`) serta penyuntingan artikel (`/dashboard/posts/edit/[id]`).
- **Input Judul Interaktif di Sidebar**: Menghapus atribut `readOnly` pada field Judul di `RightMetaSidebar.jsx` untuk memungkinkan penyuntingan judul secara langsung melalui sidebar.
- **Pengondisian Header Topbar**: Membatasi tampilan input judul artikel blog di topbar `src/app/dashboard/layout.jsx` hanya untuk rute editor artikel (`isEditorPage`), sehingga halaman dashboard lainnya tetap bersih.
- **Kompatibilitas Server Component Next.js**: Mempertahankan `src/app/layout.jsx` sebagai Server Component (menjaga ekspor `metadata` Next.js) dengan memindahkan logika `usePathname()` secara mandiri ke dalam Client Component `RightMetaSidebar.jsx`.

---

## [v1.3.0] - 2026-07-23

### 🚀 Fitur Baru & Peningkatan Arsitektur UI
- **Sistem Post Scheduling WordPress (Just-In-Time)**: Implementasi penjadwalan postingan otomatis berbasis *on-demand evaluation* saat artikel diakses tanpa memerlukan *server cron job*.
- **Desain Modularitas Aplikasi & UI Components (`src/components/ui/` & `src/components/dashboard/`)**: Refactoring dan pembuatan komponen UI reusabel (`Input.jsx`, `Select.jsx`, `Textarea.jsx`, `Button.jsx`, `Badge.jsx`, `PageHeader.jsx`, `StatsCard.jsx`, `DataTable.jsx`) yang diterapkan di seluruh halaman aplikasi (`RightMetaSidebar`, `TiptapEditor`, `/dashboard`, `/dashboard/posts`, `/dashboard/categories`, `/dashboard/comments`, `/dashboard/users`, `/dashboard/settings`, `/login`, `/register`).
- **Segmented Navigation Tabs pada Meta Sidebar**: Refactoring `RightMetaSidebar.jsx` menggunakan 5 tab bernavigasi responsif (`⚙️ Umum`, `🌐 SEO & URL`, `🏷️ Taksonomi`, `🎨 Media`, `📢 Publikasi`) dengan *Author Badge* terintegrasi.
- **Redesain Layout Editor & Formatting Toolbar (`TiptapEditor.jsx`)**: Toolbar tombol formatting (B, I, S, <>, H2, H3, List, Quote, Undo, Redo) disatukan di bagian atas kanvas editor dengan bentuk kotak presisi rata (*square rectangle*) tanpa *gap* (`gap-0`) terhadap Palet Komponen.
- **Otomatisasi 100% Media Gambar, Kategori (Auto-Create), & Tag SEO**: Pembaruan generator AI pada [aiService.js](file:///c:/web/scholarcms/src/services/aiService.js) dan [TiptapEditor.jsx](file:///c:/web/scholarcms/src/components/admin/TiptapEditor.jsx). Sekali klik **`✨ Hasilkan Artikel Berkualitas`**, AI secara otomatis menghasilkan:
  1. 🖼️ **Gambar Sampul / Featured Cover Image**: URL gambar resolusi tinggi yang relevan diisi langsung ke Meta Sidebar (`featuredImage`).
  2. 📸 **Gambar In-Article**: Tag `<img src="..." class="w-full max-h-[450px] object-cover rounded-2xl my-6 shadow-md" />` disisipkan di dalam isi teks kanvas editor.
  3. 📂 **Kategori Otomatis & Auto-Create Database**: AI menentukan Kategori artikel. Jika nama Kategori belum ada di database Firestore, sistem otomatis membuatkan Kategori baru dan memilihnya di Meta Sidebar.
  4. 🏷️ **Tag SEO Otomatis**: AI membuat 3-4 kata kunci tag SEO yang langsung terisi pada Meta Sidebar.
- **Deteksi Otomatis Gaya Penulisan (`Tone of Voice`)**: Penambahan opsi `🤖 Otomatis (Disesuaikan AI dari Judul Topik)` pada [AiGenerateModal.jsx](file:///c:/web/scholarcms/src/components/admin/AiGenerateModal.jsx) yang menganalisis kata kunci judul (seperti *"Panduan"*, *"Analisis"*, *"Tips"*) dan menentukan gaya bahasa paling cocok secara otomatis.
- **Perbaikan CSS Sticky Positioning**: Menghapus properti `overflow-hidden` pada kontainer form utama agar Palet Komponen Sidebar dan Formatting Toolbar dapat melayang (*sticky*) dengan sempurna di posisi `top-16` layar saat dokumen kanvas di-scroll ke bawah.

---

## [v1.4.0] - 2026-07-24

### 🚀 Fitur Baru Utama & Pengelola Navigasi WordPress
- **Sistem Halaman Statis WordPress (Static Pages CMS)**:
  - Penambahan rute dashboard `/dashboard/pages`, `/dashboard/pages/new`, dan `/dashboard/pages/edit/[id]` untuk membuat & mengedit halaman statis independen (Tentang Kami, Kebijakan Privasi, Kontak, dll.) menggunakan editor visual Tiptap/Gutenberg.
  - Penambahan rute publik `/page/[slug]` dan rute generik `/[slug]` yang merender halaman statis secara elegan dengan schema structured data JSON-LD.
- **Pengelola Menu Navigasi Drag & Drop 3 Level (Navbar & Footer)**:
  - Pembuat & pengatur menu navigasi interaktif di `/dashboard/menus` dengan dukungan *drag & drop* serta tombol *indent/outdent* perlevelan (Level 1 → Level 2 → Level 3).
  - Mendukung 3 tipe item navigasi: **Kategori Blog** 📂, **Halaman Statis** 📄, dan **Custom URL** 🔗.
  - Integrasi rendering menu hirarki 3-level secara dinamis pada [Navbar.jsx](file:///c:/web/scholarcms/src/components/layout/Navbar.jsx) (dengan multi-level dropdown hover/click) dan [Footer.jsx](file:///c:/web/scholarcms/src/components/layout/Footer.jsx).
- **Ekstensi Service Layer (`dbService.js`)**:
  - Penambahan metode `getPages`, `getPageBySlug`, `getPageById`, `savePage`, `deletePage`, `getMenu`, dan `saveMenu` dengan dukungan Firestore Cloud DB & Fallback Storage Mode.

---

## [v1.4.1] - 2026-07-25

### 🛠️ Perbaikan UI Editor, Native Placeholder, & Firestore Rules
- **Placeholder Judul Dinamis**:
  - Input judul pada topbar [layout.jsx](file:///c:/web/scholarcms/src/app/dashboard/layout.jsx) dan Meta Sidebar [RightMetaSidebar.jsx](file:///c:/web/scholarcms/src/components/admin/RightMetaSidebar.jsx) menyesuaikan placeholder & label secara otomatis berdasarkan konteks editor (`Judul Artikel Blog...` untuk post vs `Judul Halaman Statis...` untuk page).
- **Placeholder Asli Tiptap (Native Tiptap Placeholder)**:
  - Mengubah fallback HTML teks biasa `<p>Mulai tulis...</p>` di [TiptapEditor.jsx](file:///c:/web/scholarcms/src/components/admin/TiptapEditor.jsx) menjadi string kosong (`""`) agar ekstensi `Placeholder` Tiptap berjalan secara murni dan otomatis hilang saat diketik.
  - Penambahan styling CSS `.ProseMirror p.is-editor-empty:first-child::before` pada [globals.css](file:///c:/web/scholarcms/src/app/globals.css).
- **Perbaikan Mode Pratinjau & Tombol Editor**:
  - Mengonfigurasi toolbar atas agar tetap terlihat melayang saat beralih ke mode `Pratinjau`, memungkinkan penguncian kembali ke `Mode Editor` secara instan.
  - Merapikan render ikon tombol Pratinjau/Editor menjadi 1 ikon Lucide presisi (`Eye` vs `Edit3`).
- **Pembaruan Spesifikasi Firestore Security Rules**:
  - Memperbarui dokumentasi [DATABASE.md](file:///c:/web/scholarcms/documentation/DATABASE.md) dengan spesifikasi izin koleksi `match /pages/{pageId}` dan `match /menus/{menuId}`.

---

## [v1.4.2] - 2026-07-25

### 🚀 Fitur Baru & Peningkatan UX Editor
- **Palet Komponen Collapse - Extend (`BlockPaletteSidebar.jsx`)**:
  - Penambahan fitur toggle **Collapse (Ciutkan)** dan **Extend (Perluas)** pada Palet Komponen Gutenberg Editor di sebelah kiri layar.
  - Pada mode **Collapse**, lebar sidebar menyusut menjadi `w-16` (64px) dan daftar blok secara otomatis berubah menjadi **1 kolom ikon** (*single-column icon view*) yang super rapi dan hemat tempat.
  - Pada mode **Extend**, sidebar kembali ke ukuran normal (`w-64 sm:w-72`) dengan 5 grup kategori blok dan label nama lengkap.
  - Menyimpan preferensi state pada `localStorage` (`scholarcms_palette_collapsed`) sehingga pilihan mode tetap bertahan saat halaman di-refresh.
- **Suite Blok Lengkap H1-H6 & 5 Pengelompokan Kategori**:
  - Menyediakan koleksi blok lengkap (Paragraf, Lead, H1-H6, List Bullet, List Angka, Checklist, Tabel Data, Quote, Code, 4 Tipe Callout Alert, Gambar, Video YouTube, Tombol CTA Link, Accordion FAQ, HR) yang dikelompokkan ke dalam 5 grup terstruktur.
- **WordPress Gutenberg Visual Block Containers & Unified Sticky Toolbar Header**:
  - Setiap paragraf, judul, quote, dan elemen pada kanvas Tiptap terbingkai sebagai **Visual Block Container** (`.ProseMirror > *`) dengan efek hover outline dan border fokus aktif.
  - Penambahan **Unified Sticky Gutenberg Toolbar Header** (melayang di `top-16`) yang menyatukan Aksi Navigasi/Publikasi, Detektor Blok Aktif, Converter Tipe Blok Cepat, serta Toolbar Format Teks Lengkap (Undo, Redo, Bold, Italic, Underline <u>U</u>, Strikethrough, Inline Code `</>`, Tautan Link 🔗, Hapus Format 🧹, dan Hapus Blok 🗑️).
- **Custom React Prompt Modals (`InsertMediaModal.jsx`)**:
  - Menggantikan seluruh popup dialog abu-abu kaku bawaan browser (`window.prompt`) dengan **Modal Popup Kustom React** bergaya modern Glassmorphism (dengan Live Image Preview & checkbox tab baru) untuk penyisipan Link, Gambar, Video YouTube, dan Tombol CTA.




