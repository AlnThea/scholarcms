# AI Prompt & Development Guidelines (ScholarCMS)

**Tujuan:** Memberikan instruksi panduan bagi AI Coding Assistant dalam mengembangkan, memelihara, dan menambah fitur baru pada codebase **ScholarCMS** (Next.js 14 + Firebase Blog Engine) secara efisien dan hemat token.

---

## 1. Panduan Arsitektur Kode Proyek

Ketika Anda (AI) diminta membuat atau memodifikasi fitur baru pada ScholarCMS, selalu patuhi konvensi arsitektur berikut:

1. **Gunakan Folder `src/` Enterprise Layout**:
   - `src/app/`: Tempatkan rute halaman baru (App Router).
   - `src/components/`: Bagi komponen UI ke subfolder yang sesuai (`layout/`, `blog/`, `admin/`).
   - `src/services/dbService.js`: Tempatkan semua logika transaksi data/CRUD baru di sini.
   - `src/lib/firebase.js`: Inisialisasi SDK Firebase.
   - `src/constants/mockData.js`: Tempatkan data sampel atau konstanta baru.
2. **Gunakan Path Aliases `@/*`**:
   - Selalu gunakan import bersih seperti `import { dbService } from '@/services/dbService'` atau `import Navbar from '@/components/layout/Navbar'`.
3. **Resilient Data Service (Hybrid Fallback)**:
   - Pastikan fungsi service baru di `dbService.js` mendukung **duplikasi alur**: Firebase Firestore Cloud DB (saat `isFirebaseConfigured()` bernilai `true`) dan LocalStorage / Demo Mode Fallback.

---

## 2. Struktur Prompt AI Efektif untuk Pengembang

Saat meminta bantuan AI untuk menambah fitur di ScholarCMS, ikuti struktur prompt rekomendasi ini:

```markdown
### 1. Ringkasan Tugas
Tambah fitur [Nama Fitur] pada ScholarCMS.

### 2. File Terkait
- Edit/Tambah: `src/services/dbService.js`
- Edit/Tambah UI: `src/components/admin/[NamaKomponen].jsx`
- Tambah Route: `src/app/admin/[rute]/page.jsx`

### 3. Batasan Teknis
- Ikuti standar Tailwind CSS & Glassmorphism yang ada di `src/app/globals.css`.
- Sertakan error handling dengan `try/catch`.
- Jangan hapus fungsi yang sudah ada (hanya perbaiki atau tambahkan).
```

---

## 3. Konvensi Penulisan Komponen & UI

1. **Aestetika Modern**: Gunakan variabel CSS `var(--bg-primary)`, `var(--bg-surface)`, `var(--border-color)`, `var(--text-main)`, `var(--text-muted)`.
2. **Gutenberg Editor Blocks**: Jika menambah jenis blok baru di editor, perbarui renderer di `src/app/post/[slug]/page.jsx` dan pengeditan di `src/components/admin/GutenbergEditor.jsx`.
3. **Lucide Icons**: Gunakan ikon dari paket `lucide-react` untuk konsistensi UI WordPress Admin.

---

## 4. Tips Menghemat Token AI

- **Gunakan File Link Markdown**: Manfaatkan `[filename](file:///path/to/file)` untuk merujuk file proyek daripada menempelkan seluruh isi berkas.
- **Minta Diff Khusus Edit**: Jika hanya mengubah beberapa baris, minta AI menyajikan potongan diff.
- **Baca Dokumentasi**: Rujuk file `documentation/STRUCTURE.md` dan `documentation/DATABASE.md` sebagai acuan skema.
