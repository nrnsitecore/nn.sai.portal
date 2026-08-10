'use client';
import { HTMLAttributes } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { cn } from 'lib/utils';
import { SearchItemFields } from './index';

type SearchItemTitleProps = {
  text: SearchItemFields['subTitle'];
} & HTMLAttributes<HTMLHeadingElement>;

export const SearchItemSubTitle = ({ className, text, ...props }: SearchItemTitleProps) => {
  return (
    text && (
      <h3
        className={cn('text-base font-semibold text-foreground mb-3 line-clamp-2', className)}
        {...props}
      >
        <Text field={text} />
      </h3>
    )
  );
};
