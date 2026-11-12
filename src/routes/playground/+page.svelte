<script lang="ts">
  import { onMount } from "svelte";
  import { byId, getExamples } from "#lib/examples";
  import EnePlayer from "#lib/components/EnePlayer.svelte";
  import { m } from "#lib/paraglide/messages";

  let pick = $state("07-payment-retry");
  let text = $state(byId("07")!.source);
  let shown = $state(byId("07")!.source);
  const examples = $derived(getExamples());
  let note = $state("");
  let timer: ReturnType<typeof setTimeout>;
  const lines = $derived(text.split("\n").length);
  const steps = $derived(text.split("\n").filter((l) => /(-x|-->|->)/.test(l)).length);

  function load(slug: string) { const ex = byId(slug); if (ex) { pick = ex.slug; text = ex.source; shown = ex.source; } }
  function edit(v: string) { text = v; clearTimeout(timer); timer = setTimeout(() => (shown = text), 350); }
  function encode(s: string) { return btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function decode(s: string) { const b = atob(s.replace(/-/g, "+").replace(/_/g, "/")); return new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0))); }
  async function copy(what: "link" | "source") {
    const v = what === "link" ? `${location.origin}${location.pathname}#src=${encode(text)}` : text;
    try { await navigator.clipboard.writeText(v); note = what === "link" ? m.playground_link_copied() : m.playground_source_copied(); } catch { note = m.playground_copy_failed(); }
    setTimeout(() => (note = ""), 1800);
  }
  onMount(() => {
    const h = location.hash.slice(1);
    if (h.startsWith("src=")) { try { text = shown = decode(h.slice(4)); pick = ""; } catch { /* keep default */ } }
    else if (h) load(h);
  });
</script>

<svelte:head><title>{m.playground_title()}</title></svelte:head>

<div class="pg">
  <section class="editor" aria-label={m.playground_editor()}>
    <div class="bar">
      <label for="ex">{m.playground_example()}</label>
      <select id="ex" value={pick} onchange={(e) => load((e.currentTarget as HTMLSelectElement).value)}>
        {#if !pick}<option value="">{m.playground_shared_link()}</option>{/if}
        {#each examples as e}<option value={e.slug}>{e.id} · {e.title}</option>{/each}
      </select>
    </div>
    <label class="sr" for="src">{m.playground_source_label()}</label>
    <textarea id="src" spellcheck="false" value={text} oninput={(e) => edit((e.currentTarget as HTMLTextAreaElement).value)}></textarea>
    <div class="status"><span><i aria-hidden="true"></i> {m.playground_stats({ lines, steps })}</span><span>{m.playground_live()}</span></div>
  </section>
  <section class="view" aria-label={m.playground_player()}>
    <div class="bar">
      <span class="kicker">{m.playground_preview_kicker()}</span>
      <div class="acts">
        <span class="note" role="status">{note}</span>
        <button type="button" class="ctl" onclick={() => copy("source")}>{m.playground_copy_source()}</button>
        <button type="button" class="ctl" onclick={() => copy("link")}>{m.playground_copy_link()}</button>
      </div>
    </div>
    <div class="stage"><EnePlayer source={shown} label={m.playground_preview_label()} /></div>
    <p class="hint muted">{@html m.playground_hint()}</p>
  </section>
</div>

<style>
  .pg { display: grid; grid-template-columns: minmax(320px, 480px) minmax(0, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); min-height: calc(100vh - 64px); }
  .editor { border-right: 1px solid var(--line); display: flex; flex-direction: column; background: var(--surface); }
  .bar { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); padding: var(--space-2) var(--space-4); min-height: 52px; border-bottom: 1px solid var(--line); background: var(--bg); flex-wrap: wrap; }
  .bar label { font-size: 12px; color: var(--ink-muted); }
  select { flex: 1; min-height: 36px; background: var(--surface); color: var(--ink); border: 1px solid var(--line); border-radius: var(--radius-sm); font-family: var(--font-sans); font-size: 13px; padding: 0 var(--space-2); }
  textarea { flex: 1; min-height: 480px; resize: none; border: 0; background: transparent; color: var(--ink); caret-color: var(--accent-soft); font-family: var(--font-mono); font-size: 13px; line-height: 28px; padding: var(--space-4); outline: none; tab-size: 2; }
  textarea:focus-visible { box-shadow: inset 0 0 0 1px var(--accent); }
  .status { display: flex; justify-content: space-between; gap: var(--space-2); padding: var(--space-2) var(--space-4); border-top: 1px solid var(--line); font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); }
  .status i { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-soft); margin-right: var(--space-1); vertical-align: middle; }
  .view { display: flex; flex-direction: column; min-width: 0; }
  .acts { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; }
  .note { font-family: var(--font-mono); font-size: 12px; color: var(--accent-soft); }
  .stage { flex: 1; padding: var(--space-12) var(--space-8); overflow: auto; background: radial-gradient(50% 60% at 50% 40%, rgba(124,140,255,.10), rgba(124,140,255,0) 70%); }
  .hint { padding: var(--space-4); border-top: 1px solid var(--line); font-size: 13px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  @media (max-width: 860px) { .pg { grid-template-columns: minmax(0, 1fr); } .editor { border-right: 0; border-bottom: 1px solid var(--line); } textarea { min-height: 320px; } .stage { padding: var(--space-6) var(--space-4); } }
</style>
