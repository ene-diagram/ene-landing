<script lang="ts">
  import { page } from "$app/state";
  import "#lib/styles/app.css";
  import { href, sitePath } from "#lib/href";
  import { m } from "#lib/paraglide/messages";
  import { baseLocale, locales } from "#lib/paraglide/runtime";
  import Nav from "#lib/components/Nav.svelte";
  import Footer from "#lib/components/Footer.svelte";
  let { children } = $props();
  const path = $derived(sitePath(page.url.pathname));
</script>

<svelte:head>
  <meta name="description" content={m.meta_description()} />
  {#each locales as l}<link rel="alternate" hreflang={l} href={href(path, l)} />{/each}
  <link rel="alternate" hreflang="x-default" href={href(path, baseLocale)} />
</svelte:head>

<a class="skip" href="#main">{m.skip_to_content()}</a>
<Nav />
<main id="main">{@render children()}</main>
<Footer />

<style>
  .skip { position: absolute; left: -9999px; top: var(--space-2); background: var(--ink); color: var(--on-ink); padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); z-index: 30; }
  .skip:focus { left: var(--space-4); }
</style>
