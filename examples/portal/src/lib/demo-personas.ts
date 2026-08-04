import { resolveAppTheme } from '@/lib/app-theme';
import { TAKEDA_DEMO_PERSONAS } from '@/lib/takeda-talent-personas';

export type DemoPersonaOption = { label: string; taxonomy: string };

/** GATX internal railcar operations portal personas (https://www.gatx.com/). */
export const GATX_DEMO_PERSONAS = [
  { label: 'Fleet Operations Manager', taxonomy: 'Fleet Operations Manager' },
  { label: 'Car Maintenance Technician', taxonomy: 'Car Maintenance Technician' },
  { label: 'Leasing Account Representative', taxonomy: 'Leasing Account Representative' },
  { label: 'Regulatory Compliance Analyst', taxonomy: 'Regulatory Compliance Analyst' },
] as const satisfies readonly DemoPersonaOption[];

/** Build-time: aligned with `<html data-theme>` and DemoUserSwitcher defaults. */
export function getDemoPersonaOptions(): readonly DemoPersonaOption[] {
  const theme = resolveAppTheme();

  if (theme === 'takeda') {
    return TAKEDA_DEMO_PERSONAS;
  }

  if (theme === 'gatx') {
    return GATX_DEMO_PERSONAS;
  }

  if (theme === 'dfs') {
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
