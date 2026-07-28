# AI Prompt & Development Guidelines (ScholarCMS)

**Tujuan:** ANDA seorang programmer berpengalaman lebih dari 20 tahun dan seorang designer UI/UX yang berpengalaman lebih dari 20 tahun. Memberikan instruksi panduan bagi AI Coding Assistant dalam mengembangkan, memelihara, dan menambah fitur baru pada codebase **ScholarCMS** secara efisien dan hemat token.

---

## 1. Panduan Arsitektur Kode Proyek

Ketika Anda (AI) diminta membuat atau memodifikasi fitur baru pada ScholarCMS, selalu patuhi konvensi arsitektur berikut:

1. **Gunakan Folder `src/` Enterprise Layout**:
   - `src/app/`: Tempatkan rute halaman baru (App Router) & Dynamic Catch-All Plugin Router `src/app/dashboard/[...pluginRoute]/page.jsx`.
   - `src/themes/`: Tempatkan folder komponen tema React fisik baru (`src/themes/nama-tema/index.jsx`).
   - `src/plugins/`: Tempatkan folder komponen plugin React fisik baru (`src/plugins/nama-plugin/index.jsx`).
   - `src/components/`: Bagi komponen UI ke subfolder yang sesuai (`layout/`, `blog/`, `admin/`, `dashboard/`, `ui/`).
   - `src/services/dbService.js`: Tempatkan semua logika transaksi data/CRUD baru di sini.
   - `src/lib/firebase.js`: Inisialisasi SDK Firebase.
   - `src/constants/mockData.js`: Tempatkan data sampel atau konstanta baru.
2. **Gunakan Path Aliases `@/*`**:
   - Selalu gunakan import bersih seperti `import { dbService } from '@/services/dbService'` atau `import { getThemeComponent } from '@/themes'`.
3. **Resilient Data Service (Hybrid Fallback)**:
   - Pastikan fungsi service baru di `dbService.js` mendukung **duplikasi alur**: Firebase Firestore Cloud DB (saat `isFirebaseConfigured()` bernilai `true`) dan LocalStorage / Demo Mode Fallback.

---

## 2. Struktur Prompt AI Efektif untuk Pengembang

Saat meminta bantuan AI untuk menambah fitur di ScholarCMS, ikuti struktur prompt rekomendasi ini:

```markdown
### 1. Ringkasan Tugas
Tambah fitur [Nama Fitur / Tema / Plugin] pada ScholarCMS.

### 2. File Terkait
- Edit/Tambah: `src/services/dbService.js`
- Tambah Tema: `src/themes/[nama-tema]/index.jsx`
- Tambah Plugin: `src/plugins/[nama-plugin]/index.jsx`
- Tambah Route: `src/app/dashboard/[rute]/page.jsx`

### 3. Batasan Teknis
- Ikuti standar Tailwind CSS & Glassmorphism yang ada di `src/app/globals.css`.
- Sertakan error handling dengan `try/catch`.
- Jangan hapus fungsi yang sudah ada (hanya perbaiki atau tambahkan).
```

---

## 3. Konvensi Penulisan Komponen, Tema, & Plugin

1. **Aestetika Modern**: Gunakan variabel CSS `var(--bg-primary)`, `var(--bg-surface)`, `var(--border-color)`, `var(--text-main)`, `var(--text-muted)`.
2. **Sistem Tema**: Setiap tema menerima props standar (`posts`, `categories`, `selectedCategory`, `onSelectCategory`, `searchQuery`, `onSearch`, `loading`, `customizations`).
3. **Sistem Plugin**: Rute plugin baru otomatis ditangkap oleh `Dynamic Catch-All Plugin Router` (`/dashboard/[...pluginRoute]`) tanpa perlu rebuild Vercel.
4. **Lucide Icons**: Gunakan ikon dari paket `lucide-react` untuk konsistensi UI Admin.

---

## 4. Tips Menghemat Token AI

- **Gunakan File Link Markdown**: Manfaatkan `[filename](file:///path/to/file)` untuk merujuk file proyek daripada menempelkan seluruh isi berkas.
- **Minta Diff Khusus Edit**: Jika hanya mengubah beberapa baris, minta AI menyajikan potongan diff.
- **Baca Dokumentasi**: Rujuk file `documentation/STRUCTURE.md` dan `documentation/DATABASE.md` sebagai acuan skema.
