# Catatan Perubahan & Riwayat Rilis (CHANGELOG)

Seluruh perubahan penting pada proyek **ScholarCMS** dicatat dalam dokumen ini.

## [v2.0.0] - 2026-07-28

### 🚀 Custom Canvas 10-Kolom Modular, Suite Chart Visual (Pie, Bar, Dual-Line, Gauge), RBAC Access Control & Single-Portal HUD Engine
- **Engine Canvas 10-Kolom Modular & Clean Viewing Mode ([page.jsx](file:///c:/web/scholarcms/src/app/dashboard/page.jsx))**:
  - Peluncuran mode tampilan bersih (*Clean Viewing Mode*) dengan tombol aksi melayang di pojok kanan atas canvas (`✏️ Kustomisasi Tata Letak Dashboard`).
  - Dukungan lengkap 20+ opsi dimensi matriks grid (`2×1`, `2×2`, `2×3`, `3×1`, `3×2`, `3×3`, `4×1`, `4×2`, `4×3`, `5×1`, `5×2`, `5×3`, `6×1`, `6×2`, `6×3`, `7×1`, `7×2`, `7×3`, `10×1`, `10×2`).
  - Fitur paksaan alur baris baru (*Row Break*) via `col-start-1` per widget.
- **Draggable Inspector Modal & Viewport Portal (`createPortal`)**:
  - Modal pengontrol melayang (*Draggable Floating Inspector Panel*) dengan pegangan header pointer-events.
  - Perbaikan rumus pembatas seretan bawah (`maxY = window.innerHeight - 80px`), memungkinkan panel ditarik bebas ke paling bawah layar.
  - Penggunaan React `createPortal(..., document.body)` dengan `zIndex: 9999`, menjamin modal pengontrol melayang tetap melayang kokoh saat halaman di-scroll ke bawah.
- **Role-Based Access Control (RBAC) & Role View Switcher**:
  - Pembatasan peranan akses widget (*Super Admin*, *Writer / Penulis*, *Regular User*) pada canvas dan Katalog Widget Dashboard modal.
  - Penambahan menu selector pratinjau peranan (*Role View Switcher*) pada bar kontrol Mode Edit untuk menguji pratinjau tampilan peranan lain secara langsung.
- **Koleksi Chart & Tabel Visual Baru**:
  - **Chart Pie Lingkaran Penuh (`chart_traffic_source_pie`)**: Visual SVG Pie Chart sumber kedatangan pembaca.
  - **Chart Batang Horisontal (`chart_top_posts_hbar`)**: Visual Horizontal Bar Chart artikel paling populer.
  - **Chart Garis Komparasi Dual (`chart_dual_line_comparison`)**: Visual Dual Overlay Line Chart perbandingan rilis vs pembaca.
  - **Chart Stacked Bar (`chart_post_status_stacked`)**: Visual Stacked Bar Chart status artikel bulanan.
  - **Chart Speedometer Gauge (`chart_speedometer_gauge`)**: Visual Semi-circular Gauge Chart skor kecepatan muat CMS.
  - **Tabel Moderasi Komentar Cepat & Tabel Kesehatan SEO Artikel**: Tabel interaktif aksi 1-klik di dashboard.
- **Optimalisasi Sinkronisasi Stempel Waktu & Instant Fallback Cache ([dbService.js](file:///c:/web/scholarcms/src/services/dbService.js))**:
  - Penambahan stempel waktu (`updatedAt`) pada `saveDashboardWidgetLayout` dan pemuatan instan (`0ms`) dari LocalStorage cache.
  - Penambahan metode `getCurrentUser()` dan pembersihan pesan error peringatan permission cloud.
  - Penataan ulang Banner Selamat Datang (*Executive Modular Welcome Card*) dengan gradasi warna biru-purple premium dan kaca transparan (*glassmorphism*).

---

## [v1.9.0] - 2026-07-27

### 🚀 Production Email Dispatcher, SEO Auto-Fit, Fast Hydration & Complete Dev Docs
- **Serverless Production Email Engine ([/api/send-email](file:///c:/web/scholarcms/src/app/api/send-email/route.js))**:
  - API Route Serverless backend terhubung ke **Resend API** (`re_...`) dan **SendGrid API** (`SG....`) dengan fallback *Demo Simulation Mode*.
  - Dukungan konfigurasi dinamis melalui UI Dashboard (`/dashboard/newsletter`) dan berkas **[.env](file:///c:/web/scholarcms/.env)** (`RESEND_API_KEY`, `SENDGRID_API_KEY`, `NEWSLETTER_SENDER_EMAIL`, `NEWSLETTER_SENDER_NAME`, `NEXT_PUBLIC_NEWSLETTER_SENDER_EMAIL`, `NEXT_PUBLIC_NEWSLETTER_SENDER_NAME`).
  - **3 Alur Pengiriman Email**: *Manual Broadcast Pengumuman*, *Auto-Welcome Email*, dan *Auto-Notify New Post Publish* (otomatis mengirim email notifikasi ke seluruh subscriber saat artikel baru terbit di `/dashboard/posts/new`).
- **Otomatisasi Hasil AI Lulus SEO 100/100 (`fitSeoTitle` & `fitSeoExcerpt`)**:
  - Penambahan fungsi sanitizer pada [aiService.js](file:///c:/web/scholarcms/src/services/aiService.js) yang secara otomatis memotong & menyesuaikan Judul (30–60 karakter) dan Meta Description (50–150 karakter) sehingga **setiap artikel buatan AI 100% otomatis lulus audit SEO dengan skor 100/100**.
- **Sinkronisasi Bahasa Rekomendasi Niche & Artikel AI**:
  - Memperbarui [AiGenerateModal.jsx](file:///c:/web/scholarcms/src/components/admin/AiGenerateModal.jsx) agar daftar rekomendasi Niche tren, contoh topik, dan alasan CPC secara otomatis memperbarui bahasa (*real-time refresh*) saat dropdown *Bahasa Konten* diganti antara **Bahasa Indonesia 🇮🇩** dan **English 🇺🇸**.
- **Optimasi Kecepatan Loading Instan (0.01 Detik)**:
  - Penambahan batas waktu tunggu Firestore `withTimeout` (600ms) pada [dbService.js](file:///c:/web/scholarcms/src/services/dbService.js) untuk memotong penundaan jaringan cloud.
  - Perbaikan fungsionalitas `getLocal` dan `setLocal` dengan `localStorage` browser untuk akses data instan.
- **Pembersihan Total Teks Branding Legacy**:
  - Pembersihan 100% frasa *"WordPress-Style"*, *"WordPress Pages"*, *"Gutenberg"*, dan rincian tech-stack spesifik dari UI dashboard, metadata, CSS, dan komentar kode.
- **Dokumentasi Pengembang Lanjutan & Lisensi**:
  - **[THEME_DEVELOPMENT.md](file:///c:/web/scholarcms/documentation/THEME_DEVELOPMENT.md)**: Panduan lengkap pembuatan tema kustom.
  - **[PLUGIN_DEVELOPMENT.md](file:///c:/web/scholarcms/documentation/PLUGIN_DEVELOPMENT.md)**: Panduan lengkap pembuatan plugin kustom.
  - **[LICENSE.md](file:///c:/web/scholarcms/LICENSE.md)**: Lisensi resmi MIT.
  - Pembaruan berkas **[README.md](file:///c:/web/scholarcms/README.md)**.

---

## [v1.8.0] - 2026-07-27

### 🚀 Sistem Tema & Sistem Plugin Modular (Themes Engine, Plugin Engine, & Dynamic Catch-All Router)
- **Sistem Plugin CMS & Dynamic Catch-All Router (`/dashboard/[...pluginRoute]`)**:
  - **Dynamic Catch-All Router ([...pluginRoute]/page.jsx)**: Penangkap rute dinamis yang memungkinkan plugin baru menyajikan rute halaman di bawah `/dashboard/[rute-plugin]` (seperti `/dashboard/seo-analyzer`, `/dashboard/newsletter`) **100% tanpa perlu rebuild di Vercel**.
  - **Menu Plugin CMS & Dynamic Sidebar Injector**: Rute pengelola plugin di `/dashboard/plugins` dan penginjeksi menu otomatis pada Sidebar Admin Dashboard ([layout.jsx](file:///c:/web/scholarcms/src/app/dashboard/layout.jsx)) saat plugin berstatus **ON**.
  - **Public Plugin Widget Injector ([PluginWidgetInjector.jsx](file:///c:/web/scholarcms/src/components/blog/PluginWidgetInjector.jsx))**: Merender widget publik (tombol WhatsApp melayang & banner Newsletter) pada halaman blog pembaca secara kondisional saat plugin diaktifkan.
- **3 Plugin Bawaan Siap Pakai**:
  - **Plugin 1: SEO Analyzer & Realtime Auditor ([seo-analyzer/index.jsx](file:///c:/web/scholarcms/src/plugins/seo-analyzer/index.jsx))**: Audit skor SEO real-time, kata kunci fokus, dan kesehatan meta description.
  - **Plugin 2: Newsletter & Subscriber Manager ([newsletter/index.jsx](file:///c:/web/scholarcms/src/plugins/newsletter/index.jsx))**: Kelola email subscriber, kirim broadcast pengumuman, dan widget subskripsi publik.
  - **Plugin 3: WhatsApp Contact Floating Button ([whatsapp-float/index.jsx](file:///c:/web/scholarcms/src/plugins/whatsapp-float/index.jsx))**: Konfigurasi nomor WhatsApp & pesan pembuka, serta widget tombol melayang publik.
- **Sistem Tema Modular & Katalog Dashboard (`/dashboard/themes`)**:
  - **Katalog Tema Visual**: Kartu visual interaktif dengan badge status "Aktif", deskripsi, pembuat, versi, dan tombol 1-klik "Aktifkan Tema".
  - **No-Code Theme Customizer**: Pengatur warna aksen utama, tipografi Google Fonts, gaya kartu postingan, dan *Custom CSS Injector*.
  - **3 Preset Tema Bawaan**: Modern Glassmorphism, Editorial News & Gazette, dan Minimalist Tech.
  - **Unified Theme Resolver & Universal Dynamic Engine ([src/themes/index.js](file:///c:/web/scholarcms/src/themes/index.js))**.
- **Ekstensi Service Layer (`dbService.js`)**:
  - Penambahan fungsi pengelolaan Tema & Plugin (`getPluginStates`, `togglePluginStatus`, `getPluginSettings`, `savePluginSettings`, `saveCustomPluginPackage`, `addSubscriber`) dengan dukungan Firestore Cloud DB & Fallback Storage Mode.

---

## [v1.7.0] - 2026-07-26

### 🚀 Infrastruktur Kesiapan Google AdSense, Pembersihan Branding UI, & Tagging Interaktif
- **Suite Kesiapan Google AdSense (AdSense Readiness & Compliance)**:
  - **Dynamic XML Sitemap (`src/app/sitemap.js`)**: Generator sitemap dinamis Next.js 14 App Router yang mengindeks otomatis seluruh artikel, halaman statis, dan rute kategori.
  - **Dynamic `ads.txt` Route (`src/app/ads.txt/route.js`)**: Route handler `GET /ads.txt` berkonfigurasi `force-dynamic` dengan fallback `public/ads.txt` yang menyajikan Publisher ID resmi secara dinamis dari database `dbService`.
  - **Client Script Loader (`AdSenseScript.jsx`)**: Menginjeksi script resmi `adsbygoogle.js` pada root layout ([layout.jsx](file:///c:/web/scholarcms/src/app/layout.jsx)) secara kondisional saat AdSense diaktifkan.
  - **Komponen Responsive Ad Banner (`AdSenseBanner.jsx`)**: Slot iklan responsif pada halaman pembaca artikel ([post/[slug]/page.jsx](file:///c:/web/scholarcms/src/app/post/[slug]/page.jsx)) di posisi Header Banner dan In-Article.
  - **Schema.org Structured Data (JSON-LD)**: Menginjeksi microdata `BlogPosting` / `Article` pada halaman artikel untuk mempercepat peninjauan Googlebot.
- **Halaman Legal Wajib AdSense & Menu Footer**:
  - Memperluas **Kebijakan Privasi (`kebijakan-privasi`)** di [mockData.js](file:///c:/web/scholarcms/src/constants/mockData.js) dengan pasal resmi Google DoubleClick DART Cookie, pengumpulan data peramban, dan link opt-out periklanan.
  - Menambahkan halaman legal standar: **Syarat & Ketentuan (`syarat-ketentuan`)**, **Hubungi Kami (`hubungi-kami`)**, dan **Disclaimer (`disclaimer`)** yang terhubung ke menu Footer & Header.
- **Refactoring UI, Branding, & Sidebar Beranda**:
  - **Pembersihan Branding Mentah**: Menghapus badge `Next.js` di samping logo Navbar, mengubah tagline menjadi *"Modern Publishing Platform"*, serta menghapus seksi *"Teknologi & Stack"* dan tag teknis di Footer.
  - **Pembersihan Status DB**: Menghapus notice bar status database dari beranda.
  - **Pemisahan Widget Sidebar**: Memisah widget sidebar menjadi 2 kartu terpisah yang independen: **Topik Kategori Blog (`CategoryTopicsWidget`)** dan **Tag Tren Artikel (`TrendingTagsWidget`)**.
- **Ekstraksi Tag Dinamis, Pencarian Presisi, & Auto-Fill Komentar**:
  - **Ekstraksi Tag Dinamis**: `TrendingTagsWidget` mengekstrak 100% tag asli yang terdaftar pada artikel terbit tanpa fallback hardcoded.
  - **Pencarian Tag Presisi ([page.jsx](file:///c:/web/scholarcms/src/app/page.jsx))**: Memperbarui filter pencarian `matchesSearch` agar mencocokkan kata kunci pada tag (`post.tags`), judul, excerpt, kategori, dan isi blok konten.
  - **Clickable Post Tags ([post/[slug]/page.jsx](file:///c:/web/scholarcms/src/app/post/[slug]/page.jsx))**: Menjadikan seluruh tag artikel berupa tautan interaktif (`<Link>`) yang mengarahkan pembaca ke beranda dengan filter tag terkait.
  - **Auto-Fill Form Komentar**: Mengisi otomatis Nama & Email pengguna terdaftar yang sedang login pada form komentar pengunjung.
- **Identitas Situs Dinamis, Sakelar Pendaftaran, & Fitur UX Lanjutan**:
  - **Sakelar ON/OFF Pendaftaran Pengguna**: Admin dapat menyalakan/mematikan izin pendaftaran baru publik di Admin Settings ([settings/page.jsx](file:///c:/web/scholarcms/src/app/dashboard/settings/page.jsx)). Halaman `/register` menampilkan kartu pemberitahuan *"Pendaftaran Ditutup"* dan tombol *Daftar* pada Navbar disembunyikan otomatis saat OFF.
  - **Identitas & Tagline Situs Dinamis**: Admin dapat kustomisasi `siteTitle` dan `siteTagline` secara langsung di Admin Settings, yang dirender otomatis pada Navbar, Footer, & Metadata.
  - **Proteksi Pengalihan Otomasi Login/Register**: Pengguna yang sudah terautentikasi (logged-in) yang membuka `/login` atau `/register` akan secara otomatis dialihkan (*auto-redirect*) ke `/dashboard` (Admin/Writer) atau `/` (User).
  - **Auto-Seeding Halaman Statis Firestore**: Menambahkan `seedDefaultPagesToFirestore` pada `dbService.js` untuk secara otomatis mengimpor 5 halaman legal bawaan (*Tentang Kami, Kebijakan Privasi, Syarat & Ketentuan, Hubungi Kami, Disclaimer*) sebagai dokumen permanen di Cloud Firestore DB.
  - **Tombol Pencarian Sliding Interaktif**: Mengubah bilah pencarian statis pada Navbar ([Navbar.jsx](file:///c:/web/scholarcms/src/components/layout/Navbar.jsx)) menjadi tombol pencarian meluncur (*sliding expandable search*) yang mengembang halus saat diklik lengkap dengan tombol pembersih `[✖]`.

---

## [v1.6.0] - 2026-07-25

### 🚀 Fitur Baru Utama & Penyempurnaan Tiptap Editor & AI Generator
- **Layout Kolom Rentang Penuh 100% (Full-Width Flex Ratio)**: Memperbarui kalkulasi `Column` menggunakan `flex: ratio ratio 0%` sehingga seluruh variasi rasio kolom (`80:20`, `50:50`, dll.) merentang penuh mengisi kontainer dari kiri ke kanan tanpa celah kosong.
- **Node Extension Task List & Task Item Interaktif**: Mendaftarkan paket `@tiptap/extension-task-list` & `@tiptap/extension-task-item` untuk merender kotak centang (*checkbox*) interaktif dengan aksen biru, penataan sejajar 1 baris, dan pencoretan teks otomatis saat tercentang.
- **Floating Toast Notification System**: Menambahkan notifikasi melayang hijau (*Glassmorphism Floating Toast*) di sudut kanan bawah layar yang muncul otomatis saat mengeklik tombol **`Simpan`** dan **`Simpan & Keluar`**.
- **Tombol Hapus Blok Node 1-Klik**: Memperbarui tombol sampah (`🗑️`) di toolbar utama dan toolbar melayang agar menghapus blok node terluar secara langsung dalam 1 klik.
- **Upgrade Generasi Artikel AI (1400+ Kata Bahasa Indonesia)**: Memperbarui prompt utama dan generator fallback AI agar menghasilkan artikel mendalam 1400–1800+ kata Bahasa Indonesia yang secara otomatis memanfaatkan seluruh elemen blok visual (Multi-kolom, Accordion FAQ, Checklist Tugas, Tabel Data Matriks, Callout Boxes, dll.).

---

## [v1.5.0] - 2026-07-25

### 🚀 Fitur Baru Utama & Penyempurnaan Tiptap Editor
- **Modal Input URL Custom Video YouTube**: Menekan atau menyeret blok Video YouTube kini membuka modal interaktif `InsertMediaModal` untuk memasukkan URL video YouTube milik sendiri.
- **Accordion FAQ Extensions Interaktif**: Membuat Node Extension Tiptap `AccordionGroup`, `AccordionItem`, `AccordionHeader`, dan `AccordionContent` yang memungkinkan judul Accordion 100% diketik/diedit kembali serta mendukung banyak baris poin pertanyaan.
- **Tata Letak Multi-Kolom Rasio Persentase (14 Opsi)**: Menambahkan skema `Columns` & `Column` untuk 14 pilihan rasio persentase kolom (`50:50`, `30:70`, `70:30`, `20:80`, `80:20`, `40:60`, `60:40`, `10:90`, `90:10`, `33:33:33`, `25:50:25`, `25:25:50`, `50:25:25`, `25:25:25:25`).
- **Grip Drag Handle & Tombol Panah Pemindahan Posisi 1-Klik**:
  - Menambahkan **Grip Handle (`GripVertical`)** melayang yang muncul di pojok kiri atas setiap jenis blok saat di-hover.
  - Menambahkan **Tombol Panah Ke Atas (`▲`)** & **Panah Ke Bawah (`▼`)** untuk memindahkan posisi blok 1 langkah secara instan tanpa perlu menyeret mouse.
  - Memperbarui kalkulasi pertukaran node terluar `$pos.posAtIndex(...)` sehingga pemindahan blok 100% presisi dan tidak memotong kata atau teks paragraf di sekitarnya.
- **Grup Palet Komponen Collapsible**: Menambahkan toggle accordion pada grup Palet Komponen Sidebar (`Teks`, `Layout Kolom`, `Daftar`, `Kutipan`, `Media`) dengan kondisi default awal SEMUA TERBUKA.
- **Styling Scrollbar Ultra-Thin 5px**: Menambahkan CSS scrollbar tipis 5px dengan efek hover aksen biru dan utility Tailwind CSS v4 `@utility scrollbar-thin`.

---

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
  - Penambahan **Unified Sticky Gutenberg Toolbar Header** (melayang di `top-16`) yang menyatukan Aksi Navigasi/Publikasi, Detektor Blok Aktif, Converter Tipe Blok Cepat, serta Toolbar Format Teks Lengkap (Dropdown **Font Family**, Dropdown **Font Size**, Undo, Redo, Bold, Italic, Underline <u>U</u>, Strikethrough, Inline Code `</>`, Tautan Link 🔗, Hapus Format 🧹, dan Hapus Blok 🗑️).

- **Custom React Prompt Modals (`InsertMediaModal.jsx`)**:
  - Menggantikan seluruh popup dialog abu-abu kaku bawaan browser (`window.prompt`) dengan **Modal Popup Kustom React** bergaya modern Glassmorphism (dengan Live Image Preview & checkbox tab baru) untuk penyisipan Link, Gambar, Video YouTube, dan Tombol CTA.

---

## [v1.4.3] - 2026-07-25

### 🎨 Pengondisian & Styling Visual Drag & Drop Gutenberg Editor
- **Custom Drop Cursor Accent Line (`.ProseMirror-dropcursor`)**:
  - Mengubah garis petunjuk posisi drop (*drop cursor line*) bawaan yang berwarna hitam kaku menjadi **garis biru brand modern (`#3b82f6`)** setebal 3px dengan efek *glowing shadow* (`box-shadow: 0 0 10px rgba(59,130,246,0.75)`) dan `pointer-events: none` agar tidak menghalangi event kursor.
- **Integrasi Tiptap Interactive Table Extension & Vertical Floating Bubble Menu**:
  - Menginstal & mengintegrasikan `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, dan `@tiptap/extension-table-header`.
  - Blok **Tabel Data** saat diseret (*drag & drop*) kini langsung merender struktur node tabel visual asli 3x3 yang interaktif dan dapat diedit.
  - **Floating Table Action Menu (`BubbleMenu`)**: Menampilkan pop-up daftar vertikal melayang otomatis tepat di dekat sel tabel saat kursor/pointer aktif.
- **Tombol Penataan Teks / Text Alignment (`@tiptap/extension-text-align`)**:
  - Penambahan 4 tombol penataan alignment paragraf & heading pada toolbar editor di samping tombol Undo & Redo: **Rata Kiri (`AlignLeft`)**, **Rata Tengah (`AlignCenter`)**, **Rata Kanan (`AlignRight`)**, dan **Rata Kiri-Kanan (`AlignJustify`)**.

---

## [v1.4.4] - 2026-07-25

### 🚀 Fitur Tata Letak Multikolom & Modern Ultra-Thin Scrollbar
- **Grup Blok Tata Letak Kolom Presisi (`LAYOUT_COLUMNS_BLOCKS`)**:
  - Penambahan 14 varian rasio kolom pada Palet Komponen ([BlockPaletteSidebar.jsx](file:///c:/web/scholarcms/src/components/admin/BlockPaletteSidebar.jsx)) untuk tata letak 2 kolom, 3 kolom, dan 4 kolom:
    - **2 Kolom**: `50:50`, `30:70`, `70:30`, `20:80`, `80:20`, `40:60`, `60:40`, `10:90`, `90:10`.
    - **3 Kolom**: `33:33:33`, `25:50:25`, `25:25:50`, `50:25:25`.
    - **4 Kolom**: `25:25:25:25`.
  - Setiap kolom yang diseret (*drag & drop*) merender kontainer grid/flex responsif dengan latar belakang memikat dan border transparan yang dapat diisi teks/blok secara independen.
- **Modern Ultra-Thin Scrollbar (5px) & Utility Class**:
  - Menggantikan scrollbar bawaan browser dengan **Scrollbar Kustom Ramping (5px)** bersudut melengkung halus dan efek hover biru brand (`#3b82f6`) di seluruh aplikasi serta menambahkan utility class `@utility scrollbar-thin` ([globals.css](file:///c:/web/scholarcms/src/app/globals.css)).
- **Integrasi Tiptap Youtube Player Extension (`@tiptap/extension-youtube`)**:
  - Menginstal & mendaftarkan `@tiptap/extension-youtube` agar blok video YouTube merender pemutar video interaktif visual asli di kanvas editor dan pratinjau, bukan string HTML mentah.
- **Ekstensi Custom Node Accordion FAQ (`Details`, `DetailsSummary`, `DetailsContent`)**:
  - Dibuat Node Tiptap resmi untuk Accordion FAQ ([AccordionExtensions.js](file:///c:/web/scholarcms/src/components/admin/AccordionExtensions.js)) agar blok `<details>` dan `<summary>` merender komutator accordion interaktif asli yang dapat diklik/dibuka-tutup.
- **Grup Accordion Melayang pada Palet Komponen ([BlockPaletteSidebar.jsx](file:///c:/web/scholarcms/src/components/admin/BlockPaletteSidebar.jsx))**:
  - Setiap grup kategori palet (🔤 Teks, 📐 Tata Letak, 📑 Daftar, 💬 Kutipan, 💡 Callout, 🎨 Media) kini memiliki tombol accordion untuk **Hide & Open** secara independen dengan status *default* **SEMUA TERBUKA**.





