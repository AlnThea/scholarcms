import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
  title: 'ScholarCMS - Modern WordPress-style Blog Engine',
  description: 'Platform Blog CMS Modern ala WordPress dibangun dengan Next.js, React & Firebase.',
  keywords: ['Blog', 'CMS', 'WordPress', 'Next.js', 'React', 'Firebase', 'ScholarCMS'],
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
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
