# ene-landing

The landing page, docs, examples and playground for [ene](https://github.com/slop-makers/ene), built with SvelteKit as a fully static site.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # static site in build/
pnpm preview
```

Set `BASE_PATH=/ene-landing` when the site is served from a sub-path.

## What is where

| Path | What |
|---|---|
| `src/routes/+page.svelte` | Landing |
| `src/routes/docs/[slug]` | Docs pages, content in `src/lib/docs.ts` |
| `src/routes/examples` | Example gallery and one page per example, from `src/lib/examples/*.ene` |
| `src/routes/playground` | Editor with a live player |
| `static/ene.js`, `ene-elk.js`, `logos-subset.js` | The ene browser player |

## Design tokens

Colours, type, spacing, radius and shadows come from the **ene** design system.
`design/tokens.json` is a copy of its token file; `pnpm sync:tokens` (also run by `pnpm build`) turns it into `src/lib/styles/tokens.css`. Style with `var(--token)`, never raw values.

To change a token: edit it in the design system, copy its `tokens.json` over `design/tokens.json`, then build.

## Updating the player

`pnpm sync:player` copies `demo/ene.js`, `demo/ene-elk.js` and `demo/logos-subset.js` from a sibling checkout of `slop-makers/ene` (or `ENE_DIR=...`). Examples are copied from `packages/core/examples`.
