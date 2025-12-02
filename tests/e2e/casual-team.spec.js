import { test } from "fixtures";

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

const addPokemon = async (page, index, pokemon) => {
  // Click tab
  await page.getByRole("tab", { name: new RegExp(`${index + 1}`) }).click();

  const fillSelect = async (field, value) => {
    const id = `react-select-single-${index}-${field}`;
    const locator = page.locator(`#${id}`);
    await locator.click({ force: true });
    await locator.fill(value);
    await page.keyboard.press("Enter");
  };

  await fillSelect("name", pokemon.name);
  await fillSelect("item", pokemon.item);
  await fillSelect("ability", pokemon.ability);

  for (let i = 0; i < pokemon.moves.length; i++) {
    await fillSelect(`move${i + 1}`, pokemon.moves[i]);
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
