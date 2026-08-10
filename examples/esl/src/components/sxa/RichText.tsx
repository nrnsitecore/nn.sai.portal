import React, { JSX } from 'react';
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { cn } from '@/lib/utils';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params || {};
  const hasPagesPositionStyles = !!styles?.includes('position-');

  return (
    <section
      data-class-change
      data-component="RichText"
      className={cn(
        'component rich-text group bg-background relative w-full',
        !hasPagesPositionStyles && 'position-center',
        styles
      )}
      id={RenderingIdentifier}
    >
      <div
        className={cn(
          'component-content mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 lg:py-20',
          'group-[.position-left]:text-left group-[.position-center]:text-center group-[.position-right]:text-right'
        )}
      >
        {fields ? (
          <ContentSdkRichText
            field={fields.Text}
            className={cn(
              'esl-rich-text text-foreground max-w-[65ch] text-base leading-relaxed antialiased',
              'group-[.position-left]:mr-auto group-[.position-left]:ml-0 group-[.position-left]:text-left',
              'group-[.position-center]:mx-auto group-[.position-center]:text-center',
              'group-[.position-right]:ml-auto group-[.position-right]:mr-0 group-[.position-right]:text-right'
            )}
          />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
      </div>
    </section>
  );
};
