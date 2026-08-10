import './globals.css';

import { Barlow, Inter } from 'next/font/google';

// Takeda brand system: slightly condensed grotesque display + neutral UI sans
const heading = Barlow({
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

const body = Inter({
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

const accent = Inter({
  weight: ['500', '600', '700'],
  variable: '--font-accent',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${accent.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://edge-platform.sitecorecloud.io" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
