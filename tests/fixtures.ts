import { test as base } from "@playwright/test";
import { goToSite } from "./helper";

interface AutomaticFixtures {
  autoGoToSite: void;
}

export const test = base.extend<AutomaticFixtures>({
  autoGoToSite: [
    async ({ page }, use) => {
      await goToSite(page);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
