'use client';

import { useCallback } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { identity } from '@sitecore-content-sdk/events';

export type SignupIdentityPayload = {
  email: string;
  /** Full name from the signup form; mapped to Contact firstName / lastName. */
  name?: string;
};

/**
 * Split a free-text name into CDP Contact firstName / lastName fields.
 * Single-token names become firstName only; additional tokens become lastName.
 */
export function parseContactName(name: string): { firstName?: string; lastName?: string } {
  const trimmed = name.trim();
  if (!trimmed) return {};

  const [firstName, ...rest] = trimmed.split(/\s+/);
  if (!rest.length) {
    return { firstName };
  }

  return { firstName, lastName: rest.join(' ') };
}

/**
 * Sends an IDENTITY event to Sitecore CDP when a visitor submits the SignupBanner
 * form, so the anonymous profile can resolve to a known guest with Contact data.
 */
export function useSignupIdentity() {
  const { page } = useSitecore();
  const { isEditing, isPreview } = page.mode;
  const route = page?.layout?.sitecore?.route;

  return useCallback(
    ({ email, name }: SignupIdentityPayload) => {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) return;

      if (process.env.NODE_ENV === 'development' || isEditing || isPreview) return;

      const { firstName, lastName } = parseContactName(name ?? '');

      identity({
        channel: 'WEB',
        language: route?.itemLanguage,
        page: route?.name,
        email: trimmedEmail,
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        identifiers: [{ id: trimmedEmail, provider: 'email' }],
        extensionData: { source: 'SignupBanner' },
      }).catch((e) => console.debug(e));
    },
    [route, isEditing, isPreview]
  );
}
