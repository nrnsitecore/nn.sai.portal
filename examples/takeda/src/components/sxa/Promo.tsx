import React, { type JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
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

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
);

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  if (props.fields) {
    const { PromoIcon, PromoText, PromoText2, PromoText3, PromoLink } = props.fields;
    const linkText = PromoLink?.value?.text || 'Explore the data';
    const hasLink = !!PromoLink?.value?.href;
    const hasEyebrow = !!PromoText3?.value;

    return (
      <section
        data-class-change
        data-component="Promo"
        className={`component promo @container bg-background relative w-full ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 @md:grid-cols-[1.05fr_0.95fr] @md:gap-0 @md:px-8 @md:py-24">
          {/* Framed image */}
          <div className="relative @md:h-full">
            <div className="relative h-[300px] w-full overflow-hidden @md:h-full @md:min-h-[540px]">
              <ContentSdkImage
                field={PromoIcon}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Offset white outline frame — editorial motif from the brand promo */}
            <span
              aria-hidden
              className="pointer-events-none absolute -left-3 -top-3 bottom-8 right-12 hidden border-2 border-white @sm:block @md:-left-4 @md:-top-4 @md:bottom-10 @md:right-16"
            />
          </div>

          {/* Blush copy panel — overlaps and is inset relative to the image on desktop */}
          <div className="bg-tertiary relative z-10 flex flex-col justify-center px-8 py-10 @md:-ml-10 @md:my-10 @md:px-12 @md:py-16 @lg:px-16">
            {hasEyebrow && (
              <ContentSdkRichText
                tag="p"
                className="text-tertiary-foreground/80 mb-4 text-sm font-semibold uppercase tracking-wider"
                field={PromoText3}
              />
            )}
            <ContentSdkRichText
              tag="h2"
              className="text-tertiary-foreground font-heading text-pretty text-3xl font-semibold leading-tight @lg:text-4xl @xl:text-5xl"
              field={PromoText}
            />
            <ContentSdkRichText
              tag="div"
              className="text-foreground/75 mt-6 max-w-[52ch] space-y-4 text-base leading-relaxed @md:text-lg"
              field={PromoText2}
            />
            {hasLink && (
              <div className="mt-8">
                <ContentSdkLink
                  field={PromoLink}
                  prefetch={false}
                  className="group inline-flex items-stretch overflow-hidden rounded-md shadow-sm"
                >
                  <span className="bg-tertiary-foreground/85 group-hover:bg-tertiary-foreground inline-flex items-center px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors">
                    {linkText}
                  </span>
                  <span className="bg-tertiary-foreground inline-flex items-center justify-center px-3 text-white transition-[filter] group-hover:brightness-90">
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </span>
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
        className={`component promo flex-1 w-full shadow-lg pointer mb-5 lg:mb-0 align-stretch ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="flex flex-col items-start justify-end">
          <ContentSdkImage field={props.fields.PromoIcon} className="w-full h-auto object-cover" />
          <div className="flex-1 relative pt-4 px-4 w-full justify-center text-center">
            <ContentSdkRichText
              tag="h2"
              className="text-4xl font-bold mb-4"
              field={props.fields.PromoText}
            />
            <ContentSdkRichText tag="div" className="mb-4" field={props.fields.PromoText2} />
          </div>
          <Button
            variant="link"
            size="lg"
            className="font-bold text-xl text-center w-full py-1 px-3 ml-4 mb-4 relative b-0"
            asChild
          >
            <ContentSdkLink field={props.fields.PromoLink} />
          </Button>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};
