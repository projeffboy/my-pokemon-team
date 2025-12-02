import { test as base } from "@playwright/test";
import { goToSite } from "helper";

export const test = base.extend({
  autoGoToSite: [
    async ({ page }, use) => {
      await goToSite(page);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
