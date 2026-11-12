import { resolve } from "$app/paths";
/** Resolves a site path ("/docs/syntax/") against the deploy base, relative to the current page. */
export const href = (path: string): string => (resolve as (p: string) => string)(path.replace(/^\//, "") || ".");
