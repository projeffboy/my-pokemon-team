import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

const baseURL = "http://127.0.0.1:4173";

export default defineConfig({
  ...config,
  testDir: "./tests/smoke",
  testIgnore: [],
  outputDir: "./smoke-test-results",
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-smoke-report", open: "never" }],
  ],
  use: { ...config.use, baseURL },
  webServer: {
    command:
      "npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
