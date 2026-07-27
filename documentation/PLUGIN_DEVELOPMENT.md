# Panduan Pengembang: Cara Membuat Plugin Baru (ScholarCMS Plugin Development Guide)

Dokumentasi ini memberikan panduan langkah demi langkah bagi pengembang (*developers*) yang ingin membuat, memasang, dan membagikan **Plugin Baru** untuk platform **ScholarCMS**.

---

## 🔌 1. Arsitektur Sistem Plugin ScholarCMS

Sistem Plugin ScholarCMS dirancang agar sangat modular dan aman di lingkungan serverless (Vercel):

- **Dynamic Catch-All Router (`/dashboard/[...pluginRoute]`)**: Menangkap rute plugin baru (seperti `/dashboard/nama-plugin`) dan merender UI plugin secara dinamis **100% tanpa perlu rebuild di Vercel**.
- **Dynamic Sidebar Navigation Injector**: Secara otomatis menambahkan menu plugin baru ke Sidebar Admin Dashboard saat status plugin berstatus **ON**.
- **Public Widget Injector (`PluginWidgetInjector.jsx`)**: Menginjeksi widget publik melayang (seperti tombol chat, pop-up subskripsi, atau banner promo) ke halaman pembaca blog.

---

## 🛠️ 2. Langkah-Langkah Membuat Plugin Baru

### Langkah 1: Buat Folder Plugin Baru
Buat folder baru di direktori `src/plugins/` dengan nama plugin Anda dalam huruf kecil (misal: `src/plugins/calculator-tax/index.jsx`).

### Langkah 2: Buat Halaman UI Plugin React
Setiap plugin yang menyajikan halaman dashboard membuat komponen React seperti biasa:

```jsx
'use client';

import { useState } from 'react';
import { Calculator, Save } from 'lucide-react';

export default function TaxCalculatorPluginPage() {
  const [amount, setAmount] = useState(1000000);
  const tax = amount * 0.11;

  return (
    <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Kalkulator Pajak PPN</h1>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Jumlah Transaksi (IDR)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm font-bold"
          />
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 text-sm font-bold">
          Estimasi PPN (11%): Rp {tax.toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  );
}
```

---

### Langkah 3: Daftarkan Plugin di Plugin Registry (`src/plugins/index.js`)

Buka file `src/plugins/index.js`, impor komponen plugin Anda, dan tambahkan objek metadata plugin ke dalam array `PLUGINS_REGISTRY`:

```javascript
import TaxCalculatorPluginPage from './calculator-tax';
import { Calculator } from 'lucide-react';

export const PLUGINS_REGISTRY = [
  // ... plugin eksisting
  {
    id: 'calculator-tax',
    name: 'Kalkulator Pajak PPN',
    description: 'Hitung estimasi pajak PPN 11% secara instan di dashboard admin.',
    version: '1.0.0',
    author: 'Finance Studio',
    category: 'Finance & Tools',
    routePath: 'calculator-tax',
    navLabel: 'Kalkulator PPN',
    icon: Calculator,
    hasPublicWidget: false,
    component: TaxCalculatorPluginPage
  }
];
```

---

## 🌐 3. Menambahkan Widget Publik (Optional Public Widget)

Jika plugin Anda menyajikan widget melayang di blog publik pembaca (seperti tombol WhatsApp atau Pop-up Email):

1. Buka file `src/components/blog/PluginWidgetInjector.jsx`.
2. Tambahkan komponen widget Anda yang dikondisikan berdasarkan status plugin:

```jsx
const isTaxPluginEnabled = pluginStates['calculator-tax'] !== false;

return (
  <>
    {isTaxPluginEnabled && (
      <div className="fixed bottom-6 right-24 z-50 p-3 rounded-2xl bg-blue-600 text-white shadow-xl text-xs font-bold">
        🧮 Tool Pajak Aktif
      </div>
    )}
  </>
);
```

---

## 📥 4. Format File Paket Plugin JSON (`.json`)

Untuk membuat paket plugin yang bisa di-upload 1-klik di dashboard admin oleh pengguna awam, buat file `plugin-custom.json`:

```json
{
  "id": "quiz-poll-widget",
  "name": "Widget Quiz & Jajak Pendapat",
  "description": "Tampilkan jajak pendapat singkat di bawah setiap artikel blog.",
  "author": "Poll Studio",
  "version": "1.0.0",
  "category": "Engagement",
  "routePath": "quiz-poll-widget",
  "navLabel": "Quiz & Poll"
}
```

Pengguna awam tinggal mengunggah file JSON ini di menu Admin **/dashboard/plugins**, dan menu baru langsung muncul di sidebar!

---

## 🧪 5. Uji Coba Plugin
1. Buka Admin Dashboard: `http://localhost:3000/dashboard/plugins`.
2. Pastikan sakelar plugin Anda berada di posisi **ON**.
3. Periksa sidebar navigasi admin – menu baru Anda (misal `Kalkulator PPN`) otomatis muncul!
4. Klik menu tersebut untuk membuka halaman rute dinamis `/dashboard/calculator-tax`.
