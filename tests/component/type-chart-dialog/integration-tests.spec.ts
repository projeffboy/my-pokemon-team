import { test, expect } from "fixtures";
import { expectImageToBeLoaded } from "helper";
import type { Locator, Page } from "@playwright/test";

test.describe("FAB (Floating Action Button) Tests", () => {
  test("should show all type charts without external requests", async ({ page }) => {
    const appOrigin = new URL(page.url()).origin;
    await page.route(url => url.origin !== appOrigin, route => route.abort());

    // Click FAB to open Type Chart dialog
    const fabButton = page.getByRole("button", { name: "Type Chart" });
    await fabButton.click();

    // Collect tab locators
    const [tableTab, listTab, infographicTab] = [
      "Table",
      "List",
      "Infographic",
    ].map(name => page.getByRole("tab", { name }));

    // Verify all three tabs
    const verifyTabAndImage = async (
      page: Page,
      tab: Locator,
      altText: string,
    ) => {
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
      const image = page.getByRole("img", { name: altText });
      await expectImageToBeLoaded(image);
    };
    await verifyTabAndImage(page, tableTab, "Bulbapedia Pokemon Type Chart");
    await verifyTabAndImage(page, listTab, "List Pokemon Type Chart");
    await verifyTabAndImage(page, infographicTab, "Infographic Type Chart");

    // Test exit from popup dialog
    const goBackButton = page.getByRole("button", { name: "Go Back" });
    await goBackButton.click();

    // Dialog should be closed - tabs should not be visible
    await expect(tableTab).not.toBeVisible();
  });
});
