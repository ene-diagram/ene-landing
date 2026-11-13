import { paraglideVitePlugin } from "@inlang/paraglide-js";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

const base = (process.env.BASE_PATH ?? "") as "" | `/${string}`;
// Public origin for absolute hreflang/canonical links; override with SITE_URL when the domain changes
const site = (process.env.SITE_URL ?? "https://ene-landing.vercel.app").replace(/\/$/, "");

export default defineConfig({
  define: { __BASE_PATH__: JSON.stringify(base), __SITE_URL__: JSON.stringify(site) },
  plugins: [
    sveltekit({
      adapter: adapter({ strict: true }),
      paths: { base, relative: true },
      prerender: { entries: ["*", "/ko/docs/"], handleHttpError: "fail", handleMissingId: ({ path, message }) => { if (!/\/playground\/?$/.test(path)) throw new Error(message); } }
    }),
    paraglideVitePlugin({ project: "./project.inlang" })
  ]
});
