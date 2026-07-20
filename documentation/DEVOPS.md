# Panduan DevOps & Rilis Produksi (Vercel / Netlify)

Panduan rilis produksi (*production deployment*) untuk meng-host aplikasi **ScholarCMS** di platform serverless modern seperti **Vercel** atau **Netlify**.

---

## ☁️ 1. Deployment di Vercel (Rekomendasi Utama)

Next.js dikembangkan oleh Vercel, sehingga deployment di Vercel merupakan pilihan tercepat tanpa konfigurasi tambahan (*zero-config*).

### Langkah Deployment:
1. Push kode proyek Anda ke repositori Git (GitHub, GitLab, atau Bitbucket).
2. Masuk ke [Dashboard Vercel](https://vercel.com) dan klik tombol **"Add New Project"**.
3. Import repositori Git ScholarCMS Anda.
4. Pada bagian **Environment Variables**, tambahkan kredensial Firebase:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Klik **Deploy**. Vercel akan mengompilasi bundel Next.js 14 App Router secara otomatis.

---

## 🧪 2. Pengujian Build Produksi di Lokal

Sebelum melakukan push ke repositori produksi, Anda dapat menguji hasil build produksi langsung di komputer lokal:

```bash
# 1. Kompilasi aplikasi untuk rilis produksi
npm run build

# 2. Jalankan server produksi lokal
npm run start
```
Buka `http://localhost:3000` untuk memverifikasi performa dan kecepatan render SSR/SSG.
