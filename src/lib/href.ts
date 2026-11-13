import { resolve } from "$app/paths";
import { baseLocale, deLocalizeHref, getLocale, type Locale } from "#lib/paraglide/runtime";

/** Resolves a site path ("/docs/syntax/") against the deploy base and the locale prefix (/ko/ for Korean), relative to the current page. */
export const href = (path: string, locale: Locale = getLocale()): string => {
  const p = path.replace(/^\//, "");
  return (resolve as (p: string) => string)((locale === baseLocale ? p : `${locale}/${p}`) || ".");
};

/** Absolute URL of a site path in a locale, for hreflang and canonical links: "/docs/" -> "https://…/ko/docs/". */
export const absoluteHref = (path: string, locale: Locale): string => {
  const p = path.replace(/^\//, "");
  return `${__SITE_URL__}${__BASE_PATH__}/${locale === baseLocale ? "" : `${locale}/`}${p}`;
};

/** Remembers the language the visitor picked, so the first-visit language redirect never overrides it. */
export const LOCALE_KEY = "ene-locale";

/** The site path of a rendered pathname, without the deploy base and locale prefix: "/ene-landing/ko/docs/" -> "/docs/". */
export const sitePath = (pathname: string): string => deLocalizeHref(pathname).slice(__BASE_PATH__.length) || "/";
