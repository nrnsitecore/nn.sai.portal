import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  LinkField,
  ImageField,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
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
  'block px-4 py-5 font-[family-name:var(--font-accent)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition-colors hover:text-primary';

const iconLinkClass =
  'flex items-center justify-center p-3 text-foreground transition-colors hover:text-primary';

export const Default = (props: HeaderSTProps) => {
  const { fields } = props;

  return (
    <section className={`border-border border-b ${props.params?.styles}`} data-class-change>
      <div className="flex justify-between items-stretch">
        <Link
          href="/"
          className="relative flex justify-center items-center grow-0 shrink-0 w-20 lg:w-28 h-20 lg:h-28 p-4 lg:p-5 bg-primary z-100"
          prefetch={false}
        >
          <ContentSdkImage field={props.fields?.Logo} className="w-full h-full object-contain" />
        </Link>

        <div
          className="relative flex [.partial-editing-mode_&]:flex-col-reverse justify-between items-center gap-10 grow max-w-7xl lg:px-4 bg-background"
          role="navigation"
        >
          <ul className="hidden lg:flex flex-row lg:[.partial-editing-mode_&]:!flex-col text-left bg-background">
            <AppPlaceholder
              name={`header-navigation-${props.params?.DynamicPlaceholderId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={componentMap}
            />
          </ul>
          <div className="basis-full lg:basis-auto lg:ml-auto">
            <ul className="flex items-center">
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
                <div className="lg:hidden flex flex-col w-full h-full">
                  <div className="flex-1 flex items-center justify-center">
                    <ul className="flex flex-col text-center bg-background">
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
              <li>
                {props.params.showMiniCart ? (
                  <MiniCart cartLink={fields?.CartLink} />
                ) : (
                  <ContentSdkLink
                    field={fields?.CartLink}
                    prefetch={false}
                    className="text-foreground hover:text-primary block p-4 transition-colors"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} width={24} height={24} />
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
      </div>
    </section>
  );
};
