/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as FeatureBannerDefault,
  Vertical as FeatureBannerVertical,
  Accent as FeatureBannerAccent,
  CareerAreas as FeatureBannerCareerAreas,
} from '@/components/site-three/FeatureBanner';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'span', ...props }: any) =>
    React.createElement(Tag, props, field?.value || ''),
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

describe('FeatureBanner', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      data: {
        datasource: {
          title: {
            jsonValue: {
              value: 'Our Features',
            },
          },
          link: {
            jsonValue: {
              value: {
                href: '/features',
                text: 'Learn More',
              },
            },
          },
          children: {
            results: [
              {
                id: 'feature-1',
                image: {
                  jsonValue: {
                    value: {
                      src: '/icons/feature1.svg',
                      alt: 'Feature 1',
                    },
                  },
                },
                heading: {
                  jsonValue: {
                    value: 'High Quality',
                  },
                },
              },
              {
                id: 'feature-2',
                image: {
                  jsonValue: {
                    value: {
                      src: '/icons/feature2.svg',
                      alt: 'Feature 2',
                    },
                  },
                },
                heading: {
                  jsonValue: {
                    value: 'Fast Delivery',
                  },
                },
              },
              {
                id: 'feature-3',
                image: {
                  jsonValue: {
                    value: {
                      src: '/icons/feature3.svg',
                      alt: 'Feature 3',
                    },
                  },
                },
                heading: {
                  jsonValue: {
                    value: '24/7 Support',
                  },
                },
              },
            ],
          },
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders feature banner with title', () => {
      render(<FeatureBannerDefault {...mockProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });

    it('renders all feature items', () => {
      render(<FeatureBannerDefault {...mockProps} />);
      expect(screen.getByText('High Quality')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('renders feature icons', () => {
      render(<FeatureBannerDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('handles empty children results', () => {
      const emptyProps = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [],
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...emptyProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });

    it('handles null datasource', () => {
      const missingDatasourceProps: any = {
        params: {},
        fields: {
          data: {
            datasource: null,
          },
        },
      };
      render(<FeatureBannerDefault {...missingDatasourceProps} />);
      // Check that the section still renders
      expect(document.querySelector('section')).toBeInTheDocument();
    });

    it('handles missing title field', () => {
      const missingTitleProps: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              title: undefined,
            },
          },
        },
      };
      render(<FeatureBannerDefault {...missingTitleProps} />);
      // Should still render the component structure
      expect(document.querySelector('section')).toBeInTheDocument();
      // Should still render the feature items
      expect(screen.getByText('High Quality')).toBeInTheDocument();
    });

    it('handles null children results', () => {
      const nullChildrenProps: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: null,
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...nullChildrenProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });
  });

  describe('Vertical variant', () => {
    it('renders Vertical layout correctly', () => {
      render(<FeatureBannerVertical {...mockProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
      expect(screen.getByText('High Quality')).toBeInTheDocument();
    });

    it('renders all features in Vertical layout', () => {
      render(<FeatureBannerVertical {...mockProps} />);
      expect(screen.getByText('High Quality')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('handles empty results in Vertical layout', () => {
      const emptyProps = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [],
              },
            },
          },
        },
      };
      render(<FeatureBannerVertical {...emptyProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });
  });

  describe('Accent variant', () => {
    it('renders Accent layout correctly', () => {
      render(<FeatureBannerAccent {...mockProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
      expect(screen.getByText('High Quality')).toBeInTheDocument();
    });

    it('renders all features in Accent layout', () => {
      render(<FeatureBannerAccent {...mockProps} />);
      expect(screen.getByText('High Quality')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('handles null datasource in Accent variant', () => {
      const missingDatasourceProps: any = {
        params: {},
        fields: {
          data: {
            datasource: null,
          },
        },
      };
      render(<FeatureBannerAccent {...missingDatasourceProps} />);
      // Check that the section still renders with the accent styling
      expect(document.querySelector('section')).toBeInTheDocument();
      expect(document.querySelector('.bg-primary')).toBeInTheDocument();
    });
  });

  describe('CareerAreas variant', () => {
    const careerAreasProps = {
      ...mockProps,
      fields: {
        data: {
          datasource: {
            ...mockProps.fields.data.datasource,
            title: {
              jsonValue: {
                value: 'Career areas',
              },
            },
            link: {
              jsonValue: {
                value: {
                  href: '/career-areas',
                  text: 'View all career areas',
                },
              },
            },
          },
        },
      },
    };

    it('renders title, CTA, and feature headings', () => {
      render(<FeatureBannerCareerAreas {...careerAreasProps} />);
      expect(screen.getByText('Career areas')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view all career areas/i })).toHaveAttribute(
        'href',
        '/career-areas'
      );
      expect(screen.getByText('High Quality')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('renders horizontal scroll row with images and CareerAreas data-variant', () => {
      render(<FeatureBannerCareerAreas {...careerAreasProps} />);
      const section = document.querySelector('[data-variant="CareerAreas"]');
      expect(section).toBeInTheDocument();
      const scrollRow = section?.querySelector('[data-scroll="horizontal"]');
      expect(scrollRow).toBeInTheDocument();
      expect(scrollRow?.className).toContain('overflow-x-auto');
      expect(scrollRow?.querySelector('.flex-nowrap')).toBeInTheDocument();
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', '/icons/feature1.svg');
    });

    it('handles null datasource without crashing', () => {
      const missingDatasourceProps: any = {
        params: { styles: 'extra-styles' },
        fields: {
          data: {
            datasource: null,
          },
        },
      };
      render(<FeatureBannerCareerAreas {...missingDatasourceProps} />);
      const section = document.querySelector('[data-variant="CareerAreas"]');
      expect(section).toBeInTheDocument();
      expect(section?.className).toContain('extra-styles');
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('omits CTA when link href is missing', () => {
      const noLinkProps: any = {
        ...careerAreasProps,
        fields: {
          data: {
            datasource: {
              ...careerAreasProps.fields.data.datasource,
              link: {
                jsonValue: {
                  value: {
                    href: '',
                    text: 'View all career areas',
                  },
                },
              },
            },
          },
        },
      };
      render(<FeatureBannerCareerAreas {...noLinkProps} />);
      expect(screen.getByText('Career areas')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('FeatureItem component', () => {
    it('handles missing image field', () => {
      const propsWithMissingImage: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [
                  {
                    id: 'feature-1',
                    image: undefined,
                    heading: {
                      jsonValue: {
                        value: 'High Quality',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...propsWithMissingImage} />);
      expect(screen.getByText('High Quality')).toBeInTheDocument();
    });

    it('handles missing heading field', () => {
      const propsWithMissingHeading: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [
                  {
                    id: 'feature-1',
                    image: {
                      jsonValue: {
                        value: {
                          src: '/icons/feature1.svg',
                          alt: 'Feature 1',
                        },
                      },
                    },
                    heading: undefined,
                  },
                ],
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...propsWithMissingHeading} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
    });

    it('handles completely empty feature item', () => {
      const propsWithEmptyFeature: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [
                  {
                    id: 'feature-1',
                    image: null,
                    heading: null,
                  },
                ],
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...propsWithEmptyFeature} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });
  });
});
