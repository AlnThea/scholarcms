# Daftar Tugas: Perbaikan "Crawled - currently not indexed" (Refactoring Post Page)

Berikut adalah rencana langkah demi langkah untuk menyelesaikan masalah *Client-Side Rendering* pada halaman artikel agar bisa di-indeks oleh Google dengan baik, tanpa menghapus kode yang sudah ada:

## 📋 Status Saat Ini
- [x] **Investigasi Masalah**: Mengidentifikasi bahwa masalah indeks Google (Crawled - currently not indexed) disebabkan oleh arsitektur *Client Component* (`'use client'`) pada `page.jsx`.
- [x] **Perencanaan Solusi**: Memisahkan komponen menjadi Server Component (untuk memuat data SEO) dan Client Component (untuk interaksi UI).

## 🛠️ Langkah-Langkah Eksekusi (TODO)

- [x] **Langkah 1: Mengamankan Kode Lama**
  - Mengubah nama file `src/app/post/[slug]/page.jsx` menjadi `PostClient.jsx`.
  - Mengubah deklarasi komponen utama di dalamnya agar bisa menerima `post` dan `allPosts` sebagai *props* (bukan *fetching* sendiri).
  
- [x] **Langkah 2: Memecah Komponen (Aturan 100-300 Baris)**
  - Mengekstrak bagian form dan list komentar dari `PostClient.jsx` ke komponen baru (misal: `src/components/blog/PostComments.jsx`).
  - Mengekstrak bagian artikel utama dan header meta ke komponen baru (misal: `src/components/blog/PostContent.jsx`) jika diperlukan, agar `PostClient.jsx` hanya berfungsi sebagai wadah utama (wrapper).

- [x] **Langkah 3: Membuat Server Component Baru**
  - Membuat file `page.jsx` baru di `src/app/post/[slug]/`.
  - Menulis logika *fetching* database ke Firebase (`dbService.getPostBySlug`) di sisi server.
  - Memasukkan data tersebut ke dalam komponen `<PostClient />`.

- [ ] **Langkah 4: Pembersihan (Cleanup) & Testing**
  - Menguji perenderan awal HTML dengan *cURL* atau *view source* untuk memastikan teks artikel sudah langsung ada di dalam HTML saat dimuat pertama kali.
  - Memastikan fitur interaktif seperti komentar, tombol share, dan view count tetap berjalan normal.

---
*Catatan: File ini akan terus diperbarui seiring berjalannya proses eksekusi.*

## 📦 Backlog Refactoring (Sesuai Aturan 100-300 Baris)
Berikut adalah daftar file raksasa yang perlu dipecah (refactoring) di sesi berikutnya:

- [ ] **1. Dashboard Utama** (\src/app/dashboard/page.jsx\) - 2.169 baris
  - *Rencana*: Ekstraksi berbagai widget (statistik, tabel, grafik) menjadi komponen terpisah di \src/components/dashboard/widgets/\.

- [x] **2. Tiptap Editor (`src/components/admin/TiptapEditor.jsx` - 1.416 baris)**
  - [x] Pisahkan toolbar, ekstensi kustom, dan handler gambar ke modul terpisah.

- [x] **3. Database Service** (`src/services/dbService.js`) - 1.314 baris
  - *Rencana*: Pecah menjadi beberapa service modular seperti `postService.js`, `categoryService.js`, dll, lalu satukan dengan pola *Facade* di `dbService.js` agar *import* lama tidak rusak.

- [ ] **4. AI Generate Modal** (\src/components/admin/AiGenerateModal.jsx\) - 867 baris
  - *Rencana*: Pisahkan state management kompleks dan UI prompt menjadi sub-komponen.

- [x] **5. Right Meta Sidebar** (`src/components/admin/RightMetaSidebar.jsx`) - 824 baris
  - *Rencana*: Ekstraksi panel SEO, penampang Tag, dan panel Visibilitas ke komponen *accordion* mandiri.
