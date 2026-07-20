import './globals.css';

export const metadata = {
  title: 'ScholarCMS - Modern WordPress-style Blog Engine',
  description: 'Platform Blog CMS Modern ala WordPress dibangun dengan Next.js, React & Firebase.',
  keywords: ['Blog', 'CMS', 'WordPress', 'Next.js', 'React', 'Firebase', 'ScholarCMS'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
