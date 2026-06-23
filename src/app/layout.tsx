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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-obsidian text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}