import { test, expect } from "fixtures";

test.describe("Team Checklist - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Click on the "Team Checklist" tab
    await page.getByRole("tab", { name: /Checklist/ }).click();
  });

  test("should have no checkmarks by default", async ({ page }) => {
    const viewportSize = page.viewportSize();
    let checklistItems;

    if (
      viewportSize &&
      viewportSize.width >= 960 /* TODO: replace with constant */
    ) {
      checklistItems = [
        "Entry Hazard",
        "Spinner/Defogger",
        "Reliable Recovery",
        "Cleric",
        "Status Move",
        "Phazer",
        "Boosting Move",
        "Volt-turn Move",
        "Choice Item",
      ];
    } else if (
      viewportSize &&
      viewportSize.width >= 600 /* TODO: replace with constant */
    ) {
      checklistItems = [
        "Hazard",
        "Spinner",
        "Recovery",
        "Cleric",
        "Status",
        "Phazer",
        "Setup",
        "Volt-turn",
        "Choice",
      ];
    } else {
      checklistItems = [
        "Hazard",
        "Spin",
        "Heal",
        "Cleric",
        "Status",
        "Phazer",
        "Setup",
        "Volturn",
        "Choice",
      ];
    }

    // Verify the checklist is visible (check the first item)
    await expect(page.getByText(checklistItems[0])).toBeVisible();

    for (const item of checklistItems) {
      const itemText = page.getByText(item, { exact: true });
      const container = itemText.locator("xpath=..");
      const iconDiv = container.locator("div").first();
      const iconSvg = iconDiv.locator("svg");

      await expect(iconSvg).toBeVisible();

      const style = await iconSvg.getAttribute("style");
      if (style) {
        expect(style).not.toContain("color: #16a085");
        expect(style).not.toContain("color: rgb(22, 160, 133)");
      }
    }
  });
});
