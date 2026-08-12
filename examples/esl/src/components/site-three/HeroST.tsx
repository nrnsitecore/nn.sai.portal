'use client';

import { useState, type FormEvent } from 'react';
import { useContainerOffsets } from '@/hooks/useContainerOffsets';
import {
  ArrowRight,
  Briefcase,
  Landmark,
  MapPin,
  Search,
  UserRound,
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
/* Default variant — Covista-style image hero (no video) + service cards      */
/* Layout mirrors Oregonians CU: full-bleed media, left copy, straddling cards */
/* -------------------------------------------------------------------------- */

type HeroService = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

/** ESL.org primary service areas — static feature cards under the hero. */
const HERO_SERVICES: readonly HeroService[] = [
  {
    title: 'Personal',
    description:
      'Checking, savings, loans, mortgages, and digital banking built for everyday life.',
    href: 'https://www.esl.org/Personal',
    icon: UserRound,
  },
  {
    title: 'Business',
    description:
      'Accounts, lending, and cash management to help your business grow with confidence.',
    href: 'https://www.esl.org/Business',
    icon: Briefcase,
  },
  {
    title: 'Wealth',
    description:
      'Investment planning and trust services to help you build and protect your future.',
    href: 'https://www.esl.org/Wealth',
    icon: Landmark,
  },
];

const HeroServiceCard = ({ service }: { service: HeroService }) => {
  const Icon = service.icon;

  return (
    <a
      href={service.href}
      className="group block rounded-2xl border border-border bg-card p-6 shadow-md transition-shadow hover:shadow-lg lg:p-7"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-background">
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} aria-hidden />
      </div>
      <h2 className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
        {service.title}
      </h2>
      <p className="mt-3 text-sm leading-snug text-muted-foreground lg:text-base">
        {service.description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 font-(family-name:--font-accent) text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </a>
  );
};

type HeroDefaultBannerProps = {
  props: PageHeaderSTProps;
  /** Extra bottom padding when service cards straddle the hero edge. */
  withCardClearance?: boolean;
  variant?: 'Default' | 'NoCards';
};

/** Shared image hero banner used by Default and NoCards. */
const HeroDefaultBanner = ({
  props,
  withCardClearance = false,
  variant = 'Default',
}: HeroDefaultBannerProps) => {
  const hasEyebrow = !!props?.fields?.Eyebrow?.value;
  const hasImage = !!props?.fields?.Image1?.value?.src;
  const hasLink2 = !!props?.fields?.Link2?.value?.href;
  const link1Text = props?.fields?.Link1?.value?.text || 'Become a Member';
  const bottomPadding = withCardClearance
    ? 'pb-28 sm:pb-32 lg:pb-48'
    : 'pb-20 sm:pb-24 lg:pb-32';

  return (
    <section
      className={`relative isolate bg-dark ${props?.params?.styles || ''}`}
      data-class-change
      data-variant={variant}
    >
      {hasImage && (
        <ContentSdkImage
          field={props.fields.Image1}
          priority
          fetchPriority="high"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      )}
      {/* ESL navy scrim — soft left/top fade so white copy stays readable on bright photos */}
      <div
        data-testid="hero-st-legibility-scrim"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgb(7_56_80/0.78)_0%,rgb(7_56_80/0.48)_38%,rgb(7_56_80/0.18)_62%,transparent_82%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-dark/30 via-transparent to-transparent"
        aria-hidden
      />

      {/* Decorative dot-grid motif */}
      <div
        className="pointer-events-none absolute top-28 right-8 z-[1] hidden grid-cols-6 gap-2 lg:grid xl:right-16"
        aria-hidden
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-3 w-3 rounded-full bg-white/25" />
        ))}
      </div>

      <div className={`container relative z-10 mx-auto px-4 pt-28 lg:pt-40 ${bottomPadding}`}>
        <div className="max-w-3xl">
          {hasEyebrow && (
            <p className="mb-4 font-(family-name:--font-accent) text-sm tracking-wide text-white drop-shadow-sm lg:text-base">
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </p>
          )}
          <h1 className="font-(family-name:--font-heading) text-4xl leading-[1.05] font-bold text-white drop-shadow-sm lg:text-7xl">
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="group inline-flex items-stretch overflow-hidden rounded-full shadow-sm"
            >
              <span className="inline-flex items-center bg-light px-6 py-3 font-(family-name:--font-accent) text-sm font-semibold tracking-wide text-primary">
                {link1Text}
              </span>
              <span className="inline-flex items-center justify-center bg-primary px-3.5 text-primary-foreground transition-colors group-hover:bg-primary-hover">
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
  );
};

export const Default = (props: PageHeaderSTProps) => {
  return (
    <>
      <HeroDefaultBanner props={props} withCardClearance variant="Default" />

      {/* Service cards straddle the hero bottom edge (Oregonians / Covista pattern). */}
      <div className="relative z-20 -mt-16 pb-12 sm:-mt-20 lg:-mt-24 lg:pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HERO_SERVICES.map((service) => (
              <HeroServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/** Same as Default, without the Personal / Business / Wealth service cards. */
export const NoCards = (props: PageHeaderSTProps) => {
  return <HeroDefaultBanner props={props} variant="NoCards" />;
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
            <p className="font-(family-name:--font-accent) text-primary border-primary mb-5 inline-block border-r-4 pr-4 text-sm font-semibold">
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
            <p className="esl-heading-bar-center font-(family-name:--font-accent) text-primary mb-5 text-sm font-semibold">
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
          <p className="font-(family-name:--font-accent) border-primary mb-5 border-l-4 pl-4 text-sm font-semibold">
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
          <p className="font-(family-name:--font-accent) border-primary mb-5 border-l-4 pl-4 text-sm font-semibold">
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

/* -------------------------------------------------------------------------- */
/* JobSearch — hardcoded demo job board (credit-union careers demo)            */
/* -------------------------------------------------------------------------- */

type HardcodedJob = {
  id: string;
  title: string;
  location: string;
  careerArea: string;
  postedDate: string;
};

const JOB_BOARD_CAREER_AREAS = [
  'All career areas',
  'Research & Development',
  'Manufacturing & Supply',
  'Commercial',
  'Corporate Functions',
  'Data, Digital & Technology',
  'BioLife',
] as const;

const JOB_BOARD_RADIUS_OPTIONS = ['5 miles', '15 miles', '25 miles', '35 miles', '50 miles'] as const;

/** Demo-only job listings — not wired to Sitecore or a real ATS. */
const HARDCODED_JOBS: HardcodedJob[] = [
  {
    id: 'job-001',
    title: 'Senior Scientist, Immunology',
    location: 'Cambridge, MA',
    careerArea: 'Research & Development',
    postedDate: 'Mar 12, 2026',
  },
  {
    id: 'job-002',
    title: 'Manufacturing Associate, Plasma Operations',
    location: 'Social Circle, GA',
    careerArea: 'Manufacturing & Supply',
    postedDate: 'Mar 10, 2026',
  },
  {
    id: 'job-003',
    title: 'Brand Manager, US Commercial',
    location: 'Lexington, MA',
    careerArea: 'Commercial',
    postedDate: 'Mar 8, 2026',
  },
  {
    id: 'job-004',
    title: 'HR Business Partner',
    location: 'Zurich, Switzerland',
    careerArea: 'Corporate Functions',
    postedDate: 'Mar 5, 2026',
  },
  {
    id: 'job-005',
    title: 'Software Engineer, Digital Health Platforms',
    location: 'Boston, MA',
    careerArea: 'Data, Digital & Technology',
    postedDate: 'Mar 3, 2026',
  },
  {
    id: 'job-006',
    title: 'Plasma Center Manager',
    location: 'Austin, TX',
    careerArea: 'BioLife',
    postedDate: 'Feb 28, 2026',
  },
  {
    id: 'job-007',
    title: 'Clinical Research Associate',
    location: 'Tokyo, Japan',
    careerArea: 'Research & Development',
    postedDate: 'Feb 25, 2026',
  },
  {
    id: 'job-008',
    title: 'Quality Assurance Specialist',
    location: 'Lessines, Belgium',
    careerArea: 'Manufacturing & Supply',
    postedDate: 'Feb 22, 2026',
  },
  {
    id: 'job-009',
    title: 'Medical Science Liaison',
    location: 'Chicago, IL',
    careerArea: 'Commercial',
    postedDate: 'Feb 18, 2026',
  },
  {
    id: 'job-010',
    title: 'Data Analyst, Global Supply Chain',
    location: 'Singapore',
    careerArea: 'Data, Digital & Technology',
    postedDate: 'Feb 14, 2026',
  },
];

const jobBoardFieldClass =
  'w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40'

const jobBoardLabelClass =
  'mb-2 block font-(family-name:--font-accent) text-xs font-semibold text-foreground'

export const JobSearch = (props: PageHeaderSTProps) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState<string>(JOB_BOARD_RADIUS_OPTIONS[2]);
  const [careerArea, setCareerArea] = useState<string>(JOB_BOARD_CAREER_AREAS[0]);
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    location: '',
    careerArea: JOB_BOARD_CAREER_AREAS[0] as string,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({
      keyword: keyword.trim().toLowerCase(),
      location: location.trim().toLowerCase(),
      careerArea,
    });
  };

  const filteredJobs = HARDCODED_JOBS.filter((job) => {
    const matchesKeyword =
      !appliedFilters.keyword ||
      job.title.toLowerCase().includes(appliedFilters.keyword) ||
      job.careerArea.toLowerCase().includes(appliedFilters.keyword);
    const matchesLocation =
      !appliedFilters.location || job.location.toLowerCase().includes(appliedFilters.location);
    const matchesCareerArea =
      appliedFilters.careerArea === 'All career areas' ||
      job.careerArea === appliedFilters.careerArea;
    return matchesKeyword && matchesLocation && matchesCareerArea;
  });

  return (
    <section
      className={`bg-background ${props?.params?.styles || ''}`}
      data-class-change
      data-variant="JobSearch"
    >
      <div className="esl-band border-border border-b px-4 py-12 lg:py-16">
        <div className="container mx-auto max-w-5xl">
          <h1 className="esl-heading-bar font-(family-name:--font-heading) text-3xl font-bold tracking-tight lg:text-4xl">
            Search jobs
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
            Find roles across R&D, Manufacturing, Commercial, and every team in between—and take the
            next step toward a career that improves healthcare around the globe.
          </p>
        </div>
      </div>

      <div className="border-border border-b bg-background px-4 py-8">
        <div className="container mx-auto max-w-5xl">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end"
            aria-label="Job search filters"
          >
            <div className="lg:col-span-1">
              <label className={jobBoardLabelClass} htmlFor="job-board-keyword">
                Keyword
              </label>
              <input
                id="job-board-keyword"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Job title or skill"
                className={jobBoardFieldClass}
              />
            </div>
            <div>
              <label className={jobBoardLabelClass} htmlFor="job-board-location">
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  aria-hidden
                />
                <input
                  id="job-board-location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City or country"
                  className={`${jobBoardFieldClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={jobBoardLabelClass} htmlFor="job-board-radius">
                Radius
              </label>
              <select
                id="job-board-radius"
                value={radius}
                onChange={(event) => setRadius(event.target.value)}
                className={jobBoardFieldClass}
              >
                {JOB_BOARD_RADIUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={jobBoardLabelClass} htmlFor="job-board-career-area">
                Career area
              </label>
              <select
                id="job-board-career-area"
                value={careerArea}
                onChange={(event) => setCareerArea(event.target.value)}
                className={jobBoardFieldClass}
              >
                {JOB_BOARD_CAREER_AREAS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-primary inline-flex w-full items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" aria-hidden />
                Search jobs
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="px-4 py-10 lg:py-14">
        <div className="container mx-auto max-w-5xl">
          <p
            className="font-(family-name:--font-accent) text-muted-foreground mb-6 text-sm font-semibold"
            aria-live="polite"
          >
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </p>

          {filteredJobs.length === 0 ? (
            <div className="border-border bg-secondary text-secondary-foreground rounded-sm border px-6 py-12 text-center">
              <p className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
                No jobs match your search
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Try a different keyword, location, or career area.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {filteredJobs.map((job) => (
                <li key={job.id}>
                  <article className="border-border hover:border-primary flex flex-col gap-4 border bg-background p-6 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
                        {job.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" aria-hidden />
                          {job.location}
                        </span>
                        <span aria-hidden>·</span>
                        <span>{job.careerArea}</span>
                        <span aria-hidden>·</span>
                        <span>Posted {job.postedDate}</span>
                      </p>
                    </div>
                    <a href="/" className="btn btn-primary shrink-0 self-start sm:self-center">
                      View job
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
