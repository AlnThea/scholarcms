'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { dbService } from '@/services/dbService';

export default function ClientAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public routes, exclude dashboard to avoid skewing stats with admin activity
    if (!pathname || pathname.startsWith('/dashboard') || pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return;
    }

    const referrer = document.referrer;
    const url = window.location.href;

    // Fire and forget
    dbService.trackPageview(url, referrer).catch(err => {
      console.warn('Failed to track pageview:', err);
    });

  }, [pathname]);

  return null;
}
