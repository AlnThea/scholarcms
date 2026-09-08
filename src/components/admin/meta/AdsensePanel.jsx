import { DollarSign, ShieldCheck, Settings as SettingsIcon } from 'lucide-react';
import Select from '@/components/ui/Select';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdsensePanel({ 
  isEn, 
  globalAdSettings, 
  adClient, 
  enableAds, 
  setEnableAds, 
  adPlacement, 
  setAdPlacement, 
  isSponsored, 
  setIsSponsored 
}) {
  const { role } = useAuth();
  
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Global Inherited AdSense Info Card */}
      <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2">
        <div className="flex items-center justify-between border-b border-blue-500/10 pb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> {isEn ? 'Site AdSense Credentials' : 'Kredensial AdSense Situs'}
          </span>
          {role === 'admin' && (
            <Link href="/dashboard/settings" className="text-[9px] font-bold text-blue-500 hover:underline flex items-center gap-1">
              <SettingsIcon className="w-3 h-3" /> {isEn ? 'Manage (Admin)' : 'Kelola (Admin)'}
            </Link>
          )}
        </div>
        <div className="text-[11px] text-[var(--text-muted)] space-y-1">
          <div className="flex items-center justify-between">
            <span>{isEn ? 'Global Publisher ID:' : 'ID Publisher Global:'}</span>
            <span className="font-mono font-bold text-[var(--text-main)]">
              {globalAdSettings?.adClient || adClient || 'ca-pub-9999999999999999'}
            </span>
          </div>
          <p className="text-[10px] opacity-75">
            {isEn ? 'Ads are managed and automatically served centrally from CMS Settings.' : 'Iklan disunting dan dikelola secara otomatis terpusat dari Halaman Pengaturan CMS.'}
          </p>
        </div>
      </div>

      {/* AdSense Live Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
        enableAds
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
            enableAds ? 'bg-emerald-500' : 'bg-amber-500'
          }`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs">
              {enableAds ? (isEn ? 'Article Monetization Active 💰' : 'Monetisasi Artikel Aktif 💰') : (isEn ? 'Article Ads Disabled' : 'Iklan Artikel Dinonaktifkan')}
            </h4>
            <p className="text-[10px] opacity-80">
              {enableAds ? (isEn ? 'Auto banner ads will show on this article' : 'Iklan banner otomatis tayang di artikel ini') : (isEn ? 'This article is clean from ad banners' : 'Artikel ini bersih dari tayangan iklan')}
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={enableAds}
          onChange={(e) => setEnableAds(e.target.checked)}
          className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
      </div>

      {enableAds && (
        <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
          
          {/* Posisi Penempatan Iklan */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{isEn ? 'Article Ad Placement Position' : 'Posisi Penempatan Iklan Artikel'}</label>
            <Select
              value={adPlacement}
              onChange={(e) => setAdPlacement(e.target.value)}
            >
              <option value="all">{isEn ? '🌟 All Positions (Header, In-Article & Footer)' : '🌟 Seluruh Posisi (Header, Tengah & Footer)'}</option>
              <option value="top">{isEn ? '⬆️ Top of Article (Header Ad)' : '⬆️ Atas Artikel (Header Ad)'}</option>
              <option value="in_article">{isEn ? '↔️ Middle of Article (In-Article Auto Ad)' : '↔️ Tengah Artikel (In-Article Auto Ad)'}</option>
              <option value="bottom">{isEn ? '⬇️ Bottom of Article (Footer Ad)' : '⬇️ Bawah Artikel (Footer Ad)'}</option>
            </Select>
          </div>

          {/* Sponsored Post Partnership Badge */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-3">
            <div>
              <span className="block font-bold text-xs text-[var(--text-main)]">{isEn ? 'Sponsored Article (Paid Partnership)' : 'Artikel Bersponsor (Paid Partnership)'}</span>
              <span className="block text-[10px] text-[var(--text-muted)]">{isEn ? 'Display official sponsor badge above article' : 'Tampilkan lencana sponsor resmi di atas artikel'}</span>
            </div>
            <input
              type="checkbox"
              checked={isSponsored}
              onChange={(e) => setIsSponsored(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

        </div>
      )}
    </div>
  );
}
