<script lang="ts">
  let { code, file = "", active = -1, copy = true }: { code: string; file?: string; active?: number; copy?: boolean } = $props();
  let copied = $state(false);
  const lines = $derived(code.split("\n"));
  const tone = (l: string) => /\s-x\s/.test(l) ? "fail" : /^\s*(wait|branch|else|end|loop|group|diagram)\b/.test(l) ? "kw" : /^\s*title\b/.test(l) ? "dim" : "";
  async function doCopy() {
    try { await navigator.clipboard.writeText(code); copied = true; setTimeout(() => (copied = false), 1400); } catch { copied = false; }
  }
</script>

<div class="code">
  <div class="head">
    <span>{file}</span>
    {#if copy}<button type="button" class="ctl" onclick={doCopy}>{copied ? "Copied" : "Copy"}</button>{/if}
  </div>
  <pre><code>{#each lines as l, i}<span class="ln {tone(l)}" class:on={i === active}>{l || " "}</span>{/each}</code></pre>
</div>

<style>
  .code { border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); overflow: hidden; }
  .head { display: flex; justify-content: space-between; align-items: center; min-height: 44px; padding: var(--space-1) var(--space-2) var(--space-1) var(--space-4); border-bottom: 1px solid var(--line); font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); }
  pre { margin: 0; padding: var(--space-4) 0; font-size: 13px; line-height: 24px; overflow-x: auto; }
  .ln { display: block; padding: 0 var(--space-4); color: var(--ink); white-space: pre; }
  .ln.dim { color: var(--ink-muted); }
  .ln.kw { color: var(--accent-soft); }
  .ln.fail { color: var(--danger); }
  .ln.on { background: rgba(124, 140, 255, .08); box-shadow: inset 2px 0 0 var(--accent); }
</style>
