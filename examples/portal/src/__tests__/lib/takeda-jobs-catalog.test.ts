import {
  ALL_JOBS,
  getJobById,
  getJobDescriptionHtml,
  getJobDetailPath,
  getJobEyebrow,
  getWorkdayApplyUrl,
} from '@/lib/takeda-jobs-catalog';

describe('takeda-jobs-catalog', () => {
  it('includes all 34 unique job ids', () => {
    expect(ALL_JOBS).toHaveLength(34);
    const ids = ALL_JOBS.map((job) => job.id);
    expect(new Set(ids).size).toBe(34);
    expect(ids).toEqual(
      expect.arrayContaining(['job-001', 'grad-005', 'exp005', 'exp-006', 'chg-006', 'rem-006'])
    );
  });

  it('builds detail paths and Workday apply URLs from job id', () => {
    expect(getJobDetailPath('job-001')).toBe('/Job-Search/job-001');
    expect(getJobDetailPath('grad-001')).toBe('/Job-Search/grad-001');
    expect(getWorkdayApplyUrl('job-001')).toBe(
      'https://www.myworkdayjobs.com/en-US/Takeda?job=job-001'
    );
    expect(getWorkdayApplyUrl('rem-006')).toBe(
      'https://www.myworkdayjobs.com/en-US/Takeda?job=rem-006'
    );
  });

  it('builds eyebrow and description HTML for a known job', () => {
    const job = getJobById('job-001');
    expect(job).toBeDefined();
    expect(getJobEyebrow(job!)).toBe('Research & Development · Cambridge, MA · On-site');
    const html = getJobDescriptionHtml(job!);
    expect(html).toContain('About the role');
    expect(html).toContain('Apply now');
    expect(html).toContain('Cambridge, MA');
  });
});
