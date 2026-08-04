import './globals.css';

import { Barlow, Inter, Montserrat } from 'next/font/google';
import { resolveAppTheme } from '@/lib/app-theme';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
});

const heading = Barlow({
  weight: ['500', '600', '700'],
  variable: '--font-heading-face',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

const body = Inter({
  weight: ['400', '500', '600', '700'],
  variable: '--font-body-face',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

const accent = Inter({
  weight: ['500', '600', '700'],
  variable: '--font-accent-face',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const appTheme = resolveAppTheme();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${heading.variable} ${body.variable} ${accent.variable}`}
      data-theme={appTheme}
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
