import type { Field } from '@sitecore-content-sdk/nextjs';

import { resolveAppTheme } from '@/lib/app-theme';
import type { DemoPersonaOption } from '@/lib/demo-personas';

type LooseField = Field<string> | { jsonValue?: Field<string> } | undefined;

function readTextField(f: LooseField): string {
  if (!f) return '';
  const direct = (f as Field<string>).value;
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  const nested = (f as { jsonValue?: Field<string> }).jsonValue?.value;
  return typeof nested === 'string' ? nested.trim() : '';
}

/** Accepts `fields.data.datasource` or a flat `fields` object with the same keys. */
export function getPersonaDatasourceBlock(fields: unknown): Record<string, unknown> | null {
  if (!fields || typeof fields !== 'object') return null;
  const f = fields as { data?: { datasource?: Record<string, unknown> } };
  const ds = f.data?.datasource;
  if (ds && typeof ds === 'object') return ds;
  return fields as Record<string, unknown>;
}

/**
 * Sitecore template fields (datasource) for demo login / search personalization:
 * - User1Label, User1Taxonomy, User2Label, User2Taxonomy (Single-Line Text)
 */
export function parsePersonaOptionsFromDatasource(fields: unknown): DemoPersonaOption[] | null {
  const block = getPersonaDatasourceBlock(fields);
  if (!block) return null;

  const u1l = readTextField(block.User1Label as LooseField);
  const u1t = readTextField(block.User1Taxonomy as LooseField);
  const u2l = readTextField(block.User2Label as LooseField);
  const u2t = readTextField(block.User2Taxonomy as LooseField);

  if (!u1t || !u2t) return null;

  return [
    { label: u1l || u1t, taxonomy: u1t },
    { label: u2l || u2t, taxonomy: u2t },
  ];
}

export type SearchExperienceCopy = {
  experienceLabel: string;
  intro: string;
  searchPlaceholder: string;
  /** When set, SearchResults uses these chips; when null, use theme `popularSearches` from search data */
  popularChips: string[] | null;
};

const GATX_DEFAULT_COPY: SearchExperienceCopy = {
  experienceLabel: 'GATX Fleet Portal',
  intro:
    'Railcar fleet search for lease status, shop repair, qualification, and compliance resources across North America and specialty assets. Use the header login to choose a demo role — Fleet Operations, Maintenance, Leasing, or Regulatory Compliance — to personalize results and AI tips.',
  searchPlaceholder: 'Search fleet assets, manuals, qualifications, and operator resources…',
  popularChips: null,
};

const DFS_DEFAULT_COPY: SearchExperienceCopy = {
  experienceLabel: 'DFS Supply',
  intro:
    'Foodservice MRO search for facilities maintenance materials, equipment repair parts, and restaurant operations products. Filter by content type and program line. Use the header login to choose User 1 (Restaurant Operator) or User 2 (Technician) to personalize results and AI tips.',
  searchPlaceholder: 'Search parts, guides, manuals, and operator resources…',
  popularChips: null,
};

const INSTRUMENT_DEFAULT_COPY: SearchExperienceCopy = {
  experienceLabel: 'Dwyer Omega',
  intro:
    'Faceted navigation mirrors a modern commerce experience: filter by content type, product family, and brand. Switch the demo user in the header to see different personalized rows and AI guidance.',
  searchPlaceholder: 'Search products, articles, manuals, and technical resources…',
  popularChips: null,
};

function themeDefaultCopy(): SearchExperienceCopy {
  const theme = resolveAppTheme();
  if (theme === 'gatx') return GATX_DEFAULT_COPY;
  if (theme === 'dfs') return DFS_DEFAULT_COPY;
  return INSTRUMENT_DEFAULT_COPY;
}

export function parseSearchExperienceCopy(fields: unknown): SearchExperienceCopy {
  const base = themeDefaultCopy();
  const block = getPersonaDatasourceBlock(fields);
  if (!block) return base;

  const experienceLabel = readTextField(block.ExperienceLabel as LooseField) || base.experienceLabel;
  const intro = readTextField(block.IntroDescription as LooseField) || base.intro;
  const searchPlaceholder = readTextField(block.SearchPlaceholder as LooseField) || base.searchPlaceholder;

  const popularRaw = readTextField(block.PopularSearches as LooseField);
  const popularChips = popularRaw
    ? popularRaw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  return {
    experienceLabel,
    intro,
    searchPlaceholder,
    popularChips: popularChips?.length ? popularChips : null,
  };
}
