export type Block =
  | { t: "p"; html: string }
  | { t: "code"; code: string; file?: string }
  | { t: "player"; code: string; label: string }
  | { t: "list"; items: string[] }
  | { t: "callout"; label: string; html: string; tone?: "danger" | "accent" }
  | { t: "table"; head: string[]; rows: string[][]; mono?: number[] }
  | { t: "stats"; items: [string, string][] }
  | { t: "cards"; items: { href: string; title: string; code: string; text: string }[] };
export interface Section { id: string; h: string; blocks: Block[] }
export interface Doc { slug: string; title: string; group: string; lede: string; sections: Section[] }

export const ic = (s: string) => `<code class="ic">${s}</code>`;
export const kbd = (s: string) => `<kbd>${s}</kbd>`;
