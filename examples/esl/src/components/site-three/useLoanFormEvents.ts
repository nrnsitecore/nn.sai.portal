'use client';

import { useCallback } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { event, identity } from '@sitecore-content-sdk/events';
import { parseContactName } from './useSignupIdentity';

export const LOAN_FORM_STARTED_EVENT = 'FORM_STARTED';
export const LOAN_FORM_SUBMITTED_EVENT = 'FORM_SUBMITTED';

export type LoanFormSubmittedPayload = {
  name: string;
  email: string;
  phone?: string;
  amount: string;
  loanType: string;
};

/**
 * Sends Sitecore Cloud SDK events for the SignupBanner LoanForm variant:
 * FORM_STARTED on first interaction, FORM_SUBMITTED plus IDENTITY on submit.
 */
export function useLoanFormEvents() {
  const { page } = useSitecore();
  const { isEditing, isPreview } = page.mode;
  const route = page?.layout?.sitecore?.route;

  const trackFormStarted = useCallback(() => {
    if (process.env.NODE_ENV === 'development' || isEditing || isPreview) return;

    event({
      type: LOAN_FORM_STARTED_EVENT,
      siteId: page.siteName,
      channel: 'WEB',
      name: route?.name,
      language: route?.itemLanguage,
      extensionData: {
        source: 'SignupBanner',
        variant: 'LoanForm',
        formName: 'Loan application',
      },
    }).catch((e) => console.debug(e));
  }, [route, page.siteName, isEditing, isPreview]);

  const trackFormSubmitted = useCallback(
    ({ name, email, amount, loanType }: LoanFormSubmittedPayload) => {
      if (process.env.NODE_ENV === 'development' || isEditing || isPreview) return;

      const trimmedEmail = email.trim();
      const { firstName, lastName } = parseContactName(name);

      if (trimmedEmail) {
        identity({
          channel: 'WEB',
          language: route?.itemLanguage,
          page: route?.name,
          email: trimmedEmail,
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          identifiers: [{ id: trimmedEmail, provider: 'email' }],
          extensionData: { source: 'SignupBanner', variant: 'LoanForm' },
        }).catch((e) => console.debug(e));
      }

      event({
        type: LOAN_FORM_SUBMITTED_EVENT,
        siteId: page.siteName,
        channel: 'WEB',
        name: route?.name,
        language: route?.itemLanguage,
        extensionData: {
          source: 'SignupBanner',
          variant: 'LoanForm',
          formName: 'Loan application',
          loanType,
          amount,
        },
      }).catch((e) => console.debug(e));
    },
    [route, page.siteName, isEditing, isPreview]
  );

  return { trackFormStarted, trackFormSubmitted };
}
