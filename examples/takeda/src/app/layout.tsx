import './globals.css';

import { Archivo, Zilla_Slab } from 'next/font/google';

// Covista brand system: slab-serif display (albiona substitute) + wide humanist sans (acumin-pro-wide substitute)
const heading = Zilla_Slab({
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const body = Archivo({
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

const accent = Archivo({
  weight: ['500', '600', '700'],
  variable: '--font-accent',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${accent.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://edge-platform.sitecorecloud.io" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
