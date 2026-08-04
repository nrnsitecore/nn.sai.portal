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
    const linkText = PromoLink?.value?.text || 'Learn more';
    const hasLink = !!PromoLink?.value?.href;
    const hasEyebrow = !!PromoText3?.value;

    return (
      <section
        data-class-change
        data-component="Promo"
        className={`component promo @container bg-background relative w-full ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 @md:grid-cols-2 @md:gap-14 @md:px-8 @md:py-20">
          {/* Image with the brand's solid red caption bar */}
          <div className="border-border border shadow-sm">
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <ContentSdkImage field={PromoIcon} className="h-full w-full object-cover" />
            </div>
            {hasEyebrow && (
              <ContentSdkRichText tag="div" className="takeda-caption-bar" field={PromoText3} />
            )}
          </div>

          {/* Copy column */}
          <div className="flex flex-col justify-center">
            <ContentSdkRichText
              tag="h2"
              className="takeda-heading-bar font-heading text-pretty text-3xl font-bold leading-tight tracking-tight @lg:text-4xl"
              field={PromoText}
            />
            <ContentSdkRichText
              tag="div"
              className="text-muted-foreground mt-6 max-w-[56ch] space-y-4 text-base leading-relaxed"
              field={PromoText2}
            />
            {hasLink && (
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
