// Shared by the vite plugin and `pnpm i18n` (paraglide-js compile).
const base = process.env.BASE_PATH ?? "";

export default {
  outdir: "./src/lib/paraglide",
  emitTsDeclarations: true,
  strategy: ["url", "baseLocale"],
  trailingSlash: "always",
  // English stays unprefixed, Korean lives under /ko/. The deploy base is part of the pattern
  // because SvelteKit hands the full pathname (base included) to the reroute hook.
  urlPatterns: [{
    pattern: `${base}/:path(.*)?`,
    localized: [["ko", `${base}/ko/:path(.*)?`], ["en", `${base}/:path(.*)?`]]
  }]
};
