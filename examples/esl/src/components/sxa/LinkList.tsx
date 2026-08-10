'use client';

import React, { useEffect, useState, type JSX } from 'react';
import {
  Link as ContentSdkLink,
  Text,
  LinkField,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';

type ResultsFieldLink = {
  field: {
    link: LinkField;
  };
};

interface Fields {
  data: {
    datasource: {
      children: {
        results: ResultsFieldLink[];
      };
      field: {
        title: TextField;
      };
    };
  };
}

type LinkListProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type LinkListItemProps = {
  key: string;
  index: number;
  total: number;
  field: LinkField;
};

const linkListItemClass =
  'text-muted-foreground hover:text-primary focus:border focus:border-dashed focus:border-input inline-block px-2 py-2 focus:bg-secondary focus:outline focus:outline-dashed focus:ring-ring aria-selected:bg-secondary text-nowrap word-break-[break-word] text-sm transition-colors';

const LinkListItem = (props: LinkListItemProps & { isPageEditing?: boolean }) => {
  const { page } = useSitecore();
  const isEditing = props.isPageEditing || page?.mode?.isEditing;
  let className = `item${props.index}`;
  className += (props.index + 1) % 2 == 0 ? ' even' : ' odd';
  if (props.index == 0) {
    className += ' first';
  }
  if (props.index + 1 == props.total) {
    className += ' last';
  }
  return (
    <li className={className}>
      <div>
        {isEditing ? (
          <ContentSdkLink className={linkListItemClass} field={props.field} prefetch={false} />
        ) : (
          props.field?.value?.href && (
            <Link href={props.field.value.href} className={linkListItemClass} prefetch={false}>
              {props.field?.value?.text}
            </Link>
          )
        )}
      </div>
    </li>
  );
};

export const Default = (props: LinkListProps): JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page?.mode?.isEditing;
  const datasource = props.fields?.data?.datasource;
  const styles = `max-w-xs p-5 font-sans ${props.params.styles}`.trimEnd();
  const id = props.params.RenderingIdentifier;

  if (datasource) {
    const list = datasource.children.results
      .filter((element: ResultsFieldLink) => element?.field?.link)
      .map((element: ResultsFieldLink, key: number) => (
        <LinkListItem
          index={key}
          key={`${key}${element.field.link}`}
          total={datasource.children.results.length}
          field={element.field.link}
          isPageEditing={isPageEditing}
        />
      ));

    return (
      <div data-class-change className={styles} id={id ? id : undefined}>
        <div className="flex flex-col">
          <Text
            tag="h3"
            field={datasource?.field?.title}
            className="esl-heading-bar text-nowrap text-foreground mb-5 text-lg font-semibold md:text-lg"
          />
          <ul className="list-none p-0 m-0" aria-label="Navigation options">
            {list}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div data-class-change className={styles} id={id ? id : undefined}>
      <div className="component-content">
        <h3>Link List</h3>
      </div>
    </div>
  );
};

export const AnchorNav = (props: LinkListProps): JSX.Element => {
  const datasource = props.fields?.data?.datasource;
  const styles = `${props.params.styles}`.trimEnd();
  const id = props.params.RenderingIdentifier;
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
      setActiveId(sections[0].id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '0px 0px -85% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  if (datasource) {
    const list = datasource.children.results
      .filter((element: ResultsFieldLink) => element?.field?.link)
      .map((element: ResultsFieldLink, key: number) => {
        const link = element.field.link;
        const href = link?.value?.href || '';
        const targetId = href.replace('#', '');
        const isActive = targetId === activeId;

        return (
          <li key={`${key}${href}`} className="list-none">
            <a
              href={href}
              onClick={(e) => handleClick(e, href)}
              className={`block border-b-2 py-4 text-sm font-semibold  transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'text-foreground hover:text-primary border-transparent'
              }`}
            >
              {link?.value?.text}
            </a>
          </li>
        );
      });

    return (
      <div
        data-class-change
        className={`bg-background border-border sticky top-0 z-20 border-b shadow-sm ${styles}`}
        id={id ? id : undefined}
      >
        <div className="container mx-auto px-4">
          <ul
            className="m-0 flex list-none flex-wrap gap-x-8 gap-y-0 p-0 lg:gap-x-12"
            aria-label="Navigation options"
          >
            {list}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div data-class-change className={styles} id={id ? id : undefined}>
      <div className="component-content">
        <h3>Link List</h3>
      </div>
    </div>
  );
};

export const FooterLinks = (props: LinkListProps): JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page?.mode?.isEditing;
  const datasource = props.fields?.data?.datasource;
  const styles = `font-[inherit] ${props.params.styles}`.trimEnd();
  const id = props.params.RenderingIdentifier;

  if (datasource) {
    const list = datasource.children.results
      .filter((element: ResultsFieldLink) => element?.field?.link)
      .map((element: ResultsFieldLink, key: number) => {
        const link = element.field.link;
        const href = link?.value?.href || '';

        return (
          <React.Fragment key={`${key}${href}`}>
            {isPageEditing ? (
              <ContentSdkLink
                key={`${key}${href}-link`}
                className="font-[inherit] transition-opacity hover:opacity-70"
                field={element.field.link}
                prefetch={false}
              />
            ) : (
              href && (
                <Link
                  key={`${key}${href}-link`}
                  href={href}
                  className="font-[inherit] transition-opacity hover:opacity-70"
                  prefetch={false}
                >
                  {link?.value?.text}
                </Link>
              )
            )}
            <span className="font-[inherit] last:!hidden hidden lg:[.with-separators_&]:inline-block">
              /
            </span>
          </React.Fragment>
        );
      });

    const parentBasedStyles =
      'lg:[.list-vertical_&]:flex-col flex-wrap [.position-center_&]:items-center [.position-center_&]:justify-center [.position-right_&]:items-end [.position-right_&]:justify-end';

    return (
      <div className={` ${styles}`} id={id ? id : undefined} data-class-change>
        <div
          className={`flex flex-col lg:flex-row ${parentBasedStyles} gap-x-10 gap-y-6 font-[inherit]`}
        >
          {list}
        </div>
      </div>
    );
  }

  return (
    <div data-class-change className={styles} id={id ? id : undefined}>
      <div className="component-content">
        <h3>Link List</h3>
      </div>
    </div>
  );
};

export const HeaderPrimaryLinks = (props: LinkListProps): JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page?.mode?.isEditing;
  const datasource = props.fields?.data?.datasource;
  const styles = `font-[inherit] ${props.params.styles}`.trimEnd();
  const id = props.params.RenderingIdentifier;

  if (datasource) {
    const list = datasource.children.results
      .filter((element: ResultsFieldLink) => element?.field?.link)
      .map((element: ResultsFieldLink, key: number) => {
        const link = element.field.link;
        const href = link?.value?.href || '';

        return (
          <li key={`${key}${href}-link`} className="hover:text-primary transition-colors">
            {isPageEditing ? (
              <ContentSdkLink field={element.field.link} prefetch={false} />
            ) : (
              href && (
                <Link href={href} prefetch={false}>
                  {link?.value?.text}
                </Link>
              )
            )}
          </li>
        );
      });

    return (
      <ul className={`flex flex-col gap-3 ${styles}`} id={id ? id : undefined} data-class-change>
        {list}
      </ul>
    );
  }

  return (
    <div data-class-change className={styles} id={id ? id : undefined}>
      <div className="component-content">
        <h3>Link List</h3>
      </div>
    </div>
  );
};

export const HeaderSecondaryLinks = (props: LinkListProps): JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page?.mode?.isEditing;
  const datasource = props.fields?.data?.datasource;
  const styles = `font-[inherit] ${props.params.styles}`.trimEnd();
  const id = props.params.RenderingIdentifier;

  if (datasource) {
    const list = datasource.children.results
      .filter((element: ResultsFieldLink) => element?.field?.link)
      .map((element: ResultsFieldLink, key: number) => {
        const link = element.field.link;
        const href = link?.value?.href || '';

        return (
          <li key={`${key}${href}-link`} className="hover:text-primary text-sm transition-colors">
            {isPageEditing ? (
              <ContentSdkLink field={element.field.link} prefetch={false} />
            ) : (
              href && (
                <Link href={href} prefetch={false}>
                  {link?.value?.text}
                </Link>
              )
            )}
          </li>
        );
      });

    return (
      <div className={`flex flex-col gap-3 ${styles}`} id={id ? id : undefined} data-class-change>
        <h2 className="border-primary text-muted-foreground border-l-2 pl-3 font-(family-name:--font-accent) text-xs font-semibold">
          <Text field={datasource?.field?.title} />
        </h2>
        <ul className="flex flex-col gap-1">{list}</ul>
      </div>
    );
  }

  return (
    <div data-class-change className={styles} id={id ? id : undefined}>
      <div className="component-content">
        <h3>Link List</h3>
      </div>
    </div>
  );
};
