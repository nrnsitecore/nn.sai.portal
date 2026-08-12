'use client';

import React, { type JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  useSitecore,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Fields {
  PromoIcon: ImageField;
  PromoText: Field<string>;
  PromoLink: LinkField;
  PromoText2: Field<string>;
  PromoText3: Field<string>;
}

type PromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

/** Shared ESL navy scrim from HeroST Default — keeps white copy readable on bright photography. */
const ESL_LEGIBILITY_SCRIM_CLASS =
  'pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgb(7_56_80/0.78)_0%,rgb(7_56_80/0.48)_38%,rgb(7_56_80/0.18)_62%,transparent_82%)]';

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
);

type PromoLayout = 'imageLeft' | 'imageRight';

const PromoSplitLayout = ({
  props,
  layout,
}: {
  props: PromoProps;
  layout: PromoLayout;
}): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page?.mode?.isEditing ?? false;
  const id = props.params.RenderingIdentifier;
  const { PromoIcon, PromoText, PromoText2, PromoText3, PromoLink } = props.fields || {};
  const linkText = PromoLink?.value?.text || 'Learn more';
  const hasLink = !!PromoLink?.value?.href;
  const hasEyebrow = !!PromoText3?.value;
  // Keep the CTA mounted in Pages so authors can set PromoLink even when empty
  const showLink = hasLink || isEditing;
  const isImageRight = layout === 'imageRight';

  const imageColumn = (
    <div
      className={`overflow-hidden rounded-2xl border border-border/60 shadow-md ${
        isImageRight ? '@md:order-2' : ''
      }`}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <ContentSdkImage field={PromoIcon} className="h-full w-full object-cover" />
      </div>
      {(hasEyebrow || isEditing) && (
        <ContentSdkRichText tag="div" className="esl-caption-bar" field={PromoText3} />
      )}
    </div>
  );

  const copyColumn = (
    <div className={`flex flex-col justify-center ${isImageRight ? '@md:order-1' : ''}`}>
      <ContentSdkRichText
        tag="h2"
        className="esl-heading-bar font-heading text-pretty text-3xl font-bold leading-tight tracking-tight @lg:text-4xl"
        field={PromoText}
      />
      <ContentSdkRichText
        tag="div"
        className="text-muted-foreground mt-6 max-w-[56ch] space-y-4 text-base leading-relaxed"
        field={PromoText2}
      />
      {showLink && (
        <div className="mt-8">
          <ContentSdkLink
            field={PromoLink}
            prefetch={false}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            {linkText}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ContentSdkLink>
        </div>
      )}
    </div>
  );

  return (
    <section
      data-class-change
      data-component="Promo"
      data-variant={isImageRight ? 'ImageRight' : 'Default'}
      className={`component promo @container bg-background relative w-full ${props.params.styles}`}
      id={id ? id : undefined}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 @md:grid-cols-2 @md:gap-14 @md:px-8 @md:py-20">
        {isImageRight ? (
          <>
            {copyColumn}
            {imageColumn}
          </>
        ) : (
          <>
            {imageColumn}
            {copyColumn}
          </>
        )}
      </div>
    </section>
  );
};

export const Default = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return <PromoSplitLayout props={props} layout="imageLeft" />;
  }

  return <PromoDefaultComponent {...props} />;
};

export const ImageRight = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return <PromoSplitLayout props={props} layout="imageRight" />;
  }

  return <PromoDefaultComponent {...props} />;
};

export const FullCard = (props: PromoProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page?.mode?.isEditing ?? false;
  const id = props.params.RenderingIdentifier;

  if (props.fields) {
    const { PromoIcon, PromoText, PromoText2, PromoText3, PromoLink } = props.fields || {};
    const linkText = PromoLink?.value?.text || 'Learn more';
    const hasLink = !!PromoLink?.value?.href;
    const hasEyebrow = !!PromoText3?.value;
    const showLink = hasLink || isEditing;
    const hasImage = !!PromoIcon?.value?.src;

    return (
      <section
        data-class-change
        data-component="Promo"
        data-variant="FullCard"
        className={`component promo relative isolate w-full overflow-hidden bg-dark ${props.params.styles}`}
        id={id ? id : undefined}
      >
        {hasImage && (
          <ContentSdkImage
            field={PromoIcon}
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />
        )}
        {/* Same ESL navy scrim as HeroST Default */}
        <div data-testid="promo-fullcard-legibility-scrim" className={ESL_LEGIBILITY_SCRIM_CLASS} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-dark/30 via-transparent to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-7xl items-center px-4 py-16 @md:min-h-[32rem] @md:px-8 @md:py-24">
          <div className="max-w-2xl">
            {(hasEyebrow || isEditing) && (
              <ContentSdkRichText
                tag="div"
                className="mb-4 font-(family-name:--font-accent) text-sm tracking-wide text-white drop-shadow-sm @md:text-base"
                field={PromoText3}
              />
            )}
            <ContentSdkRichText
              tag="h2"
              className="font-heading text-pretty text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-sm @lg:text-5xl"
              field={PromoText}
            />
            <ContentSdkRichText
              tag="div"
              className="mt-6 max-w-[56ch] space-y-4 text-base leading-relaxed text-white/90"
              field={PromoText2}
            />
            {showLink && (
              <div className="mt-8">
                <ContentSdkLink
                  field={PromoLink}
                  prefetch={false}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  {linkText}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ContentSdkLink>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return <PromoDefaultComponent {...props} />;
};

export const CenteredCard = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  if (props.fields) {
    return (
      <div
        data-class-change
        className={`component promo border-border flex-1 w-full border shadow-sm mb-5 lg:mb-0 align-stretch ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="flex h-full flex-col">
          <ContentSdkImage field={props.fields.PromoIcon} className="w-full h-auto object-cover" />
          <div className="flex flex-1 flex-col justify-center px-6 py-6 text-center">
            <ContentSdkRichText
              tag="h2"
              className="font-heading mb-3 text-xl font-semibold tracking-tight"
              field={props.fields.PromoText}
            />
            <ContentSdkRichText
              tag="div"
              className="text-muted-foreground text-sm leading-relaxed"
              field={props.fields.PromoText2}
            />
          </div>
          <Button variant="default" className="rounded-none w-full justify-between" asChild>
            <ContentSdkLink field={props.fields.PromoLink} />
          </Button>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};
