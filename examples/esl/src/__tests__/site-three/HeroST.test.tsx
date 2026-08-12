/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  Default as HeroSTDefault,
  NoCards as HeroSTNoCards,
  Right as HeroSTRight,
  Centered as HeroSTCentered,
  SplitScreen as HeroSTSplitScreen,
  Stacked as HeroSTStacked,
  Search as HeroSTSearch,
  Profile as HeroSTProfile,
} from '@/components/site-three/HeroST';

// Mock useContainerOffsets hook
jest.mock('@/hooks/useContainerOffsets', () => ({
  useContainerOffsets: () => ({
    containerRef: { current: null },
    rightOffset: 0,
    leftOffset: 0,
  }),
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
  useSitecore: () => ({ page: { mode: { isEditing: false, isPreview: false, isNormal: true } } }),
}));

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

    it('renders Image1 as the hero background', () => {
      render(<HeroSTDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', expect.stringContaining('/hero-bg.jpg'));
    });

    it('renders call-to-action links', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('renders Personal, Business, and Wealth service cards below the hero', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByRole('heading', { name: 'Personal' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Business' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Wealth' })).toBeInTheDocument();
      expect(
        screen.getByText(/Checking, savings, loans, mortgages/i)
      ).toBeInTheDocument();
    });

    it('renders an ESL navy legibility gradient over the background image', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByTestId('hero-st-legibility-scrim')).toBeInTheDocument();
    });
  });

  describe('NoCards variant', () => {
    it('renders the same hero content as Default', () => {
      render(<HeroSTNoCards {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
      expect(screen.getByText('Premium Audio Experience')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByTestId('hero-st-legibility-scrim')).toBeInTheDocument();
    });

    it('does not render Personal, Business, or Wealth service cards', () => {
      render(<HeroSTNoCards {...mockProps} />);
      expect(screen.queryByRole('heading', { name: 'Personal' })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Business' })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Wealth' })).not.toBeInTheDocument();
    });

    it('marks the section with the NoCards variant attribute', () => {
      const { container } = render(<HeroSTNoCards {...mockProps} />);
      expect(container.querySelector('[data-variant="NoCards"]')).toBeInTheDocument();
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

    it('applies dark background in split screen variant', () => {
      const { container } = render(<HeroSTSplitScreen {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-dark');
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

    it('applies dark background in stacked variant', () => {
      const { container } = render(<HeroSTStacked {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-dark');
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

  describe('Search variant', () => {
    const originalSearch = window.location.search;

    afterEach(() => {
      window.history.replaceState({}, '', originalSearch ? `/${originalSearch}` : '/');
    });

    it('renders the search heading and filter controls', () => {
      render(<HeroSTSearch {...mockProps} />);
      expect(screen.getByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument();
      expect(screen.getByLabelText('Keyword')).toBeInTheDocument();
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
    });

    it('renders hardcoded credit-union results', () => {
      render(<HeroSTSearch {...mockProps} />);
      expect(screen.getByText('Everyday Checking')).toBeInTheDocument();
      expect(screen.getByText('High-Yield Savings')).toBeInTheDocument();
      expect(screen.getByText('Home mortgage')).toBeInTheDocument();
      expect(screen.getByText(/Showing 12 results/i)).toBeInTheDocument();
    });

    it('filters results by keyword on submit', () => {
      render(<HeroSTSearch {...mockProps} />);
      fireEvent.change(screen.getByLabelText('Keyword'), { target: { value: 'first-time' } });
      fireEvent.click(screen.getByRole('button', { name: /^search$/i }));
      expect(screen.getByText('Home mortgage')).toBeInTheDocument();
      expect(screen.queryByText('Everyday Checking')).not.toBeInTheDocument();
      expect(screen.getByText(/Showing 1 result/i)).toBeInTheDocument();
    });

    it('filters results by category on submit', () => {
      render(<HeroSTSearch {...mockProps} />);
      fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Locations' } });
      fireEvent.click(screen.getByRole('button', { name: /^search$/i }));
      expect(screen.getByText('Park Avenue branch')).toBeInTheDocument();
      expect(screen.getByText('Henrietta branch')).toBeInTheDocument();
      expect(screen.queryByText('Everyday Checking')).not.toBeInTheDocument();
      expect(screen.getByText(/Showing 2 results/i)).toBeInTheDocument();
    });

    it('shows empty state when no results match', () => {
      render(<HeroSTSearch {...mockProps} />);
      fireEvent.change(screen.getByLabelText('Keyword'), { target: { value: 'astronaut' } });
      fireEvent.click(screen.getByRole('button', { name: /^search$/i }));
      expect(screen.getByText('No results match your search')).toBeInTheDocument();
      expect(screen.getByText(/Showing 0 results/i)).toBeInTheDocument();
    });

    it('applies the URL q parameter as the initial keyword filter', () => {
      window.history.replaceState({}, '', '/Search?q=henrietta');
      render(<HeroSTSearch {...mockProps} />);
      expect(screen.getByLabelText('Keyword')).toHaveValue('henrietta');
      expect(screen.getByText('Henrietta branch')).toBeInTheDocument();
      expect(screen.queryByText('Everyday Checking')).not.toBeInTheDocument();
      expect(screen.getByText(/Showing 1 result/i)).toBeInTheDocument();
    });

    it('applies params styles on the section', () => {
      const { container } = render(<HeroSTSearch {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
      expect(section).toHaveAttribute('data-variant', 'Search');
    });
  });

  describe('Profile variant', () => {
    it('renders the checking dashboard variant marker', () => {
      const { container } = render(<HeroSTProfile {...mockProps} />);
      expect(container.querySelector('[data-variant="Profile"]')).toBeInTheDocument();
    });

    it('renders greeting, masked account, and balances without Sitecore fields', () => {
      render(<HeroSTProfile params={{}} fields={undefined as any} />);
      expect(screen.getByRole('heading', { name: /Good afternoon, Jordan/i })).toBeInTheDocument();
      expect(screen.getByText('Jordan Chen', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Everyday Checking')).toBeInTheDocument();
      expect(screen.getByText('•••• 4821')).toBeInTheDocument();
      expect(screen.getByText('$4,286.19')).toBeInTheDocument();
      expect(screen.getByText('$4,151.44')).toBeInTheDocument();
    });

    it('renders recent transactions and a banking-system source notation', () => {
      render(<HeroSTProfile {...mockProps} />);
      expect(screen.getByText('Direct deposit — ESL payroll')).toBeInTheDocument();
      expect(screen.getByText('Wegmans #119')).toBeInTheDocument();
      expect(
        screen.getByText(/Demo · Member name and last login from core banking member profile/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Transfer' })).toBeInTheDocument();
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
