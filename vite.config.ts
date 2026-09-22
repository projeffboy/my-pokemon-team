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

// The learnsets import carries `with { type: "json" }`, which Node needs for the logic tests.
// Browsers then insist on real JSON with a JSON content type, but the dev server would send
// Vite's JavaScript transform of the file, so serve the file itself. Builds bundle it instead.
function serveJsonModules(): Plugin {
  return {
    name: "serve-json-modules",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.replace(/\?import$/, "");
        if (pathname === request.url || !pathname?.endsWith(".json")) {
          return next();
        }
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

export default defineConfig({
  plugins: [react(), serveJsonModules()],
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
    outDir: "build",
    rollupOptions: {
      output: {
        // Pokemon data and dependencies change less often than app code, so they cache separately
        manualChunks(id) {
          // Learnsets stay in the chunk of their dynamic import, so they load after the app
          if (id.includes("/src/data/learnsets.json")) return;
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
