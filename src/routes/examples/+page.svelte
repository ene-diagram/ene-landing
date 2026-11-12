<script lang="ts">
  import { href } from "#lib/href";
  import { getExamples, tagLabels, type Tag } from "#lib/examples";
  import { reveal } from "#lib/reveal";
  import { m } from "#lib/paraglide/messages";
  const filters: ("all" | Tag)[] = ["all", "flows", "branches", "failures", "groups", "sequence"];
  const label = (x: "all" | Tag) => (x === "all" ? m.tag_all() : tagLabels[x]());
  let f = $state<"all" | Tag>("all");
  const examples = $derived(getExamples());
  const shown = $derived(f === "all" ? examples : examples.filter((e) => e.tags.includes(f as Tag)));
</script>

<svelte:head><title>{m.examples_title()}</title></svelte:head>

<div class="wrap page">
  <div class="top">
    <div class="t"><span class="kicker">{m.examples_kicker()}</span><h1>{m.examples_h1()}</h1></div>
    <p class="muted">{@html m.examples_p()}</p>
  </div>
  <div class="filters" role="group" aria-label={m.examples_filter_label()}>
    {#each filters as x}<button type="button" aria-pressed={f === x} onclick={() => (f = x)}>{label(x)}</button>{/each}
  </div>
  <div class="grid">
    {#each shown as e (e.id)}
      <a class="card" href={href(`/examples/${e.slug}/`)} use:reveal>
        <div class="thumb">{#each e.nodes as n, i}{#if i}<span class="arr" aria-hidden="true">→</span>{/if}<span class="chip" class:lit={i === 1}>{n}</span>{/each}</div>
        <div class="body"><div class="row"><strong>{e.title}</strong><span class="id">{e.id}</span></div><span class="muted">{e.blurb}</span></div>
      </a>
    {/each}
  </div>
</div>

<style>
  .page { padding-top: var(--space-18); display: flex; flex-direction: column; gap: var(--space-10); }
  .top { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-8); flex-wrap: wrap; }
  .t { display: flex; flex-direction: column; gap: var(--space-4); }
  h1 { font-size: 56px; line-height: 58px; letter-spacing: -0.035em; font-weight: 600; }
  .top p { font-size: 15px; line-height: 23px; max-width: 380px; }
  .filters { display: flex; gap: var(--space-2); flex-wrap: wrap; }
  .filters button { font-family: var(--font-sans); font-size: 13px; border-radius: var(--radius-pill); padding: var(--space-2) var(--space-4); min-height: 40px; cursor: pointer; border: 1px solid var(--line); background: var(--bg); color: var(--ink-muted); transition: color var(--motion-fast), border-color var(--motion-fast); }
  .filters button:hover { color: var(--ink); border-color: var(--line-strong); }
  .filters button[aria-pressed="true"] { background: var(--ink); color: var(--on-ink); border-color: var(--ink); }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); }
  .card { border: 1px solid var(--line); border-radius: var(--radius-xl); overflow: hidden; display: flex; flex-direction: column; transition: border-color var(--motion-fast), transform var(--motion-fast) var(--motion-ease), box-shadow var(--motion-fast); }
  .card:hover { border-color: var(--line-strong); transform: translateY(-2px); box-shadow: 0 24px 48px -24px rgba(124,140,255,.25); }
  .thumb { height: 140px; border-bottom: 1px solid var(--line); background: radial-gradient(70% 80% at 50% 50%, rgba(124,140,255,.07), rgba(124,140,255,0) 70%), var(--surface); display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: 0 var(--space-4); flex-wrap: wrap; }
  .chip { font-family: var(--font-mono); font-size: 11px; padding: var(--space-2); border-radius: var(--radius-sm); background: var(--surface-raised); border: 1px solid var(--line); white-space: nowrap; transition: border-color var(--motion-fast), box-shadow var(--motion-fast); }
  .card:hover .chip.lit { border-color: var(--accent); box-shadow: var(--glow-node); }
  .arr { color: var(--line-strong); font-size: 12px; }
  .body { padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2); font-size: 14px; line-height: 21px; }
  .row { display: flex; justify-content: space-between; gap: var(--space-2); } .row strong { font-size: 16px; font-weight: 500; }
  .id { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); }
  @media (max-width: 960px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 640px) { .grid { grid-template-columns: minmax(0, 1fr); } h1 { font-size: 34px; line-height: 38px; } .filters { flex-wrap: nowrap; overflow-x: auto; } .filters button { flex: none; } }
</style>
