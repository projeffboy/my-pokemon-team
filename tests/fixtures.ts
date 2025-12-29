import { test as base, type Page } from "@playwright/test";

// Helper function for navigation
export const goToSite = async (page: Page) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
};

type MyFixtures = {
  autoGoToSite: void;
};

export const test = base.extend<MyFixtures>({
  autoGoToSite: [
    async ({ page }, use) => {
      await goToSite(page);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
