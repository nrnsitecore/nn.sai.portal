import { shouldSkipNextImageOptimization } from '@/lib/should-skip-next-image-optimization';

describe('shouldSkipNextImageOptimization', () => {
  it('skips Content Hub public links on sandbox tenants', () => {
    expect(
      shouldSkipNextImageOptimization(
        'https://esl.sitecoresandbox.cloud/api/public/content/d5e8c9c4ab584718ab28bf2e432959bc?v=e1551ce9'
      )
    ).toBe(true);
  });

  it('skips sitecorecontenthub.cloud hosts', () => {
    expect(
      shouldSkipNextImageOptimization(
        'https://example.sitecorecontenthub.cloud/api/public/content/abc'
      )
    ).toBe(true);
  });

  it('does not skip Experience Edge media', () => {
    expect(
      shouldSkipNextImageOptimization('https://edge.sitecorecloud.io/tenant/media/foo.jpg')
    ).toBe(false);
  });

  it('handles empty values', () => {
    expect(shouldSkipNextImageOptimization(undefined)).toBe(false);
    expect(shouldSkipNextImageOptimization('')).toBe(false);
  });
});
