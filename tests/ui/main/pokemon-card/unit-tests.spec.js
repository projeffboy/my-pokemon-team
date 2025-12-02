import { test, expect } from "@playwright/test";
import { goToSite } from "helper.js";

// Test configuration based on ui-main-tests.md requirements for Pokemon Card Unit Tests

test.describe("Pokemon Card - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    await goToSite(page);
  });

  // Helper to ensure card is visible (handles responsive tabs)
  const ensureCardVisible = async (page, index) => {
    // If card is already visible, do nothing
    if (await page.locator(`#react-select-single-${index}-name`).isVisible()) {
      return;
    }

    // Try to find a tab with the number (loose match handles "1" and "1 - 2")
    // We use .first() in case of multiple matches (though unlikely in this specific UI)
    const tab = page
      .getByRole("tab", { name: `${index + 1}`, exact: false })
      .first();
    if (await tab.isVisible()) {
      await tab.click();
      // Wait for the card to appear
      await expect(
        page.locator(`#react-select-single-${index}-name`)
      ).toBeVisible();
    }
  };

  test("should have all fields empty by default", async ({ page }) => {
    // Check all 6 name fields are empty
    for (let i = 0; i < 6; i++) {
      await ensureCardVisible(page, i);
      const nameField = page.locator(`#react-select-single-${i}-name`);
      await expect(nameField).toHaveValue("");
    }

    // Check all move fields are empty (4 moves per card, 6 cards)
    for (let i = 0; i < 6; i++) {
      await ensureCardVisible(page, i);
      for (let moveNum = 1; moveNum <= 4; moveNum++) {
        const moveField = page.locator(
          `#react-select-single-${i}-move${moveNum}`
        );
        await expect(moveField).toHaveValue("");
      }
    }

    // Check all item fields are empty
    for (let i = 0; i < 6; i++) {
      await ensureCardVisible(page, i);
      const itemField = page.locator(`#react-select-single-${i}-item`);
      await expect(itemField).toHaveValue("");
    }

    // Check all ability fields are empty
    for (let i = 0; i < 6; i++) {
      await ensureCardVisible(page, i);
      const abilityField = page.locator(`#react-select-single-${i}-ability`);
      await expect(abilityField).toHaveValue("");
    }
  });

  test("should have question mark sprite by default", async ({ page }) => {
    await expect
      .poll(async () => page.locator('img[alt="question-mark"]').count())
      .toBeGreaterThanOrEqual(6);
  });

  test("should show 'Nothing found' message in moves and abilities when no pokemon is selected", async ({
    page,
  }) => {
    const moveField = page.locator("#react-select-single-0-move1");
    const abilityField = page.locator("#react-select-single-0-ability");

    // Type in move field to trigger dropdown
    await moveField.fill("Thunder");

    // Check for "Nothing found" message
    await expect(page.getByText("Nothing found")).toBeVisible();
    await expect(
      page.getByText("(Or you haven't selected a Pokemon)")
    ).toBeVisible();

    // Navigate back and clear move field
    await page.goto("http://localhost:3000");

    // Type in ability field to trigger dropdown
    await abilityField.fill("Intimidate");

    // Check for "Nothing found" message
    await expect(page.getByText("Nothing found")).toBeVisible();
    await expect(
      page.getByText("(Or you haven't selected a Pokemon)")
    ).toBeVisible();
  });
});
