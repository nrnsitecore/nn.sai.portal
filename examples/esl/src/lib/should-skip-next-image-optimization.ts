/**
 * Content Hub / DAM public links often sit behind Cloudflare bot protection.
 * Vercel’s `/_next/image` optimizer fetch is blocked (non-image / 403) →
 * INVALID_IMAGE_OPTIMIZE_REQUEST. Serve those URLs unoptimized so the browser
 * loads them directly.
 */
export function shouldSkipNextImageOptimization(src?: string | null): boolean {
  if (!src || typeof src !== 'string') return false;

  try {
    const url = new URL(src, 'https://placeholder.local');
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();

    if (path.includes('/api/public/')) return true;
    if (host.endsWith('.sitecorecontenthub.cloud')) return true;
    if (host.endsWith('.stylelabs.cloud')) return true;
    if (host.endsWith('.stylelabs.io')) return true;
    // Sandbox CH tenants (e.g. esl.sitecoresandbox.cloud)
    if (host.endsWith('.sitecoresandbox.cloud') && path.includes('/api/public/')) return true;

    return false;
  } catch {
    return src.includes('/api/public/content/');
  }
}
