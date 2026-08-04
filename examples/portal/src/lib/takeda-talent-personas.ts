import type { DemoPersonaOption } from '@/lib/demo-personas';

/** Takeda Talent Community demo personas (careers / people ops — not GATX). */
export const TAKEDA_DEMO_PERSONAS = [
  { label: 'Hiring Manager', taxonomy: 'Hiring Manager' },
  { label: 'Talent Acquisition Partner', taxonomy: 'Talent Acquisition Partner' },
  { label: 'Early Career Candidate', taxonomy: 'Early Career Candidate' },
  { label: 'People Partner', taxonomy: 'People Partner' },
] as const satisfies readonly DemoPersonaOption[];

export type TakedaTalentPersona = (typeof TAKEDA_DEMO_PERSONAS)[number]['taxonomy'];

export function isTakedaTalentPersona(value: string): value is TakedaTalentPersona {
  return (TAKEDA_DEMO_PERSONAS as readonly DemoPersonaOption[]).some((p) => p.taxonomy === value);
}
