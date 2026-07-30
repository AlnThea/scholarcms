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

  // If AdSense is disabled or publisher ID is not configured, hide the ad slot completely
  if (!isEnabled || !isRealPublisherId) {
    return null;
  }

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
