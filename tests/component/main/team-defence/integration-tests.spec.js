import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectAbility,
  checkTypeDefenceScoreAndPopover,
} from "helper";

test.describe("Team Defence - Integration Tests", () => {
  test("Score of a Pokemon with an ability that helps it resist a type", async ({
    page,
  }) => {
    // 1. Select Snorlax with ability Thick Fat
    await selectPokemon(page, "Snorlax");
    await selectAbility(page, "Thick Fat");

    // Expect that for the team defence coverage:
    // - the Fire and Ice score is +1
    // - hovering over Fire and Ice show that they do 0.5x
    await checkTypeDefenceScoreAndPopover(page, "Fire", "+1", [
      "0.5x to Snorlax",
    ]);
    await checkTypeDefenceScoreAndPopover(page, "Ice", "+1", [
      "0.5x to Snorlax",
    ]);
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
    await checkTypeDefenceScoreAndPopover(page, "Ground", "+1.5", [
      "0x to Rotom-Wash",
    ]);
  });
});
