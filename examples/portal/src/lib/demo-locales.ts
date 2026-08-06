/**
 * Demo language options for the header language switcher.
 * Codes must match Sitecore language versions available on the site
 * and entries in `src/i18n/routing.ts`.
 */
export type DemoLocaleOption = {
  code: string;
  label: string;
};

export const DEMO_LOCALES: readonly DemoLocaleOption[] = [
  { code: 'en', label: 'English' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'ja-JP', label: '日本語' },
] as const;

export const DEMO_LOCALE_CODES = DEMO_LOCALES.map((l) => l.code);
