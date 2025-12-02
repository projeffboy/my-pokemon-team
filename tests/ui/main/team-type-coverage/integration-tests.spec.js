import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectAbility,
  selectMove,
  selectItem,
  POKEMON_TYPES,
} from "helper.js";

test.describe("Team Type Coverage - Integration Tests", () => {
  const checkTypeScoreAndPopover = async (
    page,
    typeName,
    expectedScore,
    expectedContent
  ) => {
    const heading = page.getByRole("heading", { name: "Team Type Coverage" });
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
    await page.waitForTimeout(300); // Wait for transition

    // Check for header "Super effective against [Type]:"
    // Note: The text is split across nodes: "Super effective against " <span>Type</span> ":"
    // So we check for the prefix.
    await expect(
      page
        .getByText("Super effective against")
        .filter({ visible: true })
        .first()
    ).toBeVisible();
    await expect(
      page.getByText(typeName).filter({ visible: true }).first()
    ).toBeVisible();

    // Check for expected content
    for (const text of expectedContent) {
      await expect(
        page.getByText(text, { exact: false }).filter({ visible: true }).first()
      ).toBeVisible();
    }

    // Move mouse away to close popover to avoid interference with next hover
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100); // Wait for close transition
  };

  test("Special Move", async ({ page }) => {
    // 1. Select Glalie with Freeze Dry
    await selectPokemon(page, "Glalie");
    await selectMove(page, "Freeze-Dry");

    // Expect that:
    // - the Water score is +2
    // - hovering over Water shows that Freeze-Dry from Glalie is super effective
    await checkTypeScoreAndPopover(page, "Water", "+2", [
      "Freeze-Dry",
      "Glalie",
    ]);
  });

  test("Special ability", async ({ page }) => {
    // 1. Select Gardevoir-Mega with ability Pixilate and move Hyper Voice
    await selectPokemon(page, "Gardevoir-Mega");
    await selectAbility(page, "Pixilate");
    await selectMove(page, "Hyper Voice");

    // Expect that:
    // - the Dark, Dragon, Fighting score is +2
    // - hovering over Dark, Dragon, Fighting shows that Hyper Voice from Gardevoir-Mega is super effective
    const types = ["Dark", "Dragon", "Fighting"];
    for (const type of types) {
      await checkTypeScoreAndPopover(page, type, "+2", [
        "Hyper Voice",
        "Gardevoir-Mega",
      ]);
    }
  });

  test("Special Pokemon, Item, and Move", async ({ page }) => {
    // 1. Select Arceus-Dark with item Dread Plate, ability Multitype, and move Judgment
    await selectPokemon(page, "Arceus-Dark");
    await selectItem(page, "Dread Plate");
    await selectAbility(page, "Multitype");
    await selectMove(page, "Judgment");

    // Expect that:
    // - the Ghost, Psychic score is +2
    // - hovering over Ghost, Psychic shows that Judgment from Arceus-Dark is super effective
    const types = ["Ghost", "Psychic"];
    for (const type of types) {
      await checkTypeScoreAndPopover(page, type, "+2", [
        "Judgment",
        "Arceus-Dark",
      ]);
    }
  });

  test("One weak move, one non-normal status move", async ({ page }) => {
    // 1. Select Dedenne with moves Nuzzle and Rain Dance
    await selectPokemon(page, "Dedenne");
    await selectMove(page, "Nuzzle", 0, 1);
    await selectMove(page, "Rain Dance", 0, 2);

    // Expect that:
    // - the score is 0 for Flying, Water
    // - hovering over Flying, Water shows that nothing is super effective
    const types = ["Flying", "Water"];
    for (const type of types) {
      await checkTypeScoreAndPopover(page, type, "0", ["Nothing"]);
    }
  });
});
