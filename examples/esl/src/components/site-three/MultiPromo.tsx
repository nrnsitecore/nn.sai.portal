'use client';

import { useMemo } from 'react';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
} from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import { IGQLImageField, IGQLLinkField, IGQLTextField } from 'types/igql';
import { NoDataFallback } from '@/utils/NoDataFallback';

interface Fields {
  data: {
    datasource: {
      title?: IGQLTextField;
      description?: IGQLTextField;
      children: {
        results: SimplePromoFields[];
      };
    };
  };
}

interface SimplePromoFields {
  id: string;
  heading: IGQLTextField;
  description: IGQLTextField;
  image: IGQLImageField;
  link: IGQLLinkField;
}

type MultiPromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type PromoItemProps = SimplePromoFields & {
  isHorizontal?: boolean;
};

/**
 * Card built as image + solid red caption bar, the brand's core card language.
 * `isHorizontal` splits image and copy into two columns instead of stacking.
 */
const PromoItem = ({ isHorizontal, ...promo }: PromoItemProps) => {
  const { image, heading, description, link } = promo ?? {};

  return (
    <div className={`grid gap-8 ${isHorizontal ? 'lg:grid-cols-[1fr_2fr] lg:items-start' : ''}`}>
      <div className="border-border border">
        <ContentSdkImage field={image?.jsonValue} className="aspect-4/3 w-full object-cover" />
        <h3 className="takeda-caption-bar">
          <ContentSdkText field={heading?.jsonValue} />
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </h3>
      </div>
      <div>
        <p className="text-muted-foreground mb-3 leading-relaxed">
          <ContentSdkText field={description?.jsonValue} />
        </p>
        <ContentSdkLink
          field={link?.jsonValue}
          className="text-primary hover:text-primary-hover font-(family-name:--font-accent) text-sm font-semibold uppercase tracking-[0.08em] underline-offset-4 transition-colors hover:underline"
        />
      </div>
    </div>
  );
};

const parentBasedGridClasses =
  'grid lg:[.multipromo-2-3_&]:grid-cols-[2fr_3fr] lg:[.multipromo-3-2_&]:grid-cols-[3fr_2fr] lg:grid-cols-[1fr_1fr] gap-14';
const parentBasedGridItemClasses =
  '[.multipromo-centered_&]:items-center [.bg-gradient_&]:text-white items-start';

export const Default = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section className={`relative ${props.params?.styles || ''}`} data-class-change>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="takeda-heading-bar-center mb-6 text-3xl lg:text-4xl">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <p className="text-muted-foreground text-base">
              <ContentSdkText field={datasource?.description?.jsonValue} />
            </p>
          </div>
          <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-12`}>
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return <PromoItem key={promo?.id} {...promo} />;
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

export const Stacked = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section
        className={`relative ${props.params?.styles || ''} overflow-hidden`}
        data-class-change
      >
        <div className="relative container mx-auto px-4 py-16 z-10">
          <div className={`${parentBasedGridClasses}`}>
            <div className="lg:[.multipromo-3-2_&]:col-start-1 lg:[.multipromo-2-3_&]:col-start-2 lg:col-start-2 [.multipromo-2-3_&]:text-right">
              <h2 className="takeda-heading-bar mb-6 text-3xl lg:text-4xl">
                <ContentSdkText field={datasource?.title?.jsonValue} />
              </h2>
              <p className="text-muted-foreground text-base">
                <ContentSdkText field={datasource?.description?.jsonValue} />
              </p>
            </div>
          </div>
          <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-16`}>
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return (
                <div
                  key={promo?.id}
                  className="lg:odd:-mt-8 lg:[.multipromo-3-2_&]:even:-mt-8 lg:[.multipromo-3-2_&]:odd:mt-0"
                >
                  <PromoItem {...promo} />
                </div>
              );
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

export const SingleColumn = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section className={`relative ${props.params?.styles || ''}`} data-class-change>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mb-14">
            <h2 className="takeda-heading-bar mb-6 text-3xl lg:text-4xl">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <p className="text-muted-foreground text-base">
              <ContentSdkText field={datasource?.description?.jsonValue} />
            </p>
          </div>
          <div className="grid gap-14">
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return <PromoItem key={promo?.id} {...promo} isHorizontal />;
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};
