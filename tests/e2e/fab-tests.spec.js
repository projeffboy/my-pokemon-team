import { test, expect } from "@playwright/test";
import { goToSite, expectImageToBeLoaded } from "./helper.js";

// Test configuration based on e2e-tests.md requirements

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

    // Should see the dialog with tabs
    await expect(page.getByRole("tab", { name: "Table" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "List" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Infographic" })).toBeVisible();

    // Test each tab sequentially without checking which one is selected first
    // Start with Table tab
    const tableTab = page.getByRole("tab", { name: "Table" });
    const listTab = page.getByRole("tab", { name: "List" });
    const infographicTab = page.getByRole("tab", { name: "Infographic" });

    // Click Table tab and verify image loads
    await tableTab.click();
    await expect(tableTab).toHaveAttribute("aria-selected", "true");
    const tableImage = page.locator(
      'img[alt*="Type Chart"], img[alt*="Bulbapedia"]'
    );
    await expectImageToBeLoaded(tableImage);

    // Click List tab and verify image loads
    await listTab.click();
    await expect(listTab).toHaveAttribute("aria-selected", "true");
    const listImage = page.locator('img[alt*="List"], img[alt*="Type Chart"]');
    await expectImageToBeLoaded(listImage);

    // Click Infographic tab and verify image loads
    await infographicTab.click();
    await expect(infographicTab).toHaveAttribute("aria-selected", "true");
    const infographicImage = page.locator(
      'img[alt*="Infographic"], img[alt*="Type Chart"]'
    );
    await expectImageToBeLoaded(infographicImage);

    // Test exit from popup dialog
    const goBackButton = page.getByRole("button", { name: "Go Back" });
    await expect(goBackButton).toBeVisible();
    await goBackButton.click();

    // Dialog should be closed - tabs should not be visible
    await expect(page.getByRole("tab", { name: "Table" })).not.toBeVisible();
  });
});
