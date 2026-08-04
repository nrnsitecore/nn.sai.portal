'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Bookmark, BookmarkCheck, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';
import {
  getSavedJobs,
  toggleSavedJob,
  TAKEDA_SAVED_JOBS_CHANGE_EVENT,
  type SavedJob,
} from '@/lib/takeda-saved-jobs';
import {
  isTakedaTalentPersona,
  type TakedaTalentPersona,
} from '@/lib/takeda-talent-personas';

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields?: unknown;
};

export type HardcodedJob = SavedJob;

const JOB_BOARD_CAREER_AREAS = [
  'All career areas',
  'Research & Development',
  'Manufacturing & Supply',
  'Commercial',
  'Corporate Functions',
  'Data, Digital & Technology',
  'BioLife',
] as const;

const JOB_BOARD_RADIUS_OPTIONS = ['5 miles', '15 miles', '25 miles', '35 miles', '50 miles'] as const;

type PersonaJobBoard = {
  headline: string;
  intro: string;
  jobs: HardcodedJob[];
};

/** Default board when no demo persona is selected. */
const DEFAULT_JOB_BOARD: PersonaJobBoard = {
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
const JOBS_BY_PERSONA: Record<TakedaTalentPersona, PersonaJobBoard> = {
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
        id: 'exp-005',
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

function useActiveTakedaTalentPersona(): TakedaTalentPersona | null {
  const [persona, setPersona] = useState<TakedaTalentPersona | null>(null);

  useEffect(() => {
    const read = () => {
      const stored = window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '';
      setPersona(isTakedaTalentPersona(stored) ? stored : null);
    };

    read();
    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, read);
    return () => window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, read);
  }, []);

  return persona;
}

const jobBoardFieldClass =
  'border-border bg-background text-foreground placeholder:text-muted-foreground w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

const jobBoardLabelClass =
  'font-(family-name:--font-accent) mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-foreground';

const emptyFilters = {
  keyword: '',
  location: '',
  careerArea: JOB_BOARD_CAREER_AREAS[0] as string,
};

export const JobSearch = (props: PageHeaderSTProps) => {
  const persona = useActiveTakedaTalentPersona();
  const board = persona ? JOBS_BY_PERSONA[persona] : DEFAULT_JOB_BOARD;

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState<string>(JOB_BOARD_RADIUS_OPTIONS[2]);
  const [careerArea, setCareerArea] = useState<string>(JOB_BOARD_CAREER_AREAS[0]);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  // When the demo persona changes, swap the catalog and clear filters so results feel personal.
  useEffect(() => {
    setKeyword('');
    setLocation('');
    setRadius(JOB_BOARD_RADIUS_OPTIONS[2]);
    setCareerArea(JOB_BOARD_CAREER_AREAS[0]);
    setAppliedFilters(emptyFilters);
  }, [persona]);

  useEffect(() => {
    const syncSaved = () => {
      setSavedIds(new Set(getSavedJobs(persona).map((job) => job.id)));
    };
    syncSaved();
    window.addEventListener(TAKEDA_SAVED_JOBS_CHANGE_EVENT, syncSaved);
    return () => window.removeEventListener(TAKEDA_SAVED_JOBS_CHANGE_EVENT, syncSaved);
  }, [persona]);

  const handleToggleSave = (job: HardcodedJob) => {
    const { saved } = toggleSavedJob(persona, job);
    toast.message(saved ? 'Job saved to your profile' : 'Job removed from your profile', {
      description: job.title,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({
      keyword: keyword.trim().toLowerCase(),
      location: location.trim().toLowerCase(),
      careerArea,
    });
  };

  const filteredJobs = useMemo(
    () =>
      board.jobs.filter((job) => {
        const matchesKeyword =
          !appliedFilters.keyword ||
          job.title.toLowerCase().includes(appliedFilters.keyword) ||
          job.careerArea.toLowerCase().includes(appliedFilters.keyword);
        const matchesLocation =
          !appliedFilters.location || job.location.toLowerCase().includes(appliedFilters.location);
        const matchesCareerArea =
          appliedFilters.careerArea === 'All career areas' ||
          job.careerArea === appliedFilters.careerArea;
        return matchesKeyword && matchesLocation && matchesCareerArea;
      }),
    [appliedFilters, board.jobs]
  );

  return (
    <section
      className={`bg-background ${props?.params?.styles || ''}`}
      data-class-change
      data-variant="JobSearch"
      data-persona={persona || 'default'}
    >
      <div className="takeda-band border-border border-b px-4 py-12 lg:py-16">
        <div className="container mx-auto max-w-5xl">
          {persona && (
            <p className="font-(family-name:--font-accent) text-primary mb-3 text-xs font-semibold uppercase tracking-[0.1em]">
              Personalized for {persona}
            </p>
          )}
          <h1 className="takeda-heading-bar font-(family-name:--font-heading) text-3xl font-bold tracking-tight lg:text-4xl">
            {board.headline}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
            {board.intro}
          </p>
          {!persona && (
            <p className="text-muted-foreground mt-3 text-sm">
              Tip: choose a demo persona from the header Login menu to see personalized job
              recommendations.
            </p>
          )}
        </div>
      </div>

      <div className="border-border border-b bg-background px-4 py-8">
        <div className="container mx-auto max-w-5xl">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end"
            aria-label="Job search filters"
          >
            <div className="lg:col-span-1">
              <label className={jobBoardLabelClass} htmlFor="job-board-keyword">
                Keyword
              </label>
              <input
                id="job-board-keyword"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Job title or skill"
                className={jobBoardFieldClass}
              />
            </div>
            <div>
              <label className={jobBoardLabelClass} htmlFor="job-board-location">
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  aria-hidden
                />
                <input
                  id="job-board-location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City or country"
                  className={`${jobBoardFieldClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={jobBoardLabelClass} htmlFor="job-board-radius">
                Radius
              </label>
              <select
                id="job-board-radius"
                value={radius}
                onChange={(event) => setRadius(event.target.value)}
                className={jobBoardFieldClass}
              >
                {JOB_BOARD_RADIUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={jobBoardLabelClass} htmlFor="job-board-career-area">
                Career area
              </label>
              <select
                id="job-board-career-area"
                value={careerArea}
                onChange={(event) => setCareerArea(event.target.value)}
                className={jobBoardFieldClass}
              >
                {JOB_BOARD_CAREER_AREAS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-primary inline-flex w-full items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" aria-hidden />
                Search jobs
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="px-4 py-10 lg:py-14">
        <div className="container mx-auto max-w-5xl">
          <p
            className="font-(family-name:--font-accent) text-muted-foreground mb-6 text-sm font-semibold uppercase tracking-[0.08em]"
            aria-live="polite"
          >
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
            {persona ? ` · ${persona}` : ''}
          </p>

          {filteredJobs.length === 0 ? (
            <div className="border-border bg-secondary text-secondary-foreground rounded-sm border px-6 py-12 text-center">
              <p className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
                No jobs match your search
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Try a different keyword, location, or career area.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {filteredJobs.map((job) => (
                <li key={job.id}>
                  <article className="border-border hover:border-primary flex flex-col gap-4 border bg-background p-6 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {job.matchReason && (
                        <p className="font-(family-name:--font-accent) text-primary mb-2 text-xs font-semibold uppercase tracking-[0.08em]">
                          Recommended · {job.matchReason}
                        </p>
                      )}
                      <h2 className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
                        {job.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" aria-hidden />
                          {job.location}
                        </span>
                        <span aria-hidden>·</span>
                        <span>{job.careerArea}</span>
                        {job.workMode && (
                          <>
                            <span aria-hidden>·</span>
                            <span>{job.workMode}</span>
                          </>
                        )}
                        <span aria-hidden>·</span>
                        <span>Posted {job.postedDate}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 self-start sm:self-center sm:flex-row">
                      <button
                        type="button"
                        className={
                          savedIds.has(job.id)
                            ? 'btn btn-secondary inline-flex items-center justify-center gap-2'
                            : 'btn btn-outline inline-flex items-center justify-center gap-2'
                        }
                        aria-pressed={savedIds.has(job.id)}
                        data-saved={savedIds.has(job.id) ? 'true' : 'false'}
                        data-job-id={job.id}
                        onClick={() => handleToggleSave(job)}
                      >
                        {savedIds.has(job.id) ? (
                          <BookmarkCheck className="h-4 w-4" aria-hidden />
                        ) : (
                          <Bookmark className="h-4 w-4" aria-hidden />
                        )}
                        {savedIds.has(job.id) ? 'Saved' : 'Save job'}
                      </button>
                      <a href="/" className="btn btn-primary inline-flex items-center justify-center">
                        View job
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
