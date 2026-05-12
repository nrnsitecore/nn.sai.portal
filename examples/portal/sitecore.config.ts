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
      contextId: process.env.SITECORE_EDGE_CONTEXT_ID ?? '',
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
  defaultSite: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME ?? 'default',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
  editingSecret: process.env.SITECORE_EDITING_SECRET,
});
