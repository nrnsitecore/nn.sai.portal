/**
 * Mock search catalog for the GATX-style railcar fleet operations portal demo.
 *
 * Content is rail-specific (tank cars, valves, fleet telemetry, RailPulse™, compliance,
 * shop programs). The generic query/scoring helpers are reused from the DFS module since
 * they are content-agnostic; all catalog rows, persona packs, and AI insights are authored
 * here for GATX.
 */
import * as dfs from './dfs-search-data';

export type DemoUserTaxonomy =
  | 'Fleet Operations Manager'
  | 'Car Maintenance Technician'
  | 'Leasing Account Representative'
  | 'Regulatory Compliance Analyst';

export type SearchContentType = dfs.SearchContentType;
export type SearchCategory = dfs.SearchCategory;
export type SearchBrand = dfs.SearchBrand;
export type SearchBucket = dfs.SearchBucket;
export type AiSearchInsight = dfs.AiSearchInsight;

export type SearchResultItem = Omit<
  dfs.SearchResultItem,
  'demoUserTaxonomy' | 'visibleForDemoUsers'
> & {
  demoUserTaxonomy?: DemoUserTaxonomy;
  visibleForDemoUsers?: DemoUserTaxonomy[];
};

export const GATX_BASE = 'https://www.gatx.com/';

export const RESULTS_PAGE_SIZE = dfs.RESULTS_PAGE_SIZE;

export const searchFacetLabels = {
  contentType: dfs.searchFacetLabels.contentType,
  category: {
    pressure: 'Tank & pressure equipment',
    temperature: 'Thermal & jacket systems',
    flowLevel: 'Valves, fittings & flow',
    dataAcquisition: 'Fleet telemetry & compliance logs',
    wirelessIiot: 'RailPulse™ & connected fleet',
    calibrationServices: 'Shop programs & field service',
  },
  brand: {
    dwyer: 'GATX Rail North America',
    omega: 'GATX Rail Europe',
    redLion: 'Trifleet & specialty assets',
  },
} as const;

export const popularSearches = [
  'Tank car qualification',
  'AAR field manual',
  'Fleet utilization report',
  'Hazmat compliance',
  'Shop repair status',
];

export const QUERY_BUCKET_SYNONYMS = {
  pressure: [
    ...dfs.QUERY_BUCKET_SYNONYMS.pressure,
    'tank',
    'railcar',
    'car',
    'hazmat',
    'qualification',
    'jacket',
    'relief',
    'outlet',
  ],
  datalogger: [
    ...dfs.QUERY_BUCKET_SYNONYMS.datalogger,
    'utilization',
    'dwell',
    'mileage',
    'compliance',
    'qualification',
    'repair',
    'billing',
  ],
  iiot: [
    ...dfs.QUERY_BUCKET_SYNONYMS.iiot,
    'railpulse',
    'tracking',
    'telemetry',
    'fleet',
    'gps',
    'connected',
  ],
} as const;

const GATX_TAXONOMIES: readonly DemoUserTaxonomy[] = [
  'Fleet Operations Manager',
  'Car Maintenance Technician',
  'Leasing Account Representative',
  'Regulatory Compliance Analyst',
];

function isGatxTaxonomy(value: string): value is DemoUserTaxonomy {
  return (GATX_TAXONOMIES as readonly string[]).includes(value);
}

/** Legacy DFS persona strings remap onto the closest GATX persona (for stored values). */
function remapLegacyPersona(persona: dfs.DemoUserTaxonomy): DemoUserTaxonomy {
  return persona === 'Restaurant Operator'
    ? 'Fleet Operations Manager'
    : 'Car Maintenance Technician';
}

export function parseDemoUserTaxonomy(raw: string | undefined | null): DemoUserTaxonomy | null {
  const t = raw?.trim();
  if (!t) return null;
  if (isGatxTaxonomy(t)) return t;
  const legacy = dfs.parseDemoUserTaxonomy(t);
  return legacy ? remapLegacyPersona(legacy) : null;
}

export const normalizeQuery = dfs.normalizeQuery;

export function detectSearchBuckets(q: string): SearchBucket[] {
  const n = normalizeQuery(q);
  if (!n) return [];
  const words = n.split(/\s+/).filter(Boolean);
  const hits = new Set<SearchBucket>();
  for (const [bucket, synonyms] of Object.entries(QUERY_BUCKET_SYNONYMS) as [
    SearchBucket,
    readonly string[],
  ][]) {
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

export const itemMatchesQuery = dfs.itemMatchesQuery as (item: SearchResultItem, q: string) => boolean;

export const relevanceScore = dfs.relevanceScore as (
  item: SearchResultItem,
  q: string,
  activeDemoUserTaxonomy: DemoUserTaxonomy | null
) => number;

/** Small builder: defaults href to GATX and keeps rows terse. */
function g(item: Omit<SearchResultItem, 'href'> & { href?: string }): SearchResultItem {
  return { href: GATX_BASE, ...item };
}

export function supplementalResultsForDemoUserTaxonomy(plan: DemoUserTaxonomy): SearchResultItem[] {
  const packs: Record<DemoUserTaxonomy, Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[]> = {
    'Fleet Operations Manager': [
      {
        sku: 'FOM-RPT-01',
        priceLabel: 'Fleet dashboard',
        title: 'Fleet utilization snapshot — North America tank & hopper mix',
        description:
          'Daily availability, lease status, and shop queue depth for assigned car types. Export for customer QBR decks.',
        href: GATX_BASE,
        contentType: 'technicalResource',
        categories: ['dataAcquisition', 'wirelessIiot'],
        brands: ['dwyer'],
        searchBuckets: ['datalogger', 'iiot'],
        dateLabel: 'Report',
        breadcrumb: ['Fleet', 'Utilization'],
        matchTerms: ['utilization', 'fleet', 'availability', 'lease', 'dwell'],
      },
      {
        title: 'Featured article: reducing dwell with proactive car positioning',
        description:
          'Operations managers align origin/destination pairs and shop windows to keep qualified cars in revenue service.',
        href: GATX_BASE,
        contentType: 'featuredArticle',
        categories: ['dataAcquisition'],
        brands: ['dwyer'],
        searchBuckets: ['datalogger'],
        dateLabel: 'Read',
        breadcrumb: ['Insights', 'Operations'],
        matchTerms: ['dwell', 'positioning', 'revenue', 'service', 'fleet'],
      },
    ],
    'Car Maintenance Technician': [
      {
        sku: 'CMT-FLD-22',
        priceLabel: 'Shop bulletin',
        title: 'Field card: tank car jacket leak triage before shop entry',
        description:
          'Bench checklist for exterior jacket, insulation, and safety appliance checks aligned with AAR field guidance.',
        href: GATX_BASE,
        contentType: 'technicalResource',
        categories: ['pressure', 'temperature'],
        brands: ['dwyer'],
        searchBuckets: ['pressure'],
        dateLabel: 'Field',
        breadcrumb: ['Maintenance', 'Tank cars'],
        matchTerms: ['jacket', 'leak', 'tank', 'aar', 'shop'],
      },
      {
        title: 'Product manual: valve rebuild torque sequence — general service cars',
        description:
          'Technician-facing steps for gasketed bottom-outlet valves on pressure and general service cars — torque order and leak verification.',
        href: GATX_BASE,
        contentType: 'productManual',
        categories: ['pressure', 'calibrationServices'],
        brands: ['dwyer'],
        searchBuckets: ['pressure'],
        dateLabel: 'PDF',
        breadcrumb: ['Shop', 'Valves'],
        matchTerms: ['valve', 'torque', 'gasket', 'manual', 'rebuild'],
      },
    ],
    'Leasing Account Representative': [
      {
        sku: 'LAR-CRM-08',
        priceLabel: 'Account pack',
        title: 'Customer lease portfolio — expiring qualifications & replacement options',
        description:
          'Account view of car types, remaining lease term, and qualified replacements for customer conversations.',
        href: GATX_BASE,
        contentType: 'technicalResource',
        categories: ['dataAcquisition'],
        brands: ['omega'],
        searchBuckets: ['datalogger'],
        dateLabel: 'CRM',
        breadcrumb: ['Leasing', 'Accounts'],
        matchTerms: ['lease', 'customer', 'portfolio', 'renewal', 'qualification'],
      },
      {
        title: 'Featured article: positioning specialty tank assets for chemical shippers',
        description:
          'Leasing reps align car specs, linings, and service locations with shipper routing and qualification windows.',
        href: GATX_BASE,
        contentType: 'featuredArticle',
        categories: ['pressure', 'flowLevel'],
        brands: ['redLion'],
        searchBuckets: ['pressure'],
        dateLabel: 'Read',
        breadcrumb: ['Leasing', 'Specialty'],
        matchTerms: ['chemical', 'tank', 'shipper', 'lining'],
      },
    ],
    'Regulatory Compliance Analyst': [
      {
        sku: 'RCA-DOT-15',
        priceLabel: 'Compliance kit',
        title: 'Hazmat & tank car qualification tracker — FRA / DOT alignment',
        description:
          'Analyst workbook for qualification due dates, test certificates, and stenciling requirements across the active fleet.',
        href: GATX_BASE,
        contentType: 'technicalResource',
        categories: ['dataAcquisition', 'calibrationServices'],
        brands: ['dwyer'],
        searchBuckets: ['datalogger'],
        dateLabel: 'Audit',
        breadcrumb: ['Compliance', 'Hazmat'],
        matchTerms: ['hazmat', 'dot', 'fra', 'qualification', 'stencil'],
      },
      {
        title: 'Technical resource: audit-ready documentation for shop repair close-out',
        description:
          'Package bills of lading, test results, and component traceability for regulatory review and customer audits.',
        href: GATX_BASE,
        contentType: 'technicalResource',
        categories: ['calibrationServices', 'dataAcquisition'],
        brands: ['dwyer'],
        searchBuckets: ['datalogger'],
        dateLabel: 'Guide',
        breadcrumb: ['Compliance', 'Documentation'],
        matchTerms: ['audit', 'documentation', 'repair', 'traceability'],
      },
    ],
  };

  const code = plan.replace(/\s+/g, '-').toLowerCase();
  return packs[plan].map((row, i) => ({
    ...row,
    id: `gatx-sup-${code}-${i + 1}`,
    demoUserTaxonomy: plan,
  }));
}

/**
 * GATX rail catalog. Tagged with the shared facet keys (pressure/temperature/flowLevel/
 * dataAcquisition/wirelessIiot/calibrationServices and brands dwyer/omega/redLion), which
 * the GATX facet labels relabel as rail families and GATX rail regions.
 */
export const searchCatalog: SearchResultItem[] = [
  // —— Tank & pressure equipment (bucket: pressure) ——
  g({
    id: 'gx-tank-117j',
    sku: 'DOT-117J',
    priceLabel: 'Lease / shop',
    isNew: true,
    title: 'DOT-117J tank car — crude oil & ethanol service',
    description:
      'High-integrity tank car with jacketed insulation, full-height head shields, and thermal protection for flammable lading.',
    contentType: 'product',
    categories: ['pressure', 'temperature'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Fleet', 'Tank cars'],
    matchTerms: ['tank', 'car', 'crude', 'ethanol', 'hazmat', 'qualification', 'dot-117j'],
  }),
  g({
    id: 'gx-tank-111',
    sku: 'DOT-111',
    priceLabel: 'Lease / shop',
    title: 'DOT-111 general service tank car',
    description:
      'General purpose tank car for non-pressure commodities — configurable linings for chemical and food-grade lading.',
    contentType: 'product',
    categories: ['pressure', 'flowLevel'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Fleet', 'Tank cars'],
    matchTerms: ['tank', 'car', 'general service', 'lining', 'dot-111'],
  }),
  g({
    id: 'gx-tank-105',
    sku: 'DOT-105',
    priceLabel: 'Lease / shop',
    title: 'Pressure tank car (DOT-105) — LPG & anhydrous ammonia',
    description:
      'Insulated pressure car with pressure relief and bottom-outlet options for liquefied gas and pressurized lading.',
    contentType: 'product',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Fleet', 'Pressure cars'],
    matchTerms: ['pressure', 'tank', 'car', 'lpg', 'ammonia', 'relief', 'dot-105'],
  }),
  g({
    id: 'gx-valve-bov',
    sku: 'BOV-KIT-22',
    priceLabel: 'Shop part',
    title: 'Bottom outlet valve rebuild kit — tank cars',
    description:
      'Seats, gaskets, and operating hardware for tank car bottom outlet valves; matched to AAR leak-test requirements.',
    contentType: 'product',
    categories: ['pressure', 'flowLevel', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Parts', 'Valves'],
    matchTerms: ['valve', 'outlet', 'rebuild', 'gasket', 'tank', 'aar'],
  }),
  g({
    id: 'gx-valve-prv',
    sku: 'PRV-SAF-08',
    priceLabel: 'Shop part',
    title: 'Pressure relief valve — tank car safety system',
    description:
      'Reclosing pressure relief device for tank cars; set-pressure verification and certification at qualification.',
    contentType: 'product',
    categories: ['pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Parts', 'Safety systems'],
    matchTerms: ['relief', 'valve', 'pressure', 'safety', 'qualification'],
  }),
  g({
    id: 'gx-pr-jacket',
    title: 'Technical resource: tank jacket & insulation inspection guide',
    description:
      'Inspection criteria for exterior jackets, insulation moisture, and head shields before and during tank qualification.',
    contentType: 'technicalResource',
    categories: ['temperature', 'pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Resources', 'Inspection'],
    matchTerms: ['jacket', 'insulation', 'inspection', 'tank', 'qualification'],
  }),
  g({
    id: 'gx-pr-article',
    title: 'Featured article: reducing tank qualification turn time in the shop',
    description:
      'How proactive scheduling and lining-bay capacity shorten DOT-117J qualification cycles and keep cars in service.',
    contentType: 'featuredArticle',
    categories: ['pressure', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Insights', 'Shop'],
    matchTerms: ['qualification', 'turn time', 'shop', 'tank', 'lining'],
  }),
  g({
    id: 'gx-pr-manual',
    title: 'Product manual: tank car valve torque & leak-test sequence (AAR)',
    description:
      'Step-by-step torque order and leak verification for gasketed valves on pressure and general service cars.',
    contentType: 'productManual',
    categories: ['pressure', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    dateLabel: 'PDF',
    breadcrumb: ['Support', 'Manuals'],
    matchTerms: ['valve', 'torque', 'leak', 'aar', 'manual'],
  }),
  g({
    id: 'gx-pr-hazmat',
    title: 'Technical resource: hazmat tank car qualification checklist (DOT/FRA)',
    description:
      'Qualification due dates, test certificates, and stenciling requirements aligned with FRA and DOT regulations.',
    contentType: 'technicalResource',
    categories: ['pressure', 'dataAcquisition'],
    brands: ['dwyer'],
    searchBuckets: ['pressure', 'datalogger'],
    breadcrumb: ['Resources', 'Compliance'],
    matchTerms: ['hazmat', 'qualification', 'dot', 'fra', 'checklist', 'tank'],
  }),

  // —— Thermal & jacket systems (temperature) ——
  g({
    id: 'gx-thermal-coil',
    sku: 'COIL-STM-14',
    priceLabel: 'Shop upgrade',
    title: 'Steam coil heater system for viscous lading',
    description:
      'External steam coils and controls to keep heavy oils and asphalt flowable for unloading in cold climates.',
    contentType: 'product',
    categories: ['temperature', 'flowLevel'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Parts', 'Thermal'],
    matchTerms: ['steam', 'coil', 'heater', 'viscous', 'jacket', 'thermal'],
  }),
  g({
    id: 'gx-thermal-tech',
    title: 'Technical resource: insulated & jacketed car thermal maintenance',
    description:
      'Maintenance intervals for jacket integrity, insulation drying, and coil pressure testing on thermal-service cars.',
    contentType: 'technicalResource',
    categories: ['temperature', 'pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Resources', 'Thermal'],
    matchTerms: ['jacket', 'insulation', 'thermal', 'coil', 'maintenance'],
  }),

  // —— Valves, fittings & flow (flowLevel) ——
  g({
    id: 'gx-flow-gauge',
    sku: 'GAUGE-DEV-31',
    priceLabel: 'Shop part',
    title: 'Gauging device & fittings kit — general service cars',
    description:
      'Magnetic gauging device, vacuum relief, and fittings package for accurate outage and lading-level measurement.',
    contentType: 'product',
    categories: ['flowLevel', 'pressure'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Parts', 'Fittings'],
    matchTerms: ['gauge', 'fittings', 'level', 'outage', 'valve'],
  }),
  g({
    id: 'gx-flow-platform',
    sku: 'TOP-PLT-09',
    priceLabel: 'Shop upgrade',
    title: 'Top operating platform & fittings upgrade',
    description:
      'Safety platform, handrails, and reconfigured top fittings to improve loading access and crew safety.',
    contentType: 'product',
    categories: ['flowLevel', 'calibrationServices'],
    brands: ['omega'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Parts', 'Fittings'],
    matchTerms: ['platform', 'fittings', 'loading', 'safety', 'valve'],
  }),

  // —— Fleet telemetry & compliance logs (bucket: datalogger) ——
  g({
    id: 'gx-fleet-util',
    sku: 'FLEET-UTL',
    priceLabel: 'Portal report',
    isNew: true,
    title: 'Fleet utilization & dwell report',
    description:
      'Daily availability, dwell, and shop-queue depth by car type — export for customer quarterly business reviews.',
    contentType: 'product',
    categories: ['dataAcquisition', 'wirelessIiot'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger', 'iiot'],
    breadcrumb: ['Fleet', 'Reports'],
    matchTerms: ['utilization', 'dwell', 'fleet', 'availability', 'report'],
  }),
  g({
    id: 'gx-fleet-mileage',
    title: 'Technical resource: mileage equalization & repair billing (AAR Rule 88)',
    description:
      'How interline mileage, repair responsibility, and billing settle across owners and railroads for leased cars.',
    contentType: 'technicalResource',
    categories: ['dataAcquisition', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger'],
    breadcrumb: ['Resources', 'Billing'],
    matchTerms: ['mileage', 'equalization', 'repair', 'billing', 'aar'],
  }),
  g({
    id: 'gx-fleet-article',
    title: 'Featured article: turning telematics into proactive car positioning',
    description:
      'Using fleet telemetry to anticipate empties, balance origin/destination pairs, and reduce idle dwell.',
    contentType: 'featuredArticle',
    categories: ['dataAcquisition', 'wirelessIiot'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger', 'iiot'],
    breadcrumb: ['Insights', 'Operations'],
    matchTerms: ['telemetry', 'positioning', 'dwell', 'fleet'],
  }),
  g({
    id: 'gx-fleet-records',
    title: 'Product manual: compliance recordkeeping — qualification & test certs',
    description:
      'Where qualification dates, test certificates, and component traceability live in the portal and how to export them.',
    contentType: 'productManual',
    categories: ['dataAcquisition', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger'],
    dateLabel: 'PDF',
    breadcrumb: ['Support', 'Compliance'],
    matchTerms: ['compliance', 'records', 'qualification', 'certificate', 'traceability'],
  }),
  g({
    id: 'gx-fleet-shopfeed',
    sku: 'SHOP-FEED',
    priceLabel: 'Portal feed',
    title: 'Shop event tracking & repair status feed',
    description:
      'Live shop status — inbound, in-progress, promised delivery — for cars moving through GATX and partner shops.',
    contentType: 'product',
    categories: ['dataAcquisition'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger'],
    breadcrumb: ['Fleet', 'Shop status'],
    matchTerms: ['shop', 'repair', 'status', 'tracking', 'promised'],
  }),

  // —— RailPulse™ & connected fleet (bucket: iiot) ——
  g({
    id: 'gx-rp-device',
    sku: 'RAILPULSE-GPS',
    priceLabel: 'Connected fleet',
    isNew: true,
    title: 'RailPulse™ GPS & telematics device',
    description:
      'Solar-assisted telematics unit reporting location, mileage, and motion — the backbone of connected-fleet visibility.',
    contentType: 'product',
    categories: ['wirelessIiot', 'dataAcquisition'],
    brands: ['dwyer'],
    searchBuckets: ['iiot'],
    breadcrumb: ['Connected fleet', 'Devices'],
    matchTerms: ['railpulse', 'gps', 'telematics', 'tracking', 'connected'],
  }),
  g({
    id: 'gx-rp-sensor',
    sku: 'RP-SENSOR-HV',
    priceLabel: 'Connected fleet',
    title: 'Hatch & valve sensor — connected tank car',
    description:
      'Detects hatch open/close and valve position events, surfacing security and loading status to the fleet portal.',
    contentType: 'product',
    categories: ['wirelessIiot', 'pressure'],
    brands: ['dwyer'],
    searchBuckets: ['iiot', 'pressure'],
    breadcrumb: ['Connected fleet', 'Sensors'],
    matchTerms: ['sensor', 'hatch', 'valve', 'connected', 'railpulse'],
  }),
  g({
    id: 'gx-rp-article',
    title: 'Featured article: RailPulse pilot results — improving dwell visibility',
    description:
      'Early connected-fleet pilot data shows where cars idle and how telematics shortens reaction time.',
    contentType: 'featuredArticle',
    categories: ['wirelessIiot', 'dataAcquisition'],
    brands: ['dwyer'],
    searchBuckets: ['iiot'],
    breadcrumb: ['Insights', 'Connected fleet'],
    matchTerms: ['railpulse', 'pilot', 'dwell', 'telemetry', 'fleet'],
  }),
  g({
    id: 'gx-rp-survey',
    title: 'Technical resource: connected fleet onboarding & device provisioning',
    description:
      'How telematics units are assigned to cars, provisioned, and validated before data flows into the portal.',
    contentType: 'technicalResource',
    categories: ['wirelessIiot'],
    brands: ['dwyer'],
    searchBuckets: ['iiot'],
    breadcrumb: ['Resources', 'Connected fleet'],
    matchTerms: ['provisioning', 'onboarding', 'device', 'railpulse', 'connected'],
  }),
  g({
    id: 'gx-rp-manual',
    title: 'Product manual: telematics device commissioning & diagnostics',
    description:
      'Commissioning steps, status LEDs, and diagnostics for RailPulse telematics units in the field.',
    contentType: 'productManual',
    categories: ['wirelessIiot'],
    brands: ['dwyer'],
    searchBuckets: ['iiot'],
    dateLabel: 'PDF',
    breadcrumb: ['Support', 'Manuals'],
    matchTerms: ['commissioning', 'diagnostics', 'telematics', 'device', 'railpulse'],
  }),

  // —— Shop programs & field service (calibrationServices) ——
  g({
    id: 'gx-shop-otma',
    sku: 'OTMA-SVC',
    priceLabel: 'Field service',
    title: 'One-Time Movement Approval (OTMA) request service',
    description:
      'Request approval to move a car that is due or past qualification to a shop — guided workflow in the portal.',
    contentType: 'product',
    categories: ['calibrationServices', 'dataAcquisition'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger'],
    breadcrumb: ['Service', 'Movement'],
    matchTerms: ['otma', 'movement', 'approval', 'shop', 'qualification'],
  }),
  g({
    id: 'gx-shop-network',
    title: 'Technical resource: shop network capacity & lining bays',
    description:
      'Current shop locations, qualification capabilities, and lining-bay availability across the GATX network.',
    contentType: 'technicalResource',
    categories: ['calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger'],
    breadcrumb: ['Service', 'Network'],
    matchTerms: ['shop', 'capacity', 'lining', 'network', 'qualification'],
  }),

  // —— Persona-only rows (different result sets per demo user) ——
  g({
    id: 'gx-fom-only',
    title: 'Fleet Ops only: customer QBR fleet-health export',
    description:
      'One-click export of availability, dwell, and compliance posture for quarterly business reviews — Fleet Operations view.',
    contentType: 'technicalResource',
    categories: ['dataAcquisition', 'wirelessIiot'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger', 'iiot'],
    breadcrumb: ['Fleet', 'QBR'],
    matchTerms: ['qbr', 'fleet', 'health', 'export', 'utilization'],
    visibleForDemoUsers: ['Fleet Operations Manager'],
    demoUserTaxonomy: 'Fleet Operations Manager',
  }),
  g({
    id: 'gx-cmt-only',
    title: 'Technician only: shop torque card — gasketed bottom-outlet valves',
    description:
      'Laminated torque sequence and leak-test reference for valve rebuilds — Car Maintenance Technician shift aid.',
    contentType: 'productManual',
    categories: ['pressure', 'calibrationServices'],
    brands: ['dwyer'],
    searchBuckets: ['pressure'],
    breadcrumb: ['Shop', 'Shift aids'],
    matchTerms: ['torque', 'valve', 'gasket', 'leak', 'shop'],
    visibleForDemoUsers: ['Car Maintenance Technician'],
    demoUserTaxonomy: 'Car Maintenance Technician',
  }),
  g({
    id: 'gx-lar-only',
    sku: 'LEASE-VIEW',
    priceLabel: 'Account tool',
    title: 'Leasing only: lease portfolio & replacement-options viewer',
    description:
      'Remaining term, car specs, and qualified replacements per account — Leasing Account Representative workspace.',
    contentType: 'product',
    categories: ['dataAcquisition'],
    brands: ['omega'],
    searchBuckets: ['datalogger'],
    breadcrumb: ['Leasing', 'Portfolio'],
    matchTerms: ['lease', 'portfolio', 'replacement', 'renewal', 'customer'],
    visibleForDemoUsers: ['Leasing Account Representative'],
    demoUserTaxonomy: 'Leasing Account Representative',
  }),
  g({
    id: 'gx-rca-only',
    title: 'Compliance only: audit-ready documentation pack',
    description:
      'Bundle test results, certificates, and component traceability for regulatory review — Regulatory Compliance Analyst view.',
    contentType: 'technicalResource',
    categories: ['calibrationServices', 'dataAcquisition'],
    brands: ['dwyer'],
    searchBuckets: ['datalogger'],
    breadcrumb: ['Compliance', 'Documentation'],
    matchTerms: ['audit', 'documentation', 'certificate', 'traceability', 'compliance'],
    visibleForDemoUsers: ['Regulatory Compliance Analyst'],
    demoUserTaxonomy: 'Regulatory Compliance Analyst',
  }),
];

export const contentTypes = Object.keys(searchFacetLabels.contentType) as SearchContentType[];
export const categories = Object.keys(searchFacetLabels.category) as SearchCategory[];
export const brands = Object.keys(searchFacetLabels.brand) as SearchBrand[];

export const getDefaultCardImage = dfs.getDefaultCardImage;

/** Rail AI insight, varying by detected bucket and active persona. */
export function selectAiSearchInsight(
  query: string,
  user: DemoUserTaxonomy | null
): AiSearchInsight | null {
  const n = normalizeQuery(query);
  if (n.length < 2) return null;
  const buckets = detectSearchBuckets(n);

  const personaHeadline: Partial<Record<DemoUserTaxonomy, string>> = {
    'Fleet Operations Manager': 'AI suggestion — keep qualified cars in revenue service',
    'Car Maintenance Technician': 'AI suggestion — prove the fault before car release',
    'Leasing Account Representative': 'AI suggestion — match car type to shipper qualification',
    'Regulatory Compliance Analyst': 'AI suggestion — close audit gaps before qualification expiry',
  };

  const base: Record<SearchBucket, AiSearchInsight> = {
    pressure: {
      id: 'ai-gx-pressure',
      headline: 'AI suggestion — plan tank work around qualification windows',
      body: 'Tank and pressure work moves faster when valves, jackets, and relief devices are staged before the car enters the shop. Align rebuild kits and leak-test steps with AAR and qualification requirements to avoid repeat out-of-service time.',
      bullets: [
        'Pre-stage bottom-outlet valve and relief-valve kits for due cars',
        'Verify jacket and insulation condition before qualification',
        'Document torque and leak-test sequences for sign-off',
      ],
      learnMoreHref: GATX_BASE,
      learnMoreLabel: 'Tank & pressure resources',
    },
    datalogger: {
      id: 'ai-gx-datalogger',
      headline: 'AI suggestion — turn fleet data into fewer idle cars',
      body: 'Utilization, dwell, and shop-status feeds are most useful when they drive the next move. Combine telemetry with qualification due dates to position cars and schedule shop entry before service is interrupted.',
      bullets: [
        'Trend dwell by car type and origin/destination pair',
        'Flag cars approaching qualification in the next 90 days',
        'Export compliance records ahead of customer audits',
      ],
      learnMoreHref: GATX_BASE,
      learnMoreLabel: 'Fleet & compliance resources',
    },
    iiot: {
      id: 'ai-gx-iiot',
      headline: 'AI suggestion — commission telematics before you trust alerts',
      body: 'Connected-fleet value depends on clean onboarding. Provision RailPulse devices to the right cars, validate first reports, and confirm hatch/valve events before relying on location and security alerts.',
      bullets: [
        'Confirm device-to-car assignment during provisioning',
        'Validate first location and motion reports per unit',
        'Use hatch and valve events for security and loading status',
      ],
      learnMoreHref: GATX_BASE,
      learnMoreLabel: 'RailPulse & connected fleet',
    },
  };

  const order: SearchBucket[] = ['pressure', 'datalogger', 'iiot'];
  const primary = order.find((b) => buckets.includes(b));

  if (primary) {
    const insight = base[primary];
    return user && personaHeadline[user]
      ? { ...insight, id: `${insight.id}-${user.replace(/\s+/g, '-').toLowerCase()}`, headline: personaHeadline[user]! }
      : insight;
  }

  if (n.length >= 3) {
    return {
      id: 'ai-gx-generic',
      headline: user && personaHeadline[user] ? personaHeadline[user]! : 'AI suggestion — refine with the filters on the left',
      body: 'Try terms like “Tank car qualification”, “Fleet utilization report”, “RailPulse”, or “Hazmat compliance” to load curated mixes of cars, parts, technical resources, manuals, and persona-specific tools.',
      bullets: [
        'Combine content type filters with the category rails for faster triage',
        'Switch demo persona to swap results and AI guidance by role',
      ],
      learnMoreHref: GATX_BASE,
      learnMoreLabel: 'GATX resources',
    };
  }

  return null;
}

export const itemMetadataLine = dfs.itemMetadataLine as (item: SearchResultItem) => string;
