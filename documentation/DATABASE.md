# Arsitektur Database & Spesifikasi Skema Firestore

Spesifikasi model data dan skema koleksi untuk **ScholarCMS** pada database Google Cloud Firestore.

---

## 🗄️ Koleksi Utama Firestore

### 1. Koleksi: `posts`
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

#### Struktur Tipe Blok Gutenberg (`blocks`):
- `type: "paragraph"` -> `content`: Teks paragraf.
- `type: "heading"` -> `content`: Teks judul sub-topik H2/H3.
- `type: "quote"` -> `content`: Teks kutipan inspiratif.
- `type: "code"` -> `content`: Potongan kode pemrograman.
- `type: "callout"` -> `content`: Teks kotak catatan/peringatan.

---

### 2. Koleksi: `categories`
Menyimpan taksonomi topik kategori blog.

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | String | Document ID |
| `name` | String | Nama tampilan kategori (misal: `"Web Development"`) |
| `slug` | String | URL slug kategori (misal: `"web-development"`) |
| `color` | String (Hex) | Kode warna aksen (misal: `#2563eb`) |
| `description` | String | Deskripsi singkat fungsi kategori |

---

### 3. Koleksi: `comments`
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
