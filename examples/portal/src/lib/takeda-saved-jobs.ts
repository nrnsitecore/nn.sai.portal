import type { TakedaTalentPersona } from '@/lib/takeda-talent-personas';

export const TAKEDA_SAVED_JOBS_STORAGE_KEY = 'takeda-saved-jobs';
export const TAKEDA_SAVED_JOBS_CHANGE_EVENT = 'takeda-saved-jobs-change';

export type SavedJobsBucketKey = TakedaTalentPersona | 'default';

export type SavedJob = {
  id: string;
  title: string;
  location: string;
  careerArea: string;
  postedDate: string;
  workMode?: 'On-site' | 'Hybrid' | 'Remote';
  matchReason?: string;
};

type SavedJobsStore = Partial<Record<SavedJobsBucketKey, SavedJob[]>>;

function readStore(): SavedJobsStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(TAKEDA_SAVED_JOBS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SavedJobsStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: SavedJobsStore): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TAKEDA_SAVED_JOBS_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(
    new CustomEvent(TAKEDA_SAVED_JOBS_CHANGE_EVENT, { detail: { store } })
  );
}

export function resolveSavedJobsBucket(
  persona: TakedaTalentPersona | null | undefined
): SavedJobsBucketKey {
  return persona ?? 'default';
}

export function getSavedJobs(persona: TakedaTalentPersona | null | undefined): SavedJob[] {
  const key = resolveSavedJobsBucket(persona);
  return [...(readStore()[key] ?? [])];
}

export function isJobSaved(
  persona: TakedaTalentPersona | null | undefined,
  jobId: string
): boolean {
  return getSavedJobs(persona).some((job) => job.id === jobId);
}

export function saveJob(
  persona: TakedaTalentPersona | null | undefined,
  job: SavedJob
): SavedJob[] {
  const key = resolveSavedJobsBucket(persona);
  const store = readStore();
  const current = store[key] ?? [];
  if (current.some((item) => item.id === job.id)) {
    return [...current];
  }
  const next = [...current, job];
  writeStore({ ...store, [key]: next });
  return next;
}

export function removeJob(
  persona: TakedaTalentPersona | null | undefined,
  jobId: string
): SavedJob[] {
  const key = resolveSavedJobsBucket(persona);
  const store = readStore();
  const next = (store[key] ?? []).filter((job) => job.id !== jobId);
  writeStore({ ...store, [key]: next });
  return next;
}

export function clearSavedJobs(persona: TakedaTalentPersona | null | undefined): void {
  const key = resolveSavedJobsBucket(persona);
  const store = readStore();
  writeStore({ ...store, [key]: [] });
}

export function toggleSavedJob(
  persona: TakedaTalentPersona | null | undefined,
  job: SavedJob
): { saved: boolean; jobs: SavedJob[] } {
  if (isJobSaved(persona, job.id)) {
    return { saved: false, jobs: removeJob(persona, job.id) };
  }
  return { saved: true, jobs: saveJob(persona, job) };
}
