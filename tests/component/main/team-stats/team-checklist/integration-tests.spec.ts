import type { Page, TestInfo } from "@playwright/test";
import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectMove,
  selectItem,
  selectAbility,
  expectChecklistItem,
  checklistRow,
  openAnalysis,
  showSlot,
} from "helper";

// The switch that opened the checklist may still show its own tooltip
const showTooltip = async (
  page: Page,
  testInfo: TestInfo,
  label: string,
  text: string,
) => {
  const row = checklistRow(page, label);
  if (testInfo.project.use.hasTouch) await row.tap();
  else await row.hover();
  return page.getByRole("tooltip").filter({ hasText: text });
};

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
      pokemon: "Azumarill",
      move: "Aqua Jet",
      item: null,
      checklistItem: "Priority Move",
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

  test("a filled role's tooltip names each pokemon and what fills it", async ({
    page,
  }, testInfo) => {
    await selectPokemon(page, "Gigalith");
    await selectMove(page, "Stealth Rock");
    for (const [slot, pokemon, item] of [
      [1, "Buzzwole", "Choice Band"],
      [2, "Tapu Lele", "Choice Scarf"],
    ] as const) {
      await showSlot(page, slot);
      await selectPokemon(page, pokemon, slot);
      await selectItem(page, item, slot);
    }
    await expect(
      await showTooltip(page, testInfo, "Entry Hazard", "Gigalith"),
    ).toHaveText("Gigalith: Stealth Rock");
    const choice = await showTooltip(page, testInfo, "Choice Item", "Buzzwole");
    await expect(choice.getByRole("listitem")).toHaveText([
      "Buzzwole: Choice Band",
      "Tapu Lele: Choice Scarf",
    ]);
  });

  test("a filler that wraps onto two lines keeps its whole icon", async ({
    page,
  }, testInfo) => {
    await selectPokemon(page, "Vileplume");
    for (const [i, move] of [
      "Toxic",
      "Sleep Powder",
      "Stun Spore",
      "Poison Powder",
    ].entries())
      await selectMove(page, move, i + 1);

    const status = await showTooltip(
      page,
      testInfo,
      "Status Move",
      "Vileplume",
    );
    const filler = status.getByRole("listitem");
    await expect(filler).toHaveText(
      "Vileplume: Toxic, Sleep Powder, Stun Spore, and Poison Powder",
    );
    await expect(filler.locator("span").first()).toHaveJSProperty(
      "offsetWidth",
      40,
    );
  });
});
