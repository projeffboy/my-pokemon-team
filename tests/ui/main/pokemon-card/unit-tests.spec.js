import { test, expect } from "@playwright/test";
import {
  goToSite,
  createViewport,
  SMALL_VIEWPORT_WIDTH,
  MEDIUM_VIEWPORT_WIDTH,
  LARGE_VIEWPORT_WIDTH,
} from "../../../helper.js";

// Test configuration based on ui-main-tests.md requirements for Pokemon Card Unit Tests

test.describe("Pokemon Card - Unit Tests", () => {
  test.describe("Viewport-specific card counts", () => {
    test("should display 1 pokemon card in small viewport", async ({
      page,
    }) => {
      await page.setViewportSize(createViewport(SMALL_VIEWPORT_WIDTH));
      await goToSite(page);

      // Count the number of name comboboxes to determine number of visible cards
      // In small viewport, only 1 card is visible at a time
      const nameFields = page.locator(
        'input[id*="react-select-single"][id$="name"]'
      );
      await expect(nameFields).toHaveCount(1);
    });

    test("should display 2 pokemon cards in medium viewport", async ({
      page,
    }) => {
      await page.setViewportSize(createViewport(MEDIUM_VIEWPORT_WIDTH));
      await goToSite(page);

      // In medium viewport, 2 cards are visible at a time
      const nameFields = page.locator(
        'input[id*="react-select-single"][id$="name"]'
      );
      await expect(nameFields).toHaveCount(2);
    });

    test("should display 6 pokemon cards in large viewport", async ({
      page,
    }) => {
      await page.setViewportSize(createViewport(LARGE_VIEWPORT_WIDTH));
      await goToSite(page);

      // In large viewport, all 6 cards are visible
      const nameFields = page.locator(
        'input[id*="react-select-single"][id$="name"]'
      );
      await expect(nameFields).toHaveCount(6);
    });
  });

  test.describe("Default card state", () => {
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

    test("should have expected pokemon in the Name dropdown", async ({
      page,
    }) => {
      const nameField = page.locator("#react-select-single-0-name");

      // Test just a few representative pokemon to keep the test fast
      const expectedPokemon = ["Pikachu", "Garchomp", "Corviknight"];

      for (const pokemon of expectedPokemon) {
        await nameField.fill(pokemon);
        // Press Enter to see if it selects (which proves it exists)
        await nameField.press("Enter");

        // Check that the pokemon name appears
        const pokemonName = page.locator(`span:has-text("${pokemon}")`).first();
        await expect(pokemonName).toBeVisible();

        // Clear the selection by selecting and clearing the field
        await nameField.clear();

        // Wait a bit for the field to clear
        await page.waitForTimeout(200);
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

    test("should have expected items in the Item dropdown", async ({
      page,
    }) => {
      const itemField = page.locator("#react-select-single-0-item");

      // Test just a few representative items to keep the test fast
      const expectedItems = ["Focus Sash", "Choice Scarf", "Leftovers"];

      for (const item of expectedItems) {
        await itemField.fill(item);
        // Press Enter to see if it selects (which proves it exists)
        await itemField.press("Enter");

        // Check that the item appears
        const itemSpan = page.locator(`span:has-text("${item}")`).first();
        await expect(itemSpan).toBeVisible();

        // Clear the selection by clearing the field
        await itemField.clear();

        // Wait a bit for the field to clear
        await page.waitForTimeout(200);
      }
    });
  });

  test.describe("Filling in and removing pokemon details", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(createViewport(LARGE_VIEWPORT_WIDTH));
      await goToSite(page);
    });

    test("should fill in and remove details of a normal pokemon", async ({
      page,
    }) => {
      // Step 1: Select pokemon Chespin
      const nameField = page.locator("#react-select-single-0-name");
      await nameField.fill("Chespin");
      await nameField.press("Enter");

      // Give it Aerial Ace for all four moves
      for (let moveNum = 1; moveNum <= 4; moveNum++) {
        const moveField = page.locator(`#react-select-single-0-move${moveNum}`);
        await moveField.fill("Aerial Ace");
        await moveField.press("Enter");
      }

      // Give it an item of "Apicot Berry"
      const itemField = page.locator("#react-select-single-0-item");
      await itemField.fill("Apicot Berry");
      await itemField.press("Enter");

      // Choose ability "Bulletproof"
      const abilityField = page.locator("#react-select-single-0-ability");
      await abilityField.fill("Bulletproof");
      await abilityField.press("Enter");

      // Verify all details are present
      const chespinName = page.locator('span:has-text("Chespin")').first();
      await expect(chespinName).toBeVisible();

      // Verify Chespin sprite
      const chespinSprite = page.locator('img[alt="chespin"]').first();
      await expect(chespinSprite).toBeVisible();

      // Verify all 4 Aerial Ace moves
      const aerialAceMoves = page.locator('span:has-text("Aerial Ace")');
      await expect(aerialAceMoves).toHaveCount(4);

      // Verify item
      const apicotBerry = page.locator('span:has-text("Apicot Berry")').first();
      await expect(apicotBerry).toBeVisible();

      // Verify ability
      const bulletproof = page.locator('span:has-text("Bulletproof")').first();
      await expect(bulletproof).toBeVisible();

      // Step 2: Remove the pokemon by clearing the name field
      await nameField.clear();

      // Verify all details are gone
      // Name field should be empty
      await expect(nameField).toHaveValue("");

      // Sprite should be question mark again
      const questionMarkSprite = page
        .locator('img[alt="question-mark"]')
        .first();
      await expect(questionMarkSprite).toBeVisible();

      // Move fields should be empty
      for (let moveNum = 1; moveNum <= 4; moveNum++) {
        const moveField = page.locator(`#react-select-single-0-move${moveNum}`);
        await expect(moveField).toHaveValue("");
      }

      // Item field should be empty
      await expect(itemField).toHaveValue("");

      // Ability field should be empty
      await expect(abilityField).toHaveValue("");
    });

    test("should auto-fill required item and single ability for Pinsir-Mega", async ({
      page,
    }) => {
      // Select pokemon Pinsir-Mega
      const nameField = page.locator("#react-select-single-0-name");
      await nameField.fill("Pinsir-Mega");
      await nameField.press("Enter");

      // Verify it has item "Pinsirite"
      const pinsirite = page.locator('span:has-text("Pinsirite")').first();
      await expect(pinsirite).toBeVisible();

      // Verify it has ability "Aerilate"
      const aerilate = page.locator('span:has-text("Aerilate")').first();
      await expect(aerilate).toBeVisible();
    });
  });
});
