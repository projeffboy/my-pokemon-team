import { test } from "fixtures";
import {
  selectPokemon,
  selectMove,
  selectItem,
  selectAbility,
  expectChecklistItem,
  openAnalysis,
} from "helper";

test.describe("Team Checklist - Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await openAnalysis(page, "Team Checklist");
  });

  const testCases = [
    {
      pokemon: "Garchomp",
      move: "Stealth Rock",
      item: null,
      checklistItem: "Entry Hazard",
    },
    {
      pokemon: "Corviknight",
      move: "Defog",
      item: null,
      checklistItem: "Spinner/Defogger",
    },
    {
      pokemon: "Toxapex",
      move: "Recover",
      item: null,
      checklistItem: "Reliable Recovery",
    },
    {
      pokemon: "Blissey",
      move: "Heal Bell",
      item: null,
      checklistItem: "Cleric",
    },
    {
      pokemon: "Toxapex",
      move: "Toxic",
      item: null,
      checklistItem: "Status Move",
    },
    {
      pokemon: "Skarmory",
      move: "Whirlwind",
      item: null,
      checklistItem: "Phazer",
    },
    {
      pokemon: "Cofagrigus",
      move: "Mean Look",
      item: null,
      checklistItem: "Trapper",
    },
    {
      pokemon: "Diglett",
      move: null,
      item: null,
      ability: "Arena Trap",
      checklistItem: "Trapper",
    },
    {
      pokemon: "Dragonite",
      move: "Dragon Dance",
      item: null,
      checklistItem: "Boosting Move",
    },
    {
      pokemon: "Tapu Koko",
      move: "Volt Switch",
      item: null,
      checklistItem: "Volt-turn Move",
    },
    {
      pokemon: "Garchomp",
      move: null,
      item: "Choice Scarf",
      checklistItem: "Choice Item",
    },
  ];

  for (const { pokemon, move, item, ability, checklistItem } of testCases) {
    test(`should check '${checklistItem}' when ${pokemon} with ${
      move || item || ability
    } is selected`, async ({ page }) => {
      await selectPokemon(page, pokemon);
      if (move) {
        await selectMove(page, move);
      }
      if (item) {
        await selectItem(page, item);
      }
      if (ability) {
        await selectAbility(page, ability);
      }
      await expectChecklistItem(page, checklistItem, true);
    });
  }
});
