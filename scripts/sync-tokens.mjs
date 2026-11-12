// Generates src/lib/styles/tokens.css from design/tokens.json (the ene design system's token file).
// Change a token in the design system, copy its tokens.json to design/, then run `pnpm sync:tokens`.
import { readFileSync, writeFileSync } from "node:fs";
const t = JSON.parse(readFileSync(new URL("../design/tokens.json", import.meta.url), "utf8"));
const out = ["/* Generated from design/tokens.json by scripts/sync-tokens.mjs. Do not edit by hand. */", ":root {"];
for (const c of t.color.tokens) out.push(`  --${c.name}: ${typeof c.value === "object" ? c.value.dark : c.value};`);
for (const [k, v] of Object.entries(t.type.families)) out.push(`  --font-${k}: ${v};`);
for (const fam of ["spacing", "radius", "shadow"]) for (const x of t[fam]?.tokens ?? []) out.push(`  --${x.name}: ${x.value};`);
out.push("  --motion-step: 900ms;", "  --motion-fast: 160ms;", "  --motion-loop: 9.9s;", "  --motion-ease: cubic-bezier(.4, 0, .2, 1);", "}");
for (const g of t.type.groups) for (const s of g.styles) {
  out.push(`.t-${s.name} { font-family: var(--font-${g.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};${s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : ""} }`);
}
writeFileSync(new URL("../src/lib/styles/tokens.css", import.meta.url), out.join("\n") + "\n");
console.log("tokens.css written");
