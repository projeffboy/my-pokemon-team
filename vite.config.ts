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
function serveLearnsetsJson(): Plugin {
  const pathname = "/src/data/learnsets.json";
  return {
    name: "serve-learnsets-json",
    apply: "serve",
    configureServer(server) {
      const file = path.join(server.config.root, pathname);
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.split("?")[0] !== pathname) return next();
        try {
          const json = await readFile(file);
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
  plugins: [react(), serveLearnsetsJson()],
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
