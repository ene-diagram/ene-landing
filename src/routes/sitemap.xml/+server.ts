import { docSlugs } from "#lib/docs";
import { examples } from "#lib/examples";
import { absoluteHref } from "#lib/href";
import { baseLocale, locales } from "#lib/paraglide/runtime";

export const prerender = true;

/** Every page in every language, each listing its translations (hreflang) so search engines pair them. */
export const GET = () => {
  const paths = ["/", "/docs/", ...docSlugs.map((s) => `/docs/${s}/`), "/examples/", ...examples.map((e) => `/examples/${e.slug}/`), "/playground/"]
    .filter((p) => p !== "/docs/"); // /docs/ only redirects to the introduction
  const alt = (p: string) =>
    [...locales.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${absoluteHref(p, l)}"/>`),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${absoluteHref(p, baseLocale)}"/>`].join("");
  const urls = paths.flatMap((p) => locales.map((l) => `<url><loc>${absoluteHref(p, l)}</loc>${alt(p)}<changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join("")}</urlset>\n`;
  return new Response(xml, { headers: { "content-type": "application/xml" } });
};
