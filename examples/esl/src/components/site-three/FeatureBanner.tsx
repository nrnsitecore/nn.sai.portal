'use client';

import {
  Text as ContentSdkText,
  Link as ContentSdkLink,
} from '@sitecore-content-sdk/nextjs';
import { DamAwareNextImage as ContentSdkImage } from '@/components/image/DamAwareNextImage';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { IGQLImageField, IGQLLinkField, IGQLTextField } from 'types/igql';

interface Fields {
  data: {
    datasource: {
      title: IGQLTextField;
      link: IGQLLinkField;
      children: {
        results: FeatureItemFields[];
      };
    };
  };
}

interface FeatureItemFields {
  id: string;
  image: IGQLImageField;
  heading: IGQLTextField;
}

type FeatureBannerProps = {
  params: { [key: string]: string };
  fields: Fields;
};

/** Demo-only intro — FeatureBanner has no description field. */
const CAREER_AREAS_INTRO =
  'From personal banking to business services, community impact to financial wellness, ESL members get local expertise and tools that help them move forward — one step at a time.';

const FeatureItem = (props: FeatureItemFields) => {
  return (
    <div className="flex max-w-[12rem] flex-col items-center gap-3 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-background p-3 shadow-sm">
        <ContentSdkImage field={props?.image?.jsonValue} className="h-8 w-8 object-contain" />
      </div>
      <p className="text-base font-semibold text-foreground">
        <ContentSdkText field={props?.heading?.jsonValue} />
      </p>
    </div>
  );
};

const CareerAreaTile = (props: FeatureItemFields) => {
  return (
    <article className="w-[min(80vw,22rem)] shrink-0 snap-start overflow-hidden rounded-2xl border border-border/60 bg-background shadow-md">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <ContentSdkImage
          field={props?.image?.jsonValue}
          className="h-full w-full object-cover"
        />
      </div>
      <ContentSdkText tag="div" className="esl-caption-bar" field={props?.heading?.jsonValue} />
    </article>
  );
};

export const Default = (props: FeatureBannerProps) => {
  const datasource = useMemo(
    () => props?.fields?.data?.datasource,
    [props?.fields?.data?.datasource]
  );

  return (
    <section className={`py-16 ${props?.params?.styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 py-12 border-t border-b border-border">
          <h2 className="esl-heading-bar text-2xl lg:text-3xl">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-8">
            {datasource?.children?.results?.map((item) => (
              <FeatureItem key={item.id} {...item} />
            )) || []}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Vertical = (props: FeatureBannerProps) => {
  const datasource = useMemo(
    () => props?.fields?.data?.datasource,
    [props?.fields?.data?.datasource]
  );

  return (
    <section className={`py-16 ${props?.params?.styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 lg:gap-12 py-12 border-t border-b border-border">
          <h2 className="esl-heading-bar-center text-2xl lg:text-3xl">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-10">
            {datasource?.children?.results?.map((item) => (
              <FeatureItem key={item.id} {...item} />
            )) || []}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Accent = (props: FeatureBannerProps) => {
  const datasource = useMemo(
    () => props?.fields?.data?.datasource,
    [props?.fields?.data?.datasource]
  );

  return (
    <section
      className={`py-16 border-t border-b border-border ${props?.params?.styles}`}
      data-class-change
    >
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 py-12">
            <h2 className="text-2xl lg:text-3xl">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-8">
              {datasource?.children?.results?.map((item) => (
                <FeatureItem key={item.id} {...item} />
              )) || []}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* CareerAreas — single-row horizontal scroll (Oregonians-style feature cards) */
/* -------------------------------------------------------------------------- */

export const CareerAreas = (props: FeatureBannerProps) => {
  const datasource = useMemo(
    () => props?.fields?.data?.datasource,
    [props?.fields?.data?.datasource]
  );
  const features = datasource?.children?.results || [];
  const hasLink = !!datasource?.link?.jsonValue?.value?.href;
  const linkText = datasource?.link?.jsonValue?.value?.text || 'View all career areas';

  return (
    <section
      className={`esl-band py-16 lg:py-20 ${props?.params?.styles || ''}`}
      data-class-change
      data-variant="CareerAreas"
    >
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-3xl lg:mb-14">
          <h2 className="esl-heading-bar font-(family-name:--font-heading) text-3xl font-bold tracking-tight lg:text-4xl">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">{CAREER_AREAS_INTRO}</p>
          {hasLink && (
            <div className="mt-6">
              <ContentSdkLink
                field={datasource?.link?.jsonValue}
                prefetch={false}
                className="inline-flex items-center gap-2 font-(family-name:--font-accent) text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {linkText}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ContentSdkLink>
            </div>
          )}
        </div>

        {features.length > 0 && (
          <div
            className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] snap-x snap-mandatory"
            role="region"
            aria-label="Career areas"
            data-scroll="horizontal"
          >
            <div className="flex w-max flex-nowrap gap-6">
              {features.map((item) => (
                <CareerAreaTile key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Offers — compact credit-union offer tiles (referral, savings bonus, IRA)   */
/* Fields: title, optional link, FeatureItem image + heading                  */
/* -------------------------------------------------------------------------- */

const OfferCard = (props: FeatureItemFields) => {
  return (
    <article className="flex min-h-[6.75rem] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-md">
      <div className="relative w-24 shrink-0 bg-muted sm:w-28">
        <ContentSdkImage
          field={props?.image?.jsonValue}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center border-l-4 border-primary px-4 py-4 sm:px-5">
        <p className="font-(family-name:--font-heading) text-base font-semibold leading-snug text-foreground sm:text-lg">
          <ContentSdkText field={props?.heading?.jsonValue} />
        </p>
      </div>
    </article>
  );
};

export const Offers = (props: FeatureBannerProps) => {
  const datasource = useMemo(
    () => props?.fields?.data?.datasource,
    [props?.fields?.data?.datasource]
  );
  const features = datasource?.children?.results || [];
  const hasLink = !!datasource?.link?.jsonValue?.value?.href;
  const linkText = datasource?.link?.jsonValue?.value?.text || 'See all offers';

  return (
    <section
      className={`esl-band py-10 lg:py-14 ${props?.params?.styles || ''}`}
      data-class-change
      data-variant="Offers"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="esl-heading-bar font-(family-name:--font-heading) text-2xl font-bold tracking-tight lg:text-3xl">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          {hasLink && (
            <ContentSdkLink
              field={datasource?.link?.jsonValue}
              prefetch={false}
              className="btn btn-primary inline-flex shrink-0 items-center gap-2"
            >
              {linkText}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ContentSdkLink>
          )}
        </div>

        {features.length > 0 && (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            role="list"
            aria-label="Offers"
          >
            {features.map((item) => (
              <div key={item.id} role="listitem">
                <OfferCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
