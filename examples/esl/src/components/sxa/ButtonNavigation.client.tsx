'use client';

import { useSitecore, Link as ContentSdkLink, LinkField } from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { JSX } from 'react';

interface Fields {
  Id: string;
  DisplayName: string;
  Title: { value?: string };
  NavigationTitle: { value?: string };
  Href: string;
  Querystring: string;
  Children: Array<Fields>;
  Styles: string[];
}

type ButtonNavigationClientProps = {
  list: Fields[];
  getLinkField: (props: { fields: Fields }) => LinkField;
  getNavigationText: (props: { fields: Fields }) => JSX.Element | string;
};

/**
 * Client component for ButtonNavigation with editing mode detection
 */
export const ButtonNavigationClient = ({
  list,
  getLinkField,
  getNavigationText,
}: ButtonNavigationClientProps) => {
  const { page } = useSitecore();
  const isPageEditing = page?.mode?.isEditing;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((section) => {
        const linkField = getLinkField({ fields: section });
        const href = linkField?.value?.href;
        return isPageEditing ? (
          <ContentSdkLink
            key={section.Id}
            field={linkField}
            className="rounded-2xl border border-border bg-card p-6 shadow-md transition-colors hover:border-primary"
            prefetch={false}
          >
            <h4 className="text-xl font-semibold text-primary mb-2">
              {getNavigationText({ fields: section })}
            </h4>
            <p className="text-foreground mb-4">
              Explore {getNavigationText({ fields: section })} components
            </p>
            <div className="flex items-center text-primary">
              <span className="mr-2">View components</span>
              <ArrowRight size={20} />
            </div>
          </ContentSdkLink>
        ) : (
          href && (
            <Link
              key={section.Id}
              href={href}
              className="rounded-2xl border border-border bg-card p-6 shadow-md transition-colors hover:border-primary"
              prefetch={false}
            >
              <h4 className="text-xl font-semibold text-primary mb-2">
                {getNavigationText({ fields: section })}
              </h4>
              <p className="text-foreground mb-4">
                Explore {getNavigationText({ fields: section })} components
              </p>
              <div className="flex items-center text-primary">
                <span className="mr-2">View components</span>
                <ArrowRight size={20} />
              </div>
            </Link>
          )
        );
      })}
    </div>
  );
};
