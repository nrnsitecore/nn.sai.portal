'use client';

import { Text as ContentSdkText, Link as ContentSdkLink } from '@sitecore-content-sdk/nextjs';
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
  'From R&D to Manufacturing, Corporate Functions to Commercial, and every team in between, everyone’s contributions at Takeda make a meaningful impact for patients, our people, and the planet.';

const FeatureItem = (props: FeatureItemFields) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <ContentSdkImage field={props?.image?.jsonValue} className="w-6 h-6 object-contain" />
      <p className="text-base text-center">
        <ContentSdkText field={props?.heading?.jsonValue} />
      </p>
    </div>
  );
};

const CareerAreaTile = (props: FeatureItemFields) => {
  return (
    <article className="border-border bg-background w-[min(80vw,22rem)] shrink-0 snap-start overflow-hidden border shadow-sm">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <ContentSdkImage
          field={props?.image?.jsonValue}
          className="h-full w-full object-cover"
        />
      </div>
      <ContentSdkText tag="div" className="takeda-caption-bar" field={props?.heading?.jsonValue} />
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
          <h2 className="takeda-heading-bar text-2xl lg:text-3xl">
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
          <h2 className="takeda-heading-bar-center text-2xl lg:text-3xl">
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
/* CareerAreas — single-row horizontal scroll (jobs.takeda.com Career Areas)   */
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
      className={`takeda-band py-16 lg:py-20 ${props?.params?.styles || ''}`}
      data-class-change
      data-variant="CareerAreas"
    >
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-3xl lg:mb-14">
          <h2 className="takeda-heading-bar font-(family-name:--font-heading) text-3xl font-bold tracking-tight lg:text-4xl">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">{CAREER_AREAS_INTRO}</p>
          {hasLink && (
            <div className="mt-6">
              <ContentSdkLink
                field={datasource?.link?.jsonValue}
                prefetch={false}
                className="font-(family-name:--font-accent) text-primary inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] underline-offset-4 hover:underline"
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
