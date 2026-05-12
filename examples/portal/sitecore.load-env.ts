/**
 * Node-only: loads `.env*` for Sitecore CLI and other Node tools.
 * Kept out of `sitecore.config.ts` so that file stays safe to import from
 * client components (no `fs` / `dotenv-flow` in the browser bundle).
 */
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config({ silent: true });
