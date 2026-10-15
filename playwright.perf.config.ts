import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4174";

// Times the production build on an emulated phone. Timings vary with the machine and
// what else it runs, so the check is run by hand and is not part of `npm test`.
export default defineConfig({
  testDir: "./tests/perf",
  // One test at a time, so that they do not slow each other down
  workers: 1,
  timeout: 15 * 60_000,
  outputDir: "./perf-test-results",
  reporter: "list",
  use: { baseURL },
  webServer: {
    command:
      "npm run build && npm run preview -- --host 127.0.0.1 --port 4174 --strictPort",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
