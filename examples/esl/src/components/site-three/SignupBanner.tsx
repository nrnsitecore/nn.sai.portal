import React from 'react';
import { Button } from '@/components/ui/button';
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
};

const signupInputClass =
  'bg-white text-foreground placeholder:text-muted-foreground rounded-sm border-0 px-4 py-3 text-sm shadow-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70';

/** Solid charcoal panel replaces the frosted-glass treatment from the prior theme. */
const signupPanelClass = 'bg-dark/85';

const signupHeadingClass = 'text-2xl lg:text-4xl font-bold tracking-tight mb-4';

export const Default = (props: SignupBannerProps) => {
  const { fields } = props;
  const t = useTranslations();

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

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder={t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder)}
                  className={signupInputClass}
                />
              </div>

              <Button>{t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel)}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContentLeft = (props: SignupBannerProps) => {
  const { fields } = props;
  const t = useTranslations();

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

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder={t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder)}
                    className={signupInputClass}
                  />
                </div>

                <Button>{t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel)}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BackgroundPrimary = (props: SignupBannerProps) => {
  const { fields } = props;
  const t = useTranslations();

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

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder={t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder)}
                className={signupInputClass}
              />
            </div>

            <Button variant="rounded-white">{t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel)}</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BackgroundDark = (props: SignupBannerProps) => {
  const { fields } = props;
  const t = useTranslations();

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

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder={t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder)}
                className={signupInputClass}
              />
            </div>

            <Button>{t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel)}</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
