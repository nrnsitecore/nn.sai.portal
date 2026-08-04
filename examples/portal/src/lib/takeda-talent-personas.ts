import type { DemoPersonaOption } from '@/lib/demo-personas';

/** Takeda Talent Community demo personas — external job seekers (not internal TA/HR). */
export const TAKEDA_DEMO_PERSONAS = [
  { label: 'Recent Graduate', taxonomy: 'Recent Graduate' },
  { label: 'Experienced Professional', taxonomy: 'Experienced Professional' },
  { label: 'Career Changer', taxonomy: 'Career Changer' },
  { label: 'Remote Job Seeker', taxonomy: 'Remote Job Seeker' },
] as const satisfies readonly DemoPersonaOption[];

export type TakedaTalentPersona = (typeof TAKEDA_DEMO_PERSONAS)[number]['taxonomy'];

export function isTakedaTalentPersona(value: string): value is TakedaTalentPersona {
  return (TAKEDA_DEMO_PERSONAS as readonly DemoPersonaOption[]).some((p) => p.taxonomy === value);
}
