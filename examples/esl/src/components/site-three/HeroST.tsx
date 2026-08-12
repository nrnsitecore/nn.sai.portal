'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { useContainerOffsets } from '@/hooks/useContainerOffsets';
import {
  ArrowLeftRight,
  ArrowRight,
  Briefcase,
  FileText,
  Landmark,
  MapPin,
  Receipt,
  Search as SearchIcon,
  Smartphone,
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
/* Search — hardcoded credit-union site search (accounts, loans, rates, help) */
/* -------------------------------------------------------------------------- */

type SearchCategory = 'Accounts' | 'Loans' | 'Rates' | 'Locations' | 'Help';

type HardcodedSearchResult = {
  id: string;
  title: string;
  snippet: string;
  category: SearchCategory;
  location?: string;
};

const SEARCH_CATEGORIES = ['All', 'Accounts', 'Loans', 'Rates', 'Locations', 'Help'] as const;

/** Demo-only catalog — not wired to Sitecore search or a live index. */
const HARDCODED_SEARCH_RESULTS: HardcodedSearchResult[] = [
  {
    id: 'sr-001',
    title: 'Everyday Checking',
    snippet: 'Fee-free checking with debit card, mobile deposit, and nationwide ATM access.',
    category: 'Accounts',
  },
  {
    id: 'sr-002',
    title: 'High-Yield Savings',
    snippet: 'Earn a competitive dividend and a $200 bonus when you open a new savings account.',
    category: 'Accounts',
  },
  {
    id: 'sr-003',
    title: 'IRA and retirement accounts',
    snippet: 'Traditional, Roth, and SEP IRAs to help you save for retirement with local guidance.',
    category: 'Accounts',
  },
  {
    id: 'sr-004',
    title: 'Auto loan',
    snippet: 'New and used vehicle financing with member-first rates and flexible terms.',
    category: 'Loans',
  },
  {
    id: 'sr-005',
    title: 'Home mortgage',
    snippet: 'Purchase, refinance, and first-time buyer programs with local mortgage specialists.',
    category: 'Loans',
  },
  {
    id: 'sr-006',
    title: 'Personal loan',
    snippet: 'Unsecured loans for debt consolidation, home projects, or unexpected expenses.',
    category: 'Loans',
  },
  {
    id: 'sr-007',
    title: 'Current rates',
    snippet: 'Today’s dividends and loan rates for savings, CDs, auto, mortgage, and more.',
    category: 'Rates',
  },
  {
    id: 'sr-008',
    title: 'Park Avenue branch',
    snippet: 'Full-service branch with tellers, notary, and appointment-based lending.',
    category: 'Locations',
    location: 'Rochester, NY',
  },
  {
    id: 'sr-009',
    title: 'Henrietta branch',
    snippet: 'Drive-up, Saturday hours, and a 24-hour ATM on Jefferson Road.',
    category: 'Locations',
    location: 'Henrietta, NY',
  },
  {
    id: 'sr-010',
    title: 'Refer a friend, earn $50',
    snippet: 'Members who refer a new customer can earn a $50 bonus when the account is opened.',
    category: 'Help',
  },
  {
    id: 'sr-011',
    title: 'Mobile deposit help',
    snippet: 'How to deposit a check in the ESL mobile app, including photo tips and limits.',
    category: 'Help',
  },
  {
    id: 'sr-012',
    title: 'Credit card',
    snippet: 'Rewards and low-rate Visa cards with no annual fee for eligible members.',
    category: 'Accounts',
  },
];

const searchFieldClass =
  'w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40';

const searchLabelClass =
  'mb-2 block font-(family-name:--font-accent) text-xs font-semibold text-foreground';

const readSearchQueryParam = (): string => {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q')?.trim() ?? '';
};

export const Search = (props: PageHeaderSTProps) => {
  const initialKeyword = readSearchQueryParam();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState<string>(SEARCH_CATEGORIES[0]);
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: initialKeyword.toLowerCase(),
    category: SEARCH_CATEGORIES[0] as string,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({
      keyword: keyword.trim().toLowerCase(),
      category,
    });
  };

  const filteredResults = HARDCODED_SEARCH_RESULTS.filter((result) => {
    const haystack = `${result.title} ${result.snippet} ${result.category} ${result.location ?? ''}`.toLowerCase();
    const matchesKeyword = !appliedFilters.keyword || haystack.includes(appliedFilters.keyword);
    const matchesCategory =
      appliedFilters.category === 'All' || result.category === appliedFilters.category;
    return matchesKeyword && matchesCategory;
  });

  return (
    <section
      className={`bg-background ${props?.params?.styles || ''}`}
      data-class-change
      data-variant="Search"
    >
      <div className="esl-band border-border border-b px-4 py-12 lg:py-16">
        <div className="container mx-auto max-w-5xl">
          <h1 className="esl-heading-bar font-(family-name:--font-heading) text-3xl font-bold tracking-tight lg:text-4xl">
            Search
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
            Find accounts, loans, rates, branch information, and help — all in one place.
          </p>
        </div>
      </div>

      <div className="border-border border-b bg-background px-4 py-8">
        <div className="container mx-auto max-w-5xl">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end"
            aria-label="Search filters"
          >
            <div className="lg:col-span-2">
              <label className={searchLabelClass} htmlFor="cu-search-keyword">
                Keyword
              </label>
              <input
                id="cu-search-keyword"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Savings, mortgage, branch…"
                className={searchFieldClass}
              />
            </div>
            <div>
              <label className={searchLabelClass} htmlFor="cu-search-category">
                Category
              </label>
              <select
                id="cu-search-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={searchFieldClass}
              >
                {SEARCH_CATEGORIES.map((option) => (
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
                <SearchIcon className="h-4 w-4" aria-hidden />
                Search
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
            Showing {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
          </p>

          {filteredResults.length === 0 ? (
            <div className="rounded-2xl border border-border bg-secondary px-6 py-12 text-center text-secondary-foreground">
              <p className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
                No results match your search
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Try a different keyword or category.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {filteredResults.map((result) => (
                <li key={result.id}>
                  <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-(family-name:--font-accent) mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {result.category}
                      </span>
                      <h2 className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
                        {result.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {result.snippet}
                      </p>
                      {result.location && (
                        <p className="text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-sm">
                          <MapPin className="h-3.5 w-3.5" aria-hidden />
                          {result.location}
                        </p>
                      )}
                    </div>
                    <a href="/" className="btn btn-primary shrink-0 self-start sm:self-center">
                      View
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

/** Alias so existing Pages selections of JobSearch still render. */
export const JobSearch = Search;

/* -------------------------------------------------------------------------- */
/* Profile — demo-only individual checking dashboard                           */
/* -------------------------------------------------------------------------- */

type CheckingTransaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
};

const CHECKING_MEMBER = {
  firstName: 'Jordan',
  lastName: 'Chen',
  lastLogin: 'Today at 8:14 AM',
} as const;

const CHECKING_ACCOUNT = {
  name: 'Everyday Checking',
  maskedNumber: '•••• 4821',
  currentBalance: 4286.19,
  availableBalance: 4151.44,
  pending: 134.75,
} as const;

const CHECKING_TRANSACTIONS: readonly CheckingTransaction[] = [
  {
    id: 'txn-001',
    date: 'Aug 12',
    description: 'Direct deposit — ESL payroll',
    category: 'Income',
    amount: 1842.66,
  },
  {
    id: 'txn-002',
    date: 'Aug 11',
    description: 'Wegmans #119',
    category: 'Debit card',
    amount: -86.42,
  },
  {
    id: 'txn-003',
    date: 'Aug 10',
    description: 'RG&E — auto pay',
    category: 'Bill pay',
    amount: -112.08,
  },
  {
    id: 'txn-004',
    date: 'Aug 9',
    description: 'ATM withdrawal — East Ave',
    category: 'ATM',
    amount: -60.0,
  },
  {
    id: 'txn-005',
    date: 'Aug 8',
    description: 'Starbucks #54821',
    category: 'Debit card',
    amount: -6.45,
  },
  {
    id: 'txn-006',
    date: 'Aug 7',
    description: 'Transfer to Savings •••• 9104',
    category: 'Transfer',
    amount: -250.0,
  },
];

const CHECKING_QUICK_ACTIONS: readonly { label: string; icon: LucideIcon }[] = [
  { label: 'Transfer', icon: ArrowLeftRight },
  { label: 'Pay a bill', icon: Receipt },
  { label: 'Mobile deposit', icon: Smartphone },
  { label: 'Statements', icon: FileText },
];

const formatUsd = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const DemoSourceNote = ({ children }: { children: ReactNode }) => (
  <p className="text-muted-foreground mt-2 text-xs leading-snug">{children}</p>
);

/** Demo-only checking dashboard. Export name `Profile` maps to the Pages variant. */
export const Profile = (props: PageHeaderSTProps) => {
  const memberName = `${CHECKING_MEMBER.firstName} ${CHECKING_MEMBER.lastName}`;

  return (
    <section
      className={`bg-background ${props?.params?.styles || ''}`}
      data-class-change
      data-variant="Profile"
    >
      <div className="esl-band border-border border-b px-4 py-10 lg:py-14">
        <div className="container mx-auto max-w-5xl">
          <p className="font-(family-name:--font-accent) text-primary text-xs font-semibold tracking-wide uppercase">
            Online banking
          </p>
          <h1 className="esl-heading-bar font-(family-name:--font-heading) mt-3 text-3xl font-bold tracking-tight lg:text-4xl">
            Good afternoon, {CHECKING_MEMBER.firstName}
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Welcome back, {memberName}. Last login: {CHECKING_MEMBER.lastLogin}.
          </p>
          <DemoSourceNote>
            Demo · Member name and last login from core banking member profile
          </DemoSourceNote>
        </div>
      </div>

      <div className="px-4 py-10 lg:py-14">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <article className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:col-span-3 lg:col-span-1">
              <p className="font-(family-name:--font-accent) text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {CHECKING_ACCOUNT.name}
              </p>
              <p className="font-(family-name:--font-heading) mt-2 text-lg font-semibold tracking-tight">
                {CHECKING_ACCOUNT.maskedNumber}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">Primary checking</p>
            </article>
            <article className="border-border bg-card rounded-2xl border p-6 shadow-sm">
              <p className="font-(family-name:--font-accent) text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Current balance
              </p>
              <p className="font-(family-name:--font-heading) mt-2 text-3xl font-bold tracking-tight">
                {formatUsd(CHECKING_ACCOUNT.currentBalance)}
              </p>
            </article>
            <article className="border-border bg-card rounded-2xl border p-6 shadow-sm">
              <p className="font-(family-name:--font-accent) text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Available
              </p>
              <p className="font-(family-name:--font-heading) mt-2 text-3xl font-bold tracking-tight">
                {formatUsd(CHECKING_ACCOUNT.availableBalance)}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                {formatUsd(CHECKING_ACCOUNT.pending)} pending
              </p>
            </article>
          </div>
          <DemoSourceNote>
            Demo · Balances and masked account number from core banking deposit account
          </DemoSourceNote>

          <div className="mt-10">
            <h2 className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
              Quick actions
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CHECKING_QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    className="border-border bg-card hover:border-primary flex items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-semibold shadow-sm transition-colors"
                  >
                    <span className="bg-muted text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    {action.label}
                  </button>
                );
              })}
            </div>
            <DemoSourceNote>
              Demo · Would invoke online banking APIs for transfers, bill pay, remote deposit, and
              e-statements
            </DemoSourceNote>
          </div>

          <div className="mt-10">
            <h2 className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
              Recent transactions
            </h2>
            <ul className="border-border bg-card mt-4 divide-y divide-border overflow-hidden rounded-2xl border shadow-sm">
              {CHECKING_TRANSACTIONS.map((txn) => (
                <li
                  key={txn.id}
                  className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{txn.description}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {txn.date}
                      <span aria-hidden> · </span>
                      {txn.category}
                    </p>
                  </div>
                  <p
                    className={`font-(family-name:--font-heading) text-base font-semibold tabular-nums ${
                      txn.amount > 0 ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {txn.amount > 0 ? '+' : ''}
                    {formatUsd(txn.amount)}
                  </p>
                </li>
              ))}
            </ul>
            <DemoSourceNote>
              Demo · Transaction history from core banking and card processor
            </DemoSourceNote>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Alias so existing Pages selections of JobSeekerProfile still render. */
export const JobSeekerProfile = Profile;
