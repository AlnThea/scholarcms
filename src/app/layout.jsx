import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { MetaSidebarProvider } from '@/context/MetaSidebarContext';
import RightMetaSidebar from '@/components/admin/RightMetaSidebar';
import ClientAnalyticsTracker from '@/components/analytics/ClientAnalyticsTracker';

import { dbService } from '@/services/dbService';

export const revalidate = 60; // Revalidate every 60 seconds (ISR) untuk Vercel

export async function generateMetadata() {
  const settings = await dbService.getGeneralSettings();
  const title = settings.siteTitle && settings.siteTagline 
    ? `${settings.siteTitle} - ${settings.siteTagline}` 
    : 'ScholarCMS - Modern Publishing Platform';
  
  let keywordsArray = ['ScholarCMS', 'Blog', 'CMS', 'Publishing Platform', 'Artikel', 'Berita'];
  if (settings.siteKeywords) {
    keywordsArray = settings.siteKeywords.split(',').map(k => k.trim());
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarcms.com';

  const meta = {
    metadataBase: new URL(siteUrl),
    title: title,
    description: settings.siteDescription || 'Platform Blog CMS Modern untuk penerbitan artikel, berita, dan konten berkualitas.',
    keywords: keywordsArray,
    openGraph: {
      title: title,
      description: settings.siteDescription || 'Platform Blog CMS Modern untuk penerbitan artikel, berita, dan konten berkualitas.',
      url: siteUrl,
      siteName: settings.siteTitle || 'ScholarCMS',
      images: [
        {
          url: '/cover.png', // Fallback default image in public/
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: settings.siteDescription || 'Platform Blog CMS Modern untuk penerbitan artikel, berita, dan konten berkualitas.',
      images: ['/cover.png'],
    },
    alternates: {
      canonical: siteUrl,
    },
  };

  const googleVerification = settings.googleSiteVerification || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  if (googleVerification) {
    meta.verification = {
      google: googleVerification,
    };
  }

  return meta;
}

export default async function RootLayout({ children }) {
  const [adSettings, genSettings] = await Promise.all([
    dbService.getAdSenseSettings(),
    dbService.getGeneralSettings()
  ]);
  
  const adEnabled = adSettings?.globalEnableAds ?? false;
  const adClient = (adSettings?.adClient || '').trim();
  const showAds = adEnabled && adClient && adClient !== 'ca-pub-9999999999999999';
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarcms.com';
  const siteTitle = genSettings?.siteTitle || 'ScholarCMS';

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Schema.org WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteTitle,
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/?search={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {showAds && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] antialiased selection:bg-blue-500 selection:text-white">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <MetaSidebarProvider>
                <ClientAnalyticsTracker />
                {children}
                <RightMetaSidebar />
              </MetaSidebarProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
