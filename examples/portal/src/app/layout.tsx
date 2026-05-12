import './globals.css';

import { Montserrat } from 'next/font/google';
import { resolveAppTheme } from '@/lib/app-theme';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const appTheme = resolveAppTheme();

  return (
    <html
      lang="en"
      className={montserrat.variable}
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
