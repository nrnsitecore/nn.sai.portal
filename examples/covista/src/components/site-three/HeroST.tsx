'use client';

import { useEffect, useRef, useState } from 'react';
import { useContainerOffsets } from '@/hooks/useContainerOffsets';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import {
  ArrowRight,
  GraduationCap,
  School,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
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
/* Default variant — covista.com-style video hero with count-up statistics    */
/* -------------------------------------------------------------------------- */

type HeroStat = { value: number; suffix: string; label: string; icon: LucideIcon };

/** Hardcoded demo stats mirroring covista.com's homepage hero. */
const HERO_STATS: readonly HeroStat[] = [
  { value: 5, suffix: '', label: 'post-secondary institutions', icon: School },
  { value: 24, suffix: 'K+', label: 'healthcare graduates a year', icon: GraduationCap },
  { value: 290, suffix: 'K+', label: 'healthcare alumni practicing worldwide', icon: Stethoscope },
];

/** Stable reference so the observer effect does not re-run every render. */
const HERO_STATS_OBSERVER_OPTIONS = { threshold: 0.3 } as const;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Animate a whole number from 0 to `target` once `active` becomes true.
 * Uses requestAnimationFrame with easeOutCubic and honors reduced-motion
 * (jumps straight to the final value).
 */
function useCountUp(target: number, active: boolean, durationMs = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }

    let raf = 0;
    let startTs = 0;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);

  return value;
}

const HeroStatCard = ({ stat, active }: { stat: HeroStat; active: boolean }) => {
  const count = useCountUp(stat.value, active);
  const Icon = stat.icon;

  return (
    <div className="bg-card border-border rounded-md border p-6 shadow-sm lg:p-7">
      <Icon className="text-primary mb-5 h-9 w-9" strokeWidth={1.5} aria-hidden />
      <div className="text-primary font-(family-name:--font-heading) text-4xl leading-none tabular-nums lg:text-5xl">
        {count}
        {stat.suffix}
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-snug lg:text-base">{stat.label}</p>
    </div>
  );
};

export const Default = (props: PageHeaderSTProps) => {
  const { ref: statsRef, isVisible } = useIntersectionObserver(HERO_STATS_OBSERVER_OPTIONS);
  const posterSrc = props?.fields?.Image1?.value?.src as string | undefined;
  const hasEyebrow = !!props?.fields?.Eyebrow?.value;
  const hasLink2 = !!props?.fields?.Link2?.value?.href;
  const link1Text = props?.fields?.Link1?.value?.text || 'Our story';

  return (
    <>
      <section
        className={`relative isolate bg-primary ${props?.params?.styles || ''}`}
        data-class-change
      >
      {/* Autoplaying, muted, looping video backdrop (poster falls back to Image1) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        <source src="/header_final.mp4" type="video/mp4" />
      </video>
      {/* Legibility overlay */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
        aria-hidden
      />

      {/* Decorative dot-grid motif */}
      <div
        className="pointer-events-none absolute right-8 top-28 hidden grid-cols-6 gap-2 lg:grid xl:right-16"
        aria-hidden
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-3 w-3 bg-white/25" />
        ))}
      </div>

      <div className="container relative mx-auto px-4 pb-28 pt-28 sm:pb-32 lg:pb-48 lg:pt-40">
        <div className="max-w-3xl">
          {hasEyebrow && (
            <p className="font-(family-name:--font-accent) mb-4 text-sm uppercase tracking-wide text-white/85 lg:text-base">
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </p>
          )}
          <h1 className="font-(family-name:--font-heading) text-4xl leading-[1.05] text-white lg:text-7xl">
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="group inline-flex items-stretch overflow-hidden rounded-md shadow-sm"
            >
              <span className="bg-light text-primary font-(family-name:--font-accent) inline-flex items-center px-5 py-3 text-sm font-semibold tracking-wide">
                {link1Text}
              </span>
              <span className="bg-primary text-primary-foreground group-hover:bg-primary-hover inline-flex items-center justify-center px-3 transition-colors">
                <ArrowRight className="h-5 w-5" aria-hidden />
              </span>
            </ContentSdkLink>
            {hasLink2 && (
              <ContentSdkLink
                field={props?.fields?.Link2}
                prefetch={false}
                className="btn btn-outline text-white"
              />
            )}
          </div>
        </div>
      </div>

      </section>

      {/* Stat cards live in normal flow and are pulled up to straddle the hero's
          bottom edge. No overflow clipping, so they stay fully visible and
          responsive: stacked on mobile, 3-up from tablet, overlapping on desktop. */}
      <div
        ref={statsRef}
        className="relative z-20 -mt-16 pb-12 sm:-mt-20 lg:-mt-24 lg:pb-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HERO_STATS.map((stat) => (
              <HeroStatCard key={stat.label} stat={stat} active={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </>
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
        <div className="flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[50rem] px-4 py-8 lg:p-8 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]">
          <div className="lg:max-w-3xl lg:ml-auto text-right">
            <h1 className="text-primary text-xl lg:text-3xl pb-4 uppercase">
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </h1>
            <h1 className="text-4xl lg:text-7xl uppercase">
              <ContentSdkText field={props?.fields?.Title} />
            </h1>
            <div className="mt-8">
              <ContentSdkLink
                field={props?.fields?.Link1}
                prefetch={false}
                className="btn btn-primary mr-4"
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
        <div className="lg:relative lg:left-1/6 flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[50rem] px-4 py-8 lg:p-8 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]">
          <div className="lg:max-w-3xl lg:mx-auto text-center">
            <h1 className="text-primary text-xl lg:text-3xl pb-4 uppercase">
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </h1>
            <h1 className="text-4xl lg:text-7xl uppercase">
              <ContentSdkText field={props?.fields?.Title} />
            </h1>
            <div className="mt-8">
              <ContentSdkLink
                field={props?.fields?.Link1}
                prefetch={false}
                className="btn btn-primary mr-4"
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
      className={`relative bg-primary border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="flex flex-col lg:flex-row lg:min-h-[50rem]">
        <div className="p-8 lg:basis-full lg:self-center lg:p-14">
          <h1 className="text-xl lg:text-3xl pb-4 uppercase">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </h1>
          <h1 className="text-4xl lg:text-6xl uppercase">
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="btn btn-secondary mr-4"
            />
            <ContentSdkLink
              field={props?.fields?.Link2}
              prefetch={false}
              className="btn btn-secondary"
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
          <div className="relative h-full backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)] z-20">
            <div className="absolute  inset-8 lg:inset-14">
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
      className={`relative flex flex-col bg-primary lg:flex-row lg:items-center lg:min-h-[50rem] lg:bg-transparent ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="container px-4 mx-auto">
        <div className="relative lg:w-1/2 px-6 py-12 bg-primary z-20">
          <h1 className="text-xl lg:text-3xl pb-4 uppercase">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </h1>
          <h1 className="text-4xl lg:text-6xl uppercase">
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="btn btn-secondary mr-4"
            />
            <ContentSdkLink
              field={props?.fields?.Link2}
              prefetch={false}
              className="btn btn-secondary"
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
          <div className="absolute inset-0 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)] z-20">
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
