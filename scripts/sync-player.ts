// Copies the built ene browser player from a sibling checkout of slop-makers/ene into static/.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
const src = process.env.ENE_DIR ?? new URL("../../ene/demo/", import.meta.url).pathname;
// ene-elk.js bundles elkjs unmodified; its license notice must travel with the file.
const ELK_BANNER =
  "/*! elkjs (Eclipse Layout Kernel) | EPL-2.0 OR GPL-3.0-or-later | https://github.com/kieler/elkjs | https://www.eclipse.org/legal/epl-2.0/ | see /THIRD_PARTY_NOTICES.md */\n";
for (const f of ["ene.js", "ene-elk.js", "logos-subset.js"]) {
  const from = `${src.replace(/\/$/, "")}/${f}`;
  if (!existsSync(from)) { console.error(`missing ${from}`); process.exit(1); }
  const to = new URL(`../static/${f}`, import.meta.url);
  if (f === "ene-elk.js") {
    const code = readFileSync(from, "utf8");
    writeFileSync(to, code.startsWith("/*! elkjs") ? code : ELK_BANNER + code);
  } else {
    copyFileSync(from, to);
  }
}
console.log("player copied from", src);
