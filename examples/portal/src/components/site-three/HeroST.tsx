'use client';

import { useState } from 'react';
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
  ClipboardList,
  FileWarning,
  Mail,
  Pencil,
  Phone,
  Search,
  ShieldAlert,
  TrainFront,
  Wrench,
} from 'lucide-react';

import { cn } from '@/lib/utils';

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

export const Default = (props: PageHeaderSTProps) => {
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
            className={`flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
          >
            <div className="lg:max-w-3xl">
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

  return (
    <section
      className={`relative flex flex-col bg-primary lg:flex-row lg:items-center lg:bg-transparent ${HERO_CONTENT_BAND_CLASS} ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="container px-4 mx-auto">
        <div className="relative lg:w-1/2 px-6 py-12 bg-primary z-20">
          <h1 className="text-xl lg:text-3xl pb-4">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </h1>
          <h1 className={HERO_TITLE_CLASS}>
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
      <div className="relative aspect-3/2 lg:absolute lg:aspect-auto inset-0 flex z-10 bg-muted">
        <div className="relative w-1/3">
          <ContentSdkImage
            field={props?.fields?.Image2}
            width={1920}
            height={1080}
            className={`absolute inset-0 ${HERO_BG_IMAGE_CLASS}`}
          />
        </div>
        <div className="relative w-2/3">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            className={`absolute inset-0 z-10 ${HERO_BG_IMAGE_CLASS}`}
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

const PORTAL_CUSTOMER_NAME = 'Pat';
const PORTAL_CUSTOMER_ACCOUNT = 'Dow Chemical';
const PORTAL_GATX_HOME = 'https://www.gatx.com/';

const PORTAL_STAT_CARDS = [
  { label: 'Open Orders', value: '12', accent: '#0085ca', icon: ClipboardList },
  { label: 'Invoices Needing Attention', value: '3', accent: '#c92a2a', icon: FileWarning },
  { label: 'Cars In Maintenance', value: '28', accent: '#c8922e', icon: Wrench },
  { label: 'Compliance Past Due', value: '5', accent: '#c92a2a', icon: ShieldAlert },
] as const;

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

const portalInitials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const PortalPanel = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('border-border bg-background rounded border p-5 shadow-sm', className)}>
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
  return (
    <PortalPanel>
      <PortalPanelHeading
        title="Quick Car Lookup"
        subtitle="View capacity, location, active lease, service events, compliance and drawings."
      />
      <div className="space-y-3">
        <label className="sr-only" htmlFor="gatx-car-lookup">
          Car number
        </label>
        <div className="border-border focus-within:border-accent flex items-center gap-2 rounded border px-3 py-2">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden />
          <input
            id="gatx-car-lookup"
            type="text"
            placeholder="e.g. GATX 215430"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
          />
        </div>
        <a
          href={PORTAL_GATX_HOME}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary flex w-full items-center justify-center gap-2"
        >
          Look up car
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
        <div className="flex flex-wrap gap-2 pt-1">
          {PORTAL_LOOKUP_SAMPLES.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setValue(sample)}
              className="border-border text-muted-foreground hover:border-accent hover:text-foreground rounded border px-2.5 py-1 text-xs transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </PortalPanel>
  );
};

export const Portal = (props: PageHeaderSTProps) => {
  return (
    <section
      className={cn('bg-muted/40 text-foreground w-full', props?.params?.styles)}
      data-class-change
      data-component="HeroST"
      data-variant="Portal"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        {/* Welcome header */}
        <header className="border-border mb-6 flex flex-wrap items-start justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight lg:text-3xl">
              Welcome back, {PORTAL_CUSTOMER_NAME}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">
              Here&apos;s the health of your {PORTAL_CUSTOMER_ACCOUNT} fleet across leasing, maintenance,
              and compliance.
            </p>
          </div>
          <a
            href={PORTAL_GATX_HOME}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary flex items-center gap-2"
          >
            <TrainFront className="h-4 w-4" aria-hidden />
            Shop a Car
          </a>
        </header>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PORTAL_STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
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

        {/* News + Leased fleet */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <PortalPanel className="lg:col-span-2">
            <PortalPanelHeading
              title="News, Alerts & Resources"
              action={<Pencil className="text-muted-foreground h-4 w-4" aria-hidden />}
            />
            <ul className="divide-border divide-y">
              {PORTAL_NEWS_ITEMS.map((item) => (
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
          <PortalPanel>
            <PortalPanelHeading title="Leased Fleet Summary" subtitle="Active cars on lease by type" />
            <PortalFleetDonut />
          </PortalPanel>
        </div>

        {/* Maintenance + Compliance */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          <PortalPanel>
            <PortalPanelHeading title="Compliance Summary" subtitle="Qualifications by car type and timing" />
            <PortalComplianceBars />
          </PortalPanel>
        </div>

        {/* Service team + Lookup */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          <PortalQuickCarLookup />
        </div>

        {/* Footer */}
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
      </div>
    </section>
  );
};
