# Panduan Pengembang: Cara Membuat Tema Baru (ScholarCMS Theme Development Guide)

Dokumentasi ini memberikan panduan langkah demi langkah bagi pengembang (*developers*) dan perancang UI/UX yang ingin membuat, memasang, dan membagikan **Tema Baru** untuk platform **ScholarCMS**.

---

## 🎨 1. Arsitektur Sistem Tema ScholarCMS

ScholarCMS menggunakan **Dynamic Theme Registry System** berbasis React Components & Token CSS:

- **Folder Tema Kode (`src/themes/[nama-tema]/index.jsx`)**: Tempat berkas komponen React fisik untuk tema kustom.
- **Unified Theme Resolver (`src/themes/index.js`)**: Terhubung ke katalog tema di Admin Dashboard (`/dashboard/themes`).
- **No-Code Preset Importer (`.json`)**: Memungkinkan pengguna awam mengimpor varian preset tema berbasis JSON tanpa perlu mere-build serverless Vercel.

---

## 🛠️ 2. Langkah-Langkah Membuat Tema Baru

### Langkah 1: Buat Folder Tema Baru
Buat folder baru di direktori `src/themes/` dengan nama tema Anda dalam huruf kecil (misal: `src/themes/dark-cyberpunk/index.jsx`).

### Langkah 2: Buat Komponen Tema React
Setiap tema di ScholarCMS **WAJIB** menerima prop standar berikut:

```jsx
'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/blog/PostCard';
import HeroFeatured from '@/components/blog/HeroFeatured';

export default function DarkCyberpunkTheme({
  posts = [],                  // Array seluruh artikel terbit
  categories = [],             // Array seluruh kategori blog
  selectedCategory = 'All',    // Kategori yang sedang dipilih
  onSelectCategory = () => {}, // Fungsi callback ganti kategori
  searchQuery = '',            // Kata kunci pencarian
  onSearch = () => {},         // Fungsi callback pencarian
  loading = false,             // Status pemuatan data
  customizations = {}          // Objek warna & font kustom dari Admin
}) {
  const featuredPost = posts[0];
  const mainPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono">
      <Navbar onSearch={onSearch} searchQuery={searchQuery} />

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold text-cyan-400">Cyberpunk Editorial</h1>
        
        {/* Render Konten / Grid Postingan Anda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

---

### Langkah 3: Daftarkan Tema di Theme Registry (`src/themes/index.js`)

Buka file `src/themes/index.js`, impor komponen tema Anda, dan tambahkan objek metadata tema ke dalam array `THEMES_REGISTRY`:

```javascript
import DarkCyberpunkTheme from './dark-cyberpunk';

export const THEMES_REGISTRY = [
  // ... tema eksisting
  {
    id: 'dark-cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Tema futuristik dengan aksen warna neon gelap dan tipografi monospaced.',
    author: 'Studio Cyber',
    version: '1.0.0',
    category: 'Futuristic & Gaming',
    previewImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    component: DarkCyberpunkTheme,
    defaultCustomizations: {
      primaryColor: '#06b6d4',
      accentColor: '#ec4899',
      fontFamily: 'Fira Code',
      cardStyle: 'flat'
    }
  }
];
```

---

## 📥 3. Format File Paket Preset Tema (`.json`)

Untuk membuat preset tema yang bisa di-upload 1-klik oleh pengguna awam tanpa koding, buat file `preset-cyberpunk.json` dengan struktur berikut:

```json
{
  "id": "cyberpunk-preset-1",
  "name": "Cyberpunk Neon Edition",
  "description": "Preset warna neon cyan dan magenta dengan font Fira Code",
  "author": "Designer Community",
  "version": "1.0.0",
  "category": "Custom Preset",
  "customizations": {
    "primaryColor": "#06b6d4",
    "accentColor": "#ec4899",
    "fontFamily": "Fira Code",
    "cardStyle": "glassmorphism",
    "customCss": ".post-card { border: 1px solid #06b6d4; }"
  }
}
```

Pengguna awam tinggal mengunggah file JSON ini di menu Admin **/dashboard/themes**, dan tampilan blog akan berubah seketika di Vercel!

---

## 🧪 4. Uji Coba Tema
1. Jalankan dev server lokal: `npm run dev`.
2. Buka Dashboard Admin: `http://localhost:3000/dashboard/themes`.
3. Cari kartu tema baru Anda dan klik tombol **"Aktifkan Tema"**.
4. Buka halaman utama `http://localhost:3000` untuk memastikan tema baru terisi data secara sempurna!
