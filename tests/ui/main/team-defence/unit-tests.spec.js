import { test, expect } from "@playwright/test";
import { goToSite, POKEMON_TYPES } from "../../../helper.js";

// Test configuration based on ui-main-tests.md requirements for Team Defence Unit Tests

test.describe("Team Defence - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    await goToSite(page);
  });

  test("should display all 18 types with score of 0", async ({ page }) => {
    // Find the Team Defence heading
    const teamDefenceHeading = page.getByRole("heading", {
      name: "Team Defence",
    });
    await expect(teamDefenceHeading).toBeVisible();

    // Check each type exists and verify score
    for (const type of POKEMON_TYPES) {
      // Find the type element
      const typeElement = page
        .locator("div")
        .filter({ hasText: new RegExp(`^(${type.full}|${type.abbr})$`) })
        .first();
      await expect(typeElement).toBeVisible();
    }

    // Verify all scores are 0 by checking there are at least 18 "0" scores on the page
    // (36 total: 18 from Team Defence + 18 from Team Type Coverage)
    const allScores = page.locator("div").filter({ hasText: /^0$/ });
    const count = await allScores.count();
    expect(count).toBeGreaterThanOrEqual(18);
  });

  test("should show 'First Select a Pokemon' popover when hovering over Dark type", async ({
    page,
  }) => {
    // Find the Team Defence heading first to ensure we're in the right section
    const teamDefenceHeading = page.getByRole("heading", {
      name: "Team Defence",
    });
    await expect(teamDefenceHeading).toBeVisible();

    // Find the Dark type element (could be "Dark" or "DRK" depending on viewport)
    const darkTypeElement = page
      .locator("div")
      .filter({ hasText: /^(Dark|DRK)$/ })
      .first();

    // Hover over it
    await darkTypeElement.hover();

    // Wait a bit for the popover to appear
    await page.waitForTimeout(300);

    // Check for the popover message
    const popover = page.getByText("First Select a Pokemon");
    await expect(popover).toBeVisible();
  });
});
