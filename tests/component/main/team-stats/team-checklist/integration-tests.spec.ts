import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectMove,
  selectItem,
  selectAbility,
  expectChecklistItem,
  openAnalysis,
  showChecklistTooltip as showTooltip,
  showSlot,
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

    // The share link keeps the battle format, so a reload reopens the same saved team
    await page.reload();
    await openAnalysis(page, "Team Checklist");
    await expect(
      battleFormat.getByRole("button", { name: "Doubles" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expectChecklistItem(page, "Spinner/Defogger", true);
    await battleFormat.getByRole("button", { name: "Singles" }).click();
    await expectChecklistItem(page, "Spinner/Defogger", false);
  });

  test("a role that depends on the battle format names its filler and why in its tooltip", async ({
    page,
  }, testInfo) => {
    await page.goto("/?gen=4");
    await openAnalysis(page, "Team Checklist");
    await selectPokemon(page, "Togekiss");
    await selectMove(page, "Defog");
    const tooltip = await showTooltip(
      page,
      testInfo,
      "Spinner/Defogger",
      "Togekiss",
    );
    await expect(tooltip).toContainText("Togekiss: Defog");
    await expect(tooltip).toContainText(
      en.checklist.battleFormat.reasons.spinner,
    );
  });

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
