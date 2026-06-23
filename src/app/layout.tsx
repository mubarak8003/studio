import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RecoupPro | Trading Recovery Strategy Coach',
  description: 'Master your recovery with algorithmic precision and AI coaching.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 'system';
              var root = window.document.documentElement;
              if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                root.classList.add('dark');
              } else {
                root.classList.remove('dark');
              }
            } catch (e) {}
          })();
        ` }} />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
