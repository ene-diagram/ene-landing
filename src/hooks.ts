import type { Reroute } from "@sveltejs/kit/hooks";
import { deLocalizeUrl } from "#lib/paraglide/runtime";

/**
 * Maps /ko/... back to the single set of routes.
 * File requests (e.g. /_app/env.js) are left alone: Paraglide's trailingSlash "always"
 * would turn them into /_app/env.js/ and the dev server would 404, breaking hydration.
 */
export const reroute: Reroute = ({ url }) => {
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
  return deLocalizeUrl(url).pathname;
};
