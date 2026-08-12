import './globals.css';

import { DM_Sans, Open_Sans } from 'next/font/google';

// ESL brand system: geometric display + open sans body (Semplicita Pro substitute)
// Open_Sans instead of Source_Sans_3 — Next 16 Turbopack hits 404s for Source Sans 3 gstatic URLs
const heading = DM_Sans({
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const body = Open_Sans({
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const accent = DM_Sans({
  weight: ['500', '600', '700'],
  variable: '--font-accent',
  subsets: ['latin'],
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
