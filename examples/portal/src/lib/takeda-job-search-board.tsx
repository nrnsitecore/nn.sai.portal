'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';
import {
  getSavedJobs,
  toggleSavedJob,
  TAKEDA_SAVED_JOBS_CHANGE_EVENT,
} from '@/lib/takeda-saved-jobs';
import {
  DEFAULT_JOB_BOARD,
  JOBS_BY_PERSONA,
  getJobDetailPath,
  type JobListing,
} from '@/lib/takeda-jobs-catalog';
import {
  isTakedaTalentPersona,
  type TakedaTalentPersona,
} from '@/lib/takeda-talent-personas';

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields?: unknown;
};

export type HardcodedJob = JobListing;

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
                      <Link
                        href={getJobDetailPath(job.id)}
                        className="btn btn-primary inline-flex items-center justify-center"
                        prefetch={false}
                        data-job-detail-link={job.id}
                      >
                        View job
                      </Link>
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
