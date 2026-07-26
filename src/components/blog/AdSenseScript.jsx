'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { dbService } from '@/services/dbService';

export default function AdSenseScript() {
  const [publisherId, setPublisherId] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const settings = await dbService.getAdSenseSettings();
        if (isMounted && settings) {
          const pubId = (settings.adClient || settings.publisherId || '').trim();
          const isEnabled = settings.globalEnableAds ?? settings.enabled ?? false;

          if (isEnabled && pubId && pubId !== 'ca-pub-9999999999999999') {
            setPublisherId(pubId);
            setEnabled(true);
          }
        }
      } catch (err) {
        console.error('Failed to load AdSense Script settings:', err);
      }
    };
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!enabled || !publisherId) {
    return null;
  }

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
