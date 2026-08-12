import './globals.css';

import type { Metadata } from 'next';
import { DM_Sans, Source_Sans_3 } from 'next/font/google';

// ESL brand system: geometric display + open sans body (Semplicita Pro substitute)
const heading = DM_Sans({
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

const body = Source_Sans_3({
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

const accent = DM_Sans({
  weight: ['500', '600', '700'],
  variable: '--font-accent',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'ESL Federal Credit Union',
  description:
    'ESL Federal Credit Union — member-owned banking that helps our community thrive.',
  applicationName: 'ESL Federal Credit Union',
};

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
