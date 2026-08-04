import {
  clearSavedJobs,
  getSavedJobs,
  isJobSaved,
  removeJob,
  saveJob,
  TAKEDA_SAVED_JOBS_STORAGE_KEY,
  toggleSavedJob,
} from '@/lib/takeda-saved-jobs';

const sampleJob = {
  id: 'job-1',
  title: 'Data Analyst, Global Supply Chain',
  location: 'Singapore',
  careerArea: 'Data, Digital & Technology',
  postedDate: 'Mar 1, 2026',
  workMode: 'Hybrid' as const,
};

describe('takeda-saved-jobs', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and reads jobs per persona bucket', () => {
    saveJob('Recent Graduate', sampleJob);
    expect(getSavedJobs('Recent Graduate')).toEqual([sampleJob]);
    expect(getSavedJobs('Career Changer')).toEqual([]);
    expect(isJobSaved('Recent Graduate', 'job-1')).toBe(true);
  });

  it('toggles save and remove', () => {
    expect(toggleSavedJob('Remote Job Seeker', sampleJob).saved).toBe(true);
    expect(toggleSavedJob('Remote Job Seeker', sampleJob).saved).toBe(false);
    expect(getSavedJobs('Remote Job Seeker')).toEqual([]);
  });

  it('clears a persona bucket', () => {
    saveJob('default', sampleJob);
    saveJob('default', { ...sampleJob, id: 'job-2', title: 'Other' });
    clearSavedJobs('default');
    expect(getSavedJobs('default')).toEqual([]);
    expect(window.localStorage.getItem(TAKEDA_SAVED_JOBS_STORAGE_KEY)).toContain('"default":[]');
  });

  it('removeJob is idempotent for missing ids', () => {
    saveJob('Experienced Professional', sampleJob);
    removeJob('Experienced Professional', 'missing');
    expect(getSavedJobs('Experienced Professional')).toHaveLength(1);
  });
});
