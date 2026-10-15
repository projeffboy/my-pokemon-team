import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectMove,
  selectItem,
  expectChecklistItem,
  openAnalysis,
} from "helper";
import en from "@/i18n/en";

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

  for (const { pokemon, move, item, checklistItem } of testCases) {
    test(`should check '${checklistItem}' when ${pokemon} with ${
      move || item
    } is selected`, async ({ page }) => {
      await selectPokemon(page, pokemon);
      if (move) {
        await selectMove(page, move);
      }
      if (item) {
        await selectItem(page, item);
      }
      await expectChecklistItem(page, checklistItem, true);
    });
  }

  test("in Gen 4, Defog depends on the battle format, and says why until one is picked", async ({
    page,
  }) => {
    await page.goto("/?gen=4");
    await openAnalysis(page, "Team Checklist");
    await selectPokemon(page, "Togekiss");
    await selectMove(page, "Defog");
    const checklist = page.getByRole("region", { name: "Team Checklist" });
    const reason = checklist.getByText(
      en.checklist.battleFormat.reasons.spinner,
    );
    await expectChecklistItem(page, "Spinner/Defogger", "depends");
    await expect(reason).toBeVisible();

    const battleFormat = checklist.getByRole("group", {
      name: "Battle format",
    });
    await battleFormat.getByRole("button", { name: "Doubles" }).click();
    await expectChecklistItem(page, "Spinner/Defogger", true);
    await expect(reason).toBeHidden();
    await battleFormat.getByRole("button", { name: "Singles" }).click();
    await expectChecklistItem(page, "Spinner/Defogger", false);
  });
});
