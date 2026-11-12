<script lang="ts">
  import "#lib/styles/app.css";
  import Nav from "#lib/components/Nav.svelte";
  import Footer from "#lib/components/Footer.svelte";
  let { children } = $props();
</script>

<a class="skip" href="#main">Skip to content</a>
<Nav />
<main id="main">{@render children()}</main>
<Footer />

<style>
  .skip { position: absolute; left: -9999px; top: var(--space-2); background: var(--ink); color: var(--on-ink); padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); z-index: 30; }
  .skip:focus { left: var(--space-4); }
</style>
