import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { execSync } from "node:child_process";

const latestCommitDate = execSync(
  "git log -1 --format=%cd --date=format:'%b %-d, %Y'",
)
  .toString()
  .trim();

export default defineConfig({
  plugins: [react()],
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
