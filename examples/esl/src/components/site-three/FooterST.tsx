import { faFacebook, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  Link as ContentSdkLink,
  Field,
  RichTextField,
  LinkField,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import componentMap from '.sitecore/component-map';

interface Fields {
  Title: Field<string>;
  CopyrightText: RichTextField;
  FacebookLink: LinkField;
  InstagramLink: LinkField;
  LinkedinLink: LinkField;
}

type FooterSTProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

/** Returns true if the link field has a valid href (not a placeholder like # or http://#). */
function hasValidLink(field: LinkField | undefined): boolean {
  const href = field?.value?.href;
  return !!(href && href !== '#' && !href.startsWith('http://#'));
}

const footerSectionClass = 'relative bg-muted text-foreground border-t border-border';

/** Primary accent bar that anchors the footer title. */
const FooterAccentBar = () => (
  <span aria-hidden className="mb-6 block h-1 w-12 rounded-full bg-primary" />
);

const footerTitleClass =
  'mb-8 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight lg:mb-10 lg:text-3xl';

const footerPrimaryLinksClass =
  'font-(family-name:--font-heading) text-base font-semibold tracking-tight text-foreground';

const footerSecondaryLinksClass =
  'font-(family-name:--font-accent) text-sm font-medium text-muted-foreground';

const footerMetaClass =
  'text-xs text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4';

const SocialLinks = ({ fields }: { fields: Fields }) => (
  <div className="flex justify-center gap-5 text-foreground [&_a]:transition-colors [&_a:hover]:text-primary">
    {hasValidLink(fields?.FacebookLink) ? (
      <ContentSdkLink field={fields?.FacebookLink} prefetch={false} aria-label="Facebook">
        <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
      </ContentSdkLink>
    ) : (
      <span role="img" aria-label="Facebook">
        <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
      </span>
    )}
    {hasValidLink(fields?.InstagramLink) ? (
      <ContentSdkLink field={fields?.InstagramLink} prefetch={false} aria-label="Instagram">
        <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
      </ContentSdkLink>
    ) : (
      <span role="img" aria-label="Instagram">
        <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
      </span>
    )}
    {hasValidLink(fields?.LinkedinLink) ? (
      <ContentSdkLink field={fields?.LinkedinLink} prefetch={false} aria-label="LinkedIn">
        <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
      </ContentSdkLink>
    ) : (
      <span role="img" aria-label="LinkedIn">
        <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
      </span>
    )}
  </div>
);

export const Default = (props: FooterSTProps) => {
  return (
    <section
      className={`${footerSectionClass} pt-14 lg:pt-20 pb-8 ${props.params.styles}`}
      data-class-change
    >
      <div className="container mx-auto px-4">
        <FooterAccentBar />
        <h2 className={footerTitleClass}>
          <ContentSdkText field={props.fields?.Title} />
        </h2>
        <div className={`max-w-5xl mx-auto mb-6 lg:mb-10 ${footerPrimaryLinksClass}`}>
          <AppPlaceholder
            name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
          />
        </div>
        <div className={`max-w-5xl mx-auto ${footerSecondaryLinksClass}`}>
          <AppPlaceholder
            name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
          />
        </div>
      </div>
      <div className="my-10 border-t border-border lg:my-12"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between">
          <SocialLinks fields={props.fields} />
          <div className={footerMetaClass}>
            <ContentSdkRichText field={props.fields?.CopyrightText} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const LogoLeft = (props: FooterSTProps) => {
  return (
    <section
      className={`${footerSectionClass} pt-14 lg:pt-20 ${props.params.styles}`}
      data-class-change
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <FooterAccentBar />
            <h2 className={`${footerTitleClass} !mb-0`}>
              <ContentSdkText field={props.fields?.Title} />
            </h2>
          </div>
          <div className="lg:flex justify-end items-start gap-12">
            <div className={`mb-6 lg:mb-0 ${footerPrimaryLinksClass}`}>
              <AppPlaceholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
            <div className={footerSecondaryLinksClass}>
              <AppPlaceholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between mt-10">
          <SocialLinks fields={props.fields} />
          <div className={footerMetaClass}>
            <ContentSdkRichText field={props.fields?.CopyrightText} />
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-border lg:mt-12"></div>
    </section>
  );
};

export const LogoRight = (props: FooterSTProps) => {
  return (
    <section className={`${footerSectionClass} pb-8 ${props.params.styles}`} data-class-change>
      <div className="mb-10 border-t border-border lg:mb-12"></div>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="lg:order-2 lg:text-right">
            <span aria-hidden className="mb-6 block h-1 w-12 rounded-full bg-primary lg:ml-auto" />
            <h2 className={`${footerTitleClass} !mb-0`}>
              <ContentSdkText field={props.fields?.Title} />
            </h2>
          </div>
          <div className="lg:flex items-start gap-12">
            <div className={`mb-6 lg:mb-0 ${footerPrimaryLinksClass}`}>
              <AppPlaceholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
            <div className={footerSecondaryLinksClass}>
              <AppPlaceholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between mt-10">
          <SocialLinks fields={props.fields} />
          <div className={footerMetaClass}>
            <ContentSdkRichText field={props.fields?.CopyrightText} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Centered = (props: FooterSTProps) => {
  return (
    <section
      className={`${footerSectionClass} py-10 lg:py-16 ${props.params.styles}`}
      data-class-change
    >
      <div className="relative container mx-auto px-4 z-20">
        <div className="grid lg:grid-cols-3 lg:gap-8">
          <div>
            <FooterAccentBar />
            <h2 className={`${footerTitleClass} !mb-0`}>
              <ContentSdkText field={props.fields?.Title} />
            </h2>
          </div>
          <div>
            <div className={`mb-6 lg:mb-10 ${footerPrimaryLinksClass}`}>
              <AppPlaceholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
            <div className={footerSecondaryLinksClass}>
              <AppPlaceholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center lg:items-end lg:self-end mt-8">
            <SocialLinks fields={props.fields} />
            <div className={footerMetaClass}>
              <ContentSdkRichText field={props.fields.CopyrightText} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
