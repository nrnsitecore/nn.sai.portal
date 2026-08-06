'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';
import {
  clearSavedJobs,
  getSavedJobs,
  removeJob,
  TAKEDA_SAVED_JOBS_CHANGE_EVENT,
  type SavedJob,
} from '@/lib/takeda-saved-jobs';
import { getJobDetailPath } from '@/lib/takeda-jobs-catalog';
import {
  isTakedaTalentPersona,
  type TakedaTalentPersona,
} from '@/lib/takeda-talent-personas';
import { TAKEDA_TALENT_DASHBOARDS } from '@/lib/takeda-talent-portal';

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields?: unknown;
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

function useSavedJobs(persona: TakedaTalentPersona | null): SavedJob[] {
  const [jobs, setJobs] = useState<SavedJob[]>([]);

  useEffect(() => {
    const sync = () => setJobs(getSavedJobs(persona));
    sync();
    window.addEventListener(TAKEDA_SAVED_JOBS_CHANGE_EVENT, sync);
    return () => window.removeEventListener(TAKEDA_SAVED_JOBS_CHANGE_EVENT, sync);
  }, [persona]);

  return jobs;
}

const ProfileLoginGate = () => (
  <div className="border-border bg-background mx-auto max-w-xl border px-8 py-12 text-center shadow-sm">
    <span aria-hidden className="bg-primary mx-auto mb-6 block h-1 w-12" />
    <h2 className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight">
      Sign in to your job seeker profile
    </h2>
    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
      Choose a demo persona from the header Login menu to open a personalized profile and review
      jobs you saved from Job Search.
    </p>
    <p className="text-muted-foreground mt-6 text-xs uppercase tracking-[0.08em]">
      Demo only — not a real authentication flow
    </p>
  </div>
);

const JobSeekerProfileDashboard = ({
  persona,
  savedJobs,
}: {
  persona: TakedaTalentPersona;
  savedJobs: SavedJob[];
}) => {
  const profile = TAKEDA_TALENT_DASHBOARDS[persona];
  const savedCount = savedJobs.length;

  const handleRemove = (jobId: string, title: string) => {
    removeJob(persona, jobId);
    toast.message('Removed from profile', { description: title });
  };

  const handleClear = () => {
    clearSavedJobs(persona);
    toast.message('Cleared saved jobs', { description: 'Your profile cart is empty.' });
  };

  const handleApply = () => {
    if (savedCount === 0) {
      toast.message('Nothing to submit', {
        description: 'Save jobs from Job Search first.',
      });
      return;
    }
    toast.message('Applications submitted (demo)', {
      description: `${savedCount} ${savedCount === 1 ? 'role' : 'roles'} queued for ${persona}.`,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="border-border bg-background border px-6 py-6 shadow-sm lg:px-8">
        <p className="font-(family-name:--font-accent) text-primary text-xs font-semibold uppercase tracking-[0.1em]">
          {profile.role}
        </p>
        <h1 className="takeda-heading-bar font-(family-name:--font-heading) mt-3 text-3xl font-bold tracking-tight lg:text-4xl">
          {profile.name}&apos;s job seeker profile
        </h1>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
          {profile.welcomeLead}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="border-border bg-background border p-5 shadow-sm">
          <p className="font-(family-name:--font-accent) text-muted-foreground text-xs font-semibold uppercase tracking-[0.08em]">
            Saved jobs
          </p>
          <p className="font-(family-name:--font-heading) mt-2 text-3xl font-bold tracking-tight">
            {savedCount}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">In your profile cart</p>
        </article>
        <article className="border-border bg-background border p-5 shadow-sm">
          <p className="font-(family-name:--font-accent) text-muted-foreground text-xs font-semibold uppercase tracking-[0.08em]">
            Ready to apply
          </p>
          <p className="font-(family-name:--font-heading) mt-2 text-3xl font-bold tracking-tight">
            {savedCount}
          </p>
        </article>
      </div>

      <section className="border-border bg-background border shadow-sm" aria-label="Saved jobs cart">
        <div className="border-border flex flex-col gap-2 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-(family-name:--font-heading) text-xl font-semibold tracking-tight">
            Saved jobs
          </h2>
          <p className="font-(family-name:--font-accent) text-muted-foreground text-xs font-semibold uppercase tracking-[0.08em]">
            Checkout · {savedCount} {savedCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        {savedCount === 0 ? (
          <div className="px-6 py-12 text-center">
            <Briefcase className="text-muted-foreground mx-auto mb-4 h-8 w-8" aria-hidden />
            <p className="font-(family-name:--font-heading) text-lg font-semibold tracking-tight">
              No saved jobs yet
            </p>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-relaxed">
              Open the Job Search page, pick roles that fit your persona, and tap{' '}
              <span className="font-semibold text-foreground">Save job</span> to add them here.
            </p>
          </div>
        ) : (
          <ul className="divide-border divide-y">
            {savedJobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                data-saved-job-id={job.id}
              >
                <div>
                  {job.matchReason && (
                    <p className="font-(family-name:--font-accent) text-primary mb-1 text-xs font-semibold uppercase tracking-[0.08em]">
                      Recommended · {job.matchReason}
                    </p>
                  )}
                  <h3 className="font-(family-name:--font-heading) text-lg font-semibold tracking-tight">
                    <Link
                      href={getJobDetailPath(job.id)}
                      className="hover:text-primary transition-colors"
                      prefetch={false}
                      data-job-detail-link={job.id}
                    >
                      {job.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
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
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline inline-flex items-center justify-center gap-2 self-start sm:self-center"
                  onClick={() => handleRemove(job.id, job.title)}
                  data-remove-job-id={job.id}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-border bg-secondary/40 flex flex-col gap-3 border-t px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="btn btn-outline inline-flex items-center justify-center"
            onClick={handleClear}
            disabled={savedCount === 0}
            data-action="clear-saved"
          >
            Clear saved
          </button>
          <button
            type="button"
            className="btn btn-primary inline-flex items-center justify-center gap-2"
            onClick={handleApply}
            data-action="submit-applications"
          >
            <Briefcase className="h-4 w-4" aria-hidden />
            {savedCount === 0
              ? 'Submit applications'
              : `Submit ${savedCount} ${savedCount === 1 ? 'application' : 'applications'}`}
          </button>
        </div>
      </section>
    </div>
  );
};

export const JobSeekerProfile = (props: PageHeaderSTProps) => {
  const persona = useActiveTakedaTalentPersona();
  const savedJobs = useSavedJobs(persona);

  return (
    <section
      className={cn('takeda-band text-foreground w-full py-10 lg:py-14', props?.params?.styles)}
      data-class-change
      data-component="HeroST"
      data-variant="JobSeekerProfile"
      data-persona={persona || 'none'}
    >
      <div className="container mx-auto px-4">
        {persona ? (
          <JobSeekerProfileDashboard key={persona} persona={persona} savedJobs={savedJobs} />
        ) : (
          <ProfileLoginGate />
        )}
      </div>
    </section>
  );
};
