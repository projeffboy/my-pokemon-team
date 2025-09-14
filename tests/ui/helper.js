import { expect } from "@playwright/test";

/* GENERAL */

// Helper function for navigation
export const goToSite = async page => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
};

// Helper function to verify that an image has loaded successfully (not broken/404)
export const expectImageToBeLoaded = async locator => {
  await expect(locator).toBeVisible();
  await expect(locator).toHaveJSProperty("complete", true);
  await expect(locator).not.toHaveJSProperty("naturalWidth", 0);
};

/* URL RELATED */

// URLs that are known to be problematic for automated testing (but should still work for users)
const urlExceptions = [
  "https://en.softonic.com/articles/competitive-pokemon-smogon",
];

// Helper function to check if a response has no error (status < 400)
const expectResponseNotError = (response, url) => {
  if (urlExceptions.includes(url)) {
    // Skip the check for known problematic URLs
    console.log(`  ⏭️  Skipping URL check for known problematic URL: ${url}`);
    return;
  }

  expect(
    response.status(),
    `Request to ${url} failed with status ${response.status()}`
  ).toBeLessThan(400);
};

// Helper function to check if a link works by making a direct request
export const expectLinkToWork = async (page, href) => {
  // Check if the link responds successfully
  const response = await page.request.get(href);
  expectResponseNotError(response, href);
};

// Helper function to check that all HTTP links in a locator are not broken
export const expectAllLinksToWork = async (page, linksLocator) => {
  const linkCount = await linksLocator.count();

  for (let i = 0; i < linkCount; i++) {
    const link = linksLocator.nth(i);
    const href = await link.getAttribute("href");

    // Skip non-http links (mailto, tel, etc.)
    if (href && href.startsWith("http")) {
      await expect(link).toBeVisible();

      // Use the helper function to check the link
      await expectLinkToWork(page, href);
    }
  }
};
