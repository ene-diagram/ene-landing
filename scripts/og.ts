// Renders the Open Graph cards (static/og/{en,ko}.png, 1200×630) and the app icons with headless Chrome.
// Needs a sibling checkout of ene-diagram/ene (ENE_DIR) for the diagram, and Chrome (CHROME).
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const eneDir = process.env.ENE_DIR ?? join(root, "../ene");
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const tmp = mkdtempSync(join(tmpdir(), "ene-og-"));
const messages = (l: string) => JSON.parse(readFileSync(join(root, `messages/${l}.json`), "utf8")) as Record<string, string>;

const source = `user[User] -> api[API] : POST /order
api -> cache[Redis] : check stock
cache --> api : miss
api -> db[MySQL] : SELECT & api -> pay[Payment] : charge
pay -x api : timeout
api --> user : 502 retry later
`;
writeFileSync(join(tmp, "d.ene"), source);

function shot(html: string, out: string, w: number, h: number) {
  const page = join(tmp, `${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(page, html);
  // virtual time lets the SMIL animation run to the moment where the failure and the reply are on screen
  execFileSync(chrome, ["--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`,
    "--virtual-time-budget=4200", `--screenshot=${out}`, `file://${page}`], { stdio: "ignore" });
  console.log("wrote", out.replace(root, ""));
}

const fonts = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@500;600&family=Geist+Mono:wght@500&display=block">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">`;

for (const lang of ["en", "ko"]) {
  const t = messages(lang);
  const svg = execFileSync("node", [join(eneDir, "packages/cli/bin/ene.mjs"), join(tmp, "d.ene"), "-o", "-", "--lang", lang, "--no-notes"], { encoding: "utf8" });
  const h1 = t.home_h1.replace(/<[^>]+>/g, "");
  shot(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8">${fonts}<style>
  *{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}
  body{background:radial-gradient(900px 500px at 85% 20%,#1a1f4a 0%,transparent 60%),#08090A;color:#EDEEF2;
    font-family:Geist,"Pretendard Variable",system-ui,sans-serif;padding:64px 72px;display:grid;grid-template-columns:470px 1fr;gap:40px;align-items:center}
  .brand{font:600 34px Geist,sans-serif;letter-spacing:-.03em;display:flex;align-items:center;gap:12px}
  .dot{width:14px;height:14px;border-radius:50%;background:#7C8CFF;box-shadow:0 0 24px #7C8CFF}
  h1{font-size:${lang === "ko" ? 56 : 60}px;line-height:1.08;letter-spacing:${lang === "ko" ? "-.02em" : "-.045em"};margin:36px 0 24px;font-weight:600;word-break:keep-all}
  p{font:500 22px "Geist Mono",monospace;color:#8B8FA3;margin:0}
  .card{background:#0C0D10;border:1px solid #262833;border-radius:20px;padding:18px;box-shadow:0 30px 80px rgba(0,0,0,.5)}
  .card svg{width:100%;height:auto;display:block}
  </style></head><body><div><div class="brand"><span class="dot"></span>ene</div><h1>${h1}</h1><p>npm i @ene-diagram/cli</p></div>
  <div class="card">${svg}</div></body></html>`, join(root, `static/og/${lang}.png`), 1200, 630);
}

const mark = readFileSync(join(root, "static/favicon.svg"), "utf8");
for (const [name, size] of [["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512], ["favicon-32.png", 32]] as const)
  shot(`<!doctype html><style>html,body{margin:0;background:transparent}svg{width:${size}px;height:${size}px;display:block}</style>${mark}`, join(root, `static/${name}`), size, size);
