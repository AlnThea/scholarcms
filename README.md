# ScholarCMS — Modern Publishing Platform & CMS Engine

![ScholarCMS](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

**ScholarCMS** adalah platform *content management system* (CMS) dan publishing engine modern yang dirancang untuk kecepatan tinggi, performa luar biasa, serta kemudahan pengelolaan artikel, berita, halaman statis, tema visual, dan plugin tambahan.

---

## 🚀 Fitur Utama (Key Features)

- 🎨 **Modular Theme Engine**:
  - Pilihan katalog tema bawaan siap pakai (**Modern Glassmorphism**, **Editorial News & Gazette**, **Minimalist Tech**).
  - *No-Code Visual Customizer*: Ubah warna aksen, font tipografi, dan gaya kartu tanpa koding.
  - Impor & ekspor paket preset tema `.json` 1-klik di Vercel.

- 🔌 **Dynamic Plugin Engine**:
  - **Dynamic Catch-All Plugin Router (`/dashboard/[...pluginRoute]`)**: Menambah rute halaman baru untuk plugin 100% tanpa perlu rebuild di Vercel.
  - 3 Plugin Bawaan: **SEO Analyzer & Realtime Auditor**, **Newsletter & Email Subscribers**, dan **WhatsApp Contact Floating Button**.
  - *Dynamic Sidebar Injector*: Menampilkan menu plugin aktif secara otomatis pada Sidebar Admin Dashboard.

- ✍️ **Visual Block Editor**:
  - Editor artikel berbasis blok visual (Paragraf, Heading H1-H6, Multi-kolom Flex Ratio, Tabel Data Interaktif, Accordion FAQ, Checklist Tugas, Callout Box, Code Snippet, Gambar, & Video YouTube).
  - Integrasi AI Assistant untuk pembuatan artikel otomatis 1400+ kata lengkap dengan SEO tags & featured image.

- 🔐 **Role-Based Access Control (RBAC)**:
  - Peran pengguna terpisah untuk **Admin 👑**, **Writer ✍️**, dan **User 👤**.

- 📈 **AdSense & SEO Readiness Suite**:
  - *Dynamic XML Sitemap* (`/sitemap.xml`), *Dynamic ads.txt Route* (`/ads.txt`), *JSON-LD Schema.org Structured Data*, & Slot Iklan AdSense Responsif.

- ☁️ **Hybrid Resilience Data Layer**:
  - Mendukung integrasi **Google Cloud Firestore DB** dan **Auto-Fallback Demo Storage Mode**.

---

## 📁 Dokumentasi Lengkap (Documentation)

Seluruh panduan teknis dan dokumentasi proyek tersimpan rapi pada direktori `documentation/`:

- [STRUCTURE.md](documentation/STRUCTURE.md) – Arsitektur folder & struktur kode proyek.
- [DATABASE.md](documentation/DATABASE.md) – Spesifikasi skema database Firestore & koleksi.
- [INSTALL.md](documentation/INSTALL.md) – Panduan pengoperasian lokal & integrasi Firebase.
- [DEVOPS.md](documentation/DEVOPS.md) – Panduan deployment rilis produksi ke Vercel / Netlify.
- [THEME_DEVELOPMENT.md](documentation/THEME_DEVELOPMENT.md) – **Panduan Pengembang: Cara Membuat Tema Baru**.
- [PLUGIN_DEVELOPMENT.md](documentation/PLUGIN_DEVELOPMENT.md) – **Panduan Pengembang: Cara Membuat Plugin Baru**.
- [CHANGELOG.md](documentation/CHANGELOG.md) – Riwayat pembaruan & rilis versi.

---

## ⚙️ Pengoperasian Lokal (Local Development)

```bash
# 1. Clone repositori
git clone https://github.com/AlnThea/scholarcms.git
cd scholarcms

# 2. Install dependensi
npm install

# 3. Jalankan server pengembang lokal
npm run dev
```

Akses aplikasi di browser:
- **Public Feed**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/dashboard`
- **Pengelola Tema**: `http://localhost:3000/dashboard/themes`
- **Pengelola Plugin**: `http://localhost:3000/dashboard/plugins`

---

## 📜 Lisensi (License)

Proyek ini dilisensikan di bawah **MIT License** – lihat berkas [LICENSE.md](LICENSE.md) untuk detail selengkapnya.
