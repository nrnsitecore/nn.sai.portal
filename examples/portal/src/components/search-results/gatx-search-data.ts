/**
 * Mock search catalog for GATX-style railcar fleet operations portal demo.
 * Reuses DFS search mechanics with rail-specific personas, copy, and facet labels.
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
  ...dfs.QUERY_BUCKET_SYNONYMS,
  pressure: [
    ...dfs.QUERY_BUCKET_SYNONYMS.pressure,
    'tank',
    'railcar',
    'car',
    'hazmat',
    'qualification',
  ],
  iiot: [
    ...dfs.QUERY_BUCKET_SYNONYMS.iiot,
    'railpulse',
    'tracking',
    'telemetry',
    'fleet',
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

function remapLegacyPersona(persona: dfs.DemoUserTaxonomy): DemoUserTaxonomy {
  return persona === 'Restaurant Operator' ? 'Fleet Operations Manager' : 'Car Maintenance Technician';
}

function remapItem(item: dfs.SearchResultItem): SearchResultItem {
  return {
    ...item,
    href: item.href === dfs.DFS_SUPPLY_BASE ? GATX_BASE : item.href,
    demoUserTaxonomy: item.demoUserTaxonomy ? remapLegacyPersona(item.demoUserTaxonomy) : undefined,
    visibleForDemoUsers: item.visibleForDemoUsers?.map(remapLegacyPersona),
  };
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

export const itemMatchesQuery = dfs.itemMatchesQuery as (item: SearchResultItem, q: string) => boolean;

export const relevanceScore = dfs.relevanceScore as (
  item: SearchResultItem,
  q: string,
  activeDemoUserTaxonomy: DemoUserTaxonomy | null
) => number;

export function supplementalResultsForDemoUserTaxonomy(plan: DemoUserTaxonomy): SearchResultItem[] {
  const packs: Record<
    DemoUserTaxonomy,
    Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[]
  > = {
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
        searchBuckets: ['iiot'],
        dateLabel: 'Report',
        breadcrumb: ['Fleet', 'Utilization'],
        matchTerms: ['utilization', 'fleet', 'availability', 'lease'],
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
        matchTerms: ['dwell', 'positioning', 'revenue', 'service'],
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
          'Technician-facing steps for gasketed valves on pressure and general service equipment — torque order and leak verification.',
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
        matchTerms: ['lease', 'customer', 'portfolio', 'renewal'],
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

export const searchCatalog = dfs.searchCatalog.map(remapItem);

export const contentTypes = dfs.contentTypes;
export const categories = dfs.categories;
export const brands = dfs.brands;

export const getDefaultCardImage = dfs.getDefaultCardImage;

function insightPersonaKey(user: DemoUserTaxonomy | null): dfs.DemoUserTaxonomy | null {
  if (!user) return null;
  if (user === 'Fleet Operations Manager' || user === 'Leasing Account Representative') {
    return 'Restaurant Operator';
  }
  return 'Technician';
}

export function selectAiSearchInsight(query: string, user: DemoUserTaxonomy | null): AiSearchInsight | null {
  const base = dfs.selectAiSearchInsight(query, insightPersonaKey(user));
  if (!base) return null;

  const personaHeadlines: Partial<Record<DemoUserTaxonomy, string>> = {
    'Fleet Operations Manager': 'AI suggestion — keep qualified cars in revenue service',
    'Car Maintenance Technician': 'AI suggestion — prove the fault before car release',
    'Leasing Account Representative': 'AI suggestion — match car type to shipper qualification',
    'Regulatory Compliance Analyst': 'AI suggestion — close audit gaps before qualification expiry',
  };

  if (user && personaHeadlines[user]) {
    return {
      ...base,
      id: `gatx-${base.id}`,
      headline: personaHeadlines[user]!,
      learnMoreHref: GATX_BASE,
      learnMoreLabel: 'GATX resources',
    };
  }

  return {
    ...base,
    learnMoreHref: GATX_BASE,
    learnMoreLabel: 'GATX resources',
  };
}

export const itemMetadataLine = dfs.itemMetadataLine as (item: SearchResultItem) => string;
