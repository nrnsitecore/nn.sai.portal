/**
 * Unit tests for Promo component
 * Tests Default, ImageRight, FullCard, and CenteredCard variants
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as PromoDefault,
  ImageRight,
  FullCard,
  CenteredCard,
} from 'components/sxa/Promo';
import {
  defaultPromoProps,
  centeredCardPromoProps,
  minimalPromoProps,
  emptyPromoProps,
  emptyTextFieldsProps,
} from './Promo.mockProps';

// Mock the Sitecore Content SDK components and shadcn UI Button
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({ page: { mode: { isEditing: false } } }),
  NextImage: ({ field, className }: any) => {
    if (!field?.value?.src) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={field.value.src}
        alt={field.value.alt || ''}
        width={field.value.width}
        height={field.value.height}
        className={className}
      />
    );
  },
  Link: ({ field, children, className }: any) => {
    if (!field?.value?.href) return null;
    return (
      <a href={field.value.href} className={className}>
        {children || field.value.text}
      </a>
    );
  },
  RichText: ({ field, tag: Tag = 'div', className }: any) => {
    if (!field || typeof field.value !== 'string' || field.value.trim() === '') return null;
    return React.createElement(Tag, {
      className,
      dangerouslySetInnerHTML: { __html: field.value },
    });
  },
}));

// Mock the Button component
jest.mock('../../../components/ui/button', () => ({
  Button: ({ children }: any) => <button className="mocked-button">{children}</button>,
}));
/* eslint-enable @typescript-eslint/no-explicit-any */

describe('Promo Component - Default Variant', () => {
  describe('Basic Rendering', () => {
    it('should render promo with all fields', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toBeInTheDocument();
      expect(promo).toHaveClass('custom-promo-style');
      expect(promo?.id).toBe('promo-1');
    });

    it('should render promo icon image', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
      expect(image).toHaveAttribute('alt', 'Test Promo Image');
    });

    it('should render PromoText as heading', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading?.innerHTML).toContain('Featured Product');
      expect(heading).toHaveClass('text-3xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('esl-heading-bar');
    });

    it('should render PromoText2 as description', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      // PromoText2 is the muted body copy in the card's copy column
      const descriptions = container.querySelectorAll('.text-muted-foreground.text-base');
      const description = Array.from(descriptions).find((el) =>
        el.innerHTML.includes('Discover our amazing product features')
      );
      expect(description).toBeInTheDocument();
    });

    it('should render PromoText3 as badge', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      const badge = container.querySelector('.esl-caption-bar');
      expect(badge).toBeInTheDocument();
      expect(badge?.innerHTML).toContain('New Arrival');
    });

    it('should render link button', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      const link = container.querySelector('a[href="/products/featured"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Learn More');
    });
  });

  describe('Empty States', () => {
    it('should render default component when fields are null', () => {
      const { container } = render(<PromoDefault {...emptyPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toBeInTheDocument();
      expect(container.querySelector('.is-empty-hint')).toBeInTheDocument();
      expect(container).toHaveTextContent('Promo');
    });

    it('should handle empty text fields gracefully', () => {
      const { container } = render(<PromoDefault {...emptyTextFieldsProps} />);

      // Should still render the structure even with empty text fields
      const promo = container.querySelector('.component.promo');
      expect(promo).toBeInTheDocument();

      // Empty RichText components return null, so they won't be in DOM
      const heading = container.querySelector('h2');
      expect(heading).not.toBeInTheDocument();
    });

    it('should render with minimal fields', () => {
      const { container } = render(<PromoDefault {...minimalPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toBeInTheDocument();

      // Should have image and main text
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom styles from params', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toHaveClass('custom-promo-style');
    });

    it('should have container layout classes', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toHaveClass('@container');
      expect(promo).toHaveClass('bg-background');
      expect(promo).toHaveClass('relative');
    });

    it('should apply RenderingIdentifier as id', () => {
      const { container } = render(<PromoDefault {...defaultPromoProps} />);

      const promo = container.querySelector('#promo-1');
      expect(promo).toBeInTheDocument();
    });
  });
});

describe('Promo Component - ImageRight Variant', () => {
  it('should render with ImageRight variant marker and reversed column order', () => {
    const { container } = render(<ImageRight {...defaultPromoProps} />);

    const promo = container.querySelector('[data-variant="ImageRight"]');
    expect(promo).toBeInTheDocument();
    expect(promo).toHaveClass('component', 'promo');

    const grid = promo?.querySelector('.grid');
    const columns = grid?.children;
    expect(columns?.length).toBe(2);
    // Copy column first, image column second (image on the right at md+)
    expect(columns?.[0]).toHaveClass('@md:order-1');
    expect(columns?.[1]).toHaveClass('@md:order-2');
    expect(columns?.[1].querySelector('img')).toBeInTheDocument();
  });

  it('should render heading, description, and CTA', () => {
    const { container } = render(<ImageRight {...defaultPromoProps} />);

    expect(container.querySelector('h2')?.innerHTML).toContain('Featured Product');
    expect(container.querySelector('a[href="/products/featured"]')).toBeInTheDocument();
  });

  it('should render default component when fields are null', () => {
    const { container } = render(<ImageRight {...emptyPromoProps} />);

    expect(container.querySelector('.is-empty-hint')).toBeInTheDocument();
  });
});

describe('Promo Component - FullCard Variant', () => {
  it('should render full-bleed background image with ESL navy scrim', () => {
    const { container } = render(<FullCard {...defaultPromoProps} />);

    const promo = container.querySelector('[data-variant="FullCard"]');
    expect(promo).toBeInTheDocument();
    expect(promo).toHaveClass('bg-dark', 'isolate');

    const image = container.querySelector('img');
    expect(image).toHaveClass('absolute', 'inset-0', 'object-cover');
    expect(screen.getByTestId('promo-fullcard-legibility-scrim')).toBeInTheDocument();
  });

  it('should render white text content over the background', () => {
    const { container } = render(<FullCard {...defaultPromoProps} />);

    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('text-white');
    expect(heading?.innerHTML).toContain('Featured Product');
    expect(container.querySelector('a[href="/products/featured"]')).toBeInTheDocument();
  });

  it('should render default component when fields are null', () => {
    const { container } = render(<FullCard {...emptyPromoProps} />);

    expect(container.querySelector('.is-empty-hint')).toBeInTheDocument();
  });
});

describe('Promo Component - CenteredCard Variant', () => {
  describe('Basic Rendering', () => {
    it('should render centered card promo', () => {
      const { container } = render(<CenteredCard {...centeredCardPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toBeInTheDocument();
      expect(promo).toHaveClass('centered-style');
      expect(promo?.id).toBe('promo-centered');
    });

    it('should render with centered text alignment', () => {
      const { container } = render(<CenteredCard {...centeredCardPromoProps} />);

      const contentDiv = container.querySelector('.text-center');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveClass('justify-center');
    });

    it('should render heading with larger font size', () => {
      const { container } = render(<CenteredCard {...centeredCardPromoProps} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('text-xl');
      expect(heading).toHaveClass('font-semibold');
    });

    it('should render link button', () => {
      const { container } = render(<CenteredCard {...centeredCardPromoProps} />);

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should render default component when fields are null', () => {
      const { container } = render(<CenteredCard {...emptyPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toBeInTheDocument();
      expect(container.querySelector('.is-empty-hint')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have full width class', () => {
      const { container } = render(<CenteredCard {...centeredCardPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toHaveClass('w-full');
    });

    it('should have alignment stretch class', () => {
      const { container } = render(<CenteredCard {...centeredCardPromoProps} />);

      const promo = container.querySelector('.component.promo');
      expect(promo).toHaveClass('align-stretch');
    });
  });
});

describe('Promo Component - Accessibility', () => {
  it('should have proper semantic structure (Default)', () => {
    const { container } = render(<PromoDefault {...defaultPromoProps} />);

    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeInTheDocument();
    expect(container.querySelector('a')).toBeInTheDocument();
  });

  it('should have alt text on images', () => {
    const { container } = render(<PromoDefault {...defaultPromoProps} />);

    const image = container.querySelector('img');
    expect(image).toHaveAttribute('alt', 'Test Promo Image');
  });

  it('should have proper semantic structure (CenteredCard)', () => {
    const { container } = render(<CenteredCard {...centeredCardPromoProps} />);

    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeInTheDocument();
    expect(container.querySelector('a')).toBeInTheDocument();
  });
});
