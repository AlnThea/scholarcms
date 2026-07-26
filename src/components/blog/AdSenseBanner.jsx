'use client';

import React, { useEffect, useState } from 'react';
import { dbService } from '@/services/dbService';
import { DollarSign } from 'lucide-react';

export default function AdSenseBanner({
  slotId = '',
  placement = 'in-article',
  format = 'auto',
  className = ''
}) {
  const [adSettings, setAdSettings] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const settings = await dbService.getAdSenseSettings();
        if (isMounted) {
          setAdSettings(settings);
          setLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load AdSense settings in banner:', err);
        if (isMounted) setLoaded(true);
      }
    };
    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const pubId = (adSettings?.adClient || adSettings?.publisherId || '').trim();
    const isEnabled = adSettings?.globalEnableAds ?? adSettings?.enabled ?? false;

    if (isEnabled && pubId && pubId !== 'ca-pub-9999999999999999' && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    }
  }, [adSettings]);

  if (!loaded) {
    return null;
  }

  const pubId = (adSettings?.adClient || adSettings?.publisherId || '').trim();
  const isEnabled = adSettings?.globalEnableAds ?? adSettings?.enabled ?? false;
  const isRealPublisherId = isEnabled && pubId && pubId !== 'ca-pub-9999999999999999';

  // Determine specific slot ID based on placement
  let activeSlot = slotId;
  if (!activeSlot && adSettings) {
    if (placement === 'header-banner') activeSlot = adSettings.headerAdSlot;
    else if (placement === 'in-article') activeSlot = adSettings.inArticleAdSlot;
    else if (placement === 'footer') activeSlot = adSettings.footerAdSlot;
  }

  // If AdSense is enabled with a valid real publisherId
  if (isRealPublisherId) {
    return (
      <div className={`adsense-wrapper my-6 overflow-hidden text-center ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={pubId}
          data-ad-slot={activeSlot || '1234567890'}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Fallback visual slot placeholder in Dev/Demo mode
  return (
    <div className={`my-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 border border-emerald-500/20 text-center transition-all ${className}`}>
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
        <DollarSign className="w-4 h-4" />
        <span>Slot Iklan Google AdSense ({placement.toUpperCase()})</span>
      </div>
      <p className="text-[11px] text-[var(--text-muted)]">
        Iklan AdSense aktif secara otomatis begitu Publisher ID resmi diisi pada 
        <a href="/dashboard/settings" className="mx-1 text-blue-500 underline hover:text-blue-600 font-medium">
          Dashboard Admin Settings
        </a>
      </p>
    </div>
  );
}
