'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import type { HeroFields, HeroProps } from './hero.props';

export const HeroImageBackground: React.FC<HeroProps> = (props) => {
  const { fields: initialFields, isPageEditing } = props;
  const [fields, setFields] = useState(initialFields || {});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    const fetchPersonalizedContent = async () => {
      try {
        setIsLoading(true);
        // Select a random ID from the list
        // List of 10 possible IDs for personalization
        const possibleIds = [
          '45XixxP6MwsQQMXEyEFqvf',
          '6txC8Np0nFYHvbDfWO6Yq3',
          '2aITWZcsVlxCxvqYViXODs',
          '1zQ2kKlNv56JF8Ocqd06GW',
          '1F5HPS0POilcbAlgaS7p6A',
          '4ROMsF9ZRbga7WA1UlUnbe',
          '2tIyiWUJysTLkhdhJN3MVo',
          '2wFREt2N42HDSxeNR0SIvh',
          '1m8HHPaQXXNUjxgYnlJXqX',
          '1zQ2kKlNv56JF8Ocqd06GW',
        ];
        const randomIndex = Math.floor(Math.random() * possibleIds.length);
        const selectedId = possibleIds[randomIndex];

        const response = await fetch(`/api/content-service/heroDatasource/${selectedId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CONTENT_SERVICE_ACCESS_TbOKEN}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Update fields with personalized content
          const { title, description, bannerText, bannerCTA, heroImage } =
            data?.heroDatasource || {};
          const image = heroImage.value ? heroImage : { value: heroImage };
          const personalizedFields: HeroFields = {
            title: {
              value: title,
            },
            description: {
              value: description,
            },
            bannerText: {
              value: bannerText,
            },
            bannerCTA,
            image: image,
            dictionary: initialFields?.dictionary,
          };
          setFields(personalizedFields);
        }
      } catch (error) {
        console.error('Error fetching personalized content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch personalized content with 70% probability
    const shouldPersonalize = Math.random() < 0.7;
    console.debug('shouldPersonalize', shouldPersonalize);
    if (shouldPersonalize && !isPageEditing) {
      fetchPersonalizedContent();
    }
  }, [initialFields?.dictionary, isPageEditing]);

  if (fields) {
    const { title, description, bannerText, bannerCTA, image } = fields || {};
    const needsBanner: boolean = isPageEditing
      ? true
      : bannerText?.value !== '' || bannerCTA?.value?.href !== ''
        ? true
        : false;

    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    return (
      <section
        data-component="Hero"
        className="@container/herowrapper bg-background text-foreground relative w-full overflow-hidden"
      >
        <div
          data-class-change
          className={cn('group relative', {
            'position-left': !hasPagesPositionStyles,
            [props?.params?.styles]: props?.params?.styles,
          })}
        >
          {/* Image */}
          <ImageWrapper
            image={image}
            wrapperClass="absolute inset-0 w-full"
            className="h-full min-h-[28rem] w-full scale-105 object-cover object-center blur-sm md:min-h-[36rem]"
            priority={true}
            loading="eager"
            fetchPriority="high"
          />

          <div
            className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95"
            aria-hidden="true"
          />

          {/* Blur effect for mobile */}
          <div
            className="fade-to-transparent fade-to-transparent-bottom absolute inset-0 w-full md:hidden"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="@container/herocontent relative z-10 mx-auto flex min-h-[28rem] w-full max-w-5xl flex-col items-center justify-center px-4 py-16 text-center md:min-h-[36rem] md:px-10 md:py-24">
            <div className="w-full max-w-3xl rounded-sm bg-background/85 px-6 py-10 shadow-sm ring-1 ring-border/50 backdrop-blur-sm md:px-10 md:py-12">
              {isLoading && (
                <div className="absolute top-0 right-0 p-2 text-xs">
                  Loading personalized content...
                </div>
              )}

              {/* Title */}
              <AnimatedSection
                direction="up"
                className="relative z-20"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
              >
                <Text
                  tag="h1"
                  field={title}
                  className="font-heading text-balance px-2 text-3xl font-bold uppercase leading-tight tracking-wide text-primary md:text-4xl lg:text-5xl"
                />
              </AnimatedSection>

              {/* Accent line */}
              <div className="py-6">
                <div className="mx-auto h-0.5 w-16 rounded-full bg-accent" />
              </div>

              {/* Description */}
              <AnimatedSection
                direction="up"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
                delay={200}
              >
                {description && (
                  <Text
                    tag="p"
                    className="text-foreground/90 mx-auto max-w-2xl text-pretty text-base leading-relaxed md:text-lg"
                    field={description}
                  />
                )}
              </AnimatedSection>

              {/* Banner overlay */}
              {needsBanner && (
                <div className="@container/herobanner bg-primary text-primary-foreground z-10 mt-8 w-full max-w-2xl rounded-sm px-4 py-4 md:px-6">
                  <div className="@[35rem]/herobanner:flex-row @[35rem]/herobanner:items-center @[35rem]/herobanner:justify-between @[35rem]/herobanner:flex @[35rem]/herobanner:gap-10 @[35rem]/herobanner:text-left">
                    {bannerText && (
                      <AnimatedSection
                        direction="up"
                        isPageEditing={isPageEditing}
                        reducedMotion={prefersReducedMotion}
                      >
                        <Text
                          tag="p"
                          className="font-heading @md/herowrapper:text-lg text-pretty font-light leading-tight"
                          field={bannerText}
                        />
                      </AnimatedSection>
                    )}
                    {bannerCTA && (
                      <AnimatedSection
                        direction="up"
                        className="@[35rem]/herobanner:mt-0 mt-4"
                        isPageEditing={isPageEditing}
                        reducedMotion={prefersReducedMotion}
                        delay={200}
                      >
                        <ButtonBase
                          buttonLink={bannerCTA}
                          variant="default"
                          isPageEditing={isPageEditing}
                        />
                      </AnimatedSection>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Hero" />;
};
