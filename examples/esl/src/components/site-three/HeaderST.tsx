import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Link as ContentSdkLink,
  LinkField,
  ImageField,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import { DamAwareNextImage as ContentSdkImage } from '@/components/image/DamAwareNextImage';
import Link from 'next/link';
import { MiniCart } from './non-sitecore/MiniCart';
import { SearchBox } from './non-sitecore/SearchBox';
import { ComponentProps } from 'lib/component-props';
import componentMap from '.sitecore/component-map';
import { MobileMenuWrapper } from './MobileMenuWrapper';

interface Fields {
  Logo: ImageField;
  SupportLink: LinkField;
  SearchLink: LinkField;
  CartLink: LinkField;
}

type HeaderSTProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

const navLinkClass =
  'block px-3 py-4 font-[family-name:var(--font-accent)] text-sm font-semibold text-foreground transition-colors hover:text-primary lg:px-4';

const iconLinkClass =
  'flex items-center justify-center p-3 text-foreground transition-colors hover:text-primary';

const pillSolidClass =
  'inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover';

export const Default = (props: HeaderSTProps) => {
  const { fields } = props;

  return (
    <section
      className={`sticky top-0 z-30 border-b border-border/60 bg-background shadow-sm ${props.params?.styles ?? ''}`}
      data-class-change
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center py-3 lg:py-4"
          prefetch={false}
        >
          <ContentSdkImage
            field={props.fields?.Logo}
            className="h-12 w-auto max-w-[min(100%,220px)] object-contain sm:h-14 sm:max-w-[min(100%,280px)] lg:h-16"
          />
        </Link>

        <div
          className="relative flex min-w-0 flex-1 items-center justify-end gap-2 lg:justify-between [.partial-editing-mode_&]:flex-col-reverse"
          role="navigation"
          aria-label="Site header"
        >
          <ul className="hidden min-w-0 list-none flex-row items-center p-0 lg:flex lg:[.partial-editing-mode_&]:!flex-col">
            <AppPlaceholder
              name={`header-navigation-${props.params?.DynamicPlaceholderId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={componentMap}
            />
          </ul>

          <ul className="m-0 flex list-none items-center gap-1 p-0 sm:gap-2">
            <li className="mr-auto lg:mr-0">
              {props.params.showSearchBox ? (
                <SearchBox searchLink={fields?.SearchLink} />
              ) : (
                <ContentSdkLink
                  field={fields?.SearchLink}
                  prefetch={false}
                  className={navLinkClass}
                />
              )}
            </li>
            <MobileMenuWrapper>
              <div className="flex h-full w-full flex-col lg:hidden">
                <div className="flex flex-1 items-center justify-center">
                  <ul className="flex w-full flex-col bg-background text-center">
                    <AppPlaceholder
                      name={`header-navigation-${props.params?.DynamicPlaceholderId}`}
                      rendering={props.rendering}
                      page={props.page}
                      componentMap={componentMap}
                    />
                  </ul>
                </div>
                <div className="w-full">
                  <hr className="w-full border-border" />
                  <ul className="text-center">
                    <li>
                      <ContentSdkLink
                        field={fields?.SupportLink}
                        prefetch={false}
                        className={navLinkClass}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </MobileMenuWrapper>
            <li className="hidden lg:flex">
              <ContentSdkLink
                field={fields?.SupportLink}
                prefetch={false}
                className={pillSolidClass}
              />
            </li>
            <li>
              {props.params.showMiniCart ? (
                <MiniCart cartLink={fields?.CartLink} />
              ) : (
                <ContentSdkLink
                  field={fields?.CartLink}
                  prefetch={false}
                  className={iconLinkClass}
                  aria-label={fields?.CartLink?.value?.text || 'Cart'}
                >
                  <FontAwesomeIcon icon={faShoppingCart} width={22} height={22} />
                </ContentSdkLink>
              )}
            </li>
            <li className="hidden lg:flex">
              <ContentSdkLink
                field={fields?.SupportLink}
                prefetch={false}
                className={iconLinkClass}
                aria-label={fields?.SupportLink?.value?.text || 'My profile'}
              >
                <FontAwesomeIcon icon={faUser} width={20} height={20} aria-hidden />
              </ContentSdkLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
