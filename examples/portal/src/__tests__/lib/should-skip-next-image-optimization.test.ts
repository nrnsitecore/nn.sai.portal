import { shouldSkipNextImageOptimization } from '@/lib/should-skip-next-image-optimization';

describe('shouldSkipNextImageOptimization', () => {
  it('skips Content Hub public links on sandbox tenants', () => {
    expect(
      shouldSkipNextImageOptimization(
        'https://covista.sitecoresandbox.cloud/api/public/content/b201e030fbb04a13b28fbb312b19f6e8?v=08f8bc83'
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
