import { resolveAppTheme } from '@/lib/app-theme';

export type DemoPersonaOption = { label: string; taxonomy: string };

/** Build-time: same source as `<html data-theme>` — two personas for DFS foodservice demo, three for instrument themes. */
export function getDemoPersonaOptions(): readonly DemoPersonaOption[] {
  if (resolveAppTheme() === 'dfs') {
    return [
      { label: 'User 1 - Restaurant Operator', taxonomy: 'Restaurant Operator' },
      { label: 'User 2 - Technician', taxonomy: 'Technician' },
    ] as const;
  }
  return [
    { label: 'User 1 - Maintenance Engineer', taxonomy: 'Maintenance Engineer' },
    { label: 'User 2 - Engineering Consultant', taxonomy: 'Engineering Consultant' },
    { label: 'User 3 - Plant Technician', taxonomy: 'Plant Technician' },
  ] as const;
}
