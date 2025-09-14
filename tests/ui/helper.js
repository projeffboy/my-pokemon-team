import { expect } from "@playwright/test";

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
