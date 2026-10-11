import { test, expect } from "fixtures";
import {
  closeDialog,
  openFilters,
  openAdvanced,
  openTeamTools,
  openSort,
  selectDialogOption,
  selectMove,
  selectPokemon,
  getTeamTextFromUrl,
} from "helper";
import type { Page } from "@playwright/test";
import { toBase64Url } from "@/app/shared/base64url";

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

for (const action of ["Update existing team", "Copy to new team"]) {
  test(`format transfer ${action} keeps changes received during confirmation`, async ({
    page,
    context,
  }) => {
    const text =
      "Garchomp\nAbility: Rough Skin\nEVs: 252 Atk / 4 SpD / 252 Spe\n- Earthquake";
    await page.goto(`/?gen=9&team=${toBase64Url(text)}`);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Garchomp");
    await openAdvanced(page);
    await page
      .getByRole("textbox", { name: "Nickname", exact: true })
      .fill("Original");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mypokemonteam")))
      .toContain("Original");
    const otherTab = await context.newPage();
    await otherTab.goto(page.url());
    await expect(otherTab.getByLabel("Pokemon 1's name")).toHaveValue(
      "Garchomp",
    );
    await openFilters(otherTab);
    await selectDialogOption(otherTab, "Format", "Pokemon Champions (M-C)");
    await expect(
      otherTab.getByRole("button", { name: action, exact: true }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Nickname", exact: true })
      .fill("FreshName");
    await expect
      .poll(() => getTeamTextFromUrl(otherTab))
      .toContain("FreshName (Garchomp)");
    await otherTab.getByRole("button", { name: action, exact: true }).click();
    await expect
      .poll(() => getTeamTextFromUrl(otherTab))
      .toContain("FreshName (Garchomp)");
    await expect
      .poll(() => getTeamTextFromUrl(otherTab))
      .toContain("Level: 50");
    await expect
      .poll(() => getTeamTextFromUrl(otherTab))
      .toContain("EVs: 32 Atk / 1 SpD / 32 Spe");
  });
}

test("format transfer without losses keeps edits received while game data loads", async ({
  page,
  context,
}) => {
  const game = encodeURIComponent("Pokemon Champions (M-C)");
  await page.goto(
    `/?game=${game}&team=${toBase64Url("Garchomp\nAbility: Rough Skin\n- Earthquake")}`,
  );
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Garchomp");
  await openAdvanced(page);
  await page
    .getByRole("textbox", { name: "Nickname", exact: true })
    .fill("Original");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("mypokemonteam")))
    .toContain("Original");
  const teamName = await page.evaluate(() => {
    const state = JSON.parse(
      localStorage.getItem("mypokemonteam") ?? "null",
    ) as { teams: { name: string; team: { nickname?: string }[] }[] };
    return state.teams.find(team => team.team[0]?.nickname === "Original")
      ?.name;
  });
  expect(teamName).toBeTruthy();
  const otherTab = await context.newPage();
  let release = () => {};
  let requested = () => {};
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  const loaded = new Promise<void>(resolve => {
    requested = resolve;
  });
  await otherTab.route("**/src/data/generation-transfer.json*", async route => {
    requested();
    await held;
    await route.continue();
  });
  try {
    await otherTab.goto(`/?game=${game}`, { waitUntil: "domcontentloaded" });
    await loaded;
    await openTeamTools(otherTab);
    await otherTab.getByRole("button", { name: "Teams", exact: true }).click();
    await otherTab
      .getByRole("button", { name: `Load ${teamName}`, exact: true })
      .click();
    await openFilters(otherTab);
    await selectDialogOption(otherTab, "Format", "All");
    await page
      .getByRole("textbox", { name: "Nickname", exact: true })
      .fill("FreshName");
    await expect
      .poll(() => getTeamTextFromUrl(otherTab))
      .toContain("FreshName (Garchomp)");
    release();
    await expect(otherTab.getByLabel("Generation")).toContainText(
      "Scarlet Violet",
    );
    await expect
      .poll(() => getTeamTextFromUrl(otherTab))
      .toContain("FreshName (Garchomp)");
    await expect
      .poll(() => getTeamTextFromUrl(otherTab))
      .toContain("Level: 50");
  } finally {
    release();
  }
});

test("a newer ordinary format selection cancels a pending Champions request", async ({
  page,
}) => {
  let release = () => {};
  let requested = () => {};
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  const loaded = new Promise<void>(resolve => {
    requested = resolve;
  });
  await page.route("**/src/data/generation-transfer.json*", async route => {
    requested();
    await held;
    await route.continue();
  });
  try {
    await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });
    await loaded;
    await openFilters(page);
    await selectDialogOption(page, "Format", "Pokemon Champions (M-C)");
    await selectDialogOption(page, "Format", "OU: Over Used");
    await expect(
      page.getByRole("combobox", { name: "Format", exact: true }),
    ).toContainText("OU: Over Used");
    release();
    await page.waitForResponse(response =>
      response.url().includes("generation-transfer.json"),
    );
    await expect(
      page.getByRole("combobox", { name: "Format", exact: true }),
    ).toContainText("OU: Over Used");
    await expect(page.getByLabel("Generation")).toContainText("Scarlet Violet");
    await expect(
      page.getByRole("button", { name: "Update existing team", exact: true }),
    ).toBeHidden();
  } finally {
    release();
  }
});
