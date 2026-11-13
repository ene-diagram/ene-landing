<script lang="ts">
  import { page } from "$app/state";
  import "#lib/styles/app.css";
  import { absoluteHref, LOCALE_KEY, sitePath } from "#lib/href";
  import { m } from "#lib/paraglide/messages";
  import { baseLocale, getLocale } from "#lib/paraglide/runtime";
  import { onMount } from "svelte";
  import Nav from "#lib/components/Nav.svelte";
  import Footer from "#lib/components/Footer.svelte";
  let { children } = $props();
  const path = $derived(sitePath(page.url.pathname));
  // First visit only: Korean browsers on an English page go to the Korean page. A language picked in the switcher always wins.
  onMount(() => {
    try {
      if (localStorage.getItem(LOCALE_KEY) || getLocale() !== baseLocale) return;
      if (!navigator.languages.some((l) => l.toLowerCase().startsWith("ko"))) return;
      localStorage.setItem(LOCALE_KEY, "ko");
      location.replace(absoluteHref(path, "ko").replace(__SITE_URL__, location.origin) + location.hash);
    } catch {}
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#08090A" />
  <link rel="icon" href="{__BASE_PATH__}/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="{__BASE_PATH__}/favicon-32.png" sizes="32x32" type="image/png" />
  <link rel="apple-touch-icon" href="{__BASE_PATH__}/apple-touch-icon.png" />
  <link rel="manifest" href="{__BASE_PATH__}/site.webmanifest" />
</svelte:head>

<a class="skip" href="#main">{m.skip_to_content()}</a>
<Nav />
<main id="main">{@render children()}</main>
<Footer />

<style>
  .skip { position: absolute; left: -9999px; top: var(--space-2); background: var(--ink); color: var(--on-ink); padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); z-index: 30; }
  .skip:focus { left: var(--space-4); }
</style>
