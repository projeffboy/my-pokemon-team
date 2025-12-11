import { test } from "fixtures";
import type { Page } from "@playwright/test";
import { selectAbility, selectItem, selectMove, selectPokemon } from "helper";

const team = [
  {
    name: "Nidoking",
    item: "Shell Bell",
    ability: "Rivalry",
    moves: ["Protect", "Ice Punch", "Dragon Pulse", "Earthquake"],
  },
  {
    name: "Nidoqueen",
    item: "Shell Bell",
    ability: "Rivalry",
    moves: ["Protect", "Thunder Punch", "Brick Break", "Flamethrower"],
  },
  {
    name: "Umbreon",
    item: "Shell Bell",
    ability: "Inner Focus",
    moves: ["Dark Pulse", "Protect", "Crunch", "Moonlight"],
  },
  {
    name: "Espeon",
    item: "Shell Bell",
    ability: "Magic Bounce",
    moves: ["Psychic", "Protect", "Sunny Day", "Morning Sun"],
  },
  {
    name: "Mimikyu",
    item: "Shell Bell",
    ability: "Disguise",
    moves: ["Protect", "Shadow Ball", "Dark Pulse", "After You"],
  },
  {
    name: "Pikachu",
    item: "Shell Bell",
    ability: "Static",
    moves: ["Protect", "Thunderbolt", "Extreme Speed", "Attract"],
  },
];

const addPokemon = async (
  page: Page,
  index: number,
  pokemon: { name: string; item: string; ability: string; moves: string[] }
) => {
  // Click tab
  await page.getByRole("tab", { name: new RegExp(`${index + 1}`) }).click();

  await selectPokemon(page, pokemon.name, index);
  await selectItem(page, pokemon.item, index);
  await selectAbility(page, pokemon.ability, index);

  for (let i = 0; i < pokemon.moves.length; i++) {
    await selectMove(page, pokemon.moves[i], i + 1, index);
  }
};

test.describe("Casual Team", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      !["Mobile Chrome", "Mobile Safari"].includes(testInfo.project.name),
      "This test only runs on mobile"
    );
  });

  test("Creating a casual team", async ({ page }) => {
    for (let i = 0; i < team.length; i++) {
      await addPokemon(page, i, team[i]);
    }
  });
});
