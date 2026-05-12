/**
 * Search demo data facade: DFS foodservice mock when `NEXT_PUBLIC_APP_THEME=dfs`, else Dwyer instrumentation mock.
 */
import { resolveAppTheme } from '@/lib/app-theme';
import * as dfsSearchData from './dfs-search-data';
import * as instrumentSearchData from './instrument-search-data';

const isDfs = resolveAppTheme() === 'dfs';
const active = isDfs ? dfsSearchData : instrumentSearchData;

export type DemoUserTaxonomy =
  | import('./instrument-search-data').DemoUserTaxonomy
  | import('./dfs-search-data').DemoUserTaxonomy;

export type SearchContentType = import('./instrument-search-data').SearchContentType;
export type SearchCategory = import('./instrument-search-data').SearchCategory;
export type SearchBrand = import('./instrument-search-data').SearchBrand;
export type SearchBucket = import('./instrument-search-data').SearchBucket;
export type AiSearchInsight = import('./instrument-search-data').AiSearchInsight;

export type SearchResultItem = Omit<
  import('./instrument-search-data').SearchResultItem,
  'demoUserTaxonomy' | 'visibleForDemoUsers'
> & {
  demoUserTaxonomy?: DemoUserTaxonomy;
  visibleForDemoUsers?: DemoUserTaxonomy[];
};

export const DWYER_OMEGA_BASE = isDfs ? dfsSearchData.DFS_SUPPLY_BASE : instrumentSearchData.DWYER_OMEGA_BASE;

export const RESULTS_PAGE_SIZE = active.RESULTS_PAGE_SIZE;
export const searchFacetLabels = active.searchFacetLabels;
export const popularSearches = active.popularSearches;
export const QUERY_BUCKET_SYNONYMS = active.QUERY_BUCKET_SYNONYMS;

export const parseDemoUserTaxonomy = active.parseDemoUserTaxonomy as (
  raw: string | undefined | null
) => DemoUserTaxonomy | null;

export const normalizeQuery = active.normalizeQuery;
export const detectSearchBuckets = active.detectSearchBuckets;
export const itemVisibleForDemoUser = active.itemVisibleForDemoUser as (
  item: SearchResultItem,
  user: DemoUserTaxonomy | null
) => boolean;

export const itemMatchesQuery = active.itemMatchesQuery as (item: SearchResultItem, q: string) => boolean;

export const relevanceScore = active.relevanceScore as (
  item: SearchResultItem,
  q: string,
  activeDemoUserTaxonomy: DemoUserTaxonomy | null
) => number;

export const supplementalResultsForDemoUserTaxonomy =
  active.supplementalResultsForDemoUserTaxonomy as (plan: DemoUserTaxonomy) => SearchResultItem[];

export const searchCatalog = active.searchCatalog as SearchResultItem[];

export const contentTypes = active.contentTypes as import('./instrument-search-data').SearchContentType[];
export const categories = active.categories as import('./instrument-search-data').SearchCategory[];
export const brands = active.brands as import('./instrument-search-data').SearchBrand[];

export const getDefaultCardImage = active.getDefaultCardImage;
export const selectAiSearchInsight = active.selectAiSearchInsight as (
  query: string,
  user: DemoUserTaxonomy | null
) => AiSearchInsight | null;

export const itemMetadataLine = active.itemMetadataLine as (item: SearchResultItem) => string;
