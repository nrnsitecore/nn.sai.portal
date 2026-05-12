import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

// Next.js loads `.env*` for `next build` / `next dev`. For Sitecore CLI, see
// `sitecore.load-env.ts` (imported first from `sitecore.cli.config.ts`).

/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See the documentation for `defineConfig`:
 * https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig({
  api: {
    edge: {
      // CLI `sitecore-tools project build` uses `contextId` for Edge GraphQL (e.g. generateSites).
      // Fall back to the public context id when the server-only var is unset (common local setup).
      contextId:
        process.env.SITECORE_EDGE_CONTEXT_ID ||
        process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID ||
        '',
      clientContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
      edgeUrl:
        process.env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME ??
        'https://edge-platform.sitecorecloud.io',
    },
    local: {
      apiKey: process.env.SITECORE_API_KEY ?? '',
      apiHost: process.env.SITECORE_API_HOST ?? '',
    },
  },
  // Blank env must not become the literal "default" (often not a real XM Cloud site → IV-007).
  defaultSite: (() => {
    const t = process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME?.trim();
    return t && t.length > 0 ? t : '';
  })(),
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
  editingSecret: process.env.SITECORE_EDITING_SECRET,
});
