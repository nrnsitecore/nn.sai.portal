'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Briefcase,
  Check,
  ChevronDown,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  FileWarning,
  Home,
  Lock,
  Mail,
  MapPin,
  PanelLeft,
  Pencil,
  Phone,
  ScrollText,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrainFront,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';
import {
  isTakedaTalentPersona,
  type TakedaTalentPersona,
} from '@/lib/takeda-talent-personas';
import { TAKEDA_TALENT_DASHBOARDS } from '@/lib/takeda-talent-portal';

export { JobSearch } from '@/lib/takeda-job-search-board';
export { JobSeekerProfile } from '@/lib/takeda-job-seeker-profile';

interface Fields {
  Eyebrow: Field<string>;
  Title: Field<string>;
  Image1: ImageField;
  Image2: ImageField;
  Link1: LinkField;
  Link2: LinkField;
}

/**
 * Full-bleed hero backgrounds previously used `object-cover`, which crops to fill the hero box and
 * defaults to center — wide artwork with logos pinned top-left (e.g. Burns strip) loses edges.
 * `object-contain` + top-left anchor shows the whole image; `bg-muted` fills letterbox gutters.
 *
 * Vertical band: mobile ~400–600px, laptop (md) ~500–600px, desktop (lg+) ~600–800px.
 * Next/Image `width`/`height` (e.g. 1920×1080) are intrinsic aspect hints; that resolution stays a
 * solid choice for crisp wide layouts even when the rendered hero is shorter.
 */
const HERO_BG_IMAGE_CLASS = 'h-full w-full object-contain object-left object-top';
const HERO_BG_LAYER_CLASS = 'absolute inset-0 z-10 bg-muted';

/** Responsive hero content column / split row height band */
const HERO_CONTENT_BAND_CLASS =
  'min-h-[400px] max-h-[600px] md:min-h-[500px] md:max-h-[600px] lg:min-h-[600px] lg:max-h-[800px]';

/** Main headline scale (smaller than previous display sizes for shorter hero band) */
const HERO_TITLE_CLASS = 'text-3xl md:text-4xl lg:text-5xl';

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: Fields;
};

/* -------------------------------------------------------------------------- */
/* Default — careers image hero with job-search panel (Takeda parity)          */
/* -------------------------------------------------------------------------- */

const SEARCH_RADIUS_OPTIONS = ['5 mi', '10 mi', '25 mi', '50 mi', '100 mi'] as const;
const HERO_SEARCH_FALLBACK_HREF = '/search';

const heroPanelFieldClass =
  'bg-white text-foreground placeholder:text-muted-foreground w-full rounded-sm border-0 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/70';

const heroPanelLabelClass =
  'font-(family-name:--font-accent) mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-white/90';

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
      <h2 className="font-(family-name:--font-heading) mb-6 text-2xl font-semibold tracking-tight">
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
  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className={HERO_BG_LAYER_CLASS}>
        <ContentSdkImage
          field={props?.fields?.Image1}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className={HERO_BG_IMAGE_CLASS}
        />
      </div>
      <div className="relative z-20 mx-auto w-full lg:container lg:flex lg:flex-row-reverse">
        <div
          className={`flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
        >
          <div className="lg:max-w-3xl lg:ml-auto text-right">
            <h1 className="text-primary text-xl lg:text-3xl pb-4">
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </h1>
            <h1 className={HERO_TITLE_CLASS}>
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
      </div>
    </section>
  );
};

export const Centered = (props: PageHeaderSTProps) => {
  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className={HERO_BG_LAYER_CLASS}>
        <ContentSdkImage
          field={props?.fields?.Image1}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className={HERO_BG_IMAGE_CLASS}
        />
      </div>
      <div className="relative z-20 mx-auto w-full lg:container lg:flex">
        <div
          className={`lg:relative lg:left-1/6 flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
        >
          <div className="lg:max-w-3xl lg:mx-auto text-center">
            <h1 className="text-primary text-xl lg:text-3xl pb-4">
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </h1>
            <h1 className={HERO_TITLE_CLASS}>
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
      <div className={`flex flex-col lg:flex-row ${HERO_CONTENT_BAND_CLASS}`}>
        <div className="p-8 lg:basis-full lg:self-center lg:p-14">
          <h1 className="text-xl lg:text-3xl pb-4">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </h1>
          <h1 className={HERO_TITLE_CLASS}>
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8 flex flex-row flex-wrap items-start gap-4">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="btn btn-secondary"
            />
            <ContentSdkLink
              field={props?.fields?.Link2}
              prefetch={false}
              className="btn btn-secondary"
            />
          </div>
        </div>
        <div className="relative aspect-3/2 min-h-[16rem] w-full bg-muted lg:basis-full lg:aspect-auto lg:min-h-0">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            priority={true}
            fetchPriority="high"
            className={`absolute inset-0 ${HERO_BG_IMAGE_CLASS}`}
          />
        </div>
      </div>
    </section>
  );
};

export const Stacked = (props: PageHeaderSTProps) => {
  const stackedImageClass = 'absolute inset-0 h-full w-full object-cover';

  return (
    <section
      className={`relative flex flex-col bg-primary lg:min-h-[600px] lg:max-h-[800px] lg:flex-row lg:items-center lg:bg-transparent ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="relative z-20 mx-auto w-full container px-4">
        <div className="relative z-20 bg-primary px-6 py-10 lg:w-1/2 lg:py-12">
          <h1 className="pb-4 text-xl lg:text-3xl">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </h1>
          <h1 className={HERO_TITLE_CLASS}>
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-start">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="btn btn-secondary"
            />
            <ContentSdkLink
              field={props?.fields?.Link2}
              prefetch={false}
              className="btn btn-secondary"
            />
          </div>
        </div>
      </div>

      {/* Mobile / tablet: single full-bleed primary image under the copy */}
      <div className="relative z-10 aspect-[4/3] w-full bg-muted lg:hidden">
        <ContentSdkImage
          field={props?.fields?.Image1}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className={stackedImageClass}
        />
      </div>

      {/* Desktop: 1/3 + 2/3 collage behind the copy panel */}
      <div className="absolute inset-0 z-10 hidden bg-muted lg:flex">
        <div className="relative w-1/3">
          <ContentSdkImage
            field={props?.fields?.Image2}
            width={1920}
            height={1080}
            className={stackedImageClass}
          />
        </div>
        <div className="relative w-2/3">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            className={`${stackedImageClass} z-10`}
          />
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Portal variant — hardcoded GATX fleet-operations portal header (demo only) */
/* -------------------------------------------------------------------------- */

/**
 * HeroST "Portal" variant. This is a demo-only, fully hardcoded GATX internal portal
 * experience (railcar leasing, maintenance, and compliance). It intentionally ignores
 * Sitecore fields and renders a fixed dashboard so it can stand in as the portal landing
 * header without any datasource wiring.
 */

const PORTAL_CUSTOMER_ACCOUNT = 'Dow Chemical';
const PORTAL_GATX_HOME = 'https://www.gatx.com/';

const PORTAL_STAT_CARDS = [
  { id: 'orders', label: 'Open Orders', value: '12', accent: '#0085ca', icon: ClipboardList },
  { id: 'invoices', label: 'Invoices Needing Attention', value: '3', accent: '#c92a2a', icon: FileWarning },
  { id: 'maintenance', label: 'Cars In Maintenance', value: '28', accent: '#c8922e', icon: Wrench },
  { id: 'compliance', label: 'Compliance Past Due', value: '5', accent: '#c92a2a', icon: ShieldAlert },
] as const;

type PortalStatId = (typeof PORTAL_STAT_CARDS)[number]['id'];

const PORTAL_STAT_CARD_BY_ID = Object.fromEntries(
  PORTAL_STAT_CARDS.map((card) => [card.id, card]),
) as Record<PortalStatId, (typeof PORTAL_STAT_CARDS)[number]>;

/**
 * Drill-down content for a stat card. Rendered as a short list when the first
 * dashboard box is expanded. Generic columns/rows keep it reusable across metrics.
 */
type PortalStatDetail = {
  summary: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
};

const PORTAL_STAT_DETAILS: Record<PortalStatId, PortalStatDetail> = {
  orders: {
    summary: '12 open orders across new leases, requalification shopping, and movement requests.',
    columns: ['Order', 'Description', 'Cars', 'Status', 'ETA'],
    rows: [
      ['SO-48213', 'New lease — DOT-117J tank cars', '6', 'In fulfillment', 'Jul 18'],
      ['SO-48190', 'Requalification shopping — DOT-111', '9', 'Scheduled', 'Jul 24'],
      ['SO-48155', 'Covered hopper lease renewal', '4', 'Awaiting signature', 'Jul 9'],
      ['SO-48101', 'Gondola repair return', '5', 'In transit', 'Jul 12'],
      ['WO-7741', 'One-Time Movement Approval (OTMA)', '2', 'Pending approval', 'Jul 6'],
    ],
  },
  invoices: {
    summary: '3 invoices need attention — one disputed, one past due, one missing a PO.',
    columns: ['Invoice', 'Amount', 'Type', 'Status', 'Due'],
    rows: [
      ['INV-90233', '$48,210', 'Lease — June', 'Disputed', 'Jul 5'],
      ['INV-90187', '$12,650', 'Repair billing', 'Past due', 'Jun 20'],
      ['INV-90155', '$7,940', 'Mileage equalization', 'Needs PO', 'Jul 1'],
    ],
  },
  maintenance: {
    summary: '28 cars in maintenance across the shop network — next promised dates below.',
    columns: ['Car', 'Type', 'Shop', 'Service', 'Promised'],
    rows: [
      ['GATX 215430', 'DOT-117J', 'Hearne, TX', 'Tank qualification', 'Jul 17'],
      ['GATX 311902', 'DOT-111', 'Red Wing, MN', 'Valve rebuild', 'Jul 24'],
      ['GATX 045128', 'Covered hopper', 'Waycross, GA', 'Outlet gate repair', 'Jul 11'],
      ['GATX 198320', 'DOT-117J', 'Hearne, TX', 'Lining renewal', 'Jul 19'],
      ['GATX 220845', 'Gondola', 'Colton, CA', 'Structural inspection', 'Aug 2'],
    ],
  },
  compliance: {
    summary: '5 qualifications are past due — schedule shopping now to limit out-of-service time.',
    columns: ['Car', 'Type', 'Qualification', 'Due', 'Days Past'],
    rows: [
      ['GATX 207781', 'DOT-117J', 'Tank qualification', 'May 30', '30'],
      ['GATX 142908', 'DOT-111', 'Pressure relief device test', 'Jun 8', '21'],
      ['GATX 305512', 'DOT-117J', 'Thickness test', 'Jun 15', '14'],
      ['GATX 118744', 'DOT-111', 'Tank qualification', 'Jun 20', '9'],
      ['GATX 260133', 'DOT-117J', 'Service trial', 'Jun 25', '4'],
    ],
  },
};

const PORTAL_NEWS_ITEMS = [
  {
    tag: 'Service Update',
    date: 'Jun 25, 2026',
    title: 'Hearne, TX shop expands lining capacity',
    body: 'Our Hearne facility added two new lining bays, reducing average turn time for DOT-117J qualifications by an estimated 6 days.',
  },
  {
    tag: 'Compliance',
    date: 'Jun 19, 2026',
    title: '2026 Tank Qualification reminders now live',
    body: 'Cars due for tank qualification in Q3 are flagged in your Compliance dashboard. Schedule early to avoid out-of-service time.',
  },
  {
    tag: 'Resource',
    date: 'Jun 13, 2026',
    title: 'New: One-Time Movement Approval (OTMA) guide',
    body: 'A step-by-step walkthrough for requesting OTMA when shopping cars is now available in the User Guide.',
  },
  {
    tag: 'Announcement',
    date: 'Jun 1, 2026',
    title: 'RailPulse telematics pilot results',
    body: 'Early pilot data shows improved dwell visibility. Reach out to your Account Solutions contact to join the next cohort.',
  },
] as const;

const PORTAL_FLEET_SEGMENTS = [
  { label: 'Tank Cars', value: 982, color: '#0085ca' },
  { label: 'Covered Hoppers', value: 614, color: '#0c2340' },
  { label: 'Gondolas', value: 168, color: '#c8922e' },
  { label: 'Boxcars', value: 83, color: '#2f9e44' },
] as const;

const PORTAL_FLEET_TOTAL = PORTAL_FLEET_SEGMENTS.reduce((sum, s) => sum + s.value, 0);

const PORTAL_MAINTENANCE_ROWS = [
  { carType: 'Tank Car (DOT-117J)', scheduled: 11, inbound: '1–7 days', promised: 'Jul 17', total: 18 },
  { carType: 'Tank Car (DOT-111)', scheduled: 6, inbound: '8–14 days', promised: 'Jul 24', total: 9 },
  { carType: 'Covered Hopper', scheduled: 7, inbound: '1–7 days', promised: 'Jul 11', total: 12 },
  { carType: 'Gondola', scheduled: 4, inbound: '15+ days', promised: 'Aug 2', total: 5 },
] as const;

const PORTAL_MAINTENANCE_TOTALS = PORTAL_MAINTENANCE_ROWS.reduce(
  (acc, r) => ({ scheduled: acc.scheduled + r.scheduled, total: acc.total + r.total }),
  { scheduled: 0, total: 0 },
);

const PORTAL_COMPLIANCE_ROWS = [
  { carType: 'Tank Car (DOT-117J)', total: 61, pastDue: 3, currentYear: 38, nextYear: 20 },
  { carType: 'Tank Car (DOT-111)', total: 36, pastDue: 2, currentYear: 22, nextYear: 12 },
  { carType: 'Covered Hopper', total: 35, pastDue: 0, currentYear: 10, nextYear: 25 },
  { carType: 'Gondola', total: 11, pastDue: 0, currentYear: 8, nextYear: 3 },
] as const;

const PORTAL_COMPLIANCE_MAX = Math.max(...PORTAL_COMPLIANCE_ROWS.map((r) => r.total));

const PORTAL_COMPLIANCE_COLORS = {
  pastDue: '#c92a2a',
  currentYear: '#0085ca',
  nextYear: '#cbd5e1',
} as const;

const PORTAL_SERVICE_TEAM = [
  { name: 'Sarah Chen', role: 'Sales Representative', email: 'sarah.chen@gatx.com', phone: '(312) 555-0142' },
  { name: 'Marcus Webb', role: 'Account Solutions', email: 'marcus.webb@gatx.com', phone: '(312) 555-0198' },
  { name: 'Diane Alvarez', role: 'Fleet Execution', email: 'diane.alvarez@gatx.com', phone: '(312) 555-0176' },
] as const;

const PORTAL_LOOKUP_SAMPLES = ['GATX 215430', 'GATX 311902', 'GATX 045128'] as const;

/** Faux "live" car states backing the smart Quick Car Lookup (demo data only). */
const PORTAL_SHOP_STEPS = [
  'Inbound',
  'Cleaning',
  'Inspection',
  'Estimate',
  'Repair',
  'Outbound',
] as const;

type PortalCarState = 'In Shop' | 'Overdue' | 'On Lease';

type PortalCar = {
  number: string;
  type: string;
  state: PortalCarState;
  detail: string;
  /** Index into PORTAL_SHOP_STEPS for In Shop cars (current stage). */
  shopStep?: number;
};

const PORTAL_CARS: readonly PortalCar[] = [
  { number: 'GATX 215430', type: 'DOT-117J tank', state: 'In Shop', detail: 'Hearne, TX · Tank qualification', shopStep: 4 },
  { number: 'GATX 198320', type: 'DOT-117J tank', state: 'In Shop', detail: 'Hearne, TX · Lining renewal', shopStep: 2 },
  { number: 'GATX 311902', type: 'DOT-111 tank', state: 'Overdue', detail: 'Return overdue 12 days · Red Wing, MN' },
  { number: 'GATX 045128', type: 'Covered hopper', state: 'On Lease', detail: 'Lessee: Dow Chemical · Through Mar 2027' },
  { number: 'GATX 260133', type: 'DOT-117J tank', state: 'On Lease', detail: 'Lessee: Olin Corp · Through Sep 2026' },
];

const PORTAL_CAR_STATE_TONE: Record<PortalCarState, { bg: string; color: string }> = {
  'In Shop': { bg: '#c8922e1a', color: '#8a6312' },
  Overdue: { bg: '#c92a2a1a', color: '#a51111' },
  'On Lease': { bg: '#2f9e441a', color: '#1f7a32' },
};

const PortalCarStateBadge = ({ state }: { state: PortalCarState }) => {
  const tone = PORTAL_CAR_STATE_TONE[state];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: tone.bg, color: tone.color }}
    >
      {state}
    </span>
  );
};

/** Compact Inbound → … → Outbound stepper for an In Shop car. */
const PortalShopTimeline = ({ step }: { step: number }) => (
  <ol className="mt-3 flex items-center gap-1" aria-label="Shop progress">
    {PORTAL_SHOP_STEPS.map((label, index) => {
      const isDone = index < step;
      const isCurrent = index === step;
      return (
        <li key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <span
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold',
              isDone && 'bg-accent text-primary-foreground',
              isCurrent && 'bg-accent/20 text-accent ring-accent ring-2',
              !isDone && !isCurrent && 'bg-muted text-muted-foreground',
            )}
          >
            {isDone ? <Check className="h-3 w-3" aria-hidden /> : index + 1}
          </span>
          <span
            className={cn(
              'truncate text-[9px] leading-tight',
              isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground',
            )}
          >
            {label}
          </span>
        </li>
      );
    })}
  </ol>
);

const portalInitials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const PortalPanel = ({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) => (
  <div id={id} className={cn('border-border bg-background rounded border p-5 shadow-sm', className)}>
    {children}
  </div>
);

const PortalPanelHeading = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div>
      <h3 className="text-foreground text-lg font-semibold tracking-tight">{title}</h3>
      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/** Inline SVG donut chart (no chart dependency) for the leased-fleet mix. */
const PortalFleetDonut = () => {
  let cumulative = 0;
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg
          viewBox="0 0 42 42"
          className="h-full w-full -rotate-90"
          role="img"
          aria-label="Leased fleet by car type"
        >
          <circle cx="21" cy="21" r="15.91549431" fill="transparent" stroke="#eef2f6" strokeWidth="5" />
          {PORTAL_FLEET_SEGMENTS.map((seg) => {
            const pct = (seg.value / PORTAL_FLEET_TOTAL) * 100;
            const dash = `${pct} ${100 - pct}`;
            const offset = 100 - cumulative;
            cumulative += pct;
            return (
              <circle
                key={seg.label}
                cx="21"
                cy="21"
                r="15.91549431"
                fill="transparent"
                stroke={seg.color}
                strokeWidth="5"
                strokeDasharray={dash}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-foreground text-2xl font-semibold leading-none">
            {PORTAL_FLEET_TOTAL.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">Total Cars</span>
        </div>
      </div>
      <ul className="w-full space-y-2">
        {PORTAL_FLEET_SEGMENTS.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-foreground">{seg.label}</span>
            </span>
            <span className="text-foreground font-medium tabular-nums">{seg.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PortalComplianceBars = () => (
  <div className="space-y-4">
    <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
      {(
        [
          ['Past Due', PORTAL_COMPLIANCE_COLORS.pastDue],
          ['Current Year', PORTAL_COMPLIANCE_COLORS.currentYear],
          ['Next Year', PORTAL_COMPLIANCE_COLORS.nextYear],
        ] as const
      ).map(([label, color]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          {label}
        </span>
      ))}
    </div>
    <ul className="space-y-3">
      {PORTAL_COMPLIANCE_ROWS.map((row) => (
        <li key={row.carType} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">{row.carType}</span>
            <span className="text-muted-foreground tabular-nums">{row.total} cars</span>
          </div>
          <div className="bg-muted flex h-2.5 w-full overflow-hidden rounded-full">
            {(
              [
                [row.pastDue, PORTAL_COMPLIANCE_COLORS.pastDue],
                [row.currentYear, PORTAL_COMPLIANCE_COLORS.currentYear],
                [row.nextYear, PORTAL_COMPLIANCE_COLORS.nextYear],
              ] as const
            ).map(([count, color], i) => (
              <span key={i} style={{ width: `${(count / PORTAL_COMPLIANCE_MAX) * 100}%`, backgroundColor: color }} />
            ))}
          </div>
        </li>
      ))}
    </ul>
    <div className="border-border grid grid-cols-3 gap-2 border-t pt-4 text-center">
      {(
        [
          ['5', 'Past Due', PORTAL_COMPLIANCE_COLORS.pastDue],
          ['76', 'Current Year', PORTAL_COMPLIANCE_COLORS.currentYear],
          ['62', 'Next Year', '#64748b'],
        ] as const
      ).map(([value, label, color]) => (
        <div key={label}>
          <div className="text-2xl font-semibold tabular-nums" style={{ color }}>
            {value}
          </div>
          <div className="text-muted-foreground text-xs">{label}</div>
        </div>
      ))}
    </div>
  </div>
);

const PortalQuickCarLookup = () => {
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<PortalCar | null>(null);
  const [focused, setFocused] = useState(false);

  const query = value.trim().toLowerCase();
  const matches = query
    ? PORTAL_CARS.filter(
        (car) =>
          car.number.toLowerCase().includes(query) || car.type.toLowerCase().includes(query),
      )
    : PORTAL_CARS;
  const showResults = focused && !selected && matches.length > 0;

  const select = (car: PortalCar) => {
    setSelected(car);
    setValue(car.number);
    setFocused(false);
  };

  return (
    <PortalPanel>
      <PortalPanelHeading
        title="Quick Car Lookup"
        subtitle="Search a car to see live state, location, lease, and shop progress."
        action={
          <span className="bg-accent/10 text-accent inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            <Sparkles className="h-3 w-3" aria-hidden />
            AI-assisted
          </span>
        }
      />
      <div className="space-y-3">
        <label className="sr-only" htmlFor="gatx-car-lookup">
          Car number
        </label>
        <div className="relative">
          <div className="border-border focus-within:border-accent flex items-center gap-2 rounded border px-3 py-2">
            <Search className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden />
            <input
              id="gatx-car-lookup"
              type="text"
              placeholder="e.g. GATX 215430"
              value={value}
              onFocus={() => setFocused(true)}
              onBlur={() => window.setTimeout(() => setFocused(false), 150)}
              onChange={(e) => {
                setValue(e.target.value);
                setSelected(null);
                setFocused(true);
              }}
              className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
            />
            {value && (
              <button
                type="button"
                onClick={() => {
                  setValue('');
                  setSelected(null);
                }}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>

          {showResults && (
            <ul className="border-border bg-background absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded border shadow-lg">
              {matches.map((car) => (
                <li key={car.number}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(car)}
                    className="hover:bg-muted flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="text-foreground block truncate text-sm font-medium">
                        {car.number}
                      </span>
                      <span className="text-muted-foreground block truncate text-xs">{car.type}</span>
                    </span>
                    <PortalCarStateBadge state={car.state} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected ? (
          <div className="border-border bg-muted/30 rounded border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-foreground text-sm font-semibold">{selected.number}</div>
                <div className="text-muted-foreground text-xs">{selected.detail}</div>
              </div>
              <PortalCarStateBadge state={selected.state} />
            </div>
            {selected.state === 'In Shop' && selected.shopStep !== undefined && (
              <PortalShopTimeline step={selected.shopStep} />
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {PORTAL_LOOKUP_SAMPLES.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  const car = PORTAL_CARS.find((c) => c.number === sample);
                  if (car) select(car);
                }}
                className="border-border text-muted-foreground hover:border-accent hover:text-foreground rounded border px-2.5 py-1 text-xs transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        )}
      </div>
    </PortalPanel>
  );
};

/* ---- Reusable dashboard panels (shared across personas) ---- */

const PortalNewsPanel = ({
  items,
}: {
  items: readonly (typeof PORTAL_NEWS_ITEMS)[number][];
}) => (
  <PortalPanel>
    <PortalPanelHeading
      title="News, Alerts & Resources"
      action={<Pencil className="text-muted-foreground h-4 w-4" aria-hidden />}
    />
    <ul className="divide-border divide-y">
      {items.map((item) => (
        <li key={item.title} className="py-3 first:pt-0 last:pb-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-medium">
              {item.tag}
            </span>
            <span className="text-muted-foreground text-xs">{item.date}</span>
          </div>
          <p className="text-foreground font-medium">{item.title}</p>
          <p className="text-muted-foreground text-sm">{item.body}</p>
        </li>
      ))}
    </ul>
  </PortalPanel>
);

const PortalFleetPanel = () => (
  <PortalPanel>
    <PortalPanelHeading title="Leased Fleet Summary" subtitle="Active cars on lease by type" />
    <PortalFleetDonut />
  </PortalPanel>
);

const PortalMaintenancePanel = () => (
  <PortalPanel>
    <PortalPanelHeading
      title="Maintenance Summary"
      subtitle="Scheduled shop events and promised delivery"
    />
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-border border-b text-left">
            <th className="py-2 pr-2 font-medium">Car Type</th>
            <th className="py-2 pr-2 text-right font-medium">Scheduled</th>
            <th className="py-2 pr-2 font-medium">Inbound</th>
            <th className="py-2 pr-2 font-medium">Promised</th>
            <th className="py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {PORTAL_MAINTENANCE_ROWS.map((row) => (
            <tr key={row.carType} className="text-foreground">
              <td className="py-2 pr-2">{row.carType}</td>
              <td className="py-2 pr-2 text-right tabular-nums">{row.scheduled}</td>
              <td className="text-muted-foreground py-2 pr-2">{row.inbound}</td>
              <td className="text-muted-foreground py-2 pr-2">{row.promised}</td>
              <td className="py-2 text-right tabular-nums">{row.total}</td>
            </tr>
          ))}
          <tr className="text-foreground font-semibold">
            <td className="py-2 pr-2">Totals</td>
            <td className="py-2 pr-2 text-right tabular-nums">{PORTAL_MAINTENANCE_TOTALS.scheduled}</td>
            <td className="py-2 pr-2" />
            <td className="py-2 pr-2" />
            <td className="py-2 text-right tabular-nums">{PORTAL_MAINTENANCE_TOTALS.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </PortalPanel>
);

const PortalCompliancePanel = () => (
  <PortalPanel>
    <PortalPanelHeading title="Compliance Summary" subtitle="Qualifications by car type and timing" />
    <PortalComplianceBars />
  </PortalPanel>
);

const PortalTeamPanel = () => (
  <PortalPanel>
    <PortalPanelHeading title="Your GATX Service Team" subtitle="Direct contacts for your account" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {PORTAL_SERVICE_TEAM.map((c) => (
        <div key={c.email} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold">
              {portalInitials(c.name)}
            </span>
            <div className="leading-tight">
              <div className="text-foreground text-sm font-medium">{c.name}</div>
              <div className="text-muted-foreground text-xs">{c.role}</div>
            </div>
          </div>
          <a
            href={`mailto:${c.email}`}
            className="text-accent flex items-center gap-1.5 text-xs hover:underline"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden />
            {c.email}
          </a>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            {c.phone}
          </p>
        </div>
      ))}
    </div>
  </PortalPanel>
);

const PortalFooter = () => (
  <footer className="border-border text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs">
    <span>&copy; 2026 GATX Corporation. All rights reserved.</span>
    <span className="flex flex-wrap items-center gap-4">
      <a href={PORTAL_GATX_HOME} target="_blank" rel="noreferrer" className="hover:text-foreground">
        Contact Us
      </a>
      <a href={PORTAL_GATX_HOME} target="_blank" rel="noreferrer" className="hover:text-foreground">
        Privacy
      </a>
      <a href={PORTAL_GATX_HOME} target="_blank" rel="noreferrer" className="hover:text-foreground">
        Terms
      </a>
      <span>1-800-555-GATX</span>
      <a href="mailto:support@gatx.com" className="hover:text-foreground">
        support@gatx.com
      </a>
    </span>
  </footer>
);

/** Inline drill-down shown when the first stat box is expanded. */
const PortalStatDetailPanel = ({
  card,
  detail,
  id,
  onClose,
}: {
  card: (typeof PORTAL_STAT_CARDS)[number];
  detail: PortalStatDetail;
  id: string;
  onClose: () => void;
}) => (
  <PortalPanel className="mb-6 border-t-4" id={id}>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded"
          style={{ backgroundColor: `${card.accent}1a`, color: card.accent }}
        >
          <card.icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-foreground text-lg font-semibold tracking-tight">
            {card.label}
            <span className="text-muted-foreground ml-2 text-sm font-normal tabular-nums">
              {card.value}
            </span>
          </h3>
          <p className="text-muted-foreground text-sm">{detail.summary}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
        aria-label={`Hide ${card.label} details`}
      >
        Hide
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-border border-b text-left">
            {detail.columns.map((column, i) => (
              <th
                key={column}
                className={cn('py-2 pr-2 font-medium', i === detail.columns.length - 1 && 'pr-0')}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {detail.rows.map((row) => (
            <tr key={row[0]} className="text-foreground">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={cn(
                    'py-2 pr-2',
                    i === 0 ? 'font-medium tabular-nums' : 'text-muted-foreground',
                    i === row.length - 1 && 'pr-0',
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="border-border mt-4 border-t pt-3">
      <a
        href={PORTAL_GATX_HOME}
        target="_blank"
        rel="noreferrer"
        className="text-accent inline-flex items-center gap-1.5 text-sm hover:underline"
      >
        View all {card.label.toLowerCase()}
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  </PortalPanel>
);

/* -------------------------------------------------------------------------- */
/* Persona adaptation — the dashboard reorders + reskins per demo persona     */
/* -------------------------------------------------------------------------- */

const PORTAL_PERSONAS = [
  'Fleet Operations Manager',
  'Car Maintenance Technician',
  'Leasing Account Representative',
  'Regulatory Compliance Analyst',
] as const;

type PortalPersona = (typeof PORTAL_PERSONAS)[number];

function isPortalPersona(value: string): value is PortalPersona {
  return (PORTAL_PERSONAS as readonly string[]).includes(value);
}

/**
 * Subscribe to the demo persona selected in the header switcher. Mirrors the
 * DownloadList/SearchResults pattern: starts null (server + first client paint),
 * then reads localStorage in an effect and re-reads on the change event, so the
 * hero swaps personas live with no reload and without a hydration mismatch.
 */
function useActivePortalPersona(): PortalPersona | null {
  const [persona, setPersona] = useState<PortalPersona | null>(null);

  useEffect(() => {
    const read = () => {
      const stored = window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '';
      setPersona(isPortalPersona(stored) ? stored : null);
    };

    read();
    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, read);
    return () => window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, read);
  }, []);

  return persona;
}

type PortalPanelKey = 'news' | 'fleet' | 'maintenance' | 'compliance' | 'team' | 'lookup';
type PortalNewsTag = (typeof PORTAL_NEWS_ITEMS)[number]['tag'];
type PortalAlertSeverity = 'critical' | 'warning' | 'info';

type PortalPersonaConfig = {
  name: string;
  role: string;
  welcomeLead: string;
  /** Privileged personas (e.g. compliance) see the Admin module in the preview rail. */
  isAdmin?: boolean;
  /** Header notification + task counts; purely cosmetic per-persona cues. */
  notifications: number;
  pendingTasks: number;
  /** Persona-specific dismissible banner at the top of the dashboard. */
  alert: { severity: PortalAlertSeverity; message: string };
  primaryCta: { label: string; icon: LucideIcon };
  spotlight: { eyebrow: string; title: string; body: string; ctaLabel: string };
  statOrder: readonly PortalStatId[];
  panelOrder: readonly PortalPanelKey[];
  newsOrder: readonly PortalNewsTag[];
};

const PORTAL_PERSONA_CONFIG: Record<PortalPersona, PortalPersonaConfig> = {
  'Fleet Operations Manager': {
    name: 'Dana',
    role: 'Fleet Operations Manager',
    welcomeLead: `Here's your ${PORTAL_CUSTOMER_ACCOUNT} fleet's availability, dwell, and utilization across leasing, maintenance, and compliance.`,
    notifications: 6,
    pendingTasks: 4,
    alert: {
      severity: 'warning',
      message: '3 cars are overdue for return — review positioning to protect utilization.',
    },
    primaryCta: { label: 'Export Fleet-Health QBR', icon: FileSpreadsheet },
    spotlight: {
      eyebrow: 'Fleet focus',
      title: 'Keep qualified cars in revenue service',
      body: 'Cars sitting in shop or nearing qualification cut into revenue miles. Prioritize dwell reduction and re-positioning to keep utilization high.',
      ctaLabel: 'View utilization & dwell',
    },
    statOrder: ['orders', 'maintenance', 'compliance', 'invoices'],
    panelOrder: ['fleet', 'maintenance', 'compliance', 'news', 'team', 'lookup'],
    newsOrder: ['Announcement', 'Service Update', 'Compliance', 'Resource'],
  },
  'Car Maintenance Technician': {
    name: 'Luis',
    role: 'Car Maintenance Technician',
    welcomeLead: `Here's your shop queue, inbound cars, and the qualifications driving today's work on the ${PORTAL_CUSTOMER_ACCOUNT} fleet.`,
    notifications: 9,
    pendingTasks: 7,
    alert: {
      severity: 'warning',
      message: '4 cars are awaiting estimate approval before shop work can proceed.',
    },
    primaryCta: { label: 'Open Shop Torque Card', icon: Wrench },
    spotlight: {
      eyebrow: 'Shop focus',
      title: 'Prove the fault before car release',
      body: 'Confirm the torque sequence and leak-test results on gasketed bottom-outlet valves before releasing a car back to service.',
      ctaLabel: 'Open shop manuals',
    },
    statOrder: ['maintenance', 'compliance', 'orders', 'invoices'],
    panelOrder: ['maintenance', 'compliance', 'fleet', 'news', 'lookup', 'team'],
    newsOrder: ['Service Update', 'Compliance', 'Resource', 'Announcement'],
  },
  'Leasing Account Representative': {
    name: 'Priya',
    role: 'Leasing Account Representative',
    welcomeLead: `Here's the ${PORTAL_CUSTOMER_ACCOUNT} account's lease portfolio, open orders, and renewal timing.`,
    notifications: 4,
    pendingTasks: 3,
    alert: {
      severity: 'info',
      message: '2 leases renew in the next 30 days — confirm qualified replacement options.',
    },
    primaryCta: { label: 'Shop a Car', icon: TrainFront },
    spotlight: {
      eyebrow: 'Account focus',
      title: 'Match car type to shipper qualification',
      body: 'Review remaining lease term and qualified replacement options so renewals line up with each shipper\u2019s commodity and qualification needs.',
      ctaLabel: 'View lease portfolio',
    },
    statOrder: ['orders', 'invoices', 'maintenance', 'compliance'],
    panelOrder: ['fleet', 'news', 'team', 'lookup', 'maintenance', 'compliance'],
    newsOrder: ['Resource', 'Announcement', 'Service Update', 'Compliance'],
  },
  'Regulatory Compliance Analyst': {
    name: 'Evan',
    role: 'Regulatory Compliance Analyst',
    welcomeLead: `Here's the ${PORTAL_CUSTOMER_ACCOUNT} fleet's qualification posture and audit readiness.`,
    isAdmin: true,
    notifications: 8,
    pendingTasks: 5,
    alert: {
      severity: 'critical',
      message: '5 cars are past due for qualification — schedule shopping to avoid out-of-service time.',
    },
    primaryCta: { label: 'Open Audit Documentation Pack', icon: ScrollText },
    spotlight: {
      eyebrow: 'Compliance focus',
      title: 'Close audit gaps before qualification expiry',
      body: 'Bundle test results, certificates, and component traceability for cars with qualifications due this year to stay audit-ready.',
      ctaLabel: 'Download audit pack',
    },
    statOrder: ['compliance', 'maintenance', 'orders', 'invoices'],
    panelOrder: ['compliance', 'maintenance', 'fleet', 'news', 'lookup', 'team'],
    newsOrder: ['Compliance', 'Service Update', 'Resource', 'Announcement'],
  },
};

/** Reorder the shared news items by a persona's tag priority (unlisted tags fall to the end). */
function orderPortalNews(order: readonly PortalNewsTag[]) {
  const rank = (tag: PortalNewsTag) => {
    const index = order.indexOf(tag);
    return index < 0 ? order.length : index;
  };
  return [...PORTAL_NEWS_ITEMS].sort((a, b) => rank(a.tag) - rank(b.tag));
}

/** Per-severity styling for the persona alert banner (inline tints; no design-token changes). */
const PORTAL_ALERT_STYLES: Record<PortalAlertSeverity, { bg: string; border: string; color: string }> = {
  critical: { bg: '#c92a2a14', border: '#c92a2a', color: '#a51111' },
  warning: { bg: '#c8922e14', border: '#c8922e', color: '#8a6312' },
  info: { bg: '#0085ca14', border: '#0085ca', color: '#0067a0' },
};

/**
 * Preview module rail. Communicates the breadth of the full portal: only "Home" is
 * active; the rest are non-navigating preview items (lock + "Soon") with a native
 * tooltip. Demo-only — no real routing. Collapsible for polish.
 */
type PortalModule = { key: string; label: string; icon: LucideIcon; adminOnly?: boolean };

const PORTAL_MODULES: readonly PortalModule[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'leasing', label: 'Leasing', icon: FileText },
  { key: 'maintenance', label: 'Maintenance', icon: Wrench },
  { key: 'compliance', label: 'Compliance', icon: ShieldCheck },
  { key: 'car-facts', label: 'Car Facts', icon: TrainFront },
  { key: 'reporting', label: 'Reporting', icon: BarChart3 },
  { key: 'shop', label: 'Shop a Car', icon: ShoppingCart },
  { key: 'admin', label: 'Admin', icon: Settings, adminOnly: true },
];

const PortalModuleRail = ({ isAdmin }: { isAdmin?: boolean }) => {
  const [collapsed, setCollapsed] = useState(false);
  const modules = PORTAL_MODULES.filter((m) => !m.adminOnly || isAdmin);

  return (
    <nav
      aria-label="Portal modules"
      className={cn(
        'border-border bg-background hidden shrink-0 self-start rounded border p-2 lg:block',
        collapsed ? 'w-16' : 'w-52',
      )}
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        className="text-muted-foreground hover:text-foreground mb-2 flex w-full items-center justify-end rounded p-1.5 transition-colors"
      >
        <PanelLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} aria-hidden />
      </button>
      <ul className="space-y-1">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = module.key === 'home';

          if (isActive) {
            return (
              <li key={module.key}>
                <span
                  aria-current="page"
                  className="bg-accent/10 text-accent flex items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {!collapsed && <span className="truncate">{module.label}</span>}
                </span>
              </li>
            );
          }

          return (
            <li key={module.key}>
              <button
                type="button"
                disabled
                title="Available in the full portal"
                className="text-muted-foreground/80 group flex w-full cursor-default items-center gap-2.5 rounded px-2.5 py-2 text-sm"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {!collapsed && (
                  <>
                    <span className="truncate">{module.label}</span>
                    <span className="text-muted-foreground/60 ml-auto flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide">
                      <Lock className="h-3 w-3" aria-hidden />
                      Soon
                    </span>
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/** No persona selected: prompt the visitor to "log in" by picking a profile in the header. */
const PortalLoginGate = () => (
  <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-12 text-center">
    <span className="bg-primary text-primary-foreground mb-5 flex h-14 w-14 items-center justify-center rounded-full">
      <Lock className="h-6 w-6" aria-hidden />
    </span>
    <h1 className="text-foreground text-2xl font-semibold tracking-tight lg:text-3xl">
      Sign in to the GATX Customer Portal
    </h1>
    <p className="text-muted-foreground mt-3 text-sm lg:text-base">
      Choose a profile from the <span className="text-foreground font-medium">Login</span> menu in the
      header to open your personalized fleet, maintenance, and compliance dashboard.
    </p>
    <ul className="mt-6 grid w-full grid-cols-1 gap-2 text-sm sm:grid-cols-2">
      {PORTAL_PERSONAS.map((persona) => (
        <li
          key={persona}
          className="border-border bg-background flex items-center gap-2 rounded border px-3 py-2 text-left"
        >
          <TrainFront className="text-accent h-4 w-4 shrink-0" aria-hidden />
          <span className="text-foreground">{persona}</span>
        </li>
      ))}
    </ul>
    <a
      href={PORTAL_GATX_HOME}
      target="_blank"
      rel="noreferrer"
      className="btn btn-secondary mt-6 inline-flex items-center gap-2"
    >
      Visit gatx.com
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </a>
  </div>
);

/** Persona-adapted dashboard: copy, stat order, spotlight, panel order, and news all vary. */
const PortalDashboard = ({ persona }: { persona: PortalPersona }) => {
  const config = PORTAL_PERSONA_CONFIG[persona];
  const PrimaryIcon = config.primaryCta.icon;
  const statCards = config.statOrder.map((id) => PORTAL_STAT_CARD_BY_ID[id]);
  const news = orderPortalNews(config.newsOrder);

  const [detailOpen, setDetailOpen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const featuredCard = statCards[0];
  const featuredDetail = PORTAL_STAT_DETAILS[featuredCard.id];
  const detailPanelId = 'portal-stat-detail';
  const alertStyle = PORTAL_ALERT_STYLES[config.alert.severity];

  // Dashboard remounts per persona (keyed in the Portal export), so this fires
  // once on each persona switch — a "it reacted to me" cue for the live demo.
  useEffect(() => {
    toast.success(`Now viewing as ${config.role}`, {
      description: 'Dashboard personalized for this role.',
    });
  }, [config.role]);

  const panelNodes: Record<PortalPanelKey, React.ReactNode> = {
    news: <PortalNewsPanel items={news} />,
    fleet: <PortalFleetPanel />,
    maintenance: <PortalMaintenancePanel />,
    compliance: <PortalCompliancePanel />,
    team: <PortalTeamPanel />,
    lookup: <PortalQuickCarLookup />,
  };

  return (
    <div className="flex gap-6">
      <PortalModuleRail isAdmin={config.isAdmin} />

      <div className="min-w-0 flex-1">
        {/* Persona alert banner (dismissible) */}
        {!alertDismissed && (
          <div
            role="status"
            className="animate-in fade-in slide-in-from-top-1 mb-4 flex items-start gap-3 rounded border-l-4 px-4 py-3 duration-500"
            style={{ backgroundColor: alertStyle.bg, borderLeftColor: alertStyle.border }}
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" style={{ color: alertStyle.color }} aria-hidden />
            <p className="flex-1 text-sm" style={{ color: alertStyle.color }}>
              {config.alert.message}
            </p>
            <button
              type="button"
              onClick={() => setAlertDismissed(true)}
              aria-label="Dismiss alert"
              className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
              style={{ color: alertStyle.color }}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        {/* Welcome header */}
        <header className="border-border mb-6 flex flex-wrap items-start justify-between gap-4 border-b pb-6">
          <div>
            <span className="bg-accent/10 text-accent animate-in fade-in slide-in-from-top-1 mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium duration-500">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Personalized for your role · {config.role}
            </span>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight lg:text-3xl">
              Welcome back, {config.name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">{config.welcomeLead}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="border-border text-muted-foreground relative flex h-9 w-9 items-center justify-center rounded border"
              title={`${config.notifications} unread notifications`}
              aria-label={`${config.notifications} unread notifications`}
            >
              <Bell className="h-4 w-4" aria-hidden />
              <span className="bg-destructive text-destructive-foreground absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none">
                {config.notifications}
              </span>
            </span>
            <span
              className="border-border text-muted-foreground hidden items-center gap-1.5 rounded border px-2.5 py-2 text-xs font-medium sm:flex"
              title={`${config.pendingTasks} pending tasks`}
            >
              <ClipboardList className="h-4 w-4" aria-hidden />
              {config.pendingTasks} pending
            </span>
            <a
              href={PORTAL_GATX_HOME}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary flex items-center gap-2"
            >
              <PrimaryIcon className="h-4 w-4" aria-hidden />
              {config.primaryCta.label}
            </a>
          </div>
        </header>

        {/* Persona spotlight */}
      <div className="bg-primary text-primary-foreground mb-6 flex flex-col gap-4 rounded p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <div className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-wide">
            {config.spotlight.eyebrow}
          </div>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">{config.spotlight.title}</h2>
          <p className="text-primary-foreground/80 mt-1 text-sm">{config.spotlight.body}</p>
        </div>
        <a
          href={PORTAL_GATX_HOME}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary flex shrink-0 items-center gap-2"
        >
          {config.spotlight.ctaLabel}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </div>

      {/* Stat cards (persona-ordered; the first box drills down) */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isFeatured = index === 0;

          if (isFeatured) {
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setDetailOpen((open) => !open)}
                aria-expanded={detailOpen}
                aria-controls={detailPanelId}
                className="border-border bg-background hover:border-accent focus-visible:ring-accent rounded border border-t-4 p-4 text-left shadow-sm transition-colors focus:outline-none focus-visible:ring-2"
                style={{ borderTopColor: card.accent }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded"
                    style={{ backgroundColor: `${card.accent}1a`, color: card.accent }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground h-4 w-4 transition-transform',
                      detailOpen && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </div>
                <div className="text-foreground text-3xl font-semibold tabular-nums">{card.value}</div>
                <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                  {card.label}
                  <span className="text-accent text-xs">{detailOpen ? 'Hide' : 'View'}</span>
                </div>
              </button>
            );
          }

          return (
            <div
              key={card.id}
              className="border-border bg-background rounded border border-t-4 p-4 shadow-sm"
              style={{ borderTopColor: card.accent }}
            >
              <div className="mb-3 flex items-start justify-between">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded"
                  style={{ backgroundColor: `${card.accent}1a`, color: card.accent }}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <ArrowUpRight className="text-muted-foreground h-4 w-4" aria-hidden />
              </div>
              <div className="text-foreground text-3xl font-semibold tabular-nums">{card.value}</div>
              <div className="text-muted-foreground mt-1 text-sm">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* First-box drill-down */}
      {detailOpen && (
        <PortalStatDetailPanel
          card={featuredCard}
          detail={featuredDetail}
          id={detailPanelId}
          onClose={() => setDetailOpen(false)}
        />
      )}

      {/* Panels (persona-ordered) */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {config.panelOrder.map((key) => (
          <div key={key}>{panelNodes[key]}</div>
        ))}
      </div>

        <PortalFooter />
      </div>
    </div>
  );
};

export const Portal = (props: PageHeaderSTProps) => {
  const persona = useActivePortalPersona();

  return (
    <section
      className={cn('bg-muted/40 text-foreground w-full', props?.params?.styles)}
      data-class-change
      data-component="HeroST"
      data-variant="Portal"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        {persona ? <PortalDashboard key={persona} persona={persona} /> : <PortalLoginGate />}
      </div>
      <SonnerToaster position="bottom-right" />
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* TalentPortal — Takeda Talent Community demo dashboard (parallel to GATX)    */
/* -------------------------------------------------------------------------- */

function useActiveTakedaTalentPersona(): TakedaTalentPersona | null {
  const [persona, setPersona] = useState<TakedaTalentPersona | null>(null);

  useEffect(() => {
    const read = () => {
      const stored = window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '';
      setPersona(isTakedaTalentPersona(stored) ? stored : null);
    };

    read();
    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, read);
    return () => window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, read);
  }, []);

  return persona;
}

const TalentPortalLoginGate = () => (
  <div className="border-border bg-background mx-auto max-w-xl border px-8 py-12 text-center shadow-sm">
    <span aria-hidden className="bg-primary mx-auto mb-6 block h-1 w-12" />
    <h2 className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight">
      Sign in to the Talent Portal
    </h2>
    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
      Choose a demo persona from the header Login menu to explore a job-seeker experience—recent
      graduates, experienced professionals, career changers, and remote job seekers.
    </p>
    <p className="text-muted-foreground mt-6 text-xs uppercase tracking-[0.08em]">
      Demo only — not a real authentication flow
    </p>
  </div>
);

const TalentPortalDashboard = ({ persona }: { persona: TakedaTalentPersona }) => {
  const config = TAKEDA_TALENT_DASHBOARDS[persona];
  const CtaIcon = config.primaryCta.icon;

  return (
    <div className="flex flex-col gap-8">
      <div className="border-border bg-background border px-6 py-6 shadow-sm lg:px-8">
        <p className="font-(family-name:--font-accent) text-primary text-xs font-semibold uppercase tracking-[0.1em]">
          {config.role}
        </p>
        <h2 className="takeda-heading-bar font-(family-name:--font-heading) mt-3 text-3xl font-bold tracking-tight">
          Welcome, {config.name}
        </h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
          {config.welcomeLead}
        </p>
        <div className="border-primary/30 bg-secondary text-secondary-foreground mt-6 border-l-4 px-4 py-3 text-sm">
          {config.alert}
        </div>
        <button
          type="button"
          className="btn btn-primary mt-6 inline-flex items-center gap-2"
          onClick={() => toast.message(config.primaryCta.label, { description: 'Demo action only' })}
        >
          <CtaIcon className="h-4 w-4" aria-hidden />
          {config.primaryCta.label}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {config.stats.map((stat) => (
          <article key={stat.id} className="border-border bg-background border p-5 shadow-sm">
            <p className="font-(family-name:--font-accent) text-muted-foreground text-xs font-semibold uppercase tracking-[0.08em]">
              {stat.label}
            </p>
            <p className="font-(family-name:--font-heading) mt-2 text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{stat.hint}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="border-border bg-background border p-6 shadow-sm">
          <h3 className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
            Pipeline
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {config.pipeline.map((item) => (
              <li
                key={item.id}
                className="border-border flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground text-xs">{item.meta}</p>
                </div>
                <span className="bg-secondary text-secondary-foreground inline-flex w-fit px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="bg-dark text-dark-foreground p-6">
          <p className="font-(family-name:--font-accent) text-primary text-xs font-semibold uppercase tracking-[0.1em]">
            {config.spotlight.eyebrow}
          </p>
          <h3 className="font-(family-name:--font-heading) mt-3 text-2xl font-bold tracking-tight">
            {config.spotlight.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{config.spotlight.body}</p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em]">
            <Briefcase className="h-4 w-4" aria-hidden />
            #TeamTakeda
          </div>
        </aside>
      </div>
    </div>
  );
};

export const TalentPortal = (props: PageHeaderSTProps) => {
  const persona = useActiveTakedaTalentPersona();

  return (
    <section
      className={cn('takeda-band text-foreground w-full py-10 lg:py-14', props?.params?.styles)}
      data-class-change
      data-component="HeroST"
      data-variant="TalentPortal"
    >
      <div className="container mx-auto px-4">
        {persona ? (
          <TalentPortalDashboard key={persona} persona={persona} />
        ) : (
          <TalentPortalLoginGate />
        )}
      </div>
      <SonnerToaster position="bottom-right" />
    </section>
  );
};
