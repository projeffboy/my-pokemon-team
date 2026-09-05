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
  },
  define: {
    __LATEST_COMMIT_DATE__: JSON.stringify(latestCommitDate),
  },
});
