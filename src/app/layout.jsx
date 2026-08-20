import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { MetaSidebarProvider } from '@/context/MetaSidebarContext';
import RightMetaSidebar from '@/components/admin/RightMetaSidebar';
import AdSenseScript from '@/components/blog/AdSenseScript';
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

  const meta = {
    title: title,
    description: settings.siteDescription || 'Platform Blog CMS Modern untuk penerbitan artikel, berita, dan konten berkualitas.',
    keywords: keywordsArray,
  };

  const googleVerification = settings.googleSiteVerification || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  if (googleVerification) {
    meta.verification = {
      google: googleVerification,
    };
  }

  return meta;
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] antialiased selection:bg-blue-500 selection:text-white">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <MetaSidebarProvider>
                <ClientAnalyticsTracker />
                <AdSenseScript />
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
