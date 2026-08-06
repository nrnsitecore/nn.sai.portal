import type { SavedJob } from '@/lib/takeda-saved-jobs';
import type { TakedaTalentPersona } from '@/lib/takeda-talent-personas';

export type JobListing = SavedJob;

export type PersonaJobBoard = {
  headline: string;
  intro: string;
  jobs: JobListing[];
};

/** Career-site detail route for a hardcoded job id. */
export function getJobDetailPath(jobId: string): string {
  return `/Job-Search/${jobId}`;
}

/** Staged Workday-style apply URL for the apply-click talk track. */
export function getWorkdayApplyUrl(jobId: string): string {
  return `https://www.myworkdayjobs.com/en-US/Takeda?job=${encodeURIComponent(jobId)}`;
}

export function getJobEyebrow(job: JobListing): string {
  return [job.careerArea, job.location, job.workMode].filter(Boolean).join(' · ');
}

const CAREER_AREA_BLURBS: Record<string, { about: string; responsibilities: string }> = {
  'Research & Development': {
    about:
      'Join a global R&D organization advancing innovative medicines for patients with high unmet need. You will collaborate across scientific disciplines in an environment that values curiosity, rigor, and purpose.',
    responsibilities:
      'Design and execute study or research activities, partner with cross-functional teams, document findings to quality standards, and contribute to development plans that move therapies closer to patients.',
  },
  'Manufacturing & Supply': {
    about:
      'Help deliver life-changing therapies reliably and safely through world-class manufacturing and supply operations. This role sits at the intersection of quality, compliance, and operational excellence.',
    responsibilities:
      'Support production or quality processes, follow GMP and site procedures, identify continuous-improvement opportunities, and collaborate with operations partners to meet patient supply commitments.',
  },
  Commercial: {
    about:
      'Shape how Takeda brings therapies to the people who need them. Commercial roles blend brand strategy, customer insight, and cross-functional partnership in a values-driven culture.',
    responsibilities:
      'Drive brand or field medical priorities, translate insights into action, partner with medical and market access teams, and represent Takeda with integrity in every customer interaction.',
  },
  'Corporate Functions': {
    about:
      'Enable Takeda’s people and business through high-impact corporate roles. You will help build the systems, talent, and ways of working that sustain our purpose globally.',
    responsibilities:
      'Advise stakeholders, deliver programs that scale, navigate matrix environments, and uphold compliance and people-first practices across markets.',
  },
  'Data, Digital & Technology': {
    about:
      'Build digital products and data capabilities that accelerate science, operations, and the candidate experience. Healthcare background is welcome but not always required—curiosity and craft are.',
    responsibilities:
      'Deliver reliable software or analytics solutions, collaborate with product and business partners, uphold security and quality standards, and iterate based on real user needs.',
  },
  BioLife: {
    about:
      'Support BioLife plasma operations that are essential to patients who rely on plasma-derived therapies. These roles combine operational excellence with a strong patient-and-donor focus.',
    responsibilities:
      'Lead or support center operations, ensure a safe and welcoming donor experience, meet quality and compliance requirements, and develop teams that deliver every day.',
  },
};

export function getJobDescriptionHtml(job: JobListing): string {
  const blurb =
    CAREER_AREA_BLURBS[job.careerArea] ??
    CAREER_AREA_BLURBS['Corporate Functions'];
  const match = job.matchReason
    ? `<p><strong>Why this role may fit you:</strong> ${job.matchReason}</p>`
    : '';

  return [
    `<h2>About the role</h2>`,
    `<p>${blurb.about}</p>`,
    match,
    `<h2>What you will do</h2>`,
    `<p>${blurb.responsibilities}</p>`,
    `<p><strong>Location:</strong> ${job.location} · <strong>Work mode:</strong> ${job.workMode ?? 'Flexible'} · <strong>Posted:</strong> ${job.postedDate}</p>`,
    `<p>Ready to take the next step? Use <strong>Apply now</strong> to continue into Workday and complete your application.</p>`,
  ].join('');
}

/** Default board when no demo persona is selected. */
export const DEFAULT_JOB_BOARD: PersonaJobBoard = {
  headline: 'Search jobs',
  intro:
    'Find roles across R&D, Manufacturing, Commercial, and every team in between—and take the next step toward a career that improves healthcare around the globe.',
  jobs: [
    {
      id: 'job-001',
      title: 'Senior Scientist, Immunology',
      location: 'Cambridge, MA',
      careerArea: 'Research & Development',
      postedDate: 'Mar 12, 2026',
      workMode: 'On-site',
    },
    {
      id: 'job-002',
      title: 'Manufacturing Associate, Plasma Operations',
      location: 'Social Circle, GA',
      careerArea: 'Manufacturing & Supply',
      postedDate: 'Mar 10, 2026',
      workMode: 'On-site',
    },
    {
      id: 'job-003',
      title: 'Brand Manager, US Commercial',
      location: 'Lexington, MA',
      careerArea: 'Commercial',
      postedDate: 'Mar 8, 2026',
      workMode: 'Hybrid',
    },
    {
      id: 'job-004',
      title: 'HR Business Partner',
      location: 'Zurich, Switzerland',
      careerArea: 'Corporate Functions',
      postedDate: 'Mar 5, 2026',
      workMode: 'Hybrid',
    },
    {
      id: 'job-005',
      title: 'Software Engineer, Digital Health Platforms',
      location: 'Boston, MA',
      careerArea: 'Data, Digital & Technology',
      postedDate: 'Mar 3, 2026',
      workMode: 'Hybrid',
    },
    {
      id: 'job-006',
      title: 'Plasma Center Manager',
      location: 'Austin, TX',
      careerArea: 'BioLife',
      postedDate: 'Feb 28, 2026',
      workMode: 'On-site',
    },
    {
      id: 'job-007',
      title: 'Clinical Research Associate',
      location: 'Tokyo, Japan',
      careerArea: 'Research & Development',
      postedDate: 'Feb 25, 2026',
      workMode: 'On-site',
    },
    {
      id: 'job-008',
      title: 'Quality Assurance Specialist',
      location: 'Lessines, Belgium',
      careerArea: 'Manufacturing & Supply',
      postedDate: 'Feb 22, 2026',
      workMode: 'On-site',
    },
    {
      id: 'job-009',
      title: 'Medical Science Liaison',
      location: 'Chicago, IL',
      careerArea: 'Commercial',
      postedDate: 'Feb 18, 2026',
      workMode: 'Hybrid',
    },
    {
      id: 'job-010',
      title: 'Data Analyst, Global Supply Chain',
      location: 'Singapore',
      careerArea: 'Data, Digital & Technology',
      postedDate: 'Feb 14, 2026',
      workMode: 'Hybrid',
    },
  ],
};

/** Persona-specific catalogs — listings change with the header demo Login switcher. */
export const JOBS_BY_PERSONA: Record<TakedaTalentPersona, PersonaJobBoard> = {
  'Recent Graduate': {
    headline: 'Early-career roles for you',
    intro:
      'Recommended openings for recent graduates—associate, analyst, and rotational-ready roles to start your career at Takeda.',
    jobs: [
      {
        id: 'grad-001',
        title: 'Clinical Research Associate',
        location: 'Tokyo, Japan',
        careerArea: 'Research & Development',
        postedDate: 'Mar 14, 2026',
        workMode: 'On-site',
        matchReason: 'Strong match for early-career science backgrounds',
      },
      {
        id: 'grad-002',
        title: 'Manufacturing Associate, Plasma Operations',
        location: 'Social Circle, GA',
        careerArea: 'Manufacturing & Supply',
        postedDate: 'Mar 12, 2026',
        workMode: 'On-site',
        matchReason: 'Entry pathway into Manufacturing & Supply',
      },
      {
        id: 'grad-003',
        title: 'Data Analyst, Global Supply Chain',
        location: 'Singapore',
        careerArea: 'Data, Digital & Technology',
        postedDate: 'Mar 10, 2026',
        workMode: 'Hybrid',
        matchReason: 'Open to new grads with analytics coursework',
      },
      {
        id: 'grad-004',
        title: 'Quality Assurance Specialist',
        location: 'Lessines, Belgium',
        careerArea: 'Manufacturing & Supply',
        postedDate: 'Mar 8, 2026',
        workMode: 'On-site',
        matchReason: 'Early-career QA track with training support',
      },
      {
        id: 'grad-005',
        title: 'Associate Brand Coordinator, US Commercial',
        location: 'Lexington, MA',
        careerArea: 'Corporate Functions',
        postedDate: 'Mar 5, 2026',
        workMode: 'Hybrid',
        matchReason: 'Rotational-friendly commercial exposure',
      },
      {
        id: 'grad-006',
        title: 'BioLife Center Associate',
        location: 'Austin, TX',
        careerArea: 'BioLife',
        postedDate: 'Mar 2, 2026',
        workMode: 'On-site',
        matchReason: 'Hands-on patient-facing operations role',
      },
    ],
  },
  'Experienced Professional': {
    headline: 'Roles matched to your experience',
    intro:
      'Senior and specialized openings across R&D, Commercial, and leadership tracks—curated for experienced professionals.',
    jobs: [
      {
        id: 'exp-001',
        title: 'Senior Scientist, Immunology',
        location: 'Cambridge, MA',
        careerArea: 'Research & Development',
        postedDate: 'Mar 12, 2026',
        workMode: 'On-site',
        matchReason: 'Requires deep scientific expertise',
      },
      {
        id: 'exp-002',
        title: 'Brand Manager, US Commercial',
        location: 'Lexington, MA',
        careerArea: 'Commercial',
        postedDate: 'Mar 8, 2026',
        workMode: 'Hybrid',
        matchReason: 'Aligned with mid-to-senior commercial experience',
      },
      {
        id: 'exp-003',
        title: 'Medical Science Liaison',
        location: 'Chicago, IL',
        careerArea: 'Commercial',
        postedDate: 'Feb 18, 2026',
        workMode: 'Hybrid',
        matchReason: 'Field medical role for experienced clinicians/scientists',
      },
      {
        id: 'exp-004',
        title: 'Plasma Center Manager',
        location: 'Austin, TX',
        careerArea: 'BioLife',
        postedDate: 'Feb 28, 2026',
        workMode: 'On-site',
        matchReason: 'People-leadership and operations experience preferred',
      },
      {
        id: 'exp005',
        title: 'HR Business Partner',
        location: 'Zurich, Switzerland',
        careerArea: 'Corporate Functions',
        postedDate: 'Mar 5, 2026',
        workMode: 'Hybrid',
        matchReason: 'Seasoned people-partner profile',
      },
      {
        id: 'exp-006',
        title: 'Principal Software Engineer, Digital Health',
        location: 'Boston, MA',
        careerArea: 'Data, Digital & Technology',
        postedDate: 'Mar 1, 2026',
        workMode: 'Hybrid',
        matchReason: 'Senior IC track in digital platforms',
      },
    ],
  },
  'Career Changer': {
    headline: 'Pathways that value transferable skills',
    intro:
      'Pivot-friendly roles where adjacent industry experience counts—digital, analytics, people, and operations pathways into healthcare.',
    jobs: [
      {
        id: 'chg-001',
        title: 'Software Engineer, Digital Health Platforms',
        location: 'Boston, MA',
        careerArea: 'Data, Digital & Technology',
        postedDate: 'Mar 3, 2026',
        workMode: 'Hybrid',
        matchReason: 'Tech backgrounds welcome—healthcare experience not required',
      },
      {
        id: 'chg-002',
        title: 'Data Analyst, Global Supply Chain',
        location: 'Singapore',
        careerArea: 'Data, Digital & Technology',
        postedDate: 'Feb 14, 2026',
        workMode: 'Hybrid',
        matchReason: 'Strong fit for analytics careers entering life sciences',
      },
      {
        id: 'chg-003',
        title: 'HR Business Partner',
        location: 'Zurich, Switzerland',
        careerArea: 'Corporate Functions',
        postedDate: 'Mar 5, 2026',
        workMode: 'Hybrid',
        matchReason: 'People ops experience transfers across industries',
      },
      {
        id: 'chg-004',
        title: 'Quality Assurance Specialist',
        location: 'Lessines, Belgium',
        careerArea: 'Manufacturing & Supply',
        postedDate: 'Feb 22, 2026',
        workMode: 'On-site',
        matchReason: 'Process/compliance skills map well from other regulated industries',
      },
      {
        id: 'chg-005',
        title: 'Customer Experience Lead, BioLife',
        location: 'Austin, TX',
        careerArea: 'BioLife',
        postedDate: 'Mar 6, 2026',
        workMode: 'On-site',
        matchReason: 'Service and CX backgrounds encouraged',
      },
      {
        id: 'chg-006',
        title: 'Project Manager, Digital Transformation',
        location: 'Cambridge, MA',
        careerArea: 'Data, Digital & Technology',
        postedDate: 'Mar 9, 2026',
        workMode: 'Hybrid',
        matchReason: 'PMO and change-management skills are portable',
      },
    ],
  },
  'Remote Job Seeker': {
    headline: 'Remote & hybrid opportunities',
    intro:
      'Roles with remote or hybrid flexibility across Takeda’s global footprint—filtered for location-flexible job seekers.',
    jobs: [
      {
        id: 'rem-001',
        title: 'Software Engineer, Digital Health Platforms',
        location: 'Boston, MA (Hybrid / remote-eligible)',
        careerArea: 'Data, Digital & Technology',
        postedDate: 'Mar 3, 2026',
        workMode: 'Hybrid',
        matchReason: 'Hybrid with remote-eligible collaboration model',
      },
      {
        id: 'rem-002',
        title: 'Data Analyst, Global Supply Chain',
        location: 'Singapore (Hybrid)',
        careerArea: 'Data, Digital & Technology',
        postedDate: 'Feb 14, 2026',
        workMode: 'Hybrid',
        matchReason: 'Flexible schedule across time zones',
      },
      {
        id: 'rem-003',
        title: 'Brand Manager, US Commercial',
        location: 'Lexington, MA (Hybrid)',
        careerArea: 'Commercial',
        postedDate: 'Mar 8, 2026',
        workMode: 'Hybrid',
        matchReason: '2–3 days on-site; remainder remote',
      },
      {
        id: 'rem-004',
        title: 'HR Business Partner',
        location: 'Zurich, Switzerland (Hybrid)',
        careerArea: 'Corporate Functions',
        postedDate: 'Mar 5, 2026',
        workMode: 'Hybrid',
        matchReason: 'Regional hybrid people-partner role',
      },
      {
        id: 'rem-005',
        title: 'Medical Science Liaison',
        location: 'Chicago, IL (Field / hybrid)',
        careerArea: 'Commercial',
        postedDate: 'Feb 18, 2026',
        workMode: 'Hybrid',
        matchReason: 'Territory-based with home-office base',
      },
      {
        id: 'rem-006',
        title: 'Remote Clinical Documentation Specialist',
        location: 'United States (Remote)',
        careerArea: 'Research & Development',
        postedDate: 'Mar 11, 2026',
        workMode: 'Remote',
        matchReason: 'Fully remote documentation support role',
      },
    ],
  },
};

function collectAllJobs(): JobListing[] {
  const byId = new Map<string, JobListing>();
  for (const job of DEFAULT_JOB_BOARD.jobs) {
    byId.set(job.id, job);
  }
  for (const board of Object.values(JOBS_BY_PERSONA)) {
    for (const job of board.jobs) {
      byId.set(job.id, job);
    }
  }
  return [...byId.values()];
}

export const ALL_JOBS: JobListing[] = collectAllJobs();

export const JOBS_BY_ID: Record<string, JobListing> = Object.fromEntries(
  ALL_JOBS.map((job) => [job.id, job])
);

export function getJobById(jobId: string): JobListing | undefined {
  return JOBS_BY_ID[jobId];
}
