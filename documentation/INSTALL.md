# Panduan Instalasi & Pengoperasian (ScholarCMS)

Panduan langkah demi langkah untuk menjalankan **ScholarCMS** di lingkungan lokal pengembangan (*local development*) maupun menghubungkannya ke cloud **Firebase Firestore**.

---

## 📋 Persyaratan Sistem

- **Node.js**: v18.0.0 atau versi lebih baru
- **Package Manager**: `npm` (v9+) atau `yarn` / `pnpm`
- **Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari modern.

---

## 🚀 Pengoperasian Lokal (Demo Mode Ready)

ScholarCMS dilengkapi dengan **Auto-Fallback Demo Storage Mode** sehingga Anda dapat langsung menjalankan dan mencoba seluruh fitur tanpa perlu melakukan konfigurasi database awal.

### 1. Jalankan Perintah Pemasangan Dependensi
Buka terminal di direktori proyek dan jalankan:
```bash
npm install
```

### 2. Jalankan Dev Server
Untuk memulai server pengembang lokal:
```bash
npm run dev
```

Akses URL berikut di browser Anda:
- **Halaman Depan Blog**: [http://localhost:3000](http://localhost:3000)
- **WordPress Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## ☁️ Integrasi dengan Database Firebase Firestore Cloud

Untuk menghubungkan blog ini ke database cloud Firebase Firestore asli Anda:

### 1. Buat Proyek Firebase
1. Buka [Console Firebase](https://console.firebase.google.com).
2. Klik **Add Project** / **Buat Proyek Baru** dan beri nama proyek Anda.
3. Setelah proyek dibuat, tambahkan aplikasi web (*Web App*) dan aktifkan **Firestore Database**.

### 2. Isi Kredensial di File `.env`
Buka file `.env` di direktori utama proyek Anda dan perbarui dengan kredensial dari konsol Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

### 3. Jalankan Ulang Server
Jalankan perintah `npm run dev`. Buka menu **Pengaturan CMS** di `/admin/settings` untuk mengonfirmasi status database telah berubah menjadi **"Connected to Firebase Firestore"**.
