<script lang="ts">
  import Seo from "#lib/components/Seo.svelte";
  import { onMount } from "svelte";
  import { byId, getExamples } from "#lib/examples";
  import EnePlayer from "#lib/components/EnePlayer.svelte";
  import { m } from "#lib/paraglide/messages";
  import { asset } from "$app/paths";
  import { decodeShare, encodeShare } from "#lib/share";

  let pick = $state("07-payment-retry");
  let text = $state(byId("07")!.source);
  let shown = $state(byId("07")!.source);
  const examples = $derived(getExamples());
  let note = $state("");
  let timer: ReturnType<typeof setTimeout>;
  const lines = $derived(text.split("\n").length);
  const steps = $derived(text.split("\n").filter((l) => /(-x|-->|->)/.test(l)).length);

  function load(slug: string) { const ex = byId(slug); if (ex) { pick = ex.slug; text = ex.source; shown = ex.source; choices = []; } }
  function edit(v: string) { text = v; clearTimeout(timer); timer = setTimeout(() => (shown = text), 350); }
  // Branch arms picked in the player; saved in share links and used for the next render
  let choices: number[] = $state([]);
  let embed = $state(false);
  async function copy(what: "link" | "source" | "embed") {
    try {
      const base = `${location.origin}${location.pathname}`;
      const frag = what === "source" ? "" : await encodeShare(text, choices);
      const v = what === "link" ? `${base}#${frag}`
        : what === "embed" ? `<iframe src="${base}?embed#${frag}" title="ene diagram" width="100%" height="480" style="border:0" loading="lazy"></iframe>`
        : text;
      await navigator.clipboard.writeText(v);
      note = what === "link" ? m.playground_link_copied() : what === "embed" ? m.playground_embed_copied() : m.playground_source_copied();
    } catch { note = m.playground_copy_failed(); }
    setTimeout(() => (note = ""), 1800);
  }
  /** The full playground for the diagram shown in the embed view */
  let openHref = $state("");
  // ---- download ----
  type Format = "svg" | "gif" | "mp4" | "webm";
  let player: EnePlayerApi | undefined = $state();
  let format: Format = $state("gif");
  let fps = $state(15);
  let scale = $state(1);
  let theme: EneTheme = $state("light");
  let busy = $state(false);
  let progress = $state("");
  let video = $state<{ mp4: boolean; webm: boolean }>({ mp4: false, webm: false });
  let abort: AbortController | undefined;
  let exporter: Promise<NonNullable<Window["eneExport"]>> | undefined;

  function loadExporter(): Promise<NonNullable<Window["eneExport"]>> {
    exporter ??= new Promise((resolve, reject) => {
      if (window.eneExport) return resolve(window.eneExport);
      const s = document.createElement("script");
      s.src = asset("ene-export.js");
      s.onload = () => (window.eneExport ? resolve(window.eneExport) : reject(new Error("ene-export.js did not load")));
      s.onerror = () => { exporter = undefined; reject(new Error("ene-export.js did not load")); };
      document.head.appendChild(s);
    });
    return exporter;
  }
  function setFormat(f: Format) {
    format = f;
    if (f === "gif") { fps = 15; scale = 1; } else if (f !== "svg") { fps = 30; scale = 2; }
    if (f !== "svg" && theme === "auto") theme = "light";
  }
  function save(blob: Blob, ext: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${pick && byId(pick)?.source === text ? pick : "diagram"}.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  }
  async function download() {
    if (!player || busy) return;
    const svg = player.toSvg();
    busy = true; progress = "";
    abort = new AbortController();
    try {
      const ex = await loadExporter();
      if (format === "svg") { save(new Blob([ex.themedSvg(svg, theme)], { type: "image/svg+xml" }), "svg"); return; }
      const r = await ex.exportVideo(svg, { format, fps, scale, theme, signal: abort.signal,
        onProgress: (d, t) => (progress = m.playground_dl_progress({ done: d, total: t })) });
      save(r.blob, r.format);
      note = m.playground_dl_done({ size: `${Math.max(1, Math.round(r.blob.size / 1024))} KB` });
      setTimeout(() => (note = ""), 3000);
    } catch (e) {
      if ((e as Error).name !== "AbortError") { note = m.playground_dl_failed({ reason: (e as Error).message }); setTimeout(() => (note = ""), 5000); }
    } finally { busy = false; progress = ""; abort = undefined; }
  }

  onMount(() => {
    void loadExporter().then((ex) => ex.videoSupport()).then((v) => (video = v)).catch(() => {});
    embed = document.documentElement.classList.contains("embed");
    const h = location.hash.slice(1);
    if (/^(z|src)=/.test(h)) {
      decodeShare(h).then((s) => {
        if (!s) return;
        choices = s.choices; text = shown = s.source; pick = "";
        openHref = `${location.origin}${location.pathname}#${h}`;
      }).catch(() => { note = m.playground_link_broken(); });
    } else if (h) { load(h); openHref = `${location.origin}${location.pathname}#${h}`; }
    else openHref = `${location.origin}${location.pathname}`;
  });
</script>

<Seo title={m.playground_title()} description={m.meta_playground_description()} type="website" />

{#if embed}
<div class="embed-view">
  <EnePlayer source={shown} label={m.playground_preview_label()} {choices} />
  <a class="open" href={openHref} target="_blank" rel="noopener">{m.playground_open_full()}</a>
  {#if note}<p class="note" role="status">{note}</p>{/if}
</div>
{:else}
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
        <button type="button" class="ctl" onclick={() => copy("embed")}>{m.playground_copy_embed()}</button>
      </div>
    </div>
    <div class="stage"><EnePlayer source={shown} label={m.playground_preview_label()} {choices} onchoices={(c) => (choices = c)} onplayer={(p) => (player = p)} /></div>
    <form class="dl" aria-label={m.playground_dl_label()} onsubmit={(e) => { e.preventDefault(); void download(); }}>
      <label>{m.playground_dl_format()}
        <select value={format} onchange={(e) => setFormat((e.currentTarget as HTMLSelectElement).value as Format)} disabled={busy}>
          <option value="svg">{m.playground_dl_svg()}</option>
          <option value="gif">GIF</option>
          {#if video.mp4}<option value="mp4">MP4</option>{/if}
          {#if video.webm}<option value="webm">{m.playground_dl_webm()}</option>{/if}
        </select>
      </label>
      {#if format !== "svg"}
        <label>fps <input type="number" min="1" max="60" step="1" bind:value={fps} disabled={busy} /></label>
        <label>{m.playground_dl_scale()}
          <select bind:value={scale} disabled={busy}>{#each [0.5, 1, 1.5, 2, 3] as s}<option value={s}>{s}×</option>{/each}</select>
        </label>
      {/if}
      <label>{m.playground_dl_theme()}
        <select bind:value={theme} disabled={busy}>
          {#if format === "svg"}<option value="auto">{m.playground_dl_theme_auto()}</option>{/if}
          <option value="light">{m.playground_dl_theme_light()}</option>
          <option value="dark">{m.playground_dl_theme_dark()}</option>
        </select>
      </label>
      {#if busy && format !== "svg"}
        <button type="button" class="ctl" onclick={() => abort?.abort()}>{m.playground_dl_cancel()}</button>
        <span class="note" role="status">{progress}</span>
      {:else}
        <button type="submit" class="ctl" disabled={!player}>{m.playground_dl_button()}</button>
      {/if}
    </form>
    <p class="hint muted">{m.playground_dl_hint()}</p>
  </section>
</div>
{/if}

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
  .dl { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-top: 1px solid var(--line); background: var(--bg); }
  .dl label { display: flex; align-items: center; gap: var(--space-2); font-size: 12px; color: var(--ink-muted); }
  .dl select { flex: none; }
  .dl input { width: 64px; min-height: 36px; background: var(--surface); color: var(--ink); border: 1px solid var(--line); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 13px; padding: 0 var(--space-2); }
  :global(html.embed) .pg { display: none; }
  .embed-view { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
  .embed-view .open { align-self: flex-end; font-size: 12px; color: var(--ink-muted); }
  .hint { padding: var(--space-4); border-top: 1px solid var(--line); font-size: 13px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  @media (max-width: 860px) { .pg { grid-template-columns: minmax(0, 1fr); } .editor { border-right: 0; border-bottom: 1px solid var(--line); } textarea { min-height: 320px; } .stage { padding: var(--space-6) var(--space-4); } }
</style>
