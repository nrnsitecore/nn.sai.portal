/**
 * Visual brand theme for CSS variables (`<html data-theme="…">`).
 * Set via NEXT_PUBLIC_APP_THEME in XM Cloud / local env.
 */
export const APP_THEMES = ['bcbst', 'dwyeromega', 'dfs', 'gatx'] as const;
export type AppTheme = (typeof APP_THEMES)[number];

export function resolveAppTheme(): AppTheme {
  const raw = process.env.NEXT_PUBLIC_APP_THEME?.toLowerCase()?.trim();
  if (raw === 'dwyeromega') {
    return 'dwyeromega';
  }
  if (raw === 'dfs') {
    return 'dfs';
  }
  if (raw === 'gatx') {
    return 'gatx';
  }
  if (raw === 'bcbst') {
    return 'bcbst';
  }
  /* Default demo brand: GATX railcar operations portal */
  return 'gatx';
}

/** Rail / MRO portal themes that share GATX-style search chrome (vs instrumentation). */
export function isRailPortalTheme(theme: AppTheme = resolveAppTheme()): boolean {
  return theme === 'gatx' || theme === 'dfs';
}
