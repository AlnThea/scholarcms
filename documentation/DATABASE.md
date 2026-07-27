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
Menyimpan seluruh artikel blog yang dibuat melalui Visual Block Editor.

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
| `blocks` | Array of Objects | Array blok visual artikel (`[{ id, type, content }]`) |

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

---

### 5. Koleksi: `pages`
Menyimpan seluruh halaman statis blog (seperti *Tentang Kami*, *Kebijakan Privasi*, *Kontak*).

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | String | Unique document ID |
| `title` | String | Judul utama halaman statis |
| `slug` | String (Unique) | URL permalink (misal: `tentang-kami`) |
| `excerpt` | String | Ringkasan/deskripsi halaman |
| `status` | String | `"published"` atau `"draft"` |
| `publishedAt` | String (ISO 8601) | Timestamp tanggal publikasi |
| `views` | Number | Akumulasi total pembaca |
| `author` | Object | `{ name, avatar, role }` |
| `blocks` | Array of Objects | Array blok visual artikel (`[{ id, type, content }]`) |

---

### 6. Koleksi: `menus`
Menyimpan struktur navigasi menu 3-level untuk Header Navbar dan Footer.

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `location` | String (Document ID) | `"header"` atau `"footer"` |
| `items` | Array of Objects | Array item menu (`[{ id, label, type, target, url, level, order }]`) |
| `updatedAt` | String (ISO 8601) | Timestamp tanggal perubahan terakhir |

---

### 7. Dokumen Settings: `settings/theme` & `settings/plugins`
Menyimpan status konfigurasi global Sistem Tema dan Sistem Plugin.

#### `settings/theme`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `activeThemeId` | String | ID Tema Aktif (`"modern"`, `"editorial"`, `"minimalist"`, atau custom ID) |
| `customizations` | Object | `{ primaryColor, fontFamily, cardStyle, customCss }` |
| `updatedAt` | String (ISO 8601) | Timestamp tanggal pembaruan terakhir |

#### `settings/plugins`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `seo-analyzer` | Boolean | Status aktif/nonaktif Plugin SEO Analyzer (`true`/`false`) |
| `newsletter` | Boolean | Status aktif/nonaktif Plugin Newsletter (`true`/`false`) |
| `whatsapp-float` | Boolean | Status aktif/nonaktif Plugin WhatsApp (`true`/`false`) |
| `updatedAt` | String (ISO 8601) | Timestamp tanggal pembaruan terakhir |

---

### 8. Koleksi: `custom_themes` & `custom_plugins`
Menyimpan paket preset tema dan plugin kustom yang di-upload melalui Admin Dashboard.

#### `custom_themes`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | String | Document ID Paket Tema |
| `name` | String | Nama tampilan tema |
| `description` | String | Deskripsi tema |
| `author` | String | Pembuat tema |
| `version` | String | Versi rilis |
| `customizations` | Object | Objek preset kustomisasi tema |

#### `custom_plugins`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | String | Document ID Paket Plugin |
| `name` | String | Nama tampilan plugin |
| `description` | String | Deskripsi plugin |
| `routePath` | String | Rute URL halaman plugin (`/dashboard/[routePath]`) |
| `navLabel` | String | Label menu di Sidebar Admin |

---

### 9. Koleksi: `subscribers`
Menyimpan daftar pembaca yang berlangganan newsletter email.

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | String | Document ID Subscriber |
| `email` | String | Alamat email pembaca |
| `name` | String | Nama pembaca |
| `subscribedAt` | String (ISO 8601) | Timestamp tanggal berlangganan |
