import { resolveAppTheme, isTakedaTheme, isRailPortalTheme } from '@/lib/app-theme';
import { getDemoPersonaOptions, GATX_DEMO_PERSONAS } from '@/lib/demo-personas';
import { TAKEDA_DEMO_PERSONAS } from '@/lib/takeda-talent-personas';

describe('app-theme', () => {
  const original = process.env.NEXT_PUBLIC_APP_THEME;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_APP_THEME;
    } else {
      process.env.NEXT_PUBLIC_APP_THEME = original;
    }
  });

  it('defaults to takeda when unset', () => {
    delete process.env.NEXT_PUBLIC_APP_THEME;
    expect(resolveAppTheme()).toBe('takeda');
    expect(isTakedaTheme()).toBe(true);
  });

  it('resolves gatx when configured', () => {
    process.env.NEXT_PUBLIC_APP_THEME = 'gatx';
    expect(resolveAppTheme()).toBe('gatx');
    expect(isRailPortalTheme()).toBe(true);
  });
});

describe('getDemoPersonaOptions', () => {
  const original = process.env.NEXT_PUBLIC_APP_THEME;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_APP_THEME;
    } else {
      process.env.NEXT_PUBLIC_APP_THEME = original;
    }
  });

  it('returns Takeda personas for takeda theme', () => {
    process.env.NEXT_PUBLIC_APP_THEME = 'takeda';
    expect(getDemoPersonaOptions()).toEqual([...TAKEDA_DEMO_PERSONAS]);
  });

  it('returns GATX personas for gatx theme', () => {
    process.env.NEXT_PUBLIC_APP_THEME = 'gatx';
    expect(getDemoPersonaOptions()).toEqual([...GATX_DEMO_PERSONAS]);
  });
});
