import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MetaSidebarProvider } from '@/context/MetaSidebarContext';
import RightMetaSidebar from '@/components/admin/RightMetaSidebar';
import AdSenseScript from '@/components/blog/AdSenseScript';

export const metadata = {
  title: 'ScholarCMS - Modern Publishing Platform',
  description: 'Platform Blog CMS Modern untuk penerbitan artikel, berita, dan konten berkualitas.',
  keywords: ['Blog', 'CMS', 'Publishing Platform', 'ScholarCMS', 'Artikel', 'Berita'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] antialiased selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <MetaSidebarProvider>
              <AdSenseScript />
              {children}
              <RightMetaSidebar />
            </MetaSidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
