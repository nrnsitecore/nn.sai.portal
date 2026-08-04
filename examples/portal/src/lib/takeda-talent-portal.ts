import type { LucideIcon } from 'lucide-react';
import { Briefcase, MapPin, Search, Sparkles } from 'lucide-react';
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

/** Demo-only job-seeker dashboards — careers voice for popular searcher types. */
export const TAKEDA_TALENT_DASHBOARDS: Record<TakedaTalentPersona, TalentPersonaDashboard> = {
  'Recent Graduate': {
    name: 'Maya',
    role: 'Recent Graduate',
    welcomeLead:
      'Explore early-career and rotational roles, track applications, and get ready for your first conversations with #TeamTakeda.',
    alert: '3 new early-career roles match your profile in R&D and Data, Digital & Technology.',
    primaryCta: { label: 'Browse early-career jobs', icon: Search },
    stats: [
      { id: 'matches', label: 'New matches', value: '12', hint: 'Entry & early career' },
      { id: 'apps', label: 'Applications', value: '3', hint: '1 in review' },
      { id: 'saved', label: 'Saved jobs', value: '8', hint: '2 closing soon' },
      { id: 'events', label: 'Career events', value: '2', hint: 'Virtual info sessions' },
    ],
    pipeline: [
      {
        id: 'p1',
        title: 'Clinical Research Associate',
        meta: 'Tokyo · R&D · Early career',
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
      eyebrow: 'Start here',
      title: 'Realize your potential',
      body: 'Launch your career on a globally diverse team improving healthcare for patients—and grow with mentorship and real impact from day one.',
    },
  },
  'Experienced Professional': {
    name: 'Alex',
    role: 'Experienced Professional',
    welcomeLead:
      'Find roles that match your depth of experience across Commercial, Manufacturing, Corporate Functions, and more.',
    alert: 'Your application for Brand Manager, US Commercial moved to hiring-manager review.',
    primaryCta: { label: 'View my applications', icon: Briefcase },
    stats: [
      { id: 'matches', label: 'Strong matches', value: '9', hint: 'Based on your skills' },
      { id: 'apps', label: 'Active applications', value: '5', hint: '2 interviews scheduled' },
      { id: 'alerts', label: 'Job alerts', value: '4', hint: 'Weekly digests on' },
      { id: 'profile', label: 'Profile strength', value: '91%', hint: 'Add certifications' },
    ],
    pipeline: [
      {
        id: 'p1',
        title: 'Brand Manager, US Commercial',
        meta: 'Lexington, MA · Commercial',
        status: 'In review',
      },
      {
        id: 'p2',
        title: 'Senior Scientist, Immunology',
        meta: 'Cambridge, MA · R&D',
        status: 'Interview',
      },
      {
        id: 'p3',
        title: 'Medical Science Liaison',
        meta: 'Chicago, IL · Commercial',
        status: 'Saved',
      },
    ],
    spotlight: {
      eyebrow: 'Your next chapter',
      title: 'Bring your expertise to patients',
      body: 'Experienced professionals at Takeda lead work that spans science, markets, and operations—with room to grow globally.',
    },
  },
  'Career Changer': {
    name: 'Jordan',
    role: 'Career Changer',
    welcomeLead:
      'Discover transferable-skill pathways into healthcare, digital, supply chain, and corporate roles as you pivot your career.',
    alert: '2 roles highlight transferable skills from your background in tech and operations.',
    primaryCta: { label: 'Explore career areas', icon: Sparkles },
    stats: [
      { id: 'pathways', label: 'Career pathways', value: '6', hint: 'Skill-aligned areas' },
      { id: 'matches', label: 'Pivot-friendly roles', value: '14', hint: 'Open to adjacent experience' },
      { id: 'apps', label: 'Applications', value: '2', hint: 'Awaiting response' },
      { id: 'guides', label: 'Career guides', value: '5', hint: 'How we hire tips' },
    ],
    pipeline: [
      {
        id: 'p1',
        title: 'Software Engineer, Digital Health',
        meta: 'Boston, MA · DD&T',
        status: 'Submitted',
      },
      {
        id: 'p2',
        title: 'HR Business Partner',
        meta: 'Zurich · Corporate Functions',
        status: 'Saved',
      },
      {
        id: 'p3',
        title: 'Data Analyst, Global Supply Chain',
        meta: 'Singapore · DD&T',
        status: 'Exploring',
      },
    ],
    spotlight: {
      eyebrow: 'Make the leap',
      title: 'Your experience still counts',
      body: 'Many #TeamTakeda colleagues joined from other industries. Focus on impact, curiosity, and how your skills serve patients.',
    },
  },
  'Remote Job Seeker': {
    name: 'Sam',
    role: 'Remote Job Seeker',
    welcomeLead:
      'Filter for remote-friendly and hybrid opportunities across Takeda’s global footprint—and track roles that fit your location preferences.',
    alert: '4 newly posted hybrid/remote-eligible roles match your saved search for DD&T and Corporate Functions.',
    primaryCta: { label: 'Search remote & hybrid jobs', icon: MapPin },
    stats: [
      { id: 'remote', label: 'Remote-friendly', value: '7', hint: 'Open now' },
      { id: 'hybrid', label: 'Hybrid roles', value: '18', hint: 'Near your markets' },
      { id: 'alerts', label: 'Location alerts', value: '3', hint: 'Cities + remote' },
      { id: 'apps', label: 'Applications', value: '4', hint: '1 phone screen' },
    ],
    pipeline: [
      {
        id: 'p1',
        title: 'Software Engineer, Digital Health',
        meta: 'Boston / hybrid · DD&T',
        status: 'Phone screen',
      },
      {
        id: 'p2',
        title: 'Data Analyst, Global Supply Chain',
        meta: 'Singapore / hybrid · DD&T',
        status: 'Saved',
      },
      {
        id: 'p3',
        title: 'HR Business Partner',
        meta: 'Zurich / hybrid · Corporate',
        status: 'Submitted',
      },
    ],
    spotlight: {
      eyebrow: 'Work where you thrive',
      title: 'Flexibility with purpose',
      body: 'Find roles that balance location flexibility with meaningful work on a team delivering life-transforming treatments worldwide.',
    },
  },
};
