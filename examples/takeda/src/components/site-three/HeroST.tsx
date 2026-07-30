'use client';

import { useState, type FormEvent } from 'react';
import { useContainerOffsets } from '@/hooks/useContainerOffsets';
import { MapPin, Search } from 'lucide-react';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  Eyebrow: Field<string>;
  Title: Field<string>;
  Image1: ImageField;
  Image2: ImageField;
  Link1: LinkField;
  Link2: LinkField;
}

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: Fields;
};

/* -------------------------------------------------------------------------- */
/* Default variant — image hero with the brand's red job-search panel          */
/* -------------------------------------------------------------------------- */

const SEARCH_RADIUS_OPTIONS = ['5 mi', '10 mi', '25 mi', '50 mi', '100 mi'] as const;

const HERO_SEARCH_FALLBACK_HREF = '/search';

const heroPanelFieldClass =
  'bg-white text-foreground placeholder:text-muted-foreground w-full rounded-sm border-0 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/70';

const heroPanelLabelClass =
  'font-(family-name:--font-accent) mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-white/90';

/**
 * Job-search panel — the hero's signature element. Submitting composes a query
 * string onto the search destination supplied by Link2 (or /search as fallback).
 */
const HeroJobSearchPanel = ({
  searchHref,
  searchLabel,
}: {
  searchHref: string;
  searchLabel: string;
}) => {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState<string>(SEARCH_RADIUS_OPTIONS[2]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    params.set('radius', radius);
    window.location.href = `${searchHref}?${params.toString()}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-primary text-primary-foreground w-full max-w-md p-6 shadow-xl lg:p-8"
      aria-label="Search jobs"
    >
      <h2 className="font-(family-name:--font-heading) mb-6 text-2xl font-semibold tracking-tight md:text-2xl">
        Search jobs
      </h2>
      <div className="mb-4">
        <label className={heroPanelLabelClass} htmlFor="hero-search-location">
          Location
        </label>
        <div className="relative">
          <MapPin
            className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            id="hero-search-location"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, state, or country"
            className={`${heroPanelFieldClass} pl-9`}
          />
        </div>
      </div>
      <div className="mb-6">
        <label className={heroPanelLabelClass} htmlFor="hero-search-radius">
          Radius
        </label>
        <select
          id="hero-search-radius"
          value={radius}
          onChange={(event) => setRadius(event.target.value)}
          className={heroPanelFieldClass}
        >
          {SEARCH_RADIUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="font-(family-name:--font-accent) bg-dark hover:bg-dark-hover flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors"
      >
        <Search className="h-4 w-4" aria-hidden />
        {searchLabel}
      </button>
    </form>
  );
};

export const Default = (props: PageHeaderSTProps) => {
  const hasEyebrow = !!props?.fields?.Eyebrow?.value;
  const hasLink1 = !!props?.fields?.Link1?.value?.href;
  const hasImage = !!props?.fields?.Image1?.value?.src;
  const searchHref = props?.fields?.Link2?.value?.href || HERO_SEARCH_FALLBACK_HREF;
  const searchLabel = props?.fields?.Link2?.value?.text || 'Search jobs';

  return (
    <section
      className={`relative isolate bg-dark ${props?.params?.styles || ''}`}
      data-class-change
    >
      {hasImage && (
        <ContentSdkImage
          field={props.fields.Image1}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      )}
      {/* Legibility scrim — deeper on the left where the headline sits */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-black/75 via-black/45 to-black/25"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            {hasEyebrow && (
              <p className="font-(family-name:--font-accent) border-primary mb-6 border-l-4 pl-4 text-sm font-semibold uppercase tracking-[0.1em] text-white">
                <ContentSdkText field={props?.fields?.Eyebrow} />
              </p>
            )}
            <h1 className="font-(family-name:--font-heading) text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              <ContentSdkText field={props?.fields?.Title} />
            </h1>
            {hasLink1 && (
              <div className="mt-8">
                <ContentSdkLink
                  field={props?.fields?.Link1}
                  prefetch={false}
                  className="btn btn-outline text-white"
                />
              </div>
            )}
          </div>

          <div className="lg:shrink-0">
            <HeroJobSearchPanel searchHref={searchHref} searchLabel={searchLabel} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Right = (props: PageHeaderSTProps) => {
  const { containerRef, leftOffset } = useContainerOffsets();

  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <ContentSdkImage
          field={props?.fields?.Image1}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="relative lg:container w-full lg:flex lg:flex-row-reverse mx-auto z-20"
        ref={containerRef}
      >
        <div className="bg-background/95 flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[42rem] px-6 py-10 lg:p-12">
          <div className="lg:max-w-3xl lg:ml-auto text-right">
            <p className="font-(family-name:--font-accent) text-primary border-primary mb-5 inline-block border-r-4 pr-4 text-sm font-semibold uppercase tracking-[0.1em]">
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </p>
            <h1 className="text-3xl lg:text-5xl">
              <ContentSdkText field={props?.fields?.Title} />
            </h1>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <ContentSdkLink
                field={props?.fields?.Link1}
                prefetch={false}
                className="btn btn-primary"
              />
              <ContentSdkLink
                field={props?.fields?.Link2}
                prefetch={false}
                className="btn btn-secondary"
              />
            </div>
          </div>
        </div>
        <div
          className={`lg:absolute top-0 bottom-0 right-2/3`}
          style={{ left: `-${leftOffset - 16}px` }}
        >
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            className="aspect-7/4 lg:aspect-auto w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export const Centered = (props: PageHeaderSTProps) => {
  const { containerRef, rightOffset } = useContainerOffsets();

  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <ContentSdkImage
          field={props?.fields?.Image1}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative lg:container w-full lg:flex mx-auto z-20" ref={containerRef}>
        <div className="bg-background/95 lg:relative lg:left-1/6 flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[42rem] px-6 py-10 lg:p-12">
          <div className="lg:max-w-3xl lg:mx-auto text-center">
            <p className="takeda-heading-bar-center font-(family-name:--font-accent) text-primary mb-5 text-sm font-semibold uppercase tracking-[0.1em]">
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </p>
            <h1 className="text-3xl lg:text-5xl">
              <ContentSdkText field={props?.fields?.Title} />
            </h1>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ContentSdkLink
                field={props?.fields?.Link1}
                prefetch={false}
                className="btn btn-primary"
              />
              <ContentSdkLink
                field={props?.fields?.Link2}
                prefetch={false}
                className="btn btn-secondary"
              />
            </div>
          </div>
        </div>
        <div
          className={`lg:absolute top-0 bottom-0 left-5/6`}
          style={{ right: `-${rightOffset - 16}px` }}
        >
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            className="aspect-7/4 lg:aspect-auto w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export const SplitScreen = (props: PageHeaderSTProps) => {
  return (
    <section
      className={`relative bg-dark text-dark-foreground ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="flex flex-col lg:flex-row lg:min-h-[36rem]">
        <div className="p-8 lg:basis-full lg:self-center lg:p-14">
          <p className="font-(family-name:--font-accent) border-primary mb-5 border-l-4 pl-4 text-sm font-semibold uppercase tracking-[0.1em]">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </p>
          <h1 className="text-3xl lg:text-4xl">
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="btn btn-primary"
            />
            <ContentSdkLink
              field={props?.fields?.Link2}
              prefetch={false}
              className="btn btn-outline text-white"
            />
          </div>
        </div>
        <div className="relative aspect-3/2 lg:basis-full lg:aspect-auto">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            priority={true}
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="bg-dark/40 relative h-full z-20">
            <div className="border-primary absolute inset-8 border-4 lg:inset-14">
              <ContentSdkImage
                field={props?.fields?.Image1}
                width={1920}
                height={1080}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Stacked = (props: PageHeaderSTProps) => {
  return (
    <section
      className={`relative flex flex-col bg-dark text-dark-foreground lg:flex-row lg:items-center lg:min-h-[40rem] lg:bg-transparent ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="container px-4 mx-auto">
        <div className="bg-dark text-dark-foreground relative lg:w-1/2 px-8 py-12 z-20">
          <p className="font-(family-name:--font-accent) border-primary mb-5 border-l-4 pl-4 text-sm font-semibold uppercase tracking-[0.1em]">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </p>
          <h1 className="text-3xl lg:text-4xl">
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="btn btn-primary"
            />
            <ContentSdkLink
              field={props?.fields?.Link2}
              prefetch={false}
              className="btn btn-outline text-white"
            />
          </div>
        </div>
      </div>
      <div className="relative aspect-3/2 lg:absolute lg:aspect-auto inset-0 flex z-10">
        <div className="relative w-1/3">
          <ContentSdkImage
            field={props?.fields?.Image2}
            width={1920}
            height={1080}
            className="absolute w-full h-full inset-0 object-cover"
          />
        </div>
        <div className="relative w-2/3">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            className="absolute w-full h-full inset-0 object-cover z-10"
          />
          <div className="bg-dark/40 absolute inset-0 z-20">
            <ContentSdkImage
              field={props?.fields?.Image1}
              width={1920}
              height={1080}
              className="absolute w-[calc(100%-5rem)] h-full left-20 top-0 right-0 bottom-0 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
