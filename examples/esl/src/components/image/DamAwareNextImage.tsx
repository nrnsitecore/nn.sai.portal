'use client';

import { NextImage as SdkNextImage, type ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'react';
import { shouldSkipNextImageOptimization } from '@/lib/should-skip-next-image-optimization';

type Props = ComponentProps<typeof SdkNextImage>;

/**
 * Sitecore NextImage that skips Vercel optimization for Content Hub public links.
 * Cloudflare on CH tenants often blocks the optimizer fetch → INVALID_IMAGE_OPTIMIZE_REQUEST.
 */
export function DamAwareNextImage(props: Props) {
  const field = props.field as ImageField | undefined;
  const src = field?.value?.src;
  const unoptimized = Boolean(props.unoptimized) || shouldSkipNextImageOptimization(src);

  return <SdkNextImage {...props} unoptimized={unoptimized} />;
}
