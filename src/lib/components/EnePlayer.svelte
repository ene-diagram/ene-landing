<script lang="ts">
  import { m } from "#lib/paraglide/messages";
  import { getLocale } from "#lib/paraglide/runtime";
  let { source, label, autoplay = true, loop = true, choices, onchoices, onplayer }: {
    source: string; label?: string; autoplay?: boolean; loop?: boolean;
    /** Initial branch choices, read on each render */
    choices?: number[];
    /** The viewer picked another branch arm */
    onchoices?: (choices: number[]) => void;
    /** The player after each render (undefined when the source has errors) */
    onplayer?: (player: EnePlayerApi | undefined) => void;
  } = $props();
  let host: HTMLDivElement;
  let failed = $state(false);

  async function draw(src: string) {
    if (!host) return;
    if (!window.ene) { failed = true; return; }
    failed = false;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = seq;
    const player = await window.ene.render(host, src, { lang: getLocale(), autoplay: autoplay && !reduce, loop, choices, onChoicesChange: (c) => onchoices?.(c) });
    if (n === seq) onplayer?.(player);
  }
  let seq = 0;
  $effect(() => { const s = source; const n = ++seq; queueMicrotask(() => { if (n === seq) draw(s); }); });
</script>

<figure class="ene-host" aria-label={label ?? m.player_default_label()}>
  <div bind:this={host}><pre class="fallback">{source}</pre></div>
  {#if failed}<figcaption class="muted">{m.player_failed()}</figcaption>{/if}
</figure>

<style>
  figure { margin: 0; min-width: 0; }
  .fallback { margin: 0; font-size: 13px; line-height: 24px; color: var(--ink-muted); white-space: pre-wrap; }
  figcaption { font-size: 13px; margin-top: var(--space-3); }
</style>
