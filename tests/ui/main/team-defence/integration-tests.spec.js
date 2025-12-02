import { test, expect } from "@playwright/test";
import {
  goToSite,
  selectPokemon,
  selectAbility,
  POKEMON_TYPES,
} from "helper.js";

test.describe("Team Defence - Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await goToSite(page);
  });

  const checkTypeScoreAndPopover = async (
    page,
    typeName,
    expectedScore,
    expectedPopoverText
  ) => {
    const heading = page.getByRole("heading", { name: "Team Defence" });
    const section = heading.locator("xpath=../..");

    // Find the type abbreviation from helper.js
    const typeObj = POKEMON_TYPES.find(t => t.full === typeName);
    const typeAbbr = typeObj
      ? typeObj.abbr
      : typeName.substring(0, 3).toUpperCase();

    // Find the type element (e.g. "Fire" or "FIR")
    const typeElement = section
      .locator("div")
      .filter({
        hasText: new RegExp(`^(${typeName}|${typeAbbr})$`),
      })
      .first();

    // Find the score element in the same grid item
    const gridItem = typeElement.locator("xpath=..");
    const scoreElement = gridItem.locator('div[class*="MuiTypography-root"]');

    await expect(scoreElement).toHaveText(expectedScore);

    // Hover to check popover
    await typeElement.hover();
    // The popover might take a moment or be immediate.
    // The popover content is usually in a portal, so we search globally in page.
    // Filter by visibility to avoid strict mode violations if multiple exist in DOM but only one is visible
    // Use .first() because sometimes multiple popovers might be detected (e.g. if animation is finishing)
    await expect(
      page.getByText(expectedPopoverText).filter({ visible: true }).first()
    ).toBeVisible();

    // Move mouse away to close popover to avoid interference with next hover
    await page.mouse.move(0, 0);
  };

  test("Score of a Pokemon with an ability that helps it resist a type", async ({
    page,
  }) => {
    // 1. Select Snorlax with ability Thick Fat
    await selectPokemon(page, "Snorlax");
    await selectAbility(page, "Thick Fat");

    // Expect that for the team defence coverage:
    // - the Fire and Ice score is +1
    // - hovering over Fire and Ice show that they do 0.5x
    await checkTypeScoreAndPopover(page, "Fire", "+1", "0.5x");
    await checkTypeScoreAndPopover(page, "Ice", "+1", "0.5x");
  });

  test("Score of a Pokemon with an ability that makes it immune to a type", async ({
    page,
  }) => {
    // 1. Select Rotom-Wash with ability Levitate
    await selectPokemon(page, "Rotom-Wash");
    await selectAbility(page, "Levitate");

    // Expect that:
    // - the Ground score is +1.5
    // - hovering over Ground shows that it does 0x
    await checkTypeScoreAndPopover(page, "Ground", "+1.5", "0x");
  });
});
