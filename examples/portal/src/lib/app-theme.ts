/**
 * Visual brand theme for CSS variables (`<html data-theme="…">`).
 * Set via NEXT_PUBLIC_APP_THEME in XM Cloud / local env.
 */
export const APP_THEMES = ['bcbst', 'dwyeromega', 'dfs'] as const;
export type AppTheme = (typeof APP_THEMES)[number];

export function resolveAppTheme(): AppTheme {
  const raw = process.env.NEXT_PUBLIC_APP_THEME?.toLowerCase()?.trim();
  if (raw === 'dwyeromega') {
    return 'dwyeromega';
  }
  if (raw === 'dfs') {
    return 'dfs';
  }
  if (raw === 'bcbst') {
    return 'bcbst';
  }
  /* Default demo brand: DFS foodservice supply (dfsupply.com-inspired) */
  return 'dfs';
}
