import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/logic",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  outputDir: "./logic-test-results",
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-logic-report", open: "never" }],
  ],
});
