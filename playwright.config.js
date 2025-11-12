// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */

const LARGER_VIEWPORT_WIDTH = 1920;
const LARGE_VIEWPORT_WIDTH = 1366;
const MEDIUM_VIEWPORT_WIDTH = 820;

export default defineConfig({
  testDir: "./tests/ui",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "list",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  // the viewports below are subject to change depending on if the test resizes the browser
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: LARGER_VIEWPORT_WIDTH,
          height: LARGER_VIEWPORT_WIDTH / (16 / 9),
        },
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: {
          width: LARGE_VIEWPORT_WIDTH,
          height: LARGE_VIEWPORT_WIDTH / (16 / 9),
        },
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: {
          width: MEDIUM_VIEWPORT_WIDTH,
          height: MEDIUM_VIEWPORT_WIDTH / (16 / 9),
        },
      },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
