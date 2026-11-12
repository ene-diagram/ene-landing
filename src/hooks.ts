import type { Reroute } from "@sveltejs/kit/hooks";
import { deLocalizeUrl } from "#lib/paraglide/runtime";

/** Maps /ko/... back to the single set of routes. */
export const reroute: Reroute = ({ url }) => deLocalizeUrl(url).pathname;
