// Copies the built ene browser player from a sibling checkout of ene-diagram/ene into static/.
import { copyFileSync, existsSync } from "node:fs";
const src = process.env.ENE_DIR ?? new URL("../../ene/demo/", import.meta.url).pathname;
for (const f of ["ene.js", "ene-elk.js", "logos-subset.js"]) {
  const from = `${src.replace(/\/$/, "")}/${f}`;
  if (!existsSync(from)) { console.error(`missing ${from}`); process.exit(1); }
  copyFileSync(from, new URL(`../static/${f}`, import.meta.url));
}
console.log("player copied from", src);
