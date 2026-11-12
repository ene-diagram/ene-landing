<script lang="ts">
  import { href } from "#lib/href";
  import Code from "#lib/components/Code.svelte";
  import EnePlayer from "#lib/components/EnePlayer.svelte";
  import { byId } from "#lib/examples";
  import { reveal } from "#lib/reveal";
  import { m } from "#lib/paraglide/messages";

  const order = byId("01")!.source;
  const cache = byId("03")!.source;
  let copied = $state(false);
  async function copyInstall() { try { await navigator.clipboard.writeText("npm i ene"); copied = true; setTimeout(() => (copied = false), 1400); } catch { copied = false; } }
  const trio = $derived([
    { a: "->", t: m.home_arrow_request(), b: m.home_arrow_request_text() },
    { a: "-->", t: m.home_arrow_response(), b: m.home_arrow_response_text() },
    { a: "-x", t: m.home_arrow_failure(), b: m.home_arrow_failure_text() }
  ]);
</script>

<svelte:head><title>{m.home_title()}</title></svelte:head>

<header class="hero wrap">
  <a class="badge" href="#embed">{m.home_badge()}</a>
  <h1>{m.home_h1()}</h1>
  <p>{m.home_lede()}</p>
  <div class="ctas">
    <a class="btn btn-primary" href={href(`/docs/introduction/`)}>{m.home_get_started()}</a>
    <button type="button" class="btn btn-mono" onclick={copyInstall} aria-label={m.home_copy_install()}>$ {copied ? m.home_copied() : "npm i ene"}</button>
  </div>
  <p class="pre muted">{m.home_not_released()}</p>
</header>

<section class="wrap" aria-label={m.home_live_example()}>
  <div class="player">
    <div class="phead"><span>order.ene</span><a href={href(`/playground/#01-order`)}>{m.home_edit_in_playground()}</a></div>
    <div class="pbody">
      <div class="src"><Code code={order} copy={false} /></div>
      <div class="live"><EnePlayer source={order} label={m.home_order_label()} /></div>
    </div>
  </div>
</section>

<section class="wrap block" id="syntax" use:reveal>
  <div class="row"><div class="tt"><span class="kicker">{m.home_syntax_kicker()}</span><h2>{m.home_syntax_h2()}</h2></div>
    <p class="muted">{m.home_syntax_p()}</p></div>
  <div class="trio">
    {#each trio as x}<div><code class:fail={x.a === "-x"}>{x.a}</code><h3>{x.t}</h3><p class="muted">{x.b}</p></div>{/each}
  </div>
  <a class="more" href={href(`/docs/syntax/`)}>{m.home_full_syntax()}</a>
</section>

<section class="wrap block" id="branches" use:reveal>
  <div class="row"><div class="tt"><span class="kicker">{m.home_branches_kicker()}</span><h2>{m.home_branches_h2()}</h2></div>
    <p class="muted">{@html m.home_branches_p()}</p></div>
  <div class="panel"><EnePlayer source={cache} label={m.home_cache_label()} /></div>
</section>

<section class="wrap block" id="embed" use:reveal>
  <div class="embed">
    <div class="ecopy"><span class="kicker">{m.home_embed_kicker()}</span><h2>{m.home_embed_h2()}</h2>
      <p class="muted">{m.home_embed_p()}</p>
      <div><a class="btn btn-mono" href={href(`/docs/image/`)}>$ ene flow.ene -o flow.svg</a></div></div>
    <div class="emd"><span class="muted">README.md</span>
      <pre><span class="h">## {m.home_embed_md_heading()}</span>

![{m.home_embed_md_alt()}](order.svg)
<span class="c">&lt;!-- {m.home_embed_md_comment()} --&gt;</span></pre></div>
  </div>
</section>

<section class="wrap end" use:reveal>
  <h2>{m.home_end_h2()}</h2>
  <div class="ctas"><a class="btn btn-primary" href={href(`/docs/introduction/`)}>{m.home_read_docs()}</a><a class="btn" href={href(`/examples/`)}>{m.home_browse_examples()}</a></div>
</section>

<style>
  .hero { position: relative; padding-top: var(--space-30); padding-bottom: var(--space-18); display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-6); }
  .hero::before { content: ""; position: absolute; inset: 0 0 auto 50%; width: 900px; height: 600px; transform: translateX(-50%); background: radial-gradient(50% 50% at 50% 40%, rgba(124,140,255,.12), rgba(124,140,255,0) 70%); pointer-events: none; z-index: -1; animation: drift 12s var(--motion-ease) infinite alternate; }
  @keyframes drift { to { transform: translateX(-46%) translateY(24px); } }
  .badge { font-size: 13px; color: var(--accent-soft); border: 1px solid var(--line); border-radius: var(--radius-pill); padding: var(--space-1) var(--space-4); transition: border-color var(--motion-fast); }
  .badge:hover { border-color: var(--line-strong); }
  h1 { font-size: 80px; line-height: 80px; letter-spacing: -0.045em; font-weight: 600; max-width: 880px; animation: rise 900ms var(--motion-ease) both; }
  .hero > p:not(.pre) { font-size: 19px; line-height: 29px; color: var(--ink-muted); max-width: 560px; animation: rise 900ms 120ms var(--motion-ease) both; }
  .ctas { display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center; animation: rise 900ms 220ms var(--motion-ease) both; }
  .pre { font-size: 12px; font-family: var(--font-mono); }
  @keyframes rise { from { opacity: 0; transform: translateY(var(--space-4)); } }

  .player { border: 1px solid var(--line); border-radius: var(--radius-xl); background: var(--surface); overflow: hidden; animation: rise 1000ms 320ms var(--motion-ease) both; }
  .phead { display: flex; justify-content: space-between; align-items: center; min-height: 48px; padding: 0 var(--space-4); border-bottom: 1px solid var(--line); font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); }
  .phead a { color: var(--accent-soft); transition: color var(--motion-fast); } .phead a:hover { color: var(--ink); }
  .pbody { display: grid; grid-template-columns: minmax(280px, 400px) minmax(0, 1fr); }
  .src { border-right: 1px solid var(--line); }
  .src :global(.code) { border: 0; border-radius: 0; background: transparent; }
  .src :global(.head) { display: none; }
  .live { padding: var(--space-8); background: radial-gradient(60% 70% at 55% 20%, rgba(124,140,255,.10), rgba(124,140,255,0) 70%); overflow-x: auto; }

  .block { padding-top: var(--space-30); display: flex; flex-direction: column; gap: var(--space-12); }
  .row { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-12); flex-wrap: wrap; }
  .tt { display: flex; flex-direction: column; gap: var(--space-4); }
  h2 { font-size: 48px; line-height: 52px; letter-spacing: -0.03em; font-weight: 600; max-width: 560px; }
  .row > p { font-size: 15px; line-height: 23px; max-width: 400px; }
  .trio { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius-xl); overflow: hidden; }
  .trio div { background: var(--bg); padding: var(--space-8); display: flex; flex-direction: column; gap: var(--space-3); transition: background-color var(--motion-fast); }
  .trio div:hover { background: var(--surface); }
  .trio code { font-size: 22px; color: var(--accent-soft); } .trio code.fail { color: var(--danger); }
  h3 { font-size: 22px; line-height: 28px; font-weight: 500; letter-spacing: -0.01em; }
  .trio p { font-size: 15px; line-height: 23px; }
  .more { align-self: flex-start; font-size: 14px; color: var(--accent-soft); margin-top: calc(-1 * var(--space-6)); transition: color var(--motion-fast); } .more:hover { color: var(--ink); }
  .panel { border: 1px solid var(--line); border-radius: var(--radius-xl); background: var(--surface); padding: var(--space-8); overflow-x: auto; }

  .embed { border: 1px solid var(--line); border-radius: var(--radius-xl); display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); overflow: hidden; }
  .ecopy { padding: var(--space-12); display: flex; flex-direction: column; gap: var(--space-6); border-right: 1px solid var(--line); }
  .ecopy p { font-size: 15px; line-height: 23px; max-width: 420px; }
  .emd { padding: var(--space-12); background: var(--surface); display: flex; flex-direction: column; gap: var(--space-4); font-family: var(--font-mono); font-size: 12px; }
  .emd pre { margin: 0; font-size: 13px; line-height: 26px; color: var(--ink-muted); white-space: pre-wrap; } .emd .h { color: var(--ink); } .emd .c { color: var(--ink-muted); opacity: .7; }

  .end { padding-top: var(--space-40); display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-8); }
  .end h2 { font-size: 64px; line-height: 66px; letter-spacing: -0.04em; max-width: 760px; }

  @media (max-width: 900px) { .pbody, .embed { grid-template-columns: minmax(0, 1fr); } .src { border-right: 0; border-bottom: 1px solid var(--line); } .ecopy { border-right: 0; border-bottom: 1px solid var(--line); } .trio { grid-template-columns: minmax(0, 1fr); } }
  @media (max-width: 640px) {
    .hero { padding-top: var(--space-14); padding-bottom: var(--space-10); align-items: flex-start; text-align: left; }
    h1 { font-size: 44px; line-height: 46px; } .hero > p:not(.pre) { font-size: 16px; line-height: 25px; }
    .ctas { flex-direction: column; align-self: stretch; } .ctas :global(.btn) { width: 100%; }
    .block { padding-top: var(--space-18); gap: var(--space-6); } h2 { font-size: 32px; line-height: 36px; } .end h2 { font-size: 36px; line-height: 40px; }
    .live, .panel, .ecopy, .emd { padding: var(--space-4); } .end { padding-top: var(--space-24); align-items: stretch; text-align: left; }
  }
  @media (prefers-reduced-motion: reduce) { .hero::before, h1, .hero > p, .ctas, .player { animation: none; } }
</style>
