import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const latestCommitDate = execSync(
  "git log -1 --format=%cd --date=format:'%b %-d, %Y'",
)
  .toString()
  .trim();

// The learnsets and translations imports carry `with { type: "json" }`, which Node needs for
// the logic tests. Browsers then insist on real JSON with a JSON content type, but the dev
// server would send Vite's JavaScript transform of the file, so serve the file itself.
// Builds bundle it instead.
function serveDataJson(): Plugin {
  const folder = "/src/data/";
  return {
    name: "serve-data-json",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split("?")[0] ?? "";
        if (!pathname.startsWith(folder) || !pathname.endsWith(".json"))
          return next();
        try {
          const json = await readFile(path.join(server.config.root, pathname));
          response.setHeader("Content-Type", "application/json");
          response.end(json);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

// Playwire ads earn the site's revenue. The tags go in the HTML, as Playwire's SPA guide
// shows, rather than in a component, so the browser finds ramp.js while the bundle is still
// loading. Only builds get them, so dev and tests stay ad-free. App.tsx makes the
// spaNewPage call once the element Playwire inserts the banner above has rendered.
function playwireAds(): Plugin {
  return {
    name: "playwire-ads",
    apply: "build",
    transformIndexHtml: () => [
      {
        tag: "link",
        attrs: { rel: "preconnect", href: "https://cdn.intergient.com" },
        injectTo: "head",
      },
      {
        tag: "script",
        attrs: { "data-cfasync": "false" },
        children: [
          "window.ramp = window.ramp || {};",
          "window.ramp.que = window.ramp.que || [];",
          "window.ramp.passiveMode = true;",
        ].join(" "),
        injectTo: "head",
      },
      {
        tag: "script",
        attrs: {
          "data-cfasync": "false",
          async: true,
          src: "https://cdn.intergient.com/1025446/75399/ramp.js",
        },
        injectTo: "body",
      },
    ],
  };
}

export default defineConfig({
  plugins: [react(), serveDataJson(), playwireAds()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Pokemon data and dependencies change less often than app code, so they cache separately
        manualChunks(id) {
          // Learnsets and translations stay in the chunks of their dynamic imports, so they
          // load after the app, and each language only when chosen
          if (id.includes("/src/data/learnsets.json")) return;
          if (id.includes("/src/data/translations/")) return;
          if (id.includes("/src/data/")) return "data";
          if (id.includes("/node_modules/")) return "vendor";
        },
      },
    },
  },
  define: {
    __LATEST_COMMIT_DATE__: JSON.stringify(latestCommitDate),
  },
});
