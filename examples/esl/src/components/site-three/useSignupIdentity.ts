'use client';

import { useCallback } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { identity } from '@sitecore-content-sdk/events';

/**
 * Sends an IDENTITY event to Sitecore CDP when a visitor submits an email
 * via SignupBanner, so the anonymous profile can resolve to a known guest.
 */
export function useSignupIdentity() {
  const { page } = useSitecore();
  const { isEditing, isPreview } = page.mode;
  const route = page?.layout?.sitecore?.route;

  return useCallback(
    (email: string) => {
      const trimmed = email.trim();
      if (!trimmed) return;

      if (process.env.NODE_ENV === 'development' || isEditing || isPreview) return;

      identity({
        channel: 'WEB',
        language: route?.itemLanguage,
        page: route?.name,
        email: trimmed,
        identifiers: [{ id: trimmed, provider: 'email' }],
        extensionData: { source: 'SignupBanner' },
      }).catch((e) => console.debug(e));
    },
    [route, isEditing, isPreview]
  );
}
