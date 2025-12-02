import { test, expect } from "@playwright/test";
import { goToSite, expectImageToBeLoaded } from "helper.js";

// Test configuration based on ui-tests.md requirements

test.describe("FAB (Floating Action Button) Tests", () => {
  // Navigate to the site before each test
  test.beforeEach(async ({ page }) => {
    await goToSite(page);
  });

  test("should display and interact with Type Chart FAB", async ({ page }) => {
    // FAB should be there - button on bottom right with MuiFab class
    // Find FAB button by looking for Material-UI FAB classes
    const fabButton = page.locator('button[class*="MuiFab"]');
    await expect(fabButton).toBeVisible();

    // Click on Type Chart button - should load dialog with three tabs
    await fabButton.click();

    // Collect tab locators and assert they're visible
    const [tableTab, listTab, infographicTab] = [
      "Table",
      "List",
      "Infographic",
    ].map(name => page.getByRole("tab", { name }));
    await Promise.all(
      [tableTab, listTab, infographicTab].map(tab => expect(tab).toBeVisible())
    );

    // Click Table tab and verify image loads
    await tableTab.click();
    await expect(tableTab).toHaveAttribute("aria-selected", "true");
    const tableImage = page.locator(
      'img[alt*="Bulbapedia Pokemon Type Chart"]'
    );
    await expectImageToBeLoaded(tableImage);

    // Click List tab and verify image loads
    await listTab.click();
    await expect(listTab).toHaveAttribute("aria-selected", "true");
    const listImage = page.locator('img[alt*="List Pokemon Type Chart"]');
    await expectImageToBeLoaded(listImage);

    // Click Infographic tab and verify image loads
    await infographicTab.click();
    await expect(infographicTab).toHaveAttribute("aria-selected", "true");
    const infographicImage = page.locator('img[alt*="Infographic Type Chart"]');
    await expectImageToBeLoaded(infographicImage);

    // Test exit from popup dialog
    const goBackButton = page.getByRole("button", { name: "Go Back" });
    await expect(goBackButton).toBeVisible();
    await goBackButton.click();

    // Dialog should be closed - tabs should not be visible
    await expect(tableTab).not.toBeVisible();
  });
});
