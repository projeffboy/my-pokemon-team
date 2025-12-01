import { test, expect } from "@playwright/test";
import {
  goToSite,
  createViewport,
  LARGE_VIEWPORT_WIDTH,
} from "../../../helper.js";

// Test configuration based on ui-main-tests.md requirements for Pokemon Card Unit Tests

test.describe("Pokemon Card - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(createViewport(LARGE_VIEWPORT_WIDTH));
    await goToSite(page);
  });

  test("should have all fields empty by default", async ({ page }) => {
    // Check all 6 name fields are empty
    for (let i = 0; i < 6; i++) {
      const nameField = page.locator(`#react-select-single-${i}-name`);
      await expect(nameField).toHaveValue("");
    }

    // Check all move fields are empty (4 moves per card, 6 cards)
    for (let i = 0; i < 6; i++) {
      for (let moveNum = 1; moveNum <= 4; moveNum++) {
        const moveField = page.locator(
          `#react-select-single-${i}-move${moveNum}`
        );
        await expect(moveField).toHaveValue("");
      }
    }

    // Check all item fields are empty
    for (let i = 0; i < 6; i++) {
      const itemField = page.locator(`#react-select-single-${i}-item`);
      await expect(itemField).toHaveValue("");
    }

    // Check all ability fields are empty
    for (let i = 0; i < 6; i++) {
      const abilityField = page.locator(`#react-select-single-${i}-ability`);
      await expect(abilityField).toHaveValue("");
    }
  });

  test("should have question mark sprite by default", async ({ page }) => {
    // In large viewport with 6 cards, there should be 6 question marks
    await expect(page.locator('img[alt="question-mark"]')).toHaveCount(6);
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

test.describe("Filling in and removing pokemon details", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(createViewport(LARGE_VIEWPORT_WIDTH));
    await goToSite(page);
  });
});
