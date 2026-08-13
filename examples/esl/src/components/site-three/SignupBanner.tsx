'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Field,
  Image as ContentSdkImage,
  ImageField,
  RichText as ContentSdkRichText,
  RichTextField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { useTranslations } from 'next-intl';
import { useSignupIdentity } from './useSignupIdentity';
import { useLoanFormEvents } from './useLoanFormEvents';

interface Fields {
  Heading: Field<string>;
  Subheading: RichTextField;
  Image: ImageField;
  Image2: ImageField;
}

type SignupBannerProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const DICTIONARY_KEYS = {
  SIGNUPBANNER_ButtonLabel: 'Signup_Form_Button_Label',
  SIGNUPBANNER_InputPlaceholder: 'Signup_Form_Input_Placeholder',
  SIGNUPBANNER_NamePlaceholder: 'Signup_Form_Name_Placeholder',
};

const signupInputClass =
  'rounded-full border-0 bg-white px-5 py-3 text-sm text-foreground shadow-none placeholder:text-muted-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70';

/** Navy panel over photography — ESL dark + Oregonians promo treatment. */
const signupPanelClass = 'rounded-2xl bg-dark/80';

const signupHeadingClass = 'text-2xl lg:text-4xl font-bold tracking-tight mb-4';

type SignupFormProps = {
  buttonVariant?: ButtonProps['variant'];
};

const DEFAULT_NAME_PLACEHOLDER = 'Enter your first and last name';
const DEFAULT_EMAIL_PLACEHOLDER = 'Enter your email address';
const DEFAULT_BUTTON_LABEL = 'Submit';

const resolveDictionaryPhrase = (value: string, fallback: string) =>
  !value || value.startsWith('Signup_Form_') ? fallback : value;

const SignupForm = ({ buttonVariant }: SignupFormProps) => {
  const t = useTranslations();
  const identify = useSignupIdentity();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const namePlaceholder = resolveDictionaryPhrase(
    t(DICTIONARY_KEYS.SIGNUPBANNER_NamePlaceholder),
    DEFAULT_NAME_PLACEHOLDER
  );
  const emailPlaceholder = resolveDictionaryPhrase(
    t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder),
    DEFAULT_EMAIL_PLACEHOLDER
  );
  const buttonLabel = resolveDictionaryPhrase(
    t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel),
    DEFAULT_BUTTON_LABEL
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail || !event.currentTarget.checkValidity()) {
      return;
    }

    identify({ email: trimmedEmail, name: trimmedName });
    setName('');
    setEmail('');
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate={false}>
      <div className="flex-1">
        <Input
          type="text"
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={namePlaceholder}
          className={signupInputClass}
          aria-label="Name"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={emailPlaceholder}
            className={signupInputClass}
          />
        </div>
        <Button type="submit" variant={buttonVariant}>
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
};

const LOAN_TYPES = [
  { value: '', label: 'Select loan type' },
  { value: 'personal', label: 'Personal loan' },
  { value: 'auto', label: 'Auto loan' },
  { value: 'home', label: 'Home loan' },
  { value: 'education', label: 'Education loan' },
  { value: 'other', label: 'Other' },
] as const;

const LOAN_SUCCESS_MESSAGE = 'Submitted to Loan Origination System';

type LoanApplicationFormState = {
  name: string;
  email: string;
  phone: string;
  amount: string;
  loanType: string;
};

const emptyLoanForm: LoanApplicationFormState = {
  name: '',
  email: '',
  phone: '',
  amount: '',
  loanType: '',
};

const LoanApplicationForm = ({ buttonVariant }: SignupFormProps) => {
  const { trackFormStarted, trackFormSubmitted } = useLoanFormEvents();
  const [form, setForm] = useState<LoanApplicationFormState>(emptyLoanForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasStartedRef = useRef(false);

  const markFormStarted = () => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    trackFormStarted();
  };

  const handleChange =
    (field: keyof LoanApplicationFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      markFormStarted();
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      return;
    }

    trackFormSubmitted({
      name: form.name,
      email: form.email,
      phone: form.phone,
      amount: form.amount,
      loanType: form.loanType,
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <p
        className="rounded-2xl bg-white/15 px-5 py-4 text-base font-semibold text-white"
        role="status"
        data-testid="loan-form-success"
      >
        {LOAN_SUCCESS_MESSAGE}
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 text-left"
      onSubmit={handleSubmit}
      onFocus={markFormStarted}
      noValidate={false}
      aria-label="Loan application"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="loan-applicant-name" className="sr-only">
            Full name
          </label>
          <Input
            id="loan-applicant-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Full name"
            className={signupInputClass}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="loan-applicant-email" className="sr-only">
            Email
          </label>
          <Input
            id="loan-applicant-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="Email address"
            className={signupInputClass}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="loan-applicant-phone" className="sr-only">
            Phone
          </label>
          <Input
            id="loan-applicant-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="Phone number"
            className={signupInputClass}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="loan-amount" className="sr-only">
            Loan amount
          </label>
          <Input
            id="loan-amount"
            type="number"
            name="amount"
            required
            min="1"
            step="1"
            inputMode="decimal"
            value={form.amount}
            onChange={handleChange('amount')}
            placeholder="Requested amount"
            className={signupInputClass}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label htmlFor="loan-type" className="sr-only">
            Loan type
          </label>
          <select
            id="loan-type"
            name="loanType"
            required
            value={form.loanType}
            onChange={handleChange('loanType')}
            className={`${signupInputClass} h-11 w-full`}
          >
            {LOAN_TYPES.map((option) => (
              <option key={option.value || 'placeholder'} value={option.value} disabled={!option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant={buttonVariant}>
          Start Application
        </Button>
      </div>
    </form>
  );
};

export const Default = (props: SignupBannerProps) => {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  return (
    <section className={`relative px-4 ${props.params.styles}`} data-class-change>
      <div className="absolute inset-0 z-10">
        {fields?.Image && (
          <ContentSdkImage field={fields.Image} className="w-full h-full object-cover" />
        )}
      </div>

      <div className={`relative container mx-auto overflow-hidden ${signupPanelClass} z-20`}>
        <div className="relative px-4 sm:px-8 py-14 sm:py-16 text-center text-white h-full flex flex-col justify-center">
          <div className="max-w-[38rem] mx-auto">
            <h3 className={signupHeadingClass}>
              {fields?.Heading && <ContentSdkText field={fields.Heading} />}
            </h3>

            <div className="text-base leading-relaxed mb-6 text-white/85">
              {fields?.Subheading && <ContentSdkRichText field={fields.Subheading} />}
            </div>

            <SignupForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContentLeft = (props: SignupBannerProps) => {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  return (
    <section className={`relative px-4 ${props.params.styles}`} data-class-change>
      <div className="absolute inset-0 z-10">
        {fields?.Image && (
          <ContentSdkImage field={fields.Image} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="relative container mx-auto z-20">
        <div className={`lg:max-w-[60%] h-full overflow-hidden ${signupPanelClass}`}>
          <div className="relative px-4 sm:px-8 py-14 sm:py-16 text-white h-full flex flex-col justify-center">
            <div className="max-w-[38rem] mx-auto">
              <h2 className={`${signupHeadingClass} text-left`}>
                {fields?.Heading && <ContentSdkText field={fields.Heading} />}
              </h2>

              <div className="text-base mb-6 leading-relaxed text-left text-white/85">
                {fields?.Subheading && <ContentSdkRichText field={fields.Subheading} />}
              </div>

              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BackgroundPrimary = (props: SignupBannerProps) => {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  return (
    <section
      className={`relative bg-primary text-primary-foreground overflow-hidden py-8 px-4 ${props.params.styles}`}
      data-class-change
    >
      <div className="relative container mx-auto py-14 lg:py-16 text-center h-full flex flex-col justify-center z-20">
        <div className="lg:w-1/2 max-w-[38rem] mx-auto">
          <h3 className={signupHeadingClass}>
            {fields?.Heading && <ContentSdkText field={fields.Heading} />}
          </h3>

          <div className="text-base leading-relaxed mb-6 text-white/90">
            {fields?.Subheading && <ContentSdkRichText field={fields.Subheading} />}
          </div>

          <SignupForm buttonVariant="rounded-white" />
        </div>
      </div>
    </section>
  );
};

export const BackgroundDark = (props: SignupBannerProps) => {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  return (
    <section className={`relative bg-dark py-8 px-4 ${props.params.styles}`} data-class-change>
      <div className="bg-dark absolute inset-0 z-10">
        {fields?.Image && (
          <ContentSdkImage field={fields.Image} className="w-full h-full object-cover opacity-40" />
        )}
      </div>

      <div className="relative z-40 container mx-auto py-14 lg:py-16 text-center text-white h-full flex flex-col justify-center">
        <div className="lg:w-1/2 max-w-[38rem] mx-auto">
          <h3 className={signupHeadingClass}>
            {fields?.Heading && <ContentSdkText field={fields.Heading} />}
          </h3>

          <div className="text-base leading-relaxed mb-6 text-white/85">
            {fields?.Subheading && <ContentSdkRichText field={fields.Subheading} />}
          </div>

          <SignupForm />
        </div>
      </div>
    </section>
  );
};

export const LoanForm = (props: SignupBannerProps) => {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  return (
    <section
      className={`relative px-4 ${props.params.styles}`}
      data-class-change
      data-variant="LoanForm"
    >
      <div className="absolute inset-0 z-10">
        {fields?.Image && (
          <ContentSdkImage field={fields.Image} className="w-full h-full object-cover" />
        )}
      </div>

      <div className={`relative container mx-auto overflow-hidden ${signupPanelClass} z-20`}>
        <div className="relative px-4 sm:px-8 py-14 sm:py-16 text-white h-full flex flex-col justify-center">
          <div className="max-w-[42rem] mx-auto w-full">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">
              Loan application
            </p>
            <h3 className={signupHeadingClass}>
              {fields?.Heading && <ContentSdkText field={fields.Heading} />}
            </h3>

            <div className="text-base leading-relaxed mb-6 text-white/85">
              {fields?.Subheading && <ContentSdkRichText field={fields.Subheading} />}
            </div>

            <LoanApplicationForm />
          </div>
        </div>
      </div>
    </section>
  );
};
