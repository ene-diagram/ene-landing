<script lang="ts">
  import { href } from "#lib/href";
  import Code from "#lib/components/Code.svelte";
  import EnePlayer from "#lib/components/EnePlayer.svelte";
  import { m } from "#lib/paraglide/messages";
  import Seo from "#lib/components/Seo.svelte";
  let { data } = $props();
  const ex = $derived(data.ex);
</script>

<Seo title={m.example_page_title({ title: ex.title })} description={m.meta_example_description({ blurb: ex.blurb })} />

<div class="wrap page">
  <a class="back" href={href(`/examples/`)}>{m.example_back()}</a>
  <div class="head"><div><span class="kicker">{m.example_kicker({ id: ex.id })}</span><h1>{ex.title}</h1><p class="muted">{ex.blurb}</p></div>
    <a class="btn btn-primary" href={href(`/playground/#${ex.slug}`)}>{m.example_open_playground()}</a></div>
  <div class="stage"><EnePlayer source={ex.source} label={ex.title} /></div>
  <Code code={ex.source} file="{ex.slug}.ene" />
  <nav class="pn" aria-label={m.example_pn_label()}>
    {#if data.prev}<a class="card" href={href(`/examples/${data.prev.slug}/`)}><span>← {data.prev.id}</span><strong>{data.prev.title}</strong></a>{:else}<span></span>{/if}
    {#if data.next}<a class="card r" href={href(`/examples/${data.next.slug}/`)}><span>{data.next.id} →</span><strong>{data.next.title}</strong></a>{/if}
  </nav>
</div>

<style>
  .page { padding-top: var(--space-10); display: flex; flex-direction: column; gap: var(--space-8); }
  .back { font-size: 14px; color: var(--ink-muted); transition: color var(--motion-fast); } .back:hover { color: var(--ink); }
  .head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-6); flex-wrap: wrap; }
  .head > div { display: flex; flex-direction: column; gap: var(--space-3); }
  h1 { font-size: 48px; line-height: 52px; letter-spacing: -0.03em; font-weight: 600; }
  .stage { border: 1px solid var(--line); border-radius: var(--radius-xl); background: radial-gradient(60% 70% at 50% 30%, rgba(124,140,255,.10), rgba(124,140,255,0) 70%), var(--surface); padding: var(--space-12) var(--space-8); overflow-x: auto; }
  .pn { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
  .card { border: 1px solid var(--line); border-radius: var(--radius-lg); padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2); transition: border-color var(--motion-fast), transform var(--motion-fast) var(--motion-ease); }
  .card:hover { border-color: var(--line-strong); transform: translateY(-2px); }
  .card span { font-size: 12px; color: var(--ink-muted); font-family: var(--font-mono); } .card strong { font-weight: 500; } .card.r { text-align: right; }
  @media (max-width: 640px) { h1 { font-size: 34px; line-height: 38px; } .stage { padding: var(--space-6) var(--space-4); } }
</style>
