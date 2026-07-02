import { Text, RichText, Link as ContentSdkLink } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { PromoImageProps } from './promo-image.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { useMatchMedia } from '@/hooks/use-match-media';

export const PromoImageRight: React.FC<PromoImageProps> = (props) => {
  const { fields, isPageEditing } = props;
  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  if (fields) {
    const { image, heading, description, link } = fields;
    const hasLink = isPageEditing || link?.value?.href;
    const linkText = link?.value?.text || 'Explore the data';

    return (
      <section
        data-component="Promo Image"
        className="@container bg-background relative w-full"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 @md:grid-cols-[0.95fr_1.05fr] @md:gap-0 @md:px-8 @md:py-24">
          {/* Blush copy panel — overlaps and is inset relative to the image on desktop */}
          <div className="bg-tertiary relative z-10 order-2 flex flex-col justify-center px-8 py-10 @md:order-1 @md:-mr-10 @md:my-10 @md:px-12 @md:py-16 @lg:px-16">
            {heading && (
              <AnimatedSection
                direction="right"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
              >
                <Text
                  tag="h2"
                  className="text-tertiary-foreground font-heading text-pretty text-3xl font-semibold leading-tight @lg:text-4xl @xl:text-5xl"
                  field={heading}
                />
              </AnimatedSection>
            )}
            {description && (
              <AnimatedSection
                direction="right"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
                delay={400}
              >
                <RichText
                  className="text-foreground/75 mt-6 max-w-[52ch] space-y-4 text-base leading-relaxed @md:text-lg"
                  field={description}
                />
              </AnimatedSection>
            )}
            {hasLink && (
              <AnimatedSection
                direction="right"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
                delay={800}
              >
                <div className="mt-8">
                  <ContentSdkLink
                    field={link}
                    prefetch={false}
                    className="group inline-flex items-stretch overflow-hidden rounded-md shadow-sm"
                  >
                    <span className="bg-tertiary-foreground/85 group-hover:bg-tertiary-foreground inline-flex items-center px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors">
                      {linkText}
                    </span>
                    <span className="bg-tertiary-foreground inline-flex items-center justify-center px-3 text-white transition-[filter] group-hover:brightness-90">
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </span>
                  </ContentSdkLink>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Framed image */}
          {image && (
            <div className="relative order-1 @md:order-2 @md:h-full">
              <div className="relative h-[300px] w-full overflow-hidden @md:h-full @md:min-h-[540px]">
                <ImageWrapper
                  image={image}
                  className="h-full w-full object-cover"
                  wrapperClass="h-full w-full"
                  priority={true}
                />
              </div>
              {/* Offset white outline frame — editorial motif from the brand promo */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-3 bottom-8 left-12 hidden border-2 border-white @sm:block @md:-right-4 @md:-top-4 @md:bottom-10 @md:left-16"
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Promo Image: Right" />;
};
