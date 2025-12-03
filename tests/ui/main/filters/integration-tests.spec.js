import { test, expect } from "fixtures";

// Pokemon Selectibility Check Helpers

const checkPokemonVisibility = async (
  page,
  name,
  shouldBeSelectable = true,
  expectedNameInList = null
) => {
  const pokemonInput = page.getByRole("combobox").first();
  await pokemonInput.fill(name);

  const option = page
    .getByRole("listbox")
    .getByText(expectedNameInList || name, { exact: true });

  if (shouldBeSelectable) {
    await expect(option).toBeVisible();
  } else {
    await expect(option).not.toBeVisible();
  }
};

const checkPokemonSelectable = async (page, name, expectedNameInList) => {
  await checkPokemonVisibility(page, name, true, expectedNameInList);
};

const checkPokemonNotSelectable = async (page, name) => {
  await checkPokemonVisibility(page, name, false);
};

// Move Selectibility Check Helpers

const checkMoveVisilibility = async (page, moveName, shouldBeSelectable) => {
  const moveInput = page.getByRole("combobox").nth(1);
  await moveInput.fill(moveName);
  const option = page.getByRole("listbox").getByText(moveName, { exact: true });
  if (shouldBeSelectable) {
    await expect(option).toBeVisible();
  } else {
    await expect(option).not.toBeVisible();
  }
};

const checkMoveSelectable = async (page, moveName) => {
  await checkMoveVisilibility(page, moveName, true);
};

const checkMoveNotSelectable = async (page, moveName) => {
  await checkMoveVisilibility(page, moveName, false);
};

const selectFilterOption = async (page, filterName, optionName) => {
  const label = page.getByText(filterName, { exact: true });
  const dropdown = label.locator("..").getByRole("button");
  await dropdown.click();
  const option = page.getByRole("option", { name: optionName });
  await option.click();
  await expect(page.getByRole("listbox")).toBeHidden();
};

test.describe("Filters Integration Tests", () => {
  test("Format Filter", async ({ page }) => {
    // 1. Select format OU
    await selectFilterOption(page, "Format", "OU: Over Used");

    // Pokemon that can be selected: Meowth, Landorus-Therian, Regigigas
    const selectablePokemon = [
      { name: "Meowth" },
      { name: "Landorus", expected: "Landorus-Therian" },
      { name: "Regigigas" },
    ];
    for (const { name, expected } of selectablePokemon) {
      await checkPokemonSelectable(page, name, expected);
    }

    // Pokemon that can't be selected: Landorus, Arceus, Dracovish
    const notSelectablePokemon = ["Landorus", "Arceus", "Dracovish"];
    for (const name of notSelectablePokemon) {
      await checkPokemonNotSelectable(page, name);
    }
  });

  test("Type Filter", async ({ page }) => {
    // 1. Select type electric
    await selectFilterOption(page, "Type", "Electric");

    // Pokemon that can be selected: Pichu, Pikachu, Raichu, Electabuzz, Vikavolt, Tapu Koko
    const selectablePokemon = [
      "Pichu",
      "Pikachu",
      "Raichu",
      "Electabuzz",
      "Vikavolt",
      "Tapu Koko",
    ];
    for (const name of selectablePokemon) {
      await checkPokemonSelectable(page, name);
    }

    // Pokemon that can't be selected: Larvitar, Corphish, Reshiram
    const notSelectablePokemon = ["Larvitar", "Corphish", "Reshiram"];
    for (const name of notSelectablePokemon) {
      await checkPokemonNotSelectable(page, name);
    }
  });

  test("Region Filter", async ({ page }) => {
    // 1. Select region Kalos
    await selectFilterOption(page, "Region", "Kalos");

    // Pokemon that can be selected: Chespin, Greninja, Litleo, Volcanion
    const selectablePokemon = ["Chespin", "Greninja", "Litleo", "Volcanion"];
    for (const name of selectablePokemon) {
      await checkPokemonSelectable(page, name);
    }

    // Pokemon that can't be selected: Bulbasaur, Pikachu, Rowlet
    const notSelectablePokemon = ["Bulbasaur", "Pikachu", "Rowlet"];
    for (const name of notSelectablePokemon) {
      await checkPokemonNotSelectable(page, name);
    }
  });

  test("Moves Filter", async ({ page }) => {
    // 1. Select only viable moves.
    await selectFilterOption(page, "Moves", "Viable");

    // 2. Select pokemon Muk-Alola
    const pokemonInput = page.getByRole("combobox").first();
    await pokemonInput.fill("Muk-Alola");
    await page
      .getByRole("listbox")
      .getByText("Muk-Alola", { exact: true })
      .click();
    await expect(page.getByRole("listbox")).toBeHidden();

    const selectableMoves = ["Crunch", "Toxic", "Stone Edge", "Flamethrower"];
    for (const move of selectableMoves) {
      await checkMoveSelectable(page, move);
    }

    // Moves that can't be selected: Dig, Attract, Hyper Beam, Poison Fang
    const notSelectableMoves = ["Dig", "Attract", "Hyper Beam", "Poison Fang"];
    for (const move of notSelectableMoves) {
      await checkMoveNotSelectable(page, move);
    }
  });

  test("All Filters", async ({ page }) => {
    // 1. Set all filters
    await selectFilterOption(page, "Format", "UU: Under Used");
    await page.waitForTimeout(500); // Wait for overlay to disappear completely

    await selectFilterOption(page, "Type", "Grass");
    await page.waitForTimeout(500);

    await selectFilterOption(page, "Region", "Sinnoh");
    await page.waitForTimeout(500);

    await selectFilterOption(page, "Moves", "Viable");
    await page.waitForTimeout(500);

    const pokemonInput = page.getByRole("combobox").first();

    // Pokemon that can be selected: Torterra
    await pokemonInput.fill("Torterra");
    await expect(
      page.getByRole("listbox").getByText("Torterra", { exact: true })
    ).toBeVisible();

    // Pokemon that can't be selected: Chespin, Pikachu, Clefable
    const notSelectablePokemon = ["Chespin", "Pikachu", "Clefable"];
    for (const name of notSelectablePokemon) {
      await checkPokemonNotSelectable(page, name);
    }

    // 2. Select pokemon Torterra
    await pokemonInput.fill("Torterra");
    await page
      .getByRole("listbox")
      .getByText("Torterra", { exact: true })
      .click();
    await expect(page.getByRole("listbox")).toBeHidden();

    const selectableMoves = [
      "Earthquake",
      "Wood Hammer",
      "Stealth Rock",
      "Synthesis",
    ];
    for (const move of selectableMoves) {
      await checkMoveSelectable(page, move);
    }

    const notSelectableMoves = ["Attract", "Splash", "Celebrate", "Confide"];
    for (const move of notSelectableMoves) {
      await checkMoveNotSelectable(page, move);
    }
  });
});
