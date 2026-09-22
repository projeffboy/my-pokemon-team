import { test, expect } from "fixtures";
import {
  selectAbility,
  selectItem,
  selectMove,
  selectPokemon,
  getTeamTextFromUrl,
} from "helper";
import type { Page } from "@playwright/test";

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
  pokemon: (typeof team)[number],
) => {
  // Click tab
  await page.getByRole("tab", { name: new RegExp(`${index + 1}`) }).click();

  await selectPokemon(page, pokemon.name, index);
  await selectItem(page, pokemon.item, index);
  await selectAbility(page, pokemon.ability, index);

  for (const [i, move] of pokemon.moves.entries()) {
    await selectMove(page, move, i + 1, index);
  }
};

test.describe("Casual Team", () => {
  test("Creating a casual team", async ({ page }, testInfo) => {
    test.skip(
      !["Android", "iPhone"].includes(testInfo.project.name),
      "This test only runs on mobile",
    );

    for (const [i, pokemon] of team.entries()) {
      await addPokemon(page, i, pokemon);
    }

    // The URL's `team` param should reflect the fully built team
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Pikachu");
    const teamText = getTeamTextFromUrl(page);
    for (const pokemon of team) {
      expect(teamText).toContain(pokemon.name);
      expect(teamText).toContain(`Ability: ${pokemon.ability}`);
      for (const move of pokemon.moves) {
        expect(teamText).toContain(`- ${move}`);
      }
    }
  });
});
