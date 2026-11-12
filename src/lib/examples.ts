import { m } from "#lib/paraglide/messages";

const files = import.meta.glob("./examples/*.ene", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export type Tag = "flows" | "branches" | "failures" | "groups" | "sequence";
const meta: Record<string, { tags: Tag[] }> = {
  "01": { tags: ["flows", "failures"] },
  "02": { tags: ["flows", "failures"] },
  "03": { tags: ["branches"] },
  "04": { tags: ["flows"] },
  "05": { tags: ["flows"] },
  "06": { tags: ["flows", "branches"] },
  "07": { tags: ["failures"] },
  "08": { tags: ["flows", "failures"] },
  "09": { tags: ["flows", "failures"] },
  "10": { tags: ["flows"] },
  "11": { tags: ["flows", "groups"] },
  "12": { tags: ["flows", "groups"] },
  "13": { tags: ["groups"] },
  "14": { tags: ["sequence", "branches"] }
};

/** Titles and blurbs per locale (messages/*.json). Referenced one by one so unused ones can be tree-shaken. */
const text: Record<string, { title: () => string; blurb: () => string }> = {
  "01": { title: m.ex_01_title, blurb: m.ex_01_blurb }, "02": { title: m.ex_02_title, blurb: m.ex_02_blurb },
  "03": { title: m.ex_03_title, blurb: m.ex_03_blurb }, "04": { title: m.ex_04_title, blurb: m.ex_04_blurb },
  "05": { title: m.ex_05_title, blurb: m.ex_05_blurb }, "06": { title: m.ex_06_title, blurb: m.ex_06_blurb },
  "07": { title: m.ex_07_title, blurb: m.ex_07_blurb }, "08": { title: m.ex_08_title, blurb: m.ex_08_blurb },
  "09": { title: m.ex_09_title, blurb: m.ex_09_blurb }, "10": { title: m.ex_10_title, blurb: m.ex_10_blurb },
  "11": { title: m.ex_11_title, blurb: m.ex_11_blurb }, "12": { title: m.ex_12_title, blurb: m.ex_12_blurb },
  "13": { title: m.ex_13_title, blurb: m.ex_13_blurb }, "14": { title: m.ex_14_title, blurb: m.ex_14_blurb }
};
export const tagLabels: Record<Tag, () => string> = { flows: m.tag_flows, branches: m.tag_branches, failures: m.tag_failures, groups: m.tag_groups, sequence: m.tag_sequence };

export interface Example { id: string; slug: string; source: string; nodes: string[]; tags: Tag[] }
export type LocalizedExample = Example & { title: string; blurb: string };

function nodesOf(src: string): string[] {
  const seen: string[] = [];
  for (const m of src.matchAll(/([A-Za-z_][\w-]*)\[([^\]]+)\]/g)) if (!seen.includes(m[2])) seen.push(m[2]);
  return seen.slice(0, 4);
}

export const examples: Example[] = Object.entries(files)
  .map(([path, source]) => {
    const slug = path.split("/").pop()!.replace(/\.ene$/, "");
    const id = slug.slice(0, 2);
    return { id, slug, source: source.trim(), nodes: nodesOf(source), ...meta[id] };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

export const byId = (id: string) => examples.find((e) => e.id === id || e.slug === id);

const localize = (e: Example): LocalizedExample => ({ ...e, title: text[e.id].title(), blurb: text[e.id].blurb() });
/** Examples with title and blurb in the current locale. Call per request or render, never at module load. */
export const getExamples = (): LocalizedExample[] => examples.map(localize);
export const getExample = (id: string): LocalizedExample | undefined => { const e = byId(id); return e && localize(e); };
