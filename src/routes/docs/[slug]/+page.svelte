<script lang="ts">
  import { href } from "#lib/href";
  import { getDocs, getGroups } from "#lib/docs";
  import Code from "#lib/components/Code.svelte";
  import EnePlayer from "#lib/components/EnePlayer.svelte";
  import { reveal } from "#lib/reveal";
  import { m } from "#lib/paraglide/messages";
  let { data } = $props();
  const doc = $derived(data.doc);
  const docs = $derived(getDocs());
  const groups = $derived(getGroups());
</script>

<svelte:head><title>{m.docs_page_title({ title: doc.title })}</title></svelte:head>

<div class="docs wrap">
  <aside class="side" aria-label={m.docs_nav_label()}>
    <label class="pick"><span class="kicker">{m.docs_page_kicker()}</span>
      <select onchange={(e) => (location.href = href(`/docs/${(e.currentTarget as HTMLSelectElement).value}/`))} value={doc.slug}>
        {#each docs as d}<option value={d.slug}>{d.group} / {d.title}</option>{/each}
      </select>
    </label>
    {#each groups as g}
      <div class="grp">
        <div class="kicker">{g.toUpperCase()}</div>
        {#each docs.filter((d) => d.group === g) as d}
          <a href={href(`/docs/${d.slug}/`)} aria-current={d.slug === doc.slug ? "page" : undefined}>{d.title}</a>
        {/each}
      </div>
    {/each}
  </aside>

  <article>
    <div class="crumb">{doc.group} / <span>{doc.title}</span></div>
    <h1>{doc.title}</h1>
    <p class="lede">{@html doc.lede}</p>
    {#each doc.sections as s}
      <section id={s.id} use:reveal>
        <h2>{s.h}</h2>
        {#each s.blocks as b}
          {#if b.t === "p"}<p class="p">{@html b.html}</p>
          {:else if b.t === "code"}<Code code={b.code} file={b.file} />
          {:else if b.t === "player"}<div class="stage"><EnePlayer source={b.code} label={b.label} /></div>
          {:else if b.t === "list"}<ul>{#each b.items as it}<li>{@html it}</li>{/each}</ul>
          {:else if b.t === "callout"}<div class="callout"><span class:danger={b.tone === "danger"}>{b.label}</span><p>{@html b.html}</p></div>
          {:else if b.t === "table"}
            <div class="tbl"><table><thead><tr>{#each b.head as h}<th scope="col">{h}</th>{/each}</tr></thead>
              <tbody>{#each b.rows as r}<tr>{#each r as c, ci}<td class:mono={b.mono?.includes(ci)} class:fail={c.includes(" -x ")}>{@html c}</td>{/each}</tr>{/each}</tbody></table></div>
          {:else if b.t === "stats"}<div class="stats">{#each b.items as [v, l]}<div><strong>{v}</strong><span>{l}</span></div>{/each}</div>
          {:else if b.t === "cards"}<div class="cards">{#each b.items as c}<a class="card" href={href(`${c.href}/`)}><code>{c.code}</code><strong>{c.title}</strong><span>{c.text}</span></a>{/each}</div>
          {/if}
        {/each}
      </section>
    {/each}
    <nav class="pn" aria-label={m.docs_pn_label()}>
      {#if data.prev}<a class="card" href={href(`/docs/${data.prev.slug}/`)}><span>{m.docs_previous()}</span><strong>{data.prev.title}</strong></a>{:else}<span></span>{/if}
      {#if data.next}<a class="card r" href={href(`/docs/${data.next.slug}/`)}><span>{m.docs_next()}</span><strong>{data.next.title}</strong></a>{/if}
    </nav>
  </article>

  <aside class="toc" aria-label={m.docs_toc_label()}>
    <div class="kicker">{m.docs_toc_kicker()}</div>
    {#each doc.sections as s}<a href="#{s.id}">{s.h}</a>{/each}
  </aside>
</div>

<style>
  .docs { display: grid; grid-template-columns: 220px minmax(0, 1fr) 180px; gap: var(--space-12); max-width: 1360px; padding-top: var(--space-10); }
  .side { position: sticky; top: 88px; align-self: start; display: flex; flex-direction: column; gap: var(--space-8); }
  .grp { display: flex; flex-direction: column; gap: 2px; }
  .grp .kicker { padding: 0 var(--space-3) var(--space-2); }
  .grp a { font-size: 14px; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); color: var(--ink-muted); transition: color var(--motion-fast), background-color var(--motion-fast); }
  .grp a:hover { color: var(--ink); }
  .grp a[aria-current="page"] { color: var(--ink); background: var(--surface-raised); box-shadow: inset 2px 0 0 var(--accent); }
  .pick { display: none; }
  article { max-width: 760px; display: flex; flex-direction: column; gap: var(--space-5); padding-bottom: var(--space-24); min-width: 0; }
  .crumb { font-size: 13px; color: var(--ink-muted); } .crumb span { color: var(--ink); }
  h1 { font-size: 48px; line-height: 52px; letter-spacing: -0.03em; font-weight: 600; }
  .lede { font-size: 19px; line-height: 29px; color: var(--ink-muted); }
  section { display: flex; flex-direction: column; gap: var(--space-5); padding-top: var(--space-10); scroll-margin-top: 88px; }
  h2 { font-size: 28px; line-height: 34px; letter-spacing: -0.02em; font-weight: 600; }
  .p, li { font-size: 15px; line-height: 25px; color: var(--ink-muted); }
  ul { margin: 0; padding-left: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2); }
  .stage { border: 1px solid var(--line); border-radius: var(--radius-xl); background: radial-gradient(60% 70% at 50% 30%, rgba(124,140,255,.08), rgba(124,140,255,0) 70%), var(--surface); padding: var(--space-8) var(--space-6); overflow-x: auto; }
  .callout { display: flex; gap: var(--space-3); border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); padding: var(--space-4) var(--space-5); font-size: 14px; line-height: 22px; }
  .callout span { font-family: var(--font-mono); font-size: 12px; color: var(--accent-soft); flex: none; padding-top: 1px; }
  .callout span.danger { color: var(--danger); }
  .callout p { color: var(--ink-muted); }
  .tbl { border: 1px solid var(--line); border-radius: var(--radius-xl); overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; text-align: left; }
  th { background: var(--surface); padding: var(--space-3) var(--space-5); font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-muted); font-weight: 400; }
  td { border-top: 1px solid var(--line); padding: var(--space-4) var(--space-5); font-size: 14px; color: var(--ink-muted); }
  td:first-child { color: var(--ink); }
  td.mono { font-family: var(--font-mono); font-size: 13px; white-space: nowrap; }
  td.fail { color: var(--danger); }
  .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius-xl); overflow: hidden; }
  .stats div { background: var(--bg); padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-2); }
  .stats strong { font-size: 32px; font-weight: 600; letter-spacing: -0.03em; } .stats span { font-size: 13px; color: var(--ink-muted); }
  .cards, .pn { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
  .pn { margin-top: var(--space-10); }
  .card { border: 1px solid var(--line); border-radius: var(--radius-lg); padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2); transition: border-color var(--motion-fast), transform var(--motion-fast) var(--motion-ease), box-shadow var(--motion-fast); }
  .card:hover { border-color: var(--line-strong); transform: translateY(-2px); box-shadow: 0 24px 48px -24px rgba(124,140,255,.25); }
  .card span { font-size: 12px; color: var(--ink-muted); } .card strong { font-size: 16px; font-weight: 500; } .card code { font-size: 13px; color: var(--accent-soft); }
  .card.r { text-align: right; }
  .toc { position: sticky; top: 88px; align-self: start; display: flex; flex-direction: column; gap: var(--space-3); font-size: 13px; padding-top: var(--space-2); }
  .toc a { color: var(--ink-muted); transition: color var(--motion-fast); } .toc a:hover { color: var(--ink); }
  @media (max-width: 1100px) { .docs { grid-template-columns: 200px minmax(0, 1fr); } .toc { display: none; } }
  @media (max-width: 760px) {
    .docs { grid-template-columns: minmax(0, 1fr); gap: var(--space-6); padding-top: var(--space-4); }
    .side { position: static; } .grp { display: none; }
    .pick { display: flex; flex-direction: column; gap: var(--space-2); }
    .pick select { min-height: 44px; background: var(--surface); color: var(--ink); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 0 var(--space-3); font-family: var(--font-sans); font-size: 14px; }
    h1 { font-size: 34px; line-height: 38px; } .lede { font-size: 16px; line-height: 25px; }
    .stats, .cards { grid-template-columns: minmax(0, 1fr); }
  }
</style>
