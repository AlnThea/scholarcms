# Arsitektur Database & Spesifikasi Skema Firestore

Spesifikasi model data dan skema koleksi untuk **ScholarCMS** pada database Google Cloud Firestore.

---

## 🗄️ Koleksi Utama Firestore

### 1. Koleksi: `users`
Menyimpan profil pengguna terdaftar dan peran hak akses (*Role-Based Access Control*).

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` / `uid` | String | Unique User ID (Firebase Auth UID atau local ID) |
| `name` | String | Nama lengkap pengguna |
| `email` | String | Alamat email terdaftar |
| `role` | String | `"admin"`, `"writer"`, atau `"user"` |
| `avatar` | String (URL) | Foto profil pengguna |
| `createdAt` | String (ISO 8601) | Timestamp tanggal pendaftaran |

---

### 2. Koleksi: `posts`
Menyimpan seluruh artikel blog yang dibuat melalui Editor Gutenberg.

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | String | Unique document ID (misal: `post-1` / Firestore Auto ID) |
| `title` | String | Judul utama postingan |
| `slug` | String (Unique) | URL permalink artikel (misal: `panduan-cms-modern`) |
| `excerpt` | String | Ringkasan singkat untuk kartu preview |
| `category` | String | Nama kategori artikel |
| `tags` | Array of Strings | Daftar kata kunci/tag (misal: `["Next.js", "React"]`) |
| `featuredImage` | String (URL) | Tautan URL gambar cover unggulan |
| `status` | String | `"published"` (terbit) atau `"draft"` (konsep) |
| `publishedAt` | String (ISO 8601) | Timestamp tanggal publikasi |
| `views` | Number | Akumulasi total pembaca artikel |
| `readTime` | String | Estimasi lama baca (misal: `"5 min read"`) |
| `author` | Object | `{ name, avatar, role }` |
| `blocks` | Array of Objects | Array blok visual Gutenberg (`[{ id, type, content }]`) |

---

### 3. Koleksi: `categories`
Menyimpan taksonomi topik kategori blog.

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | String | Document ID |
| `name` | String | Nama tampilan kategori (misal: `"Web Development"`) |
| `slug` | String | URL slug kategori (misal: `"web-development"`) |
| `color` | String (Hex) | Kode warna aksen (misal: `#2563eb`) |
| `description` | String | Deskripsi singkat fungsi kategori |

---

### 4. Koleksi: `comments`
Menyimpan komentar pengunjung pada artikel tertentu.

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | String | Document ID |
| `postId` | String | Foreign key referensi ke `posts.id` |
| `authorName` | String | Nama pengirim komentar |
| `authorEmail` | String | Email pengirim komentar (opsional) |
| `content` | String | Isi teks komentar |
| `createdAt` | String (ISO 8601) | Timestamp tanggal kirim |
| `status` | String | `"approved"` (disetujui) atau `"rejected"` (ditolak) |
