import { test as base } from "@playwright/test";
import { goToSite } from "helper";

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
