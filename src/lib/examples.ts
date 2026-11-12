const files = import.meta.glob("./examples/*.ene", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export type Tag = "Flows" | "Branches" | "Failures and retries" | "Groups" | "Sequence";
const meta: Record<string, { blurb: string; tags: Tag[] }> = {
  "01": { blurb: "Parallel calls and a payment timeout.", tags: ["Flows", "Failures and retries"] },
  "02": { blurb: "An expired token, a refresh, a retry.", tags: ["Flows", "Failures and retries"] },
  "03": { blurb: "Two branches the viewer picks.", tags: ["Branches"] },
  "04": { blurb: "Work handed off and consumed later.", tags: ["Flows"] },
  "05": { blurb: "Upload, store, make thumbnails.", tags: ["Flows"] },
  "06": { blurb: "Edge cache in front of the origin.", tags: ["Flows", "Branches"] },
  "07": { blurb: "Failures, waits and a final approval.", tags: ["Failures and retries"] },
  "08": { blurb: "A distributed transaction and its compensation.", tags: ["Flows", "Failures and retries"] },
  "09": { blurb: "Inbound events, acknowledgements and retries.", tags: ["Flows", "Failures and retries"] },
  "10": { blurb: "Writes that update a search index.", tags: ["Flows"] },
  "11": { blurb: "A request through managed services.", tags: ["Flows", "Groups"] },
  "12": { blurb: "A full storefront in one diagram.", tags: ["Flows", "Groups"] },
  "13": { blurb: "Groups, shapes and icons.", tags: ["Groups"] },
  "14": { blurb: "The same kind of flow as a sequence diagram.", tags: ["Sequence", "Branches"] }
};

export interface Example { id: string; slug: string; title: string; source: string; nodes: string[]; blurb: string; tags: Tag[] }

function nodesOf(src: string): string[] {
  const seen: string[] = [];
  for (const m of src.matchAll(/([A-Za-z_][\w-]*)\[([^\]]+)\]/g)) if (!seen.includes(m[2])) seen.push(m[2]);
  return seen.slice(0, 4);
}

export const examples: Example[] = Object.entries(files)
  .map(([path, source]) => {
    const slug = path.split("/").pop()!.replace(/\.ene$/, "");
    const id = slug.slice(0, 2);
    const title = /^title\s+(.+)$/m.exec(source)?.[1] ?? slug;
    return { id, slug, title, source: source.trim(), nodes: nodesOf(source), ...meta[id] };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

export const byId = (id: string) => examples.find((e) => e.id === id || e.slug === id);
