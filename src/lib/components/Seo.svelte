<script lang="ts">
  import { page } from "$app/state";
  import { absoluteHref, sitePath } from "#lib/href";
  import { m } from "#lib/paraglide/messages";
  import { baseLocale, getLocale, locales } from "#lib/paraglide/runtime";

  interface Props {
    title: string;
    description: string;
    /** "website" for the home page, "article" for docs and examples */
    type?: "website" | "article";
    /** Structured data (schema.org) for this page */
    jsonLd?: Record<string, unknown>;
  }
  let { title, description, type = "article", jsonLd }: Props = $props();

  const ogLocale = { en: "en_US", ko: "ko_KR" } as const;
  const path = $derived(sitePath(page.url.pathname));
  const locale = $derived(getLocale());
  const url = $derived(absoluteHref(path, locale));
  const image = $derived(`${__SITE_URL__}${__BASE_PATH__}/og/${locale}.png`);
  // JSON-LD goes in a script tag; "<" is escaped so the content cannot close it
  const ld = $derived(jsonLd ? JSON.stringify({ "@context": "https://schema.org", ...jsonLd }).replace(/</g, "\\u003c") : "");
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={m.meta_keywords()} />
  <link rel="canonical" href={url} />
  {#each locales as l}<link rel="alternate" hreflang={l} href={absoluteHref(path, l)} />{/each}
  <link rel="alternate" hreflang="x-default" href={absoluteHref(path, baseLocale)} />

  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={m.meta_site_name()} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:locale" content={ogLocale[locale]} />
  {#each locales.filter((l) => l !== locale) as l}<meta property="og:locale:alternate" content={ogLocale[l]} />{/each}
  <meta property="og:image" content={image} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={m.meta_og_image_alt()} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content={m.meta_og_image_alt()} />

  {#if ld}{@html `<script type="application/ld+json">${ld}</script>`}{/if}
</svelte:head>
