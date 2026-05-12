/**
 * Mock search catalog for DFS-style foodservice MRO / operator demo.
 * Data only — UI lives in SearchResults.tsx.
 */

export type DemoUserTaxonomy = 'Restaurant Operator' | 'Technician';

export type SearchContentType = 'product' | 'featuredArticle' | 'technicalResource' | 'productManual';

/** Left-rail facet: measurement / application family */
export type SearchCategory =
  | 'pressure'
  | 'temperature'
  | 'flowLevel'
  | 'dataAcquisition'
  | 'wirelessIiot'
  | 'calibrationServices';

/** Brand / product line facet */
export type SearchBrand = 'dwyer' | 'omega' | 'redLion';

/** Which keyword buckets surface this row (OR within bucket; AND with query text when no bucket hit) */
export type SearchBucket = 'pressure' | 'datalogger' | 'iiot';

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  contentType: SearchContentType;
  categories: SearchCategory[];
  brands: SearchBrand[];
  /** Keyword buckets for curated queries (parts, operations tracking, facilities monitoring) */
  searchBuckets: SearchBucket[];
  dateLabel?: string;
  breadcrumb?: string[];
  matchTerms?: string[];
  imageSrc?: string;
  isNew?: boolean;
  /** When set, strong relevance boost for that demo persona */
  demoUserTaxonomy?: DemoUserTaxonomy;
  /** If set, this row only appears for these personas (different result sets per user) */
  visibleForDemoUsers?: DemoUserTaxonomy[];
  /** Mock SKU for products */
  sku?: string;
  /** e.g. "From $245" */
  priceLabel?: string;
};

export type AiSearchInsight = {
  id: string;
  headline: string;
  body: string;
  bullets: string[];
  learnMoreHref: string;
  learnMoreLabel?: string;
};

export const DFS_SUPPLY_BASE = 'https://dfsupply.com/';

export const RESULTS_PAGE_SIZE = 9;

export const searchFacetLabels = {
  contentType: {
    product: 'Products',
    featuredArticle: 'Featured articles',
    technicalResource: 'Technical resources',
    productManual: 'Product manuals',
  },
  category: {
    pressure: 'Equipment repair & steam',
    temperature: 'Cold chain & holding',
    flowLevel: 'Water filtration & flow',
    dataAcquisition: 'Operations tracking & compliance',
    wirelessIiot: 'Facilities & energy monitoring',
    calibrationServices: 'Service programs & kits',
  },
  brand: {
    dwyer: 'OEM parts program',
    omega: 'Restaurant operations supplies',
    redLion: 'Facilities & MRO line',
  },
} as const;

export const popularSearches = [
  'Commercial oven parts',
  'Disposable gloves case',
  'Walk-in gasket kit',
  'Hood filter replacement',
  'Steam table pans',
];

/** Synonyms → bucket; used to mimic category landing search */
export const QUERY_BUCKET_SYNONYMS: Record<SearchBucket, readonly string[]> = {
  pressure: [
    'pressure',
    'regulator',
    'regulators',
    'valve',
    'valves',
    'gauge',
    'gauges',
    'manifold',
    'transmitter',
    'dp',
    'differential',
    'parts',
    'oem',
    'compressor',
    'pump',
    'steam',
    'gasket',
    'motor',
    'bearing',
  ],
  datalogger: [
    'data',
    'logger',
    'loggers',
    'logging',
    'log',
    'recorder',
    'recording',
    'acquisition',
    'daq',
    'chart',
    'portable',
    'usb',
    'haccp',
    'inventory',
    'holding',
    'temperature log',
    'label',
  ],
  iiot: [
    'iiot',
    'iot',
    'wireless',
    'gateway',
    'gateways',
    'cloud',
    'remote',
    'mesh',
    'cellular',
    'systems',
    'system',
    'network',
    'facility',
    'facilities',
    'hood',
    'energy',
    'monitoring',
  ],
};

const QUERY_STOP_WORDS = new Set([
  'and',
  'or',
  'the',
  'for',
  'with',
  'from',
  'your',
  'our',
  'are',
  'you',
]);

/**
 * Photo IDs verified with HEAD requests — many legacy Unsplash paths now 404.
 * ixlib/crop/w params match current CDN expectations for stable resizing.
 */
const UNSPLASH_PHOTO_IDS: readonly string[] = [
  '1581091226825-a6a2a5aee158',
  '1518770660439-4636190af475',
  '1582719478250-c89cae4dc85b',
  '1581092162384-8987c1d64718',
  '1531297484001-80022131f5a1',
  '1551288049-bebda4e38f71',
  '1504328345606-18bbc8c9d7d1',
  '1589829545856-d10d557cf95f',
  '1565043666747-69f6646db940',
  '1576091160550-2173dba999ef',
  '1576091160399-112ba8d25d1d',
  '1587854692152-cbe660dbde88',
  '1504711434969-e33886168f5c',
  '1505751172876-fa1923c5c528',
  '1571019613454-1cb2f99b2d8b',
  '1451187580459-43490279c0fa',
  '1489515217757-5fd1be406fef',
  '1500530855697-b586d89ba3ee',
  '1460925895917-afdab827c52f',
  '1581094794329-c8112a89af12',
  '1558618666-fcd25c85cd64',
  '1519389950473-47ba0277781c',
  '1573164713714-d95e436ab8d6',
  '1677442136019-21780ecad995',
  '1515886657613-9f3515b0c78f',
  '1554224155-6726b3ff858f',
  '1497366216548-37526070297c',
  '1497366754035-f200968a6e72',
  '1600585154340-be6161a56a0c',
  '1617791160505-6f00504e3519',
  '1522071820081-009f0129c71c',
  '1531482615713-2afd69097998',
  '1557804506-669a67965ba0',
  '1563986768609-322da13575f3',
  '1573496359142-b8d87734a5a2',
  '1504384308090-c894fdcc538d',
  '1517245386807-bb43f82c33c4',
  '1551434678-e076c223a692',
  '1556761175-b413da4baf72',
];

function buildCatalogImageUrl(id: string): string {
  return `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`;
}

/** Distinct demo thumbnails; cycles only after all IDs are used once */
function catalogDemoImage(slot: number): string {
  const len = UNSPLASH_PHOTO_IDS.length;
  const id = UNSPLASH_PHOTO_IDS[((slot % len) + len) % len]!;
  return buildCatalogImageUrl(id);
}

export function parseDemoUserTaxonomy(raw: string | undefined | null): DemoUserTaxonomy | null {
  const t = raw?.trim();
  if (t === 'Restaurant Operator' || t === 'Technician') {
    return t;
  }
  return null;
}

export function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function detectSearchBuckets(q: string): SearchBucket[] {
  const n = normalizeQuery(q);
  if (!n) return [];
  const words = n.split(/\s+/).filter(Boolean);
  const hits = new Set<SearchBucket>();
  for (const [bucket, synonyms] of Object.entries(QUERY_BUCKET_SYNONYMS) as [SearchBucket, readonly string[]][]) {
    for (const syn of synonyms) {
      if (n.includes(syn) || words.some((w) => w.length > 2 && syn.startsWith(w))) {
        hits.add(bucket);
        break;
      }
    }
  }
  return [...hits];
}

export function itemVisibleForDemoUser(item: SearchResultItem, user: DemoUserTaxonomy | null): boolean {
  if (!item.visibleForDemoUsers?.length) return true;
  if (!user) return false;
  return item.visibleForDemoUsers.includes(user);
}

function itemMatchesBuckets(item: SearchResultItem, buckets: SearchBucket[]): boolean {
  if (!buckets.length) return true;
  return buckets.some((b) => item.searchBuckets.includes(b));
}

function significantQueryWords(n: string): string[] {
  return n
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !QUERY_STOP_WORDS.has(w));
}

export function itemMatchesQuery(item: SearchResultItem, q: string): boolean {
  const n = normalizeQuery(q);
  if (!n) return true;
  const buckets = detectSearchBuckets(n);
  if (buckets.length) {
    if (!itemMatchesBuckets(item, buckets)) return false;
  }
  const hay = [
    item.title,
    item.description,
    ...(item.breadcrumb ?? []),
    ...(item.matchTerms ?? []),
    ...(item.sku ? [item.sku] : []),
  ]
    .join(' ')
    .toLowerCase();
  const words = significantQueryWords(n);
  if (!words.length) return true;
  if (buckets.length) {
    return words.some((w) => hay.includes(w));
  }
  return words.every((w) => hay.includes(w));
}

export function relevanceScore(
  item: SearchResultItem,
  q: string,
  activeDemoUserTaxonomy: DemoUserTaxonomy | null
): number {
  const n = normalizeQuery(q);
  if (!n) return 0;
  const words = significantQueryWords(n);
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const crumbs = (item.breadcrumb ?? []).join(' ').toLowerCase();
  const extra = (item.matchTerms ?? []).join(' ').toLowerCase();
  let score = 0;
  for (const w of words) {
    if (title.includes(w)) score += 5;
    if (desc.includes(w)) score += 2;
    if (crumbs.includes(w)) score += 1;
    if (extra.includes(w)) score += 3;
  }
  if (activeDemoUserTaxonomy && item.demoUserTaxonomy === activeDemoUserTaxonomy) {
    score += 25;
  }
  const buckets = detectSearchBuckets(n);
  if (buckets.length) {
    for (const b of buckets) {
      if (item.searchBuckets.includes(b)) score += 8;
    }
  }
  return score;
}

/** Persona-specific supplemental rows (always merged when a demo user is active) */
export function supplementalResultsForDemoUserTaxonomy(plan: DemoUserTaxonomy): SearchResultItem[] {
  const code = plan === 'Restaurant Operator' ? 'ro' : 'tc';
  const rows: Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[] =
    plan === 'Restaurant Operator'
      ? [
          {
            sku: 'RO-PACK-12',
            priceLabel: 'Case pricing',
            imageSrc: catalogDemoImage(0),
            isNew: true,
            title: 'Operator bundle: disposables & smallwares for peak shifts',
            description:
              'Curated case packs for front-of-house and line service — napkins, gloves, and high-turn smallwares sized for independent and multi-unit kitchens.',
            href: DFS_SUPPLY_BASE,
            contentType: 'technicalResource',
            categories: ['flowLevel', 'dataAcquisition'],
            brands: ['omega'],
            searchBuckets: ['datalogger'],
            dateLabel: 'Guide',
            breadcrumb: ['Operations', 'Supplies'],
            matchTerms: ['disposables', 'gloves', 'napkins', 'smallwares', 'case'],
          },
          {
            imageSrc: catalogDemoImage(1),
            title: 'Featured article: par levels for walk-in and dry storage',
            description:
              'Simple min/max templates for restaurant operators balancing spoilage vs stockouts across high-velocity SKUs.',
            href: DFS_SUPPLY_BASE,
            contentType: 'featuredArticle',
            categories: ['dataAcquisition', 'temperature'],
            brands: ['omega'],
            searchBuckets: ['datalogger'],
            dateLabel: 'Read',
            breadcrumb: ['Insights', 'Inventory'],
            matchTerms: ['par', 'inventory', 'walk-in', 'storage'],
          },
        ]
      : [
          {
            sku: 'TC-PART-44',
            priceLabel: 'OEM match',
            imageSrc: catalogDemoImage(2),
            isNew: true,
            title: 'Technician field card: compressor start components & safeties',
            description:
              'Bench checklist for commercial refrigeration calls — relays, capacitors, and pressure controls commonly stocked for first-visit fix rates.',
            href: DFS_SUPPLY_BASE,
            contentType: 'technicalResource',
            categories: ['pressure', 'temperature'],
            brands: ['dwyer'],
            searchBuckets: ['pressure'],
            dateLabel: 'Field',
            breadcrumb: ['Service', 'Refrigeration'],
            matchTerms: ['compressor', 'relay', 'capacitor', 'refrigeration', 'parts'],
          },
          {
            imageSrc: catalogDemoImage(3),
            title: 'Product manual: steam valve rebuild torque sequence',
            description:
              'Technician-facing steps for gasketed steam valves on combi and steam-jacketed equipment — torque order and leak verification.',
            href: DFS_SUPPLY_BASE,
            contentType: 'productManual',
            categories: ['pressure', 'calibrationServices'],
            brands: ['dwyer'],
            searchBuckets: ['pressure'],
            dateLabel: 'PDF',
            breadcrumb: ['Parts', 'Steam'],
            matchTerms: ['steam', 'valve', 'torque', 'gasket', 'manual'],
          },
        ];

  return rows.map((row, i) => ({
    ...row,
    id: `demo-sup-${code}-${i + 1}`,
    demoUserTaxonomy: plan,
  }));
}

const defaultImg = catalogDemoImage(6);

function p(
  partial: Omit<SearchResultItem, 'id' | 'href'> & { id: string; href?: string }
): SearchResultItem {
  return {
    href: partial.href ?? DFS_SUPPLY_BASE,
    imageSrc: partial.imageSrc ?? defaultImg,
    ...partial,
  };
}

/**
 * Rich mock catalog: multi-bucket tags + persona-only rows → different sets per query × user.
 * ≥18 rows per major bucket after filters (for two pages at 9/page).
 */
export const searchCatalog: SearchResultItem[] = [
  // —— Equipment repair / steam (bucket: parts / pressure) ——
  p({
    id: 'pr-1',
    sku: 'OVN-RB-01',
    priceLabel: 'From $189',
    title: 'Commercial convection oven door rebuild kit',
    description:
      'Gaskets, glass clips, and hinge hardware matched to common deck and stack ovens — keep first-visit fix rates high during PM windows.',
    contentType: 'product',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['pressure', 'regulator', 'oven', 'parts', 'gasket'],
    imageSrc: catalogDemoImage(7),
    isNew: true,
    breadcrumb: ['Products', 'Cooking', 'Ovens'],
  }),
  p({
    id: 'pr-2',
    sku: 'STM-VLV-22',
    priceLabel: 'From $312',
    title: 'Steam table valve rebuild — brass seat & stem',
    description:
      'Compact service kit for saturated steam on lines and steam tables; sized for high-cycle QSR kitchens.',
    contentType: 'product',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['regulator', 'steam', 'valve', 'table', 'parts'],
    imageSrc: catalogDemoImage(8),
    breadcrumb: ['Products', 'Steam'],
  }),
  p({
    id: 'pr-3',
    sku: 'REF-G-160',
    priceLabel: '$98',
    title: 'Refrigeration suction pressure gauge — stainless lower mount',
    description:
      'Liquid-filled dial for compressor racks and walk-ins — technician-friendly ¼ flare lower mount.',
    contentType: 'product',
    categories: ['pressure', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['gauge', 'pressure', 'compressor', 'refrigeration', 'parts'],
    imageSrc: catalogDemoImage(9),
    breadcrumb: ['Products', 'Refrigeration'],
  }),
  p({
    id: 'pr-4',
    title: 'Featured article: sizing replacement motors for exhaust and make-up air',
    description:
      'Walkthrough of nameplate data, sheave ratios, and electrical service checks before ordering OEM drop-ins.',
    contentType: 'featuredArticle',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['motor', 'exhaust', 'parts', 'oem', 'hood'],
    imageSrc: catalogDemoImage(10),
    breadcrumb: ['Learn', 'Featured'],
  }),
  p({
    id: 'pr-5',
    title: 'Technical resource: differential pressure across hood filters',
    description:
      'Trend interpretation for magnehelic-style indicators; includes change-out thresholds for grease-loaded filters.',
    contentType: 'technicalResource',
    categories: ['pressure', 'flowLevel'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['differential', 'dp', 'filter', 'hood'],
    imageSrc: catalogDemoImage(11),
    breadcrumb: ['Resources', 'Application notes'],
  }),
  p({
    id: 'pr-6',
    title: 'Product manual: combi oven steam generator startup & leak check',
    description:
      'PDF manual with torque values, purge sequence, and daily operator checks for multi-mode ovens.',
    contentType: 'productManual',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['manual', 'steam', 'combi', 'startup', 'parts'],
    imageSrc: catalogDemoImage(12),
    breadcrumb: ['Support', 'Manuals'],
  }),
  p({
    id: 'pr-me-only',
    sku: 'OP-DISP-7',
    title: 'Operator-only: disposable glove & liner case pack for peak shifts',
    description:
      'Color-coded sizes and shelf-ready inner packs sized for independent restaurants — not shown in standard OEM-only filters.',
    contentType: 'product',
    categories: ['pressure', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['disposable', 'gloves', 'case', 'operator', 'pack'],
    imageSrc: catalogDemoImage(13),
    visibleForDemoUsers: ['Restaurant Operator'],
    demoUserTaxonomy: 'Restaurant Operator',
    breadcrumb: ['Operations', 'Disposables'],
  }),
  p({
    id: 'pr-ec-only',
    title: 'Technician-only: PRV station authority memo for campus kitchens',
    description:
      'Field engineering note on parallel steam drops, lockout sequencing, and documentation for multi-building accounts.',
    contentType: 'technicalResource',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['authority', 'steam', 'engineering', 'prv', 'technician'],
    imageSrc: catalogDemoImage(14),
    visibleForDemoUsers: ['Technician'],
    demoUserTaxonomy: 'Technician',
    breadcrumb: ['Resources', 'Whitepapers'],
  }),
  p({
    id: 'pr-pt-only',
    title: 'Technician-only: shift card — compressor short-cycle triage in 5 minutes',
    description:
      'Quick electrical and refrigerant checks before ordering start components — includes tag-out references.',
    contentType: 'productManual',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['compressor', 'test', 'relay', 'parts', 'leak'],
    imageSrc: catalogDemoImage(15),
    visibleForDemoUsers: ['Technician'],
    demoUserTaxonomy: 'Technician',
    breadcrumb: ['Service', 'Shift aids'],
  }),
  p({
    id: 'pr-7',
    sku: 'TEMP-TX-AT2',
    priceLabel: '$1,245',
    title: 'Walk-in temperature transmitter — loop-powered',
    description:
      '4–20 mA output with field-selectable ranges for cold rooms and prep coolers — pairs with BMS headends.',
    contentType: 'product',
    categories: ['pressure', 'dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['pressure', 'datalogger'],
    matchTerms: ['transmitter', '4-20', 'walk-in', 'temperature', 'loop'],
    imageSrc: catalogDemoImage(16),
    breadcrumb: ['Products', 'Cold chain'],
  }),
  p({
    id: 'pr-8',
    sku: 'HOOD-DP-67',
    priceLabel: 'From $67',
    title: 'Hood differential pressure gauge kit',
    description:
      'Dial kit for grease hood static pressure checks — high-visibility face options for dim line areas.',
    contentType: 'product',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['differential', 'hood', 'gauge', 'filter', 'kitchen'],
    imageSrc: catalogDemoImage(17),
    isNew: true,
    breadcrumb: ['Products', 'Ventilation'],
  }),
  p({
    id: 'pr-9',
    title: 'Featured article: Best practices for regulator stations in hydronic systems',
    description:
      'Avoid hunting and water hammer with staged pressure drops and proper bypass — written for consulting engineers.',
    contentType: 'featuredArticle',
    categories: ['pressure', 'flowLevel'],
    brands: ['dwyer', 'omega'],
    searchBuckets: ['pressure'],
    matchTerms: ['hydronic', 'regulator', 'bypass', 'engineering'],
    imageSrc: catalogDemoImage(18),
    breadcrumb: ['Learn', 'HVAC'],
  }),
  p({
    id: 'pr-10',
    title: 'Product manual: Minihelic® / Photohelic® installation addendum',
    description:
      'Wiring, setpoint, and relay configuration for switching gauges used in fan proving applications.',
    contentType: 'productManual',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['photohelic', 'minihelic', 'relay', 'manual'],
    imageSrc: catalogDemoImage(19),
    breadcrumb: ['Support', 'Manuals'],
  }),
  p({
    id: 'pr-11',
    sku: 'PRV-2LF',
    priceLabel: '$156',
    title: 'Low-flow precision regulator for analyzers',
    description:
      'Stainless seat option for corrosive sample gases — outlet stability for GC and CEMS sample conditioning.',
    contentType: 'product',
    categories: ['pressure', 'calibrationServices'],
    brands: ['omega'],
    searchBuckets: ['pressure'],
    matchTerms: ['regulator', 'low flow', 'analyzer', 'sample'],
    imageSrc: catalogDemoImage(20),
    breadcrumb: ['Products', 'Pressure'],
  }),
  p({
    id: 'pr-12',
    title: 'Technical resource: Sizing a relief valve upstream of a regulator',
    description:
      'Avoid nuisance lifts when inlet pressure spikes — includes capacity curves and vent line sizing notes.',
    contentType: 'technicalResource',
    categories: ['pressure', 'flowLevel'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['relief', 'regulator', 'sizing', 'inlet'],
    imageSrc: catalogDemoImage(21),
    breadcrumb: ['Resources', 'Safety'],
  }),
  p({
    id: 'pr-13',
    sku: 'DH3-004',
    priceLabel: '$412',
    title: 'Differential pressure manifold — 3-valve block for transmitters',
    description:
      'Isolate, equalize, and vent in one compact body for DP transmitters on steam and hydronic systems.',
    contentType: 'product',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['manifold', 'differential', 'transmitter', 'block'],
    imageSrc: catalogDemoImage(22),
    breadcrumb: ['Products', 'Valves'],
  }),
  p({
    id: 'pr-14',
    title: 'Featured article: Digital vs mechanical regulators in skids',
    description:
      'When electronic piloting pays off versus traditional spring-loaded regulators for packaged equipment OEMs.',
    contentType: 'featuredArticle',
    categories: ['pressure', 'dataAcquisition'],
    brands: ['dwyer', 'omega'],
    searchBuckets: ['pressure'],
    matchTerms: ['digital', 'regulator', 'skid', 'oem'],
    imageSrc: catalogDemoImage(23),
    breadcrumb: ['Learn', 'OEM'],
  }),
  p({
    id: 'pr-15',
    title: 'Product manual: Field verification of regulator lockup pressure',
    description:
      'Step-by-step procedure with data sheet template for QA sign-off after maintenance.',
    contentType: 'productManual',
    categories: ['pressure', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    matchTerms: ['lockup', 'regulator', 'verification', 'manual'],
    imageSrc: catalogDemoImage(24),
    breadcrumb: ['Support', 'Field'],
  }),

  // —— Data loggers / acquisition ——
  p({
    id: 'dl-1',
    sku: 'OM-CP-OCTPRO',
    priceLabel: 'From $389',
    title: 'OM-CP-OctPro Multi-Channel Temperature Logger',
    description:
      'Eight thermocouple channels with onboard memory and USB offload — suited for oven mapping and cold chain studies.',
    contentType: 'product',
    categories: ['dataAcquisition', 'temperature'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['data', 'logger', 'temperature', 'thermocouple', 'mapping'],
    imageSrc: catalogDemoImage(25),
    isNew: true,
    breadcrumb: ['Products', 'Data acquisition'],
  }),
  p({
    id: 'dl-2',
    sku: 'OM-DAQ-1200',
    priceLabel: '$2,150',
    title: 'Portable USB DAQ — 16-bit, 100 kS/s',
    description:
      'Benchtop acquisition for lab characterization with bundled Omega software drivers and example projects.',
    contentType: 'product',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['daq', 'usb', 'acquisition', 'logger', 'portable'],
    imageSrc: catalogDemoImage(26),
    breadcrumb: ['Products', 'DAQ'],
  }),
  p({
    id: 'dl-3',
    title: 'Featured article: Mapping an autoclave with battery-powered loggers',
    description:
      'Sensor placement, sampling intervals, and report generation for validation engineers.',
    contentType: 'featuredArticle',
    categories: ['dataAcquisition', 'temperature'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['mapping', 'logger', 'autoclave', 'validation'],
    imageSrc: catalogDemoImage(27),
    breadcrumb: ['Learn', 'Life sciences'],
  }),
  p({
    id: 'dl-4',
    title: 'Technical resource: Alarming and statistics in Omega data software',
    description:
      'How to configure rolling min/max, MKT, and email alerts for cold rooms using Omega desktop suite.',
    contentType: 'technicalResource',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['alarm', 'software', 'data', 'logger'],
    imageSrc: catalogDemoImage(28),
    breadcrumb: ['Resources', 'Software'],
  }),
  p({
    id: 'dl-5',
    title: 'Product manual: OM-CP series quick start & calibration certificate template',
    description:
      'PDF quick start with traceable calibration worksheet references for auditors.',
    contentType: 'productManual',
    categories: ['dataAcquisition', 'calibrationServices'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['manual', 'calibration', 'certificate', 'logger'],
    imageSrc: catalogDemoImage(29),
    breadcrumb: ['Support', 'Manuals'],
  }),
  p({
    id: 'dl-me-only',
    title: 'Maintenance-only: Logger battery rotation matrix',
    description:
      'SKU cross-reference for coin-cell and lithium packs used across Omega OM-CP loggers — reduces stockouts.',
    contentType: 'technicalResource',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['battery', 'logger', 'maintenance', 'stock'],
    imageSrc: catalogDemoImage(30),
    visibleForDemoUsers: ['Restaurant Operator'],
    demoUserTaxonomy: 'Restaurant Operator',
    breadcrumb: ['Maintenance', 'CMMS'],
  }),
  p({
    id: 'dl-ec-only',
    title: 'Consulting-only: Uncertainty budget for multi-channel logger systems',
    description:
      'Worked example combining sensor interchangeability, cold junction error, and logger quantization.',
    contentType: 'technicalResource',
    categories: ['dataAcquisition', 'calibrationServices'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['uncertainty', 'logger', 'engineering', 'budget'],
    imageSrc: catalogDemoImage(31),
    visibleForDemoUsers: ['Technician'],
    demoUserTaxonomy: 'Technician',
    breadcrumb: ['Resources', 'Metrology'],
  }),
  p({
    id: 'dl-pt-only',
    title: 'Technician-only: Field swap guide — logger vs chart recorder legacy loops',
    description:
      'Stepwise decommission of circular chart drives and reuse of existing TC wells with digital loggers.',
    contentType: 'productManual',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['chart', 'recorder', 'swap', 'technician'],
    imageSrc: catalogDemoImage(32),
    visibleForDemoUsers: ['Technician'],
    demoUserTaxonomy: 'Technician',
    breadcrumb: ['Operations', 'Retrofits'],
  }),
  p({
    id: 'dl-6',
    sku: 'DW-LOG-PRO',
    priceLabel: '$425',
    title: 'Dwyer Series DW-LOG Pressure & Temperature Logger',
    description:
      'Combined absolute/gauge pressure with ambient temperature logging for compressed air audits.',
    contentType: 'product',
    categories: ['dataAcquisition', 'pressure'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger', 'pressure'],
    matchTerms: ['logger', 'pressure', 'temperature', 'audit'],
    imageSrc: catalogDemoImage(33),
    breadcrumb: ['Products', 'Loggers'],
  }),
  p({
    id: 'dl-7',
    sku: 'OM-SQ-2040',
    priceLabel: '$199',
    title: 'Single-use temperature logger — flat shipping profile',
    description:
      'Cold chain compliance with PDF trip report on USB — ideal for lane qualification studies.',
    contentType: 'product',
    categories: ['dataAcquisition', 'temperature'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['cold chain', 'logger', 'usb', 'pdf'],
    imageSrc: catalogDemoImage(34),
    breadcrumb: ['Products', 'Loggers'],
  }),
  p({
    id: 'dl-8',
    title: 'Featured article: From strip charts to digital historians on a budget',
    description:
      'Migration path for small utilities upgrading legacy recording without rip-and-replace DCS work.',
    contentType: 'featuredArticle',
    categories: ['dataAcquisition'],
    brands: ['omega', 'redLion'],
    searchBuckets: ['datalogger'],
    matchTerms: ['historian', 'digital', 'migration', 'logger'],
    imageSrc: catalogDemoImage(35),
    breadcrumb: ['Learn', 'Utilities'],
  }),
  p({
    id: 'dl-9',
    title: 'Product manual: DAQ driver installation for Windows 11 environments',
    description:
      'Signed driver packages, UAC prompts, and firewall exceptions for lab PCs.',
    contentType: 'productManual',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['driver', 'daq', 'windows', 'manual'],
    imageSrc: catalogDemoImage(36),
    breadcrumb: ['Support', 'IT'],
  }),
  p({
    id: 'dl-10',
    sku: 'OM-EL-USB',
    priceLabel: '$72',
    title: 'EL-USB Temperature & Humidity Logger',
    description:
      'Set-and-forget USB logger with LED status — thousands deployed in warehouses and clinics.',
    contentType: 'product',
    categories: ['dataAcquisition', 'temperature'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['usb', 'logger', 'humidity', 'temperature'],
    imageSrc: catalogDemoImage(37),
    isNew: true,
    breadcrumb: ['Products', 'Loggers'],
  }),
  p({
    id: 'dl-11',
    sku: 'OM-DAQ-USB8',
    priceLabel: '$289',
    title: '8-channel voltage logger with software triggers',
    description:
      'Log 0–10 V and 4–20 mA with configurable thresholds — ship logs to CSV for Six Sigma studies.',
    contentType: 'product',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['logger', 'channel', 'voltage', 'csv'],
    imageSrc: catalogDemoImage(38),
    breadcrumb: ['Products', 'DAQ'],
  }),
  p({
    id: 'dl-12',
    title: 'Technical resource: Logger sampling jitter and aliasing primer',
    description:
      'Short guide for engineers choosing sample rates for rotating equipment and fast thermal transients.',
    contentType: 'technicalResource',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['sampling', 'logger', 'aliasing', 'engineering'],
    imageSrc: catalogDemoImage(39),
    breadcrumb: ['Resources', 'Education'],
  }),
  p({
    id: 'dl-13',
    sku: 'DW-SCADA-LITE',
    priceLabel: '$560',
    title: 'Lightweight SCADA logger bridge for small utilities',
    description:
      'Poll Modbus registers and persist to removable media — bridge legacy PLCs to modern reporting.',
    contentType: 'product',
    categories: ['dataAcquisition', 'wirelessIiot'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger'],
    matchTerms: ['scada', 'logger', 'modbus', 'utility'],
    imageSrc: catalogDemoImage(40),
    breadcrumb: ['Products', 'Software'],
  }),
  p({
    id: 'dl-14',
    title: 'Featured article: Data integrity for 21 CFR Part 11 studies',
    description:
      'Audit trails, user accounts, and electronic signatures when Omega software is used in regulated labs.',
    contentType: 'featuredArticle',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['data', 'logger', 'compliance', 'cfr'],
    imageSrc: catalogDemoImage(41),
    breadcrumb: ['Learn', 'Regulatory'],
  }),
  p({
    id: 'dl-15',
    title: 'Product manual: Ethernet logger firewall exceptions',
    description:
      'IT-friendly port matrix for Omega Ethernet loggers in segmented OT networks.',
    contentType: 'productManual',
    categories: ['dataAcquisition', 'wirelessIiot'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    matchTerms: ['ethernet', 'logger', 'firewall', 'manual'],
    imageSrc: catalogDemoImage(42),
    breadcrumb: ['Support', 'IT'],
  }),

  // —— IIoT / Wireless ——
  p({
    id: 'iot-1',
    sku: 'OM-WLS-01',
    priceLabel: 'From $510',
    title: 'Wireless Temperature Transmitter — Mesh repeater capable',
    description:
      'License-free sub-GHz mesh for plant-wide temperature visibility without running new conduit.',
    contentType: 'product',
    categories: ['wirelessIiot', 'temperature', 'dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['iiot'],
    matchTerms: ['wireless', 'mesh', 'iiot', 'transmitter', 'temperature'],
    imageSrc: catalogDemoImage(43),
    isNew: true,
    breadcrumb: ['Products', 'Wireless'],
  }),
  p({
    id: 'iot-2',
    sku: 'RL-GW-IO',
    priceLabel: '$1,890',
    title: 'Red Lion Edge Gateway — MQTT & Sparkplug B',
    description:
      'Publish OT tags to cloud historians with store-and-forward for unreliable cellular uplinks.',
    contentType: 'product',
    categories: ['wirelessIiot', 'dataAcquisition'],
    brands: ['redLion'],
    searchBuckets: ['iiot'],
    matchTerms: ['gateway', 'mqtt', 'iiot', 'edge', 'cloud'],
    imageSrc: catalogDemoImage(44),
    breadcrumb: ['Products', 'Connectivity'],
  }),
  p({
    id: 'iot-3',
    title: 'Featured article: Designing a secure IIoT pilot on brownfield assets',
    description:
      'Segmentation, read-only PLC taps, and certificate rotation patterns for first production pilots.',
    contentType: 'featuredArticle',
    categories: ['wirelessIiot'],
    brands: ['omega', 'redLion'],
    searchBuckets: ['iiot'],
    matchTerms: ['iiot', 'secure', 'pilot', 'plc'],
    imageSrc: catalogDemoImage(45),
    breadcrumb: ['Learn', 'IIoT'],
  }),
  p({
    id: 'iot-4',
    title: 'Technical resource: Wireless site survey checklist for metal buildings',
    description:
      'RSSI targets, antenna height rules, and interference sources common in process plants.',
    contentType: 'technicalResource',
    categories: ['wirelessIiot'],
    brands: ['omega'],
    searchBuckets: ['iiot'],
    matchTerms: ['wireless', 'survey', 'antenna', 'rssi'],
    imageSrc: catalogDemoImage(46),
    breadcrumb: ['Resources', 'Field'],
  }),
  p({
    id: 'iot-5',
    title: 'Product manual: Edge gateway commissioning & SIM provisioning',
    description:
      'APN settings, firewall pinholes, and OT/IT handoff checklist for operations teams.',
    contentType: 'productManual',
    categories: ['wirelessIiot'],
    brands: ['redLion'],
    searchBuckets: ['iiot'],
    matchTerms: ['gateway', 'sim', 'commissioning', 'manual'],
    imageSrc: catalogDemoImage(47),
    breadcrumb: ['Support', 'Manuals'],
  }),
  p({
    id: 'iot-me-only',
    title: 'Maintenance-only: Spare antenna kit list by panel type',
    description:
      'Cross-reference whip vs remote-mount kits for Omega wireless receivers in MCC rooms.',
    contentType: 'technicalResource',
    categories: ['wirelessIiot'],
    brands: ['omega'],
    searchBuckets: ['iiot'],
    matchTerms: ['antenna', 'spare', 'wireless', 'maintenance'],
    imageSrc: catalogDemoImage(48),
    visibleForDemoUsers: ['Restaurant Operator'],
    demoUserTaxonomy: 'Restaurant Operator',
    breadcrumb: ['Maintenance', 'Spares'],
  }),
  p({
    id: 'iot-ec-only',
    title: 'Consulting-only: Reference architecture — SCADA to cloud via Sparkplug',
    description:
      'Single-line diagrams and topic naming conventions for multi-site OEM rollouts.',
    contentType: 'technicalResource',
    categories: ['wirelessIiot', 'dataAcquisition'],
    brands: ['redLion'],
    searchBuckets: ['iiot'],
    matchTerms: ['sparkplug', 'scada', 'architecture', 'cloud'],
    imageSrc: catalogDemoImage(49),
    visibleForDemoUsers: ['Technician'],
    demoUserTaxonomy: 'Technician',
    breadcrumb: ['Resources', 'Architecture'],
  }),
  p({
    id: 'iot-pt-only',
    title: 'Technician-only: Swap procedure — cellular gateway without process downtime',
    description:
      'Hot-swap using redundant path and validation pings before cutover.',
    contentType: 'productManual',
    categories: ['wirelessIiot'],
    brands: ['redLion'],
    searchBuckets: ['iiot'],
    matchTerms: ['cellular', 'gateway', 'swap', 'downtime'],
    imageSrc: catalogDemoImage(50),
    visibleForDemoUsers: ['Technician'],
    demoUserTaxonomy: 'Technician',
    breadcrumb: ['Operations', 'Runbooks'],
  }),
  p({
    id: 'iot-6',
    sku: 'OM-CLOUD-LITE',
    priceLabel: '$29/mo',
    title: 'Omega Cloud Lite — dashboards for wireless loggers',
    description:
      'Pre-built tiles for min/max, excursions, and CSV export — pairs with Omega wireless endpoints.',
    contentType: 'product',
    categories: ['wirelessIiot', 'dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['iiot', 'datalogger'],
    matchTerms: ['cloud', 'dashboard', 'wireless', 'logger'],
    imageSrc: catalogDemoImage(51),
    breadcrumb: ['Products', 'Software'],
  }),
  p({
    id: 'iot-7',
    sku: 'DW-WPT',
    priceLabel: '$268',
    title: 'Wireless Pressure Transmitter — battery powered',
    description:
      'Remote monitoring for filter banks and coil DP where wiring is cost-prohibitive.',
    contentType: 'product',
    categories: ['wirelessIiot', 'pressure'],
    brands: ['dwyer'],
    searchBuckets: ['iiot', 'pressure'],
    matchTerms: ['wireless', 'pressure', 'transmitter', 'battery'],
    imageSrc: catalogDemoImage(52),
    breadcrumb: ['Products', 'Wireless'],
  }),
  p({
    id: 'iot-8',
    title: 'Featured article: IIoT and Wireless Systems — where to start in 2026',
    description:
      'Decision tree for pilot scope: sensors first vs network first vs historian first.',
    contentType: 'featuredArticle',
    categories: ['wirelessIiot', 'dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['iiot'],
    matchTerms: ['iiot', 'wireless', 'systems', 'pilot'],
    imageSrc: catalogDemoImage(53),
    breadcrumb: ['Learn', 'Strategy'],
  }),
  p({
    id: 'iot-9',
    title: 'Product manual: Wireless receiver pairing & security keys',
    description:
      'Factory default rotation, pairing timeout behavior, and lost-device revocation.',
    contentType: 'productManual',
    categories: ['wirelessIiot'],
    brands: ['omega'],
    searchBuckets: ['iiot'],
    matchTerms: ['pairing', 'security', 'wireless', 'manual'],
    imageSrc: catalogDemoImage(54),
    breadcrumb: ['Support', 'Manuals'],
  }),
  p({
    id: 'iot-10',
    sku: 'RL-DA10D',
    priceLabel: '$640',
    title: 'Data Acquisition Module — edge preprocessing',
    description:
      'Scale and linearize raw counts before MQTT publish — reduces cloud ingress costs.',
    contentType: 'product',
    categories: ['dataAcquisition', 'wirelessIiot'],
    brands: ['redLion'],
    searchBuckets: ['iiot', 'datalogger'],
    matchTerms: ['edge', 'mqtt', 'acquisition', 'preprocess'],
    imageSrc: catalogDemoImage(55),
    breadcrumb: ['Products', 'IIoT'],
  }),
  p({
    id: 'iot-11',
    sku: 'OM-WG-MESH',
    priceLabel: '$348',
    title: 'Wireless mesh repeater — extend plant coverage',
    description:
      'Self-healing mesh for Omega W-series endpoints; DIN-rail mount with diagnostics LEDs.',
    contentType: 'product',
    categories: ['wirelessIiot'],
    brands: ['omega'],
    searchBuckets: ['iiot'],
    matchTerms: ['wireless', 'mesh', 'repeater', 'iiot'],
    imageSrc: catalogDemoImage(56),
    breadcrumb: ['Products', 'Wireless'],
  }),
  p({
    id: 'iot-12',
    title: 'Technical resource: OT/IT demarcation for IIoT pilots',
    description:
      'RACI matrix for firewall changes, historian ownership, and backup responsibilities.',
    contentType: 'technicalResource',
    categories: ['wirelessIiot', 'dataAcquisition'],
    brands: ['redLion'],
    searchBuckets: ['iiot'],
    matchTerms: ['iiot', 'ot', 'it', 'firewall'],
    imageSrc: catalogDemoImage(57),
    breadcrumb: ['Resources', 'Security'],
  }),
  p({
    id: 'iot-13',
    sku: 'RL-CELL-5G',
    priceLabel: '$920',
    title: 'Industrial 5G cellular router with GPS',
    description:
      'Primary or failover uplink for remote assets — GPS for fleet maps in Omega Cloud dashboards.',
    contentType: 'product',
    categories: ['wirelessIiot'],
    brands: ['redLion'],
    searchBuckets: ['iiot'],
    matchTerms: ['cellular', '5g', 'router', 'wireless'],
    imageSrc: catalogDemoImage(58),
    isNew: true,
    breadcrumb: ['Products', 'Connectivity'],
  }),
  p({
    id: 'iot-14',
    title: 'Featured article: Wireless Systems commissioning playbook',
    description:
      'End-to-end checklist from FAT through SAT for IIoT rollouts with Red Lion gateways.',
    contentType: 'featuredArticle',
    categories: ['wirelessIiot'],
    brands: ['redLion', 'omega'],
    searchBuckets: ['iiot'],
    matchTerms: ['wireless', 'systems', 'commissioning', 'iiot'],
    imageSrc: catalogDemoImage(59),
    breadcrumb: ['Learn', 'Deployment'],
  }),
  p({
    id: 'iot-15',
    title: 'Product manual: MQTT topic design for multi-site OEMs',
    description:
      'Versioned topic trees, birth certificates, and dead-band publishing guidance.',
    contentType: 'productManual',
    categories: ['wirelessIiot', 'dataAcquisition'],
    brands: ['redLion'],
    searchBuckets: ['iiot'],
    matchTerms: ['mqtt', 'topic', 'manual', 'oem'],
    imageSrc: catalogDemoImage(60),
    breadcrumb: ['Support', 'Developers'],
  }),
];

export const contentTypes = Object.keys(searchFacetLabels.contentType) as SearchContentType[];
export const categories = Object.keys(searchFacetLabels.category) as SearchCategory[];
export const brands = Object.keys(searchFacetLabels.brand) as SearchBrand[];

export function getDefaultCardImage(): string {
  return defaultImg;
}

function insightKey(buckets: SearchBucket[], user: DemoUserTaxonomy | null): string {
  const b = [...buckets].sort().join('|') || 'browse';
  const u = user ?? 'any';
  return `${b}::${u}`;
}

/** Mock “AI” narrative that shifts with query buckets + demo persona */
export function selectAiSearchInsight(query: string, user: DemoUserTaxonomy | null): AiSearchInsight | null {
  const n = normalizeQuery(query);
  if (n.length < 2) return null;
  const buckets = detectSearchBuckets(n);
  const key = insightKey(buckets, user);

  const pool: Record<string, AiSearchInsight> = {
    'pressure::Restaurant Operator': {
      id: 'ai-pr-ro',
      headline: 'AI suggestion — keep line downtime low on steam and pressure stations',
      body:
        'Restaurant operators win consistency when critical spares are pre-binned for combi ovens and steam tables. Track gasket and seat kits alongside filter changes so PM days do not turn into emergency parts runs.',
      bullets: [
        'Stage OEM-matched kits for your top five failure codes',
        'Log setpoints after major menu or production changes',
        'Pair disposable PPE with every steam-side PM window',
      ],
      learnMoreHref: DFS_SUPPLY_BASE,
      learnMoreLabel: 'Equipment repair parts',
    },
    'pressure::Technician': {
      id: 'ai-pr-tc',
      headline: 'AI suggestion — prove the fault before you open the steam loop',
      body:
        'Technicians shorten callbacks by verifying demand, safeties, and inlet quality before swapping regulators or motors. Document torque sequences for gasketed steam valves to avoid repeat leaks.',
      bullets: [
        'Photo tagout points and nameplate data before teardown',
        'Bench-test relays and caps on compressor calls',
        'Keep OEM interchange notes on the truck tablet',
      ],
      learnMoreHref: DFS_SUPPLY_BASE,
      learnMoreLabel: 'Service technician resources',
    },
    'datalogger::Restaurant Operator': {
      id: 'ai-dl-ro',
      headline: 'AI suggestion — HACCP logs are a habit, not a scramble',
      body:
        'Operators reduce audit friction when temp checks and holding labels share one rhythm with line open/close. Short digital checklists beat binders during rushes.',
      bullets: [
        'Align probe IDs with walk-in zones on the line board',
        'Export weekly PDFs before third-party inspections',
        'Train leads on corrective action wording once per quarter',
      ],
      learnMoreHref: DFS_SUPPLY_BASE,
      learnMoreLabel: 'Restaurant operations products',
    },
    'datalogger::Technician': {
      id: 'ai-dl-tc',
      headline: 'AI suggestion — verify probe placement before you blame the controller',
      body:
        'Field teams cut NTF rates by confirming well depth, air gaps, and shielding on temp calls. Keep a spare logger on the van to shadow questionable panels overnight.',
      bullets: [
        'Run a 10-minute ice/boil sanity check on probes',
        'Label USB ports used for equipment downloads only',
        'Capture photos of routing before closing panels',
      ],
      learnMoreHref: DFS_SUPPLY_BASE,
      learnMoreLabel: 'Parts & diagnostics',
    },
    'iiot::Restaurant Operator': {
      id: 'ai-iot-ro',
      headline: 'AI suggestion — treat hood energy like a controllable COGS line',
      body:
        'Facilities-aware operators schedule hood setbacks after close, align make-up air with occupancy, and catch drift early with simple dashboards tied to utility incentives.',
      bullets: [
        'Publish one “green shift” checklist for open/close',
        'Trend exhaust VFDs weekly during menu changes',
        'Bundle filter changes with grease duct inspections',
      ],
      learnMoreHref: DFS_SUPPLY_BASE,
      learnMoreLabel: 'Facilities & MRO',
    },
    'iiot::Technician': {
      id: 'ai-iot-tc',
      headline: 'AI suggestion — commission gateways before you trust alerts',
      body:
        'Technicians reduce truck rolls by staging cellular and BACnet gateways on the bench, validating APNs, and proving outbound topics before panel install night.',
      bullets: [
        'Keep ICCIDs and panel IP schemes in the shift log',
        'Segment OT Wi‑Fi from guest SSIDs on shared sites',
        'Document firmware hashes after vendor updates',
      ],
      learnMoreHref: DFS_SUPPLY_BASE,
      learnMoreLabel: 'Maintenance repair operations',
    },
  };

  // Multi-bucket queries: merge first matching bucket priority pressure > datalogger > iiot
  const order: SearchBucket[] = ['pressure', 'datalogger', 'iiot'];
  for (const b of order) {
    if (buckets.includes(b)) {
      const singleKey = `${b}::${user ?? 'any'}`;
      if (pool[singleKey]) return pool[singleKey];
    }
  }

  // Generic fallback when keywords match but no persona-specific block
  if (buckets.includes('pressure')) {
    return (
      pool[`pressure::${user ?? 'any'}`] ?? {
        id: 'ai-pr-gen',
        headline: 'AI suggestion — match parts to manufacturer plates first',
        body:
          'Equipment repair performance depends on OEM series, electrical service, and steam vs electric duty. Use Equipment repair & steam filters, then compare kits vs single components.',
        bullets: [
          'Filter to OEM parts first, then add disposables for the same PM window',
          'Open manuals for torque and lockout sequences',
          'Save articles for shift handoff on repeat failure codes',
        ],
        learnMoreHref: DFS_SUPPLY_BASE,
        learnMoreLabel: 'Explore parts',
      }
    );
  }
  if (buckets.includes('datalogger')) {
    return (
      pool[`datalogger::${user ?? 'any'}`] ?? {
        id: 'ai-dl-gen',
        headline: 'AI suggestion — align logs with how the kitchen actually runs',
        body:
          'Holding and cooling evidence is easier when checklists match station cadence. Prefer locked templates and PDF exports before health department walkthroughs.',
        bullets: ['Use Technical resources for line-ready checklists', 'Download manuals for equipment-specific probes'],
        learnMoreHref: DFS_SUPPLY_BASE,
        learnMoreLabel: 'Operations tracking',
      }
    );
  }
  if (buckets.includes('iiot')) {
    return (
      pool[`iiot::${user ?? 'any'}`] ?? {
        id: 'ai-iot-gen',
        headline: 'AI suggestion — prove connectivity before trusting facility alerts',
        body:
          'Pilot monitoring on one hood line, one gateway, and a clear escalation path. Operators see faster ROI when setbacks and filter PMs share one calendar.',
        bullets: ['Survey signal quality during peak exhaust', 'Publish read-only dashboards for GMs first', 'Document vendor support numbers in the book'],
        learnMoreHref: DFS_SUPPLY_BASE,
        learnMoreLabel: 'Facilities monitoring',
      }
    );
  }

  // Keyword search without bucket: lightweight assistant
  if (n.length >= 3) {
    const generic: AiSearchInsight = {
      id: `ai-gen-${key}`,
      headline: 'AI suggestion — refine with categories on the left',
      body:
        'Try popular terms like “Commercial oven parts”, “Disposable gloves case”, or “Hood filter replacement” to load curated mixes of products, articles, manuals, and operator checklists.',
      bullets: [
        'Combine Content type filters with category rails for faster triage',
        'Demo user switcher swaps Restaurant Operator vs Technician rows and AI tips',
      ],
      learnMoreHref: DFS_SUPPLY_BASE,
      learnMoreLabel: 'Visit DFS Supply',
    };
    return generic;
  }

  return null;
}

export function itemMetadataLine(item: SearchResultItem): string {
  const type = searchFacetLabels.contentType[item.contentType];
  const when = item.dateLabel ?? (item.contentType === 'product' ? 'In stock' : 'Resource');
  const trail = item.breadcrumb?.length ? item.breadcrumb.join(' · ') : '';
  const sku = item.sku ? `SKU ${item.sku}` : '';
  const bits = [type, when, sku, trail].filter(Boolean);
  return bits.join(' · ');
}
