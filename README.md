# ene-landing

The landing page, docs, examples and playground for [ene](https://github.com/ene-diagram/ene), built with SvelteKit as a fully static site.

## Develop

Requires Node 24+ (scripts are TypeScript run by Node directly) and pnpm.

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

## Languages

English (default, unprefixed) and Korean (`/ko/...`), via [Paraglide JS](https://paraglidejs.com).

- UI strings: `messages/en.json` and `messages/ko.json`, used as `m.key()` from `#lib/paraglide/messages`. `pnpm i18n` (also run by `pnpm check`) regenerates `src/lib/paraglide`; `pnpm build` and `pnpm dev` do it too.
- Docs content: `src/lib/docs/en.ts` and `src/lib/docs/ko.ts` (same slugs, ids and code samples).
- Example titles and blurbs: `ex_NN_*` keys in the messages files.
- New locale: add it to `locales` in `project.inlang/settings.json`, add its entry to `localized` in `project.inlang/paraglide.config.ts`, create `messages/<locale>.json`, add `src/lib/docs/<locale>.ts` and register it in `src/lib/docs.ts`, and add its name to `src/lib/i18n.ts`.
- Always build links with `href()` from `#lib/href` so they get the locale prefix and base path.

## Design tokens

Colours, type, spacing, radius and shadows come from the **ene** design system.
`design/tokens.json` is a copy of its token file; `pnpm sync:tokens` (also run by `pnpm build`) turns it into `src/lib/styles/tokens.css`. Style with `var(--token)`, never raw values.

To change a token: edit it in the design system, copy its `tokens.json` over `design/tokens.json`, then build.

## Updating the player

`pnpm sync:player` copies `demo/ene.js`, `demo/ene-elk.js` and `demo/logos-subset.js` from a sibling checkout of `ene-diagram/ene` (or `ENE_DIR=...`). Examples are copied from `packages/core/examples`.

## Toolchain

Everything is TypeScript: routes, components, `vite.config.ts` and the `scripts/*.ts` that Node runs directly.
Dependencies are on their latest releases (SvelteKit 3, Svelte 5, Vite 8) except TypeScript, which is pinned to 6.0: SvelteKit 3 declares `typescript ^6` as its peer and relies on the JavaScript compiler API that TypeScript 7 no longer ships.

`pnpm check` type-checks the app (svelte-check) and the scripts (tsc).
