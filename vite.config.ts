import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ strict: true }),
      paths: { base: (process.env.BASE_PATH ?? "") as "" | `/${string}`, relative: true },
      prerender: { handleHttpError: "fail", handleMissingId: ({ path, message }) => { if (!path.startsWith("/playground")) throw new Error(message); } }
    })
  ]
});
