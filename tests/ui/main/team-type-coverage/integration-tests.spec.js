import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectAbility,
  selectMove,
  selectItem,
  checkTypeCoverageScoreAndPopover,
} from "helper";

test.describe("Team Type Coverage - Integration Tests", () => {
  test("Special Move", async ({ page }) => {
    // 1. Select Glalie with Freeze Dry
    await selectPokemon(page, "Glalie");
    await selectMove(page, "Freeze-Dry");

    // Expect that:
    // - the Water score is +2
    // - hovering over Water shows that Freeze-Dry from Glalie is super effective
    await checkTypeCoverageScoreAndPopover(page, "Water", "+2", [
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
      await checkTypeCoverageScoreAndPopover(page, type, "+2", [
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
      await checkTypeCoverageScoreAndPopover(page, type, "+2", [
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
      await checkTypeCoverageScoreAndPopover(page, type, "0", ["Nothing"]);
    }
  });
});
