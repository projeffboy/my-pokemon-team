import { test, expect } from "fixtures";
import {
  closeDialog,
  openFilters,
  openSort,
  selectDialogOption,
  selectMove,
  selectPokemon,
  getTeamTextFromUrl,
} from "helper";
import type { Page } from "@playwright/test";

test.describe("Filters Integration Tests", () => {
  // Pokemon Selectibility Check Helpers

  const checkPokemonVisibility = async (
    page: Page,
    name: string,
    shouldBeSelectable: boolean,
    expectedNameInList: string | null = null,
  ) => {
    const pokemonInput = page.getByRole("combobox", {
      name: "Pokemon 1's name",
    });
    await pokemonInput.fill(name);
    const option = page
      .getByRole("listbox")
      .getByText(expectedNameInList || name, { exact: true });
    await expect(option)[shouldBeSelectable ? "toBeVisible" : "toBeHidden"]();
  };

  const checkPokemonSelectable = async (
    page: Page,
    name: string,
    expectedNameInList?: string,
  ) => {
    await checkPokemonVisibility(page, name, true, expectedNameInList);
  };

  const checkPokemonNotSelectable = async (page: Page, name: string) => {
    await checkPokemonVisibility(page, name, false);
  };

  // Move Selectibility Check Helpers

  const checkMoveVisilibility = async (
    page: Page,
    moveName: string,
    shouldBeSelectable: boolean,
  ) => {
    const moveInput = page.getByRole("combobox", {
      name: "Pokemon 1's move1",
    });
    await moveInput.fill(moveName);
    const option = page
      .getByRole("listbox")
      .getByText(moveName, { exact: true });
    await expect(option)[shouldBeSelectable ? "toBeVisible" : "toBeHidden"]();
  };

  const checkMoveSelectable = async (page: Page, moveName: string) => {
    await checkMoveVisilibility(page, moveName, true);
  };

  const checkMoveNotSelectable = async (page: Page, moveName: string) => {
    await checkMoveVisilibility(page, moveName, false);
  };

  // Select Filter Option Helper

  const selectFilterOption = async (
    page: Page,
    filterName: string,
    optionName: string,
  ) => {
    await openFilters(page);
    await selectDialogOption(page, filterName, optionName);
    await closeDialog(page);
  };

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

  test("sorts the selected Pokemon even when filters exclude it", async ({
    page,
  }) => {
    await selectPokemon(page, "Aron");
    await selectFilterOption(page, "Region", "Hoenn");
    await selectFilterOption(page, "Type", "Fire");
    const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
    const checkOrder = async (before: string, after: string) => {
      await expect(input).toHaveValue("Aron");
      await input.click();
      const options = page.getByRole("listbox").getByRole("option");
      await expect(options.filter({ hasText: /^Aron$/ })).toBeVisible();
      const labels = await options.allTextContents();
      expect(labels).toContain(before);
      expect(labels).toContain(after);
      expect(labels.indexOf(before)).toBeLessThan(labels.indexOf("Aron"));
      expect(labels.indexOf("Aron")).toBeLessThan(labels.indexOf(after));
      await input.press("Escape");
    };

    await checkOrder("Blaziken", "Numel");
    await openSort(page);
    await page.getByRole("radio", { name: "Name", exact: true }).check();
    await closeDialog(page);
    await input.click();
    await expect(
      page.getByRole("listbox").getByRole("option").first(),
    ).toHaveText("Aron");
    await input.press("Escape");

    await openSort(page);
    await page.getByRole("radio", { name: "Pokedex number" }).check();
    await page.getByRole("button", { name: "Descending" }).click();
    await closeDialog(page);
    await checkOrder("Numel", "Blaziken");
  });

  test("Pokemon Champions Format Filter", async ({ page }) => {
    const generation = page.getByRole("combobox", { name: "Generation" });
    await selectFilterOption(page, "Format", "Pokemon Champions (M-C)");
    await expect(generation).toContainText("Gen 9 · Champions");

    // Eligible: Kommo-o, Glimmora-Mega
    await checkPokemonSelectable(page, "Kommo-o");
    await checkPokemonSelectable(page, "Glimmora", "Glimmora-Mega");

    // Not eligible: Wooper, Zekrom
    for (const name of ["Wooper", "Zekrom"]) {
      await checkPokemonNotSelectable(page, name);
    }
  });

  test("a pending Champions format change keeps edits made in another tab", async ({
    page,
    context,
  }) => {
    await selectPokemon(page, "Delphox");
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem("mypokemonteam") ?? ""),
      )
      .toContain("delphox");
    const otherTab = await context.newPage();
    await otherTab.goto(page.url());
    await expect(otherTab.getByLabel("Pokemon 1's name")).toHaveValue(
      "Delphox",
    );

    await openFilters(page);
    await selectDialogOption(page, "Format", "Pokemon Champions (M-C)");
    const transfer = page.getByRole("dialog", { name: /Switch game/ });
    await expect(transfer).toBeVisible();
    await selectPokemon(otherTab, "Tyrantrum");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Tyrantrum");
    await transfer
      .getByRole("button", { name: "Update existing team", exact: true })
      .click();
    await expect(transfer).toBeHidden();
    await closeDialog(page);

    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Champions");
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Tyrantrum");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Level: 50");
    await otherTab.close();
  });

  test("format options follow generation and clear unsupported selections", async ({
    page,
  }) => {
    await selectFilterOption(page, "Format", "Doubles UU");
    const generation = page.getByRole("combobox", { name: "Generation" });
    await generation.click();
    await page.getByRole("option", { name: /^Gen 2/ }).click();
    await openFilters(page);
    await page.getByRole("combobox", { name: "Format" }).click();
    await expect(
      page.getByRole("option", { name: "All", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("option")).toHaveText([
      "All",
      "Uber",
      "OU: Over Used",
      "UU: Under Used",
      "NU: Never Used",
      "PU",
      "ZU",
    ]);
    await page
      .getByRole("option", { name: "OU: Over Used", exact: true })
      .click();
    await closeDialog(page);
    await generation.click();
    await page.getByRole("option", { name: /^Gen 3/ }).click();
    await openFilters(page);
    await expect(page.getByRole("combobox", { name: "Format" })).toContainText(
      "OU: Over Used",
    );
    await page.getByRole("combobox", { name: "Format" }).click();
    await expect(
      page.getByRole("option", { name: "RU: Rarely Used", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Little Cup (LC)", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Doubles OU", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Doubles UU", exact: true }),
    ).toHaveCount(0);
    await page.keyboard.press("Escape");
    await closeDialog(page);
  });

  test("Type Filter", async ({ page }) => {
    // 1. Select type electric
    await openFilters(page);
    const type = page.getByRole("combobox", { name: "Type", exact: true });
    await type.click();
    await expect(page.getByRole("option").locator("img")).toHaveCount(18);
    const electric = page.getByRole("option", {
      name: "Electric",
      exact: true,
    });
    const icon = await electric.locator("img").getAttribute("src");
    await electric.click();
    await expect(type.locator("img")).toHaveAttribute("src", icon ?? "");
    await closeDialog(page);

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

  test("Moves Filter", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "Desktop Chrome"); // will undo in the future

    // 1. Select only viable moves.
    await selectFilterOption(page, "Moves", "Viable");

    // 2. Select pokemon Muk-Alola
    await selectPokemon(page, "Muk-Alola");

    const selectableMoves = ["Crunch", "Toxic", "Stone Edge", "Flamethrower"];
    for (const move of selectableMoves) {
      await checkMoveSelectable(page, move);
    }

    // Moves that can't be selected: Dig, Attract, Hyper Beam, Venoshock
    const notSelectableMoves = ["Dig", "Attract", "Hyper Beam", "Venoshock"];
    for (const move of notSelectableMoves) {
      await checkMoveNotSelectable(page, move);
    }
  });

  test("selected moves stay visible when the Viable filter excludes them", async ({
    page,
  }) => {
    await selectPokemon(page, "Luvdisc");
    await selectMove(page, "Attract");
    await selectFilterOption(page, "Moves", "Viable");

    const selected = page.getByLabel("Pokemon 1's move1");
    await expect(selected).toHaveValue("Attract");
    expect(getTeamTextFromUrl(page)).toContain("- Attract");

    const empty = page.getByLabel("Pokemon 1's move2");
    await empty.fill("Attract");
    await expect(
      page.getByRole("option", { name: "Attract", exact: true }),
    ).toHaveCount(0);
    await empty.press("Escape");
    await expect(selected).toHaveValue("Attract");

    await selected.click();
    await selected
      .locator("..")
      .getByRole("button", { name: "Clear", exact: true })
      .click();
    await expect(selected).toHaveValue("");
    expect(getTeamTextFromUrl(page)).not.toContain("- Attract");
  });

  test("Ability Filter", async ({ page }) => {
    await openFilters(page);
    const ability = page.getByRole("combobox", { name: "Ability" });
    await ability.fill("Levitate");
    await page.getByRole("option", { name: "Levitate", exact: true }).click();
    await closeDialog(page);

    await checkPokemonSelectable(page, "Bronzong");
    await checkPokemonSelectable(page, "Rotom");
    await checkPokemonNotSelectable(page, "Garchomp");
  });

  test("Clear resets every filter", async ({ page }) => {
    await selectFilterOption(page, "Type", "Electric");
    await checkPokemonNotSelectable(page, "Larvitar");

    await openFilters(page);
    await page.getByRole("button", { name: "Clear" }).click();
    await closeDialog(page);
    await checkPokemonSelectable(page, "Larvitar");
  });

  test("All Filters", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "Desktop Chrome");

    // 1. Set all filters
    await openFilters(page);
    await selectDialogOption(page, "Format", "UU: Under Used");
    await selectDialogOption(page, "Type", "Grass");
    await selectDialogOption(page, "Region", "Sinnoh");
    await selectDialogOption(page, "Moves", "Viable");
    await closeDialog(page);

    // Pokemon that can be selected: Torterra
    await checkPokemonVisibility(page, "Torterra", true);

    // Pokemon that can't be selected: Chespin, Pikachu, Clefable
    const notSelectablePokemon = ["Chespin", "Pikachu", "Clefable"];
    for (const name of notSelectablePokemon) {
      await checkPokemonNotSelectable(page, name);
    }

    // 2. Select pokemon Torterra
    await selectPokemon(page, "Torterra");

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
