import React, { JSX } from 'react';
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <section
      data-class-change
      data-component="RichText"
      className={`component rich-text bg-background relative w-full ${styles || ''}`}
      id={RenderingIdentifier}
    >
      <div className="component-content mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 lg:py-20">
        {fields ? (
          <ContentSdkRichText
            field={fields.Text}
            className="takeda-rich-text text-foreground max-w-[65ch] text-base leading-relaxed antialiased"
          />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
      </div>
    </section>
  );
};
