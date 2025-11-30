import { test, expect } from "@playwright/test";
import { goToSite, POKEMON_TYPES } from "../../../helper.js";

// Test configuration based on ui-main-tests.md requirements for Team Defence Integration Tests

test.describe("Team Defence - Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await goToSite(page);
  });

  test("should show correct scores for single-type pokemon (Porygon2)", async ({
    page,
  }) => {
    // Step 1: Select pokemon Porygon2
    const nameCombobox = page.locator("#react-select-single-0-name");
    await nameCombobox.fill("Porygon2");
    await page.waitForTimeout(500); // Wait for dropdown to populate
    await nameCombobox.press("Enter");

    // Wait longer for the state to update
    await page.waitForTimeout(2000);

    // Check that Porygon2 appears in the selected value
    const selectedValue = page
      .locator("span")
      .filter({ hasText: "Porygon2" })
      .first();
    await expect(selectedValue).toBeVisible();

    // Verify team defence coverage scores
    const expectedScores = {
      Fighting: -1,
      Ghost: 1.5,
    };

    // Check specific scores
    for (const [typeName, expectedScore] of Object.entries(expectedScores)) {
      const score = await getTeamDefenceScore(page, typeName);
      expect(score).toBe(expectedScore);
    }

    // Check all other types should be 0
    for (const type of POKEMON_TYPES) {
      if (!expectedScores[type.full]) {
        const score = await getTeamDefenceScore(page, type.full);
        expect(score).toBe(0);
      }
    }

    // Verify hover tooltips
    await verifyTypeTooltip(page, "Fighting", ["2x to Porygon2"]);
    await verifyTypeTooltip(page, "Ghost", ["0x to Porygon2"]);

    // Verify a sample of other types do 1x
    await verifyTypeTooltip(page, "Fire", ["1x to Porygon2"]);
    await verifyTypeTooltip(page, "Water", ["1x to Porygon2"]);
  });

  test("should show correct scores for dual-type pokemon (Roselia)", async ({
    page,
  }) => {
    // Step 1: Select pokemon Roselia
    const nameCombobox = page.locator("#react-select-single-0-name");
    await nameCombobox.fill("Roselia");
    await page.waitForTimeout(500); // Wait for dropdown to populate
    await nameCombobox.press("Enter");

    // Wait longer for the state to update
    await page.waitForTimeout(2000);

    // Check that Roselia appears in the selected value
    const selectedValue = page
      .locator("span")
      .filter({ hasText: "Roselia" })
      .first();
    await expect(selectedValue).toBeVisible();

    // Verify team defence coverage scores
    const expectedScores = {
      Grass: 1.5,
      Electric: 1,
      Fairy: 1,
      Fighting: 1,
      Water: 1,
      Fire: -1,
      Flying: -1,
      Ice: -1,
      Psychic: -1,
    };

    // Check specific scores
    for (const [typeName, expectedScore] of Object.entries(expectedScores)) {
      const score = await getTeamDefenceScore(page, typeName);
      expect(score).toBe(expectedScore);
    }

    // Check all other types should be 0
    for (const type of POKEMON_TYPES) {
      if (!expectedScores[type.full]) {
        const score = await getTeamDefenceScore(page, type.full);
        expect(score).toBe(0);
      }
    }

    // Verify hover tooltips
    await verifyTypeTooltip(page, "Grass", ["0.25x to Roselia"]);

    const halfDamageTypes = ["Electric", "Fairy", "Fighting", "Water"];
    for (const type of halfDamageTypes) {
      await verifyTypeTooltip(page, type, ["0.5x to Roselia"]);
    }

    const doubleDamageTypes = ["Fire", "Flying", "Ice", "Psychic"];
    for (const type of doubleDamageTypes) {
      await verifyTypeTooltip(page, type, ["2x to Roselia"]);
    }

    // Verify a sample of other types do 1x
    await verifyTypeTooltip(page, "Normal", ["1x to Roselia"]);
    await verifyTypeTooltip(page, "Rock", ["1x to Roselia"]);
  });

  test("should show correct scores for two pokemon combined (Porygon2 + Roselia)", async ({
    page,
  }) => {
    // Step 1: Select pokemon Porygon2 in slot 1
    const nameCombobox1 = page.locator("#react-select-single-0-name");
    await nameCombobox1.fill("Porygon2");
    await page.waitForTimeout(500);
    await nameCombobox1.press("Enter");

    // Step 2: Select pokemon Roselia in slot 2
    const nameCombobox2 = page.locator("#react-select-single-1-name");
    await nameCombobox2.fill("Roselia");
    await page.waitForTimeout(500);
    await nameCombobox2.press("Enter");

    // Wait for state update
    await page.waitForTimeout(2000);

    // Verify team defence coverage scores
    const expectedScores = {
      Ghost: 1.5,
      Grass: 1.5,
      Electric: 1,
      Fairy: 1,
      Water: 1,
      Fire: -1,
      Flying: -1,
      Ice: -1,
      Psychic: -1,
    };

    // Check specific scores
    for (const [typeName, expectedScore] of Object.entries(expectedScores)) {
      const score = await getTeamDefenceScore(page, typeName);
      expect(score).toBe(expectedScore);
    }

    // Check all other types should be 0
    for (const type of POKEMON_TYPES) {
      if (!expectedScores[type.full]) {
        const score = await getTeamDefenceScore(page, type.full);
        expect(score).toBe(0);
      }
    }

    // Verify hover tooltips

    // Electric, Fairy, Water do 0.5x to Roselia and 1x to Porygon2
    const halfRoseliaNormalPorygon = ["Electric", "Fairy", "Water"];
    for (const type of halfRoseliaNormalPorygon) {
      await verifyTypeTooltip(page, type, [
        "0.5x to Roselia",
        "1x to Porygon2",
      ]);
    }

    // Fighting does 0.5x to Roselia and 2x to Porygon2
    await verifyTypeTooltip(page, "Fighting", [
      "0.5x to Roselia",
      "2x to Porygon2",
    ]);

    // Fire, Flying, Ice, Psychic do 2x to Roselia and 1x to Porygon2
    const doubleRoseliaNormalPorygon = ["Fire", "Flying", "Ice", "Psychic"];
    for (const type of doubleRoseliaNormalPorygon) {
      await verifyTypeTooltip(page, type, ["2x to Roselia", "1x to Porygon2"]);
    }

    // Ghost does 1x to Roselia and 0x to Porygon2
    await verifyTypeTooltip(page, "Ghost", ["1x to Roselia", "0x to Porygon2"]);

    // Grass does 0.25x to Roselia and 1x to Porygon2
    await verifyTypeTooltip(page, "Grass", [
      "0.25x to Roselia",
      "1x to Porygon2",
    ]);

    // All other types do 1x to both pokemon
    await verifyTypeTooltip(page, "Normal", [
      "1x to Roselia",
      "1x to Porygon2",
    ]);
    await verifyTypeTooltip(page, "Rock", ["1x to Roselia", "1x to Porygon2"]);
  });

  test("should show correct scores for pokemon with ability resisting type (Snorlax + Thick Fat)", async ({
    page,
  }) => {
    // Step 1: Select Snorlax
    const nameCombobox = page.locator("#react-select-single-0-name");
    await nameCombobox.fill("Snorlax");
    await page.waitForTimeout(500);
    await nameCombobox.press("Enter");

    // Step 2: Select Ability Thick Fat
    const abilityCombobox = page.locator("#react-select-single-0-ability");
    await abilityCombobox.fill("Thick Fat");
    await page.waitForTimeout(500);
    await abilityCombobox.press("Enter");

    // Wait for state update
    await page.waitForTimeout(2000);

    // Verify team defence coverage scores
    const expectedScores = {
      Ghost: 1.5,
      Fire: 1,
      Ice: 1,
      Fighting: -1,
    };

    // Check specific scores
    for (const [typeName, expectedScore] of Object.entries(expectedScores)) {
      const score = await getTeamDefenceScore(page, typeName);
      expect(score).toBe(expectedScore);
    }

    // Check all other types should be 0
    for (const type of POKEMON_TYPES) {
      if (!expectedScores[type.full]) {
        const score = await getTeamDefenceScore(page, type.full);
        expect(score).toBe(0);
      }
    }

    // Verify hover tooltips

    // Ghost does 0x
    await verifyTypeTooltip(page, "Ghost", ["0x to Snorlax"]);

    // Fire, Ice do 0.5x
    await verifyTypeTooltip(page, "Fire", ["0.5x to Snorlax"]);
    await verifyTypeTooltip(page, "Ice", ["0.5x to Snorlax"]);

    // Fighting does 2x
    await verifyTypeTooltip(page, "Fighting", ["2x to Snorlax"]);

    // All other types do 1x
    await verifyTypeTooltip(page, "Normal", ["1x to Snorlax"]);
    await verifyTypeTooltip(page, "Water", ["1x to Snorlax"]);
  });

  test("should show correct scores for pokemon with ability providing immunity (Heatran + Flash Fire)", async ({
    page,
  }) => {
    // Step 1: Select Heatran
    const nameCombobox = page.locator("#react-select-single-0-name");
    await nameCombobox.fill("Heatran");
    await page.waitForTimeout(500);
    await nameCombobox.press("Enter");

    // Step 2: Select Ability Flash Fire
    const abilityCombobox = page.locator("#react-select-single-0-ability");
    await abilityCombobox.fill("Flash Fire");
    await page.waitForTimeout(500);
    await abilityCombobox.press("Enter");

    // Wait for state update
    await page.waitForTimeout(2000);

    // Verify team defence coverage scores
    const expectedScores = {
      Bug: 1.5,
      Fairy: 1.5,
      Fire: 1.5,
      Grass: 1.5,
      Ice: 1.5,
      Poison: 1.5,
      Steel: 1.5,
      Dragon: 1,
      Flying: 1,
      Normal: 1,
      Psychic: 1,
      Fighting: -1,
      Water: -1,
      Ground: -1.5,
    };

    // Check specific scores
    for (const [typeName, expectedScore] of Object.entries(expectedScores)) {
      const score = await getTeamDefenceScore(page, typeName);
      expect(score).toBe(expectedScore);
    }

    // Check all other types should be 0 (Dark, Electric, Ghost, Rock)
    for (const type of POKEMON_TYPES) {
      if (!expectedScores[type.full]) {
        const score = await getTeamDefenceScore(page, type.full);
        expect(score).toBe(0);
      }
    }

    // Verify hover tooltips

    // Fire, Poison do 0x
    await verifyTypeTooltip(page, "Fire", ["0x to Heatran"]);
    await verifyTypeTooltip(page, "Poison", ["0x to Heatran"]);

    // Bug, Fairy, Grass, Ice, Steel do 0.25x
    const quarterDamageTypes = ["Bug", "Fairy", "Grass", "Ice", "Steel"];
    for (const type of quarterDamageTypes) {
      await verifyTypeTooltip(page, type, ["0.25x to Heatran"]);
    }

    // Dragon, Flying, Normal, Psychic do 0.5x
    const halfDamageTypes = ["Dragon", "Flying", "Normal", "Psychic"];
    for (const type of halfDamageTypes) {
      await verifyTypeTooltip(page, type, ["0.5x to Heatran"]);
    }

    // Fighting, Water do 2x
    await verifyTypeTooltip(page, "Fighting", ["2x to Heatran"]);
    await verifyTypeTooltip(page, "Water", ["2x to Heatran"]);

    // Ground does 4x
    await verifyTypeTooltip(page, "Ground", ["4x to Heatran"]);

    // All other types do 1x
    await verifyTypeTooltip(page, "Dark", ["1x to Heatran"]);
    await verifyTypeTooltip(page, "Electric", ["1x to Heatran"]);
  });
});

/**
 * Helper function to get the team defence score for a specific type
 * @param {Page} page - Playwright page object
 * @param {string} typeName - Full name of the type (e.g., "Fighting", "Ghost")
 * @returns {Promise<number>} The score as a number
 */
async function getTeamDefenceScore(page, typeName) {
  // Find the type abbreviation
  const typeInfo = POKEMON_TYPES.find(t => t.full === typeName);
  if (!typeInfo) {
    throw new Error(`Type ${typeName} not found in POKEMON_TYPES`);
  }

  const scoreText = await page
    .locator("div")
    .filter({ hasText: new RegExp(`^(${typeInfo.full}|${typeInfo.abbr})$`) })
    .first()
    .locator("xpath=following-sibling::*[1]")
    .textContent();

  return parseFloat(scoreText);
}

/**
 * Helper function to verify the tooltip content when hovering over a type
 * @param {Page} page - Playwright page object
 * @param {string} typeName - Full name of the type
 * @param {string[]} expectedTexts - Array of text snippets expected in the tooltip
 */
async function verifyTypeTooltip(page, typeName, expectedTexts) {
  const typeInfo = POKEMON_TYPES.find(t => t.full === typeName);
  if (!typeInfo) {
    throw new Error(`Type ${typeName} not found in POKEMON_TYPES`);
  }

  // Find the type element in Team Defence section (first occurrence)
  const typeElement = page
    .locator("div")
    .filter({ hasText: new RegExp(`^(${typeInfo.full}|${typeInfo.abbr})$`) })
    .first();

  // Hover over the type
  await typeElement.hover();

  // Wait for the popover to appear
  await page.waitForTimeout(500);

  // Verify the expected text appears in the popover
  for (const expectedText of expectedTexts) {
    // Match the list item containing the expected text parts
    const listItem = page
      .locator("li")
      // this regex allows for flexible spacing (or lack of) between words
      .filter({ hasText: new RegExp(expectedText.replace(/\s+/g, "\\s*")) });
    await expect(listItem).toBeVisible();
  }
}
