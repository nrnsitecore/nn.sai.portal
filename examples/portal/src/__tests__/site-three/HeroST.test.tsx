/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  Default as HeroSTDefault,
  Right as HeroSTRight,
  Centered as HeroSTCentered,
  SplitScreen as HeroSTSplitScreen,
  Stacked as HeroSTStacked,
  JobSearch as HeroSTJobSearch,
  JobSeekerProfile as HeroSTJobSeekerProfile,
  Portal as HeroSTPortal,
  TalentPortal as HeroSTTalentPortal,
} from '@/components/site-three/HeroST';
import { getSavedJobs, TAKEDA_SAVED_JOBS_STORAGE_KEY } from '@/lib/takeda-saved-jobs';

// Mock useContainerOffsets hook
jest.mock('@/hooks/useContainerOffsets', () => ({
  useContainerOffsets: () => ({
    containerRef: { current: null },
    rightOffset: 0,
    leftOffset: 0,
  }),
}));

jest.mock('sonner', () => ({
  toast: { message: jest.fn() },
}));

jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Link: ({ field, children, className }: any) => (
    <a href={field?.value?.href || '#'} className={className}>
      {children || field?.value?.text || ''}
    </a>
  ),
}));

jest.mock('next/link', () => {
  return ({ children, href, className, prefetch, ...props }: any) => (
    <a href={href} className={className} data-prefetch={prefetch} {...props}>
      {children}
    </a>
  );
});

describe('HeroST', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      Eyebrow: {
        value: 'New Collection',
      },
      Title: {
        value: 'Premium Audio Experience',
      },
      Image1: {
        value: {
          src: '/images/hero-bg.jpg',
          alt: 'Hero background',
        },
      },
      Image2: {
        value: {
          src: '/images/hero-product.jpg',
          alt: 'Hero product',
        },
      },
      Link1: {
        value: {
          href: '/shop',
          text: 'Shop Now',
        },
      },
      Link2: {
        value: {
          href: '/learn-more',
          text: 'Learn More',
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders hero with eyebrow text', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });

    it('renders hero with title', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('renders background image', () => {
      render(<HeroSTDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('renders primary CTA and job-search panel', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByRole('form', { name: /search jobs/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
    });
  });

  describe('JobSearch variant', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('renders job board filters and default listings', () => {
      render(<HeroSTJobSearch {...mockProps} />);
      expect(document.querySelector('[data-variant="JobSearch"]')).toBeInTheDocument();
      expect(document.querySelector('[data-persona="default"]')).toBeInTheDocument();
      expect(screen.getByRole('form', { name: /job search filters/i })).toBeInTheDocument();
      expect(screen.getByText('Senior Scientist, Immunology')).toBeInTheDocument();
    });

    it('links View job to nested Job Search detail routes', () => {
      render(<HeroSTJobSearch {...mockProps} />);
      const detailLink = document.querySelector('[data-job-detail-link="job-001"]');
      expect(detailLink).toBeInTheDocument();
      expect(detailLink).toHaveAttribute('href', '/Job-Search/job-001');
      const viewJobLinks = screen.getAllByRole('link', { name: /view job/i });
      expect(viewJobLinks.length).toBeGreaterThan(0);
      viewJobLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', expect.stringMatching(/^\/Job-Search\//));
      });
    });

    it('personalizes listings when a Recent Graduate persona is selected', async () => {
      window.localStorage.setItem('demo-user-taxonomy', 'Recent Graduate');
      render(<HeroSTJobSearch {...mockProps} />);

      expect(await screen.findByText(/personalized for recent graduate/i)).toBeInTheDocument();
      expect(document.querySelector('[data-persona="Recent Graduate"]')).toBeInTheDocument();
      expect(screen.getByText('Clinical Research Associate')).toBeInTheDocument();
      expect(screen.getByText('Associate Brand Coordinator, US Commercial')).toBeInTheDocument();
      expect(screen.queryByText('Senior Scientist, Immunology')).not.toBeInTheDocument();
    });

    it('swaps catalogs when persona changes via taxonomy event', async () => {
      window.localStorage.setItem('demo-user-taxonomy', 'Remote Job Seeker');
      render(<HeroSTJobSearch {...mockProps} />);

      expect(await screen.findByText(/remote & hybrid opportunities/i)).toBeInTheDocument();
      expect(screen.getByText('Remote Clinical Documentation Specialist')).toBeInTheDocument();

      window.localStorage.setItem('demo-user-taxonomy', 'Career Changer');
      await act(async () => {
        window.dispatchEvent(new CustomEvent('demo-taxonomy-change'));
      });

      expect(await screen.findByText(/pathways that value transferable skills/i)).toBeInTheDocument();
      expect(screen.getByText('Project Manager, Digital Transformation')).toBeInTheDocument();
      expect(
        screen.queryByText('Remote Clinical Documentation Specialist')
      ).not.toBeInTheDocument();
    });

    it('saves a job to the persona profile cart', async () => {
      window.localStorage.setItem('demo-user-taxonomy', 'Recent Graduate');
      render(<HeroSTJobSearch {...mockProps} />);

      await screen.findByText('Clinical Research Associate');
      const saveButtons = screen.getAllByRole('button', { name: /save job/i });
      await act(async () => {
        fireEvent.click(saveButtons[0]);
      });

      const savedButton = await screen.findByRole('button', { name: /^saved$/i });
      expect(savedButton).toHaveAttribute('data-saved', 'true');
      expect(savedButton).toHaveAttribute('aria-pressed', 'true');
      expect(getSavedJobs('Recent Graduate')).toHaveLength(1);
      expect(getSavedJobs('Recent Graduate')[0].title).toBe('Clinical Research Associate');
    });
  });

  describe('JobSeekerProfile variant', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('renders login gate when no persona is selected', () => {
      render(<HeroSTJobSeekerProfile {...mockProps} />);
      expect(document.querySelector('[data-variant="JobSeekerProfile"]')).toBeInTheDocument();
      expect(document.querySelector('[data-persona="none"]')).toBeInTheDocument();
      expect(screen.getByText(/sign in to your job seeker profile/i)).toBeInTheDocument();
    });

    it('shows empty cart for a signed-in persona with no saved jobs', async () => {
      window.localStorage.setItem('demo-user-taxonomy', 'Experienced Professional');
      render(<HeroSTJobSeekerProfile {...mockProps} />);

      expect(await screen.findByText(/alex's job seeker profile/i)).toBeInTheDocument();
      expect(document.querySelector('[data-persona="Experienced Professional"]')).toBeInTheDocument();
      expect(screen.getByText(/no saved jobs yet/i)).toBeInTheDocument();
    });

    it('lists saved jobs from storage and supports remove', async () => {
      window.localStorage.setItem('demo-user-taxonomy', 'Recent Graduate');
      window.localStorage.setItem(
        TAKEDA_SAVED_JOBS_STORAGE_KEY,
        JSON.stringify({
          'Recent Graduate': [
            {
              id: 'grad-001',
              title: 'Clinical Research Associate',
              location: 'Tokyo, Japan',
              careerArea: 'Research & Development',
              postedDate: 'Mar 14, 2026',
              workMode: 'On-site',
              matchReason: 'Strong match for early-career science backgrounds',
            },
          ],
        })
      );

      render(<HeroSTJobSeekerProfile {...mockProps} />);

      expect(await screen.findByText('Clinical Research Associate')).toBeInTheDocument();
      expect(document.querySelector('[data-saved-job-id="grad-001"]')).toBeInTheDocument();
      expect(document.querySelector('[data-job-detail-link="grad-001"]')).toHaveAttribute(
        'href',
        '/Job-Search/grad-001'
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /remove/i }));
      });

      expect(screen.getByText(/no saved jobs yet/i)).toBeInTheDocument();
      expect(getSavedJobs('Recent Graduate')).toHaveLength(0);
    });
  });

  describe('Portal variant (GATX)', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('renders Portal login gate when no persona is selected', () => {
      render(<HeroSTPortal {...mockProps} />);
      expect(document.querySelector('[data-variant="Portal"]')).toBeInTheDocument();
      expect(screen.getByText(/sign in to the gatx customer portal/i)).toBeInTheDocument();
    });
  });

  describe('TalentPortal variant', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('renders Talent Portal login gate when no persona is selected', () => {
      render(<HeroSTTalentPortal {...mockProps} />);
      expect(document.querySelector('[data-variant="TalentPortal"]')).toBeInTheDocument();
      expect(screen.getByText(/sign in to the talent portal/i)).toBeInTheDocument();
    });
  });

  describe('Centered variant', () => {
    it('renders hero with title', () => {
      render(<HeroSTCentered {...mockProps} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('renders call-to-action links', () => {
      render(<HeroSTCentered {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
    });

    it('renders eyebrow text in centered variant', () => {
      render(<HeroSTCentered {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });

    it('applies custom styles in centered variant', () => {
      const { container } = render(<HeroSTCentered {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });
  });

  describe('Right variant', () => {
    it('renders hero with title in right variant', () => {
      render(<HeroSTRight {...mockProps} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('renders eyebrow text in right variant', () => {
      render(<HeroSTRight {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });

    it('renders call-to-action links in right variant', () => {
      render(<HeroSTRight {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('renders background images in right variant', () => {
      render(<HeroSTRight {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('applies custom styles in right variant', () => {
      const { container } = render(<HeroSTRight {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });

    it('handles missing eyebrow in right variant', () => {
      const propsWithoutEyebrow: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Eyebrow: undefined,
        },
      };
      render(<HeroSTRight {...propsWithoutEyebrow} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });
  });

  describe('SplitScreen variant', () => {
    it('renders hero with title in split screen variant', () => {
      render(<HeroSTSplitScreen {...mockProps} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('renders eyebrow text in split screen variant', () => {
      render(<HeroSTSplitScreen {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });

    it('renders call-to-action links in split screen variant', () => {
      render(<HeroSTSplitScreen {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('applies primary background in split screen variant', () => {
      const { container } = render(<HeroSTSplitScreen {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-primary');
    });

    it('renders images in split screen layout', () => {
      render(<HeroSTSplitScreen {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('handles missing title in split screen variant', () => {
      const propsWithoutTitle: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Title: undefined,
        },
      };
      render(<HeroSTSplitScreen {...propsWithoutTitle} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });
  });

  describe('Stacked variant', () => {
    it('renders hero with title in stacked variant', () => {
      render(<HeroSTStacked {...mockProps} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('renders eyebrow text in stacked variant', () => {
      render(<HeroSTStacked {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });

    it('renders call-to-action links in stacked variant', () => {
      render(<HeroSTStacked {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('applies primary background in stacked variant', () => {
      const { container } = render(<HeroSTStacked {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-primary');
    });

    it('renders both Image1 and Image2 in stacked layout', () => {
      render(<HeroSTStacked {...mockProps} />);
      const images = screen.getAllByRole('img');
      // Should render multiple images (Image1 and Image2 fields)
      expect(images.length).toBeGreaterThan(1);
    });

    it('handles missing Image2 in stacked variant', () => {
      const propsWithoutImage2: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Image2: undefined,
        },
      };
      render(<HeroSTStacked {...propsWithoutImage2} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('applies custom styles in stacked variant', () => {
      const { container } = render(<HeroSTStacked {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });
  });

  describe('Edge cases and missing data', () => {
    it('handles completely missing fields in default variant', () => {
      const propsWithoutFields: any = {
        params: {},
        fields: {},
      };
      const { container } = render(<HeroSTDefault {...propsWithoutFields} />);
      // Component should still render without errors
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('handles missing links in default variant', () => {
      const propsWithoutLinks: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Link1: undefined,
          Link2: undefined,
        },
      };
      render(<HeroSTDefault {...propsWithoutLinks} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('handles missing images in default variant', () => {
      const propsWithoutImages: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Image1: undefined,
        },
      };
      render(<HeroSTDefault {...propsWithoutImages} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });

    it('renders without params styles', () => {
      const propsWithoutStyles = {
        ...mockProps,
        params: {},
      };
      render(<HeroSTDefault {...propsWithoutStyles} />);
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
    });
  });
});
