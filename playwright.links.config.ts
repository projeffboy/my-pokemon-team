import { defineConfig, devices } from "@playwright/test";

// Checks the Pokemon Info dialog's dex links on the real sites, so it is not part of `npm test`
export default defineConfig({
  testDir: "./tests/links",
  fullyParallel: true,
  workers: 4,
  retries: 1,
  timeout: 60_000,
  outputDir: "./links-test-results",
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-links-report", open: "never" }],
  ],
  projects: [{ name: "Desktop Chrome", use: { ...devices["Desktop Chrome"] } }],
});
