// Share links keep the diagram in the URL fragment, so nothing is stored on a server.
// New links: #z=<deflate-raw, base64url>&c=<branch choices>. Old links (#src=<UTF-8, base64url>) still open.

export interface Shared { source: string; choices: number[] }

/** Largest source a link may expand to, so a crafted link cannot exhaust memory */
export const MAX_SOURCE_BYTES = 1 << 20;

const toB64u = (bytes: Uint8Array) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream, limit = Infinity): Promise<Uint8Array> {
  const reader = new Blob([bytes as BlobPart]).stream().pipeThrough(stream).getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) { await reader.cancel(); throw new Error("shared diagram is too large"); }
    parts.push(value);
  }
  const out = new Uint8Array(size);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

/** The fragment (without "#") for a source and its branch choices; compressed where the browser can */
export async function encodeShare(source: string, choices: number[] = []): Promise<string> {
  const raw = new TextEncoder().encode(source);
  const body = typeof CompressionStream === "function" ? `z=${toB64u(await pipe(raw, new CompressionStream("deflate-raw")))}` : `src=${toB64u(raw)}`;
  return choices.some((c) => c > 0) ? `${body}&c=${choices.join(".")}` : body;
}

/** Read a fragment written by encodeShare (or an old #src= link); undefined when it holds no diagram */
export async function decodeShare(fragment: string): Promise<Shared | undefined> {
  const q = new URLSearchParams(fragment.replace(/^#/, ""));
  const z = q.get("z"), src = q.get("src");
  let bytes: Uint8Array;
  if (z) {
    if (typeof DecompressionStream !== "function") throw new Error("this browser cannot open compressed links");
    bytes = await pipe(fromB64u(z), new DecompressionStream("deflate-raw"), MAX_SOURCE_BYTES);
  } else if (src) {
    bytes = fromB64u(src);
    if (bytes.length > MAX_SOURCE_BYTES) throw new Error("shared diagram is too large");
  } else return undefined;
  const choices = (q.get("c") ?? "").split(".").filter(Boolean).map(Number).map((n) => (Number.isInteger(n) && n >= 0 && n < 1000 ? n : 0)).slice(0, 100);
  return { source: new TextDecoder("utf-8", { fatal: true }).decode(bytes), choices };
}
