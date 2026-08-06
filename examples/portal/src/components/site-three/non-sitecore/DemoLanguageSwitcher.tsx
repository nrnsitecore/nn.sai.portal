'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { routing } from '@/i18n/routing';
import { DEMO_LOCALES } from '@/lib/demo-locales';

export function buildLocaleHref(nextLocale: string, contentPath: string): string {
  const path = contentPath || '/';
  if (nextLocale === routing.defaultLocale) {
    return path;
  }
  // Non-default locales use a locale prefix (next-intl / LocaleProxy as-needed).
  const normalized = path === '/' ? '' : path;
  return `/${nextLocale}${normalized}`;
}

export function contentPathFromParams(path: string | string[] | undefined): string {
  if (Array.isArray(path) && path.length > 0) {
    return `/${path.join('/')}`;
  }
  if (typeof path === 'string' && path.length > 0) {
    return `/${path}`;
  }
  return '';
}

/**
 * Demo control to switch Sitecore / next-intl locale via the URL.
 * Relies on LocaleProxy rewriting `/de-DE/...` → `/[site]/[locale]/[[...path]]`.
 */
export function DemoLanguageSwitcher() {
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale =
    (typeof params?.locale === 'string' && params.locale) || routing.defaultLocale;
  const contentPath = contentPathFromParams(params?.path as string | string[] | undefined);

  const handleValueChange = (nextLocale: string) => {
    if (nextLocale === currentLocale) return;
    const href = buildLocaleHref(nextLocale, contentPath);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Select value={currentLocale} onValueChange={handleValueChange} disabled={isPending}>
      <SelectTrigger
        className="h-10 min-w-[8.5rem] max-w-[12rem]"
        aria-label="Demo language"
        data-testid="demo-language-switcher"
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent align="end">
        {DEMO_LOCALES.map((locale) => (
          <SelectItem key={locale.code} value={locale.code}>
            {locale.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
