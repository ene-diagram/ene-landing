export const prerender = true;

export const GET = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${__SITE_URL__}${__BASE_PATH__}/sitemap.xml\n`, { headers: { "content-type": "text/plain" } });
