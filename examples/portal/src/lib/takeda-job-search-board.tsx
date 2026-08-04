'use client';

import { useState, type FormEvent } from 'react';
import { MapPin, Search } from 'lucide-react';

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields?: unknown;
};

type HardcodedJob = {
  id: string;
  title: string;
  location: string;
  careerArea: string;
  postedDate: string;
};

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

/** Demo-only job listings — not wired to Sitecore or a real ATS. */
const HARDCODED_JOBS: HardcodedJob[] = [
  {
    id: 'job-001',
    title: 'Senior Scientist, Immunology',
    location: 'Cambridge, MA',
    careerArea: 'Research & Development',
    postedDate: 'Mar 12, 2026',
  },
  {
    id: 'job-002',
    title: 'Manufacturing Associate, Plasma Operations',
    location: 'Social Circle, GA',
    careerArea: 'Manufacturing & Supply',
    postedDate: 'Mar 10, 2026',
  },
  {
    id: 'job-003',
    title: 'Brand Manager, US Commercial',
    location: 'Lexington, MA',
    careerArea: 'Commercial',
    postedDate: 'Mar 8, 2026',
  },
  {
    id: 'job-004',
    title: 'HR Business Partner',
    location: 'Zurich, Switzerland',
    careerArea: 'Corporate Functions',
    postedDate: 'Mar 5, 2026',
  },
  {
    id: 'job-005',
    title: 'Software Engineer, Digital Health Platforms',
    location: 'Boston, MA',
    careerArea: 'Data, Digital & Technology',
    postedDate: 'Mar 3, 2026',
  },
  {
    id: 'job-006',
    title: 'Plasma Center Manager',
    location: 'Austin, TX',
    careerArea: 'BioLife',
    postedDate: 'Feb 28, 2026',
  },
  {
    id: 'job-007',
    title: 'Clinical Research Associate',
    location: 'Tokyo, Japan',
    careerArea: 'Research & Development',
    postedDate: 'Feb 25, 2026',
  },
  {
    id: 'job-008',
    title: 'Quality Assurance Specialist',
    location: 'Lessines, Belgium',
    careerArea: 'Manufacturing & Supply',
    postedDate: 'Feb 22, 2026',
  },
  {
    id: 'job-009',
    title: 'Medical Science Liaison',
    location: 'Chicago, IL',
    careerArea: 'Commercial',
    postedDate: 'Feb 18, 2026',
  },
  {
    id: 'job-010',
    title: 'Data Analyst, Global Supply Chain',
    location: 'Singapore',
    careerArea: 'Data, Digital & Technology',
    postedDate: 'Feb 14, 2026',
  },
];

const jobBoardFieldClass =
  'border-border bg-background text-foreground placeholder:text-muted-foreground w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

const jobBoardLabelClass =
  'font-(family-name:--font-accent) mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-foreground';

export const JobSearch = (props: PageHeaderSTProps) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState<string>(JOB_BOARD_RADIUS_OPTIONS[2]);
  const [careerArea, setCareerArea] = useState<string>(JOB_BOARD_CAREER_AREAS[0]);
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    location: '',
    careerArea: JOB_BOARD_CAREER_AREAS[0] as string,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({
      keyword: keyword.trim().toLowerCase(),
      location: location.trim().toLowerCase(),
      careerArea,
    });
  };

  const filteredJobs = HARDCODED_JOBS.filter((job) => {
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
  });

  return (
    <section
      className={`bg-background ${props?.params?.styles || ''}`}
      data-class-change
      data-variant="JobSearch"
    >
      <div className="takeda-band border-border border-b px-4 py-12 lg:py-16">
        <div className="container mx-auto max-w-5xl">
          <h1 className="takeda-heading-bar font-(family-name:--font-heading) text-3xl font-bold tracking-tight lg:text-4xl">
            Search jobs
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
            Find roles across R&D, Manufacturing, Commercial, and every team in between—and take the
            next step toward a career that improves healthcare around the globe.
          </p>
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
                        <span aria-hidden>·</span>
                        <span>Posted {job.postedDate}</span>
                      </p>
                    </div>
                    <a href="/" className="btn btn-primary shrink-0 self-start sm:self-center">
                      View job
                    </a>
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
