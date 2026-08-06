import { defineRouting } from 'next-intl/routing';
import sitecoreConfig from 'sitecore.config';
import { DEMO_LOCALE_CODES } from '@/lib/demo-locales';

const defaultLocale = sitecoreConfig.defaultLanguage || 'en';

// Ensure default locale is first and present; include demo languages from Sitecore (en, de-DE, ja-JP).
const locales = Array.from(new Set([defaultLocale, ...DEMO_LOCALE_CODES]));

export const routing = defineRouting({
  // Locales must match Sitecore language versions available on the site.
  locales,

  // Used when no locale matches
  defaultLocale,

  // No prefix is added for the default locale ("as-needed").
  // For other configuration options, refer to the next-intl documentation:
  // https://next-intl.dev/docs/routing/configuration
  localePrefix: 'as-needed',
});
