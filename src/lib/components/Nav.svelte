<script lang="ts">
  import { page } from "$app/state";
  import { href } from "#lib/href";
  let scrolled = $state(false);
  let open = $state(false);
  const links = [
    { href: "/docs/introduction", label: "Docs", match: "/docs" },
    { href: "/docs/syntax", label: "Syntax", match: "/docs/syntax" },
    { href: "/examples", label: "Examples", match: "/examples" },
    { href: "/playground", label: "Playground", match: "/playground" }
  ];
  const current = (m: string) => page.url.pathname.includes(m) && !(m === "/docs" && page.url.pathname.includes("/docs/syntax"));
</script>

<svelte:window onscroll={() => (scrolled = scrollY > 8)} />

<header class:scrolled>
  <nav class="wrap" aria-label="Main">
    <a class="logo" href={href(`/`)}>ene</a>
    <ul class:open>
      {#each links as l}<li><a href={href(`${l.href}`)} aria-current={current(l.match) ? "page" : undefined} onclick={() => (open = false)}>{l.label}</a></li>{/each}
    </ul>
    <div class="right">
      <a class="gh" href="https://github.com/slop-makers/ene">GitHub</a>
      <button type="button" class="menu" aria-label="Open menu" aria-expanded={open} onclick={() => (open = !open)}>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" /></svg>
      </button>
    </div>
  </nav>
</header>

<style>
  header { position: sticky; top: 0; z-index: 20; border-bottom: 1px solid transparent; transition: background-color var(--motion-fast), border-color var(--motion-fast), backdrop-filter var(--motion-fast); }
  header.scrolled { background: rgba(8, 9, 10, .88); border-bottom-color: var(--line); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
  nav { display: flex; align-items: center; gap: var(--space-10); min-height: 64px; font-size: 14px; }
  .logo { font-weight: 600; font-size: 18px; }
  ul { display: flex; gap: var(--space-8); list-style: none; margin: 0; padding: 0; }
  ul a { color: var(--ink-muted); transition: color var(--motion-fast); }
  ul a:hover, ul a[aria-current="page"] { color: var(--ink); }
  .right { margin-left: auto; display: flex; gap: var(--space-2); align-items: center; }
  .gh { border: 1px solid var(--line); border-radius: var(--radius-md); padding: var(--space-2) var(--space-4); min-height: 36px; display: inline-flex; align-items: center; transition: border-color var(--motion-fast); }
  .gh:hover { border-color: var(--line-strong); }
  .menu { display: none; width: 44px; height: 44px; border: 1px solid var(--line); border-radius: var(--radius-md); background: transparent; align-items: center; justify-content: center; cursor: pointer; }
  .menu svg { stroke: var(--ink); stroke-width: 1.5; fill: none; }
  @media (max-width: 720px) {
    nav { gap: var(--space-4); }
    .menu { display: inline-flex; }
    .gh { display: none; }
    ul { display: none; position: absolute; top: 64px; left: 0; right: 0; flex-direction: column; gap: 0; background: var(--bg); border-bottom: 1px solid var(--line); padding: var(--space-2) var(--space-4); }
    ul.open { display: flex; }
    ul a { display: flex; min-height: 44px; align-items: center; font-size: 16px; }
  }
</style>
