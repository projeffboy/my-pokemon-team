import { test, expect } from "@playwright/test";
import {
  goToSite,
  createViewport,
  SMALL_VIEWPORT_WIDTH,
  MEDIUM_VIEWPORT_WIDTH,
} from "../../../helper.js";

// Test configuration based on ui-main-tests.md requirements for Team Viewer Integration Tests

test.describe("Team Viewer - Integration Tests", () => {
  test.describe("Small viewport", () => {
    test.use({ viewport: createViewport(SMALL_VIEWPORT_WIDTH) });

    test.beforeEach(async ({ page }) => {
      await goToSite(page);
    });

    test("should update team viewer and pokemon card when selecting and switching between slots", async ({
      page,
    }) => {
      // Step 1: Select pokemon Totodile
      const nameCombobox = page.locator("#react-select-single-0-name");
      await nameCombobox.fill("Totodile");
      await nameCombobox.press("Enter");

      // Verify: Team viewer slot 1 should have Totodile's sprite
      const slot1 = page.getByRole("tab", { name: /totodile 1/ });
      await expect(slot1).toBeVisible();
      await expect(slot1.locator('img[alt="totodile"]')).toBeVisible();

      // Step 2: Select slot 3
      const slot3 = page.getByRole("tab", { name: /question-mark 3/ });
      await slot3.click();

      // Verify expectations for slot 1, slot 3, and pokemon card
      // Slot 1: not selected, Totodile sprite
      await expect(slot1).toHaveAttribute("aria-selected", "false");
      await expect(slot1.locator('img[alt="totodile"]')).toBeVisible();

      // Slot 3: selected, question mark sprite
      await expect(slot3).toHaveAttribute("aria-selected", "true");
      await expect(slot3.locator('img[alt="question-mark"]')).toBeVisible();

      // Pokemon card: question mark sprite in the card's sprite area, empty name
      // When a slot with no pokemon is selected, the card shows a question mark sprite
      // The name field should be empty
      // In small viewport, when slot 3 is selected, it shows card for Pokemon 3 (index 2)
      const nameField = page.locator("#react-select-single-2-name");
      await expect(nameField).toHaveValue("");

      // Step 3: Select slot 2
      const slot2 = page.getByRole("tab", { name: /question-mark 2/ });
      await slot2.click();

      // Verify: slot 2 is selected
      await expect(slot2).toHaveAttribute("aria-selected", "true");

      // Step 4: Select slot 1
      await slot1.click();

      // Verify: slot 1 is selected with Totodile sprite, and pokemon card has Totodile sprite and name
      await expect(slot1).toHaveAttribute("aria-selected", "true");
      await expect(slot1.locator('img[alt="totodile"]')).toBeVisible();

      // Pokemon card should have Totodile sprite
      const pokemonCardsAfter = page
        .locator("div")
        .filter({ has: page.locator("#react-select-single-0-name") });
      const pokemonCardSpriteAfter = pokemonCardsAfter
        .locator('img[alt="totodile"]')
        .first();
      await expect(pokemonCardSpriteAfter).toBeVisible();

      // Name field should show Totodile
      const nameOption = page.locator('span:has-text("Totodile")').first();
      await expect(nameOption).toBeVisible();
    });
  });

  test.describe("Medium viewport", () => {
    test.use({ viewport: createViewport(MEDIUM_VIEWPORT_WIDTH) });

    test.beforeEach(async ({ page }) => {
      await goToSite(page);
    });

    test("should handle slot pairs and dual pokemon cards correctly", async ({
      page,
    }) => {
      // Step 1: Select team viewer slot 3-4
      const slot3to4 = page.getByRole("tab", {
        name: /question-mark question-mark 3 - 4/,
      });
      await slot3to4.click();

      // Verify: Slot 3-4 is selected
      await expect(slot3to4).toHaveAttribute("aria-selected", "true");

      // Step 2: For pokemon card 1, select pokemon Elekid and choose move "Thunder Shock"
      const nameCombobox1 = page.locator("#react-select-single-2-name");
      await nameCombobox1.fill("Elekid");
      await nameCombobox1.press("Enter");

      const moveCombobox1 = page.locator("#react-select-single-2-move1");
      await moveCombobox1.fill("Thunder Shock");
      await moveCombobox1.press("Enter");

      // Verify expectations
      // Slot 1-2: not selected, question mark sprite
      const slot1to2 = page.getByRole("tab", {
        name: /question-mark question-mark 1 - 2/,
      });
      await expect(slot1to2).toHaveAttribute("aria-selected", "false");
      await expect(slot1to2.locator('img[alt="question-mark"]')).toHaveCount(2);

      // Slot 3-4: selected, first sprite is elekid, second sprite is question mark
      // Re-query the slot since it may have changed after entering pokemon
      const slot3to4Updated = page.getByRole("tab", {
        name: /elekid question-mark 3 - 4/,
      });
      await expect(slot3to4Updated).toHaveAttribute("aria-selected", "true");
      await expect(slot3to4Updated.locator('img[alt="elekid"]')).toBeVisible();
      await expect(
        slot3to4Updated.locator('img[alt="question-mark"]')
      ).toBeVisible();

      // Step 3: Select slot 5-6
      const slot5to6 = page.getByRole("tab", {
        name: /question-mark question-mark 5 - 6/,
      });
      await slot5to6.click();

      // Verify expectations
      // Slot 3-4: not selected, Elekid and question mark sprite
      const slot3to4AfterSwitch = page.getByRole("tab", {
        name: /elekid question-mark 3 - 4/,
      });
      await expect(slot3to4AfterSwitch).toHaveAttribute(
        "aria-selected",
        "false"
      );
      await expect(
        slot3to4AfterSwitch.locator('img[alt="elekid"]')
      ).toBeVisible();
      await expect(
        slot3to4AfterSwitch.locator('img[alt="question-mark"]')
      ).toBeVisible();

      // Slot 5-6: selected, two question mark sprites
      await expect(slot5to6).toHaveAttribute("aria-selected", "true");
      await expect(slot5to6.locator('img[alt="question-mark"]')).toHaveCount(2);

      // Pokemon cards: both empty name, empty moves, question mark sprites
      // When slot 5-6 is selected in medium viewport, cards for Pokemon 5 and 6 are shown
      // These correspond to card indices 4 and 5 (0-indexed)
      const nameField1 = page.locator("#react-select-single-4-name");
      await expect(nameField1).toHaveValue("");

      const nameField2 = page.locator("#react-select-single-5-name");
      await expect(nameField2).toHaveValue("");

      // Step 4: Select slot 3-4
      const slot3to4Final = page.getByRole("tab", {
        name: /elekid question-mark 3 - 4/,
      });
      await slot3to4Final.click();

      // Verify expectations
      // Slot 3-4: selected, Elekid and question mark sprite
      await expect(slot3to4Final).toHaveAttribute("aria-selected", "true");
      await expect(slot3to4Final.locator('img[alt="elekid"]')).toBeVisible();
      await expect(
        slot3to4Final.locator('img[alt="question-mark"]')
      ).toBeVisible();

      // Pokemon card 1: Elekid name and sprite, has "Thunder Shock" move
      const elekidOption = page.locator('span:has-text("Elekid")').first();
      await expect(elekidOption).toBeVisible();

      const pokemonCard1After = page
        .locator("div")
        .filter({ has: page.locator("#react-select-single-2-name") });
      const pokemonCard1Sprite = pokemonCard1After
        .locator('img[alt="elekid"]')
        .first();
      await expect(pokemonCard1Sprite).toBeVisible();

      const thunderShockOption = page
        .locator('span:has-text("Thunder Shock")')
        .first();
      await expect(thunderShockOption).toBeVisible();

      // Step 5: For pokemon card 2, select Kangaskhan
      const nameCombobox2 = page.locator("#react-select-single-3-name");
      await nameCombobox2.fill("Kangaskhan");
      await nameCombobox2.press("Enter");

      // Verify: Slot 3-4 has Elekid and Kangaskhan sprites
      const slot3to4WithBoth = page.getByRole("tab", {
        name: /elekid kangaskhan 3 - 4/,
      });
      await expect(slot3to4WithBoth.locator('img[alt="elekid"]')).toBeVisible();
      await expect(
        slot3to4WithBoth.locator('img[alt="kangaskhan"]')
      ).toBeVisible();
    });
  });
});
