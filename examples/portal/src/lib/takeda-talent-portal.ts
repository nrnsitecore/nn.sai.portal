import type { LucideIcon } from 'lucide-react';
import { Briefcase, ClipboardList, Users } from 'lucide-react';
import type { TakedaTalentPersona } from '@/lib/takeda-talent-personas';

export type TalentStat = {
  id: string;
  label: string;
  value: string;
  hint: string;
};

export type TalentPipelineItem = {
  id: string;
  title: string;
  meta: string;
  status: string;
};

export type TalentPersonaDashboard = {
  name: string;
  role: string;
  welcomeLead: string;
  alert: string;
  primaryCta: { label: string; icon: LucideIcon };
  stats: TalentStat[];
  pipeline: TalentPipelineItem[];
  spotlight: { eyebrow: string; title: string; body: string };
};

/** Demo-only talent dashboards — careers voice, not GATX railcars. */
export const TAKEDA_TALENT_DASHBOARDS: Record<TakedaTalentPersona, TalentPersonaDashboard> = {
  'Hiring Manager': {
    name: 'Aiko',
    role: 'Hiring Manager',
    welcomeLead:
      'Track open requisitions, interview progress, and offer decisions for your teams across R&D and Commercial.',
    alert: '2 candidates are waiting on interview feedback — complete scorecards within 48 hours.',
    primaryCta: { label: 'Review open reqs', icon: Briefcase },
    stats: [
      { id: 'reqs', label: 'Open requisitions', value: '7', hint: '3 priority roles' },
      { id: 'pipeline', label: 'Active candidates', value: '34', hint: 'Across 5 stages' },
      { id: 'interviews', label: 'Interviews this week', value: '9', hint: '2 panels tomorrow' },
      { id: 'offers', label: 'Offers pending', value: '2', hint: 'Awaiting approval' },
    ],
    pipeline: [
      {
        id: 'p1',
        title: 'Senior Scientist, Immunology',
        meta: 'Cambridge, MA · R&D',
        status: 'Panel interview',
      },
      {
        id: 'p2',
        title: 'Brand Manager, US Commercial',
        meta: 'Lexington, MA · Commercial',
        status: 'Offer review',
      },
      {
        id: 'p3',
        title: 'Clinical Research Associate',
        meta: 'Tokyo · R&D',
        status: 'Phone screen',
      },
    ],
    spotlight: {
      eyebrow: 'Hiring focus',
      title: 'Keep priority roles moving',
      body: 'Complete interview feedback promptly so Talent Acquisition can advance strong candidates without losing momentum.',
    },
  },
  'Talent Acquisition Partner': {
    name: 'Jordan',
    role: 'Talent Acquisition Partner',
    welcomeLead:
      'Coordinate sourcing, screening, and hiring-manager alignment for #TeamTakeda roles worldwide.',
    alert: '5 new applications need screening for Manufacturing & Supply roles this morning.',
    primaryCta: { label: 'Open screening queue', icon: ClipboardList },
    stats: [
      { id: 'apps', label: 'New applications', value: '128', hint: 'Last 7 days' },
      { id: 'screens', label: 'Screens due', value: '18', hint: 'Today + tomorrow' },
      { id: 'slates', label: 'Slates ready', value: '6', hint: 'Awaiting HM review' },
      { id: 'community', label: 'Talent community', value: '2.4k', hint: 'Engaged this month' },
    ],
    pipeline: [
      {
        id: 'p1',
        title: 'Manufacturing Associate, Plasma',
        meta: 'Social Circle, GA · Manufacturing',
        status: 'Screening',
      },
      {
        id: 'p2',
        title: 'Software Engineer, Digital Health',
        meta: 'Boston, MA · DD&T',
        status: 'HM slate',
      },
      {
        id: 'p3',
        title: 'Plasma Center Manager',
        meta: 'Austin, TX · BioLife',
        status: 'Sourcing',
      },
    ],
    spotlight: {
      eyebrow: 'TA focus',
      title: 'Build diverse, qualified slates',
      body: 'Prioritize early-career and experienced talent from the community while keeping hiring managers informed on timeline risks.',
    },
  },
  'Early Career Candidate': {
    name: 'Sam',
    role: 'Early Career Candidate',
    welcomeLead:
      'Explore roles, track applications, and prepare for interviews as you start your career at Takeda.',
    alert: 'Your application for Clinical Research Associate moved to phone screen — confirm availability.',
    primaryCta: { label: 'View my applications', icon: Briefcase },
    stats: [
      { id: 'apps', label: 'Applications', value: '4', hint: '1 in progress' },
      { id: 'saved', label: 'Saved roles', value: '11', hint: '3 new matches' },
      { id: 'events', label: 'Upcoming events', value: '2', hint: 'Virtual career chat' },
      { id: 'profile', label: 'Profile strength', value: '82%', hint: 'Add a resume' },
    ],
    pipeline: [
      {
        id: 'p1',
        title: 'Clinical Research Associate',
        meta: 'Tokyo · R&D',
        status: 'Phone screen',
      },
      {
        id: 'p2',
        title: 'Quality Assurance Specialist',
        meta: 'Lessines · Manufacturing',
        status: 'Submitted',
      },
      {
        id: 'p3',
        title: 'Data Analyst, Global Supply Chain',
        meta: 'Singapore · DD&T',
        status: 'Saved',
      },
    ],
    spotlight: {
      eyebrow: 'Your journey',
      title: 'Realize your potential',
      body: 'Join a globally diverse team improving healthcare for patients—and discover new opportunities to grow your career.',
    },
  },
  'People Partner': {
    name: 'Priya',
    role: 'People Partner',
    welcomeLead:
      'Support leaders with workforce planning, inclusive hiring, and employee experience across the business.',
    alert: 'Q2 headcount plan needs sign-off for Commercial and Corporate Functions.',
    primaryCta: { label: 'Open workforce plan', icon: Users },
    stats: [
      { id: 'hc', label: 'Planned hires', value: '42', hint: 'This quarter' },
      { id: 'dei', label: 'Slate diversity', value: '68%', hint: 'Target met' },
      { id: 'offers', label: 'Accepted offers', value: '15', hint: 'MTD' },
      { id: 'retention', label: '90-day retention', value: '97%', hint: 'New hires' },
    ],
    pipeline: [
      {
        id: 'p1',
        title: 'HR Business Partner',
        meta: 'Zurich · Corporate Functions',
        status: 'Offer stage',
      },
      {
        id: 'p2',
        title: 'Medical Science Liaison',
        meta: 'Chicago · Commercial',
        status: 'Final interview',
      },
      {
        id: 'p3',
        title: 'Workforce planning sync',
        meta: 'Global · People',
        status: 'Due Fri',
      },
    ],
    spotlight: {
      eyebrow: 'People focus',
      title: 'Inclusive teams, stronger outcomes',
      body: 'Partner with hiring managers to create belonging and equitable access to opportunities for every candidate and colleague.',
    },
  },
};
