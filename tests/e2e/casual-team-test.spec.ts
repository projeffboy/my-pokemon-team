import { test } from "fixtures";
import {
  selectAbility,
  selectItem,
  selectMove,
  selectPokemon,
} from "../helper";
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
  pokemon: (typeof team)[number]
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

  test("Creating a casual team", async ({ page }, testInfo) => {
    test.skip(
      !["Android", "iPhone"].includes(testInfo.project.name),
      "This test only runs on mobile"
    );

    for (let i = 0; i < team.length; i++) {
      await addPokemon(page, i, team[i]);
    }
  });
});
