import type { Field } from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';

/**
 * Datasource fields for Search Results (Sitecore template).
 * Authors: assign a datasource item with these Single-Line / Multi-Line Text fields.
 *
 * Personas (required for multi-user demo; up to four for GATX portal):
 * - User1Label — e.g. "Fleet Operations Manager"
 * - User1Taxonomy — must match search mock parser, e.g. "Fleet Operations Manager"
 * - User2Label — e.g. "Car Maintenance Technician"
 * - User2Taxonomy — e.g. "Car Maintenance Technician"
 *
 * Optional copy:
 * - ExperienceLabel — e.g. "DFS Supply" (shown above results title)
 * - IntroDescription — plain text intro under the title (optional)
 * - SearchPlaceholder — search input placeholder
 * - PopularSearches — one suggestion per line (overrides popular chip row when set)
 */
export interface SearchResultsDatasourceFields {
  User1Label?: Field<string> | { jsonValue?: Field<string> };
  User1Taxonomy?: Field<string> | { jsonValue?: Field<string> };
  User2Label?: Field<string> | { jsonValue?: Field<string> };
  User2Taxonomy?: Field<string> | { jsonValue?: Field<string> };
  ExperienceLabel?: Field<string> | { jsonValue?: Field<string> };
  IntroDescription?: Field<string> | { jsonValue?: Field<string> };
  SearchPlaceholder?: Field<string> | { jsonValue?: Field<string> };
  PopularSearches?: Field<string> | { jsonValue?: Field<string> };
}

export type SearchResultsFieldsFromLayout = {
  data?: {
    datasource?: Partial<SearchResultsDatasourceFields>;
  };
};

export type SearchResultsComponentProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Partial<SearchResultsDatasourceFields> | SearchResultsFieldsFromLayout;
};
