import { DEMO_LOCALE_CODES, DEMO_LOCALES } from '@/lib/demo-locales';
import { buildLocaleHref, contentPathFromParams } from '@/components/site-three/non-sitecore/DemoLanguageSwitcher';

jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'de-DE', 'ja-JP'],
    defaultLocale: 'en',
    localePrefix: 'as-needed',
  },
}));

describe('demo locales', () => {
  it('includes English, German, and Japanese', () => {
    expect(DEMO_LOCALE_CODES).toEqual(['en', 'de-DE', 'ja-JP']);
    expect(DEMO_LOCALES.map((l) => l.label)).toEqual(['English', 'Deutsch', '日本語']);
  });
});

describe('buildLocaleHref', () => {
  it('omits prefix for the default locale', () => {
    expect(buildLocaleHref('en', '')).toBe('/');
    expect(buildLocaleHref('en', '/Job-Search')).toBe('/Job-Search');
  });

  it('prefixes non-default locales', () => {
    expect(buildLocaleHref('de-DE', '')).toBe('/de-DE');
    expect(buildLocaleHref('ja-JP', '/Job-Search')).toBe('/ja-JP/Job-Search');
  });
});

describe('contentPathFromParams', () => {
  it('joins path segments', () => {
    expect(contentPathFromParams(['Job-Search', 'exp001'])).toBe('/Job-Search/exp001');
    expect(contentPathFromParams(undefined)).toBe('');
  });
});
