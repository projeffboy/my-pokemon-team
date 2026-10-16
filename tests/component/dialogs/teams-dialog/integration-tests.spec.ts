import { test, expect } from "fixtures";
import {
  clickMenuItem,
  closeDialog,
  openFilters,
  selectDialogOption,
  getTeamTextFromUrl,
  goToSite,
  openMoreMenu,
  openTeamsImportExport,
  selectPokemon,
} from "helper";
import type { Page } from "@playwright/test";
import { fromBase64Url } from "@/app/shared/base64url";
import { parseTeamText } from "@/store/team-text";
import { pokemonTypes } from "@/shared/pokedex";

const openTeams = async (page: Page) => {
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Teams" })).toBeVisible();
};

test.describe("Teams Dialog - Integration Tests", () => {
  test("a random new team uses the active filters", async ({ page }) => {
    await selectPokemon(page, "Shiftry");
    await openFilters(page);
    await selectDialogOption(page, "Type", "Grass");
    await closeDialog(page);
    await openTeams(page);
    await page
      .getByRole("button", { name: "Random team", exact: true })
      .click();
    await expect
      .poll(
        () =>
          parseTeamText(getTeamTextFromUrl(page)).filter(member => member.name)
            .length,
      )
      .toBe(6);
    expect(
      parseTeamText(getTeamTextFromUrl(page)).every(member =>
        pokemonTypes(member.name).includes("Grass"),
      ),
    ).toBe(true);
    await openFilters(page);
    await expect(
      page.getByRole("dialog").getByLabel("Type", { exact: true }),
    ).toHaveText("Grass");
  });

  test("keeps creation and import controls visible while saved teams scroll", async ({
    page,
  }) => {
    await openTeamsImportExport(page);
    const importer = page.getByRole("dialog", { name: "Import/Export" });
    await importer
      .getByRole("textbox")
      .fill(
        Array.from(
          { length: 16 },
          (_, i) => `=== [gen9] Saved ${i + 1} ===\n\nBarboach\n- Water Gun`,
        ).join("\n\n"),
      );
    await importer
      .getByRole("button", { name: "Add teams", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "Teams" });
    const teams = dialog.getByRole("list", { name: "Saved teams" });
    const controls = [
      dialog.getByRole("button", { name: "New Team", exact: true }),
      dialog.getByRole("button", { name: "Random team", exact: true }),
      dialog.getByRole("button", { name: "Import/Export", exact: true }),
      dialog.getByText("Teams are saved in this browser.", { exact: true }),
    ];
    await expect(teams.getByRole("listitem")).toHaveCount(17);
    await expect(
      teams.getByRole("button", { name: "Load Saved 16" }),
    ).toBeInViewport();
    for (const width of [320, 400, 600, 960, 1366]) {
      await page.setViewportSize({ width, height: 560 });
      if (width < 600) {
        await expect
          .poll(() => dialog.boundingBox())
          .toEqual({
            x: 0,
            y: 0,
            width,
            height: 560,
          });
      }
      await teams
        .getByRole("button", { name: "Load Team 1" })
        .scrollIntoViewIfNeeded();
      const before = await Promise.all(
        controls.map(control => control.boundingBox()),
      );
      await teams
        .getByRole("button", { name: "Load Saved 16" })
        .scrollIntoViewIfNeeded();
      await expect
        .poll(() => teams.evaluate(list => list.scrollTop))
        .toBeGreaterThan(0);
      for (const [i, control] of controls.entries()) {
        await expect(control).toBeInViewport();
        expect((await control.boundingBox())?.y).toBe(before[i]?.y);
      }
    }
    await teams
      .getByRole("button", { name: "Load Team 1" })
      .scrollIntoViewIfNeeded();
    await closeDialog(page, "Close");
    await openTeams(page);
    await expect(
      teams.getByRole("button", { name: "Load Saved 16" }),
    ).toBeInViewport();
    await teams
      .getByRole("button", { name: "Load Saved 8", exact: true })
      .click();
    await expect(dialog).toBeHidden();
    await openTeams(page);
    const current = teams.getByRole("button", {
      name: "Load Saved 8",
      exact: true,
    });
    await expect(current).toHaveAttribute("aria-current", "true");
    await expect(current).toBeInViewport();
    await expect
      .poll(() => teams.evaluate(list => list.scrollTop))
      .toBeGreaterThan(0);
    await dialog
      .getByRole("button", { name: "Import/Export", exact: true })
      .click();
    await expect(importer).toBeVisible();
  });

  test("team-name and duplicate actions live in Teams, which cannot duplicate an empty team", async ({
    page,
  }) => {
    await openMoreMenu(page);
    await expect(
      page.getByRole("menuitem", { name: "Edit team name", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("menuitem", { name: "Duplicate", exact: true }),
    ).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toBeHidden();
    await openTeams(page);
    const teams = page.getByRole("list", { name: "Saved teams" });
    await expect(teams.getByRole("button", { name: /^Load Team/ })).toHaveCount(
      1,
    );
    await page.getByRole("button", { name: "Options for Team 1" }).click();
    await clickMenuItem(page, "Duplicate");
    await expect(
      page
        .getByText("The team is empty. Add a pokemon to duplicate it.", {
          exact: true,
        })
        .last(),
    ).toBeVisible();
    await expect(teams.getByRole("button", { name: /^Load Team/ })).toHaveCount(
      1,
    );
  });

  test("creates, switches, and deletes teams, keeping each one's pokemon", async ({
    page,
  }) => {
    await selectPokemon(page, "Snorlax");

    await openTeams(page);
    const teams = page.getByRole("list", { name: "Saved teams" });
    await expect(
      teams.getByRole("button", { name: "Load Team 1" }),
    ).toHaveAttribute("aria-current", "true");
    // The card names the generation's games, which tells it from Gen 9 Champions
    await expect(teams.getByRole("listitem")).toContainText("Gen 9 (SV)");
    await page.getByRole("button", { name: "New Team" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
    await expect(page).not.toHaveURL(/[?&]team=/);

    await selectPokemon(page, "Lapras");
    await openTeams(page);
    await expect(teams.getByRole("button", { name: /^Load Team/ })).toHaveCount(
      2,
    );
    await teams.getByRole("button", { name: "Load Team 1" }).click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Snorlax");
    expect(getTeamTextFromUrl(page)).toContain("Snorlax");

    await openTeams(page);
    await page.getByRole("button", { name: "Options for Team 2" }).click();
    await clickMenuItem(page, "Delete");
    await page
      .getByRole("dialog", { name: "Delete Team 2?" })
      .getByRole("button", { name: "Delete" })
      .click();
    await expect(teams.getByRole("button", { name: /^Load Team/ })).toHaveCount(
      1,
    );
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Snorlax");
  });

  test("saved teams survive a reload", async ({ page }) => {
    test.setTimeout(60000);
    await selectPokemon(page, "Snorlax");
    await openFilters(page);
    await selectDialogOption(page, "Type", "Normal");
    await closeDialog(page);
    await openTeams(page);
    await page.getByRole("button", { name: "New Team" }).click();
    // A click on the page would land on the dialog while it is closing
    await expect(page.getByRole("dialog")).toBeHidden();
    await selectPokemon(page, "Lapras");
    await openFilters(page);
    await expect(page.getByLabel("Type", { exact: true })).not.toContainText(
      "Normal",
    );
    await selectDialogOption(page, "Type", "Water");
    await closeDialog(page);

    // A reload before the address holds the team opens a new one
    await expect(page).toHaveURL(/team=/);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Lapras");
    await openFilters(page);
    await expect(page.getByLabel("Type", { exact: true })).toContainText(
      "Water",
    );
    await closeDialog(page);
    await openTeams(page);
    await page
      .getByRole("list", { name: "Saved teams" })
      .getByRole("button", { name: "Load Team 1" })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Snorlax");
    await openFilters(page);
    await expect(page.getByLabel("Type", { exact: true })).toContainText(
      "Normal",
    );
  });

  test("a team made in another tab is kept when this tab saves", async ({
    page,
    context,
  }) => {
    test.slow();
    await selectPokemon(page, "Snorlax");
    const otherTab = await context.newPage();
    await goToSite(otherTab);
    await expect(otherTab.getByLabel("Pokemon 1's name")).toHaveValue("");
    await selectPokemon(otherTab, "Lapras");

    await openTeams(page);
    const teams = page.getByRole("list", { name: "Saved teams" });
    await expect(teams.getByRole("button", { name: /^Load Team/ })).toHaveCount(
      2,
    );
    await teams.getByRole("button", { name: "Load Team 1" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await selectPokemon(page, "Mamoswine");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await openTeams(page);
    await teams.getByRole("button", { name: "Load Team 2" }).click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Lapras");
  });

  test("a random team fills the empty current team, and Import/Export downloads every team", async ({
    page,
  }) => {
    await openTeams(page);
    await page.getByRole("button", { name: "Random team" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect
      .poll(() => getTeamTextFromUrl(page).split("\n\n").filter(Boolean))
      .toHaveLength(6);

    // The empty Team 1 was reused rather than a Team 2 added
    await openTeams(page);
    await expect(
      page
        .getByRole("list", { name: "Saved teams" })
        .getByRole("button", { name: /^Load Team/ }),
    ).toHaveCount(1);
    await page
      .getByRole("button", { name: "Import/Export", exact: true })
      .click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download", exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("my-pokemon-teams.txt");
    const text = await (await download.createReadStream()).toArray();
    expect(Buffer.concat(text).toString()).toContain("=== [gen9] Team 1 ===");
  });

  test("Import/Export is a page of the dialog that adds the pasted teams", async ({
    page,
  }) => {
    await openTeamsImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });

    await dialog.getByRole("textbox").fill(`=== [gen8uu] Sun ===

Torkoal @ Heat Rock
Ability: Drought
- Eruption

=== [gen9doublesou] Rain ===

Pelipper @ Damp Rock
Ability: Drizzle
- Hurricane
`);
    await dialog.getByRole("button", { name: "Add teams" }).click();
    // The open dialog hides the snackbar from assistive technology, so find it by its attribute
    await expect(page.locator("[role=alert]")).toContainText(
      "2 teams imported",
    );
    // Back on the team list, with the new teams
    const teams = page
      .getByRole("dialog", { name: "Teams" })
      .getByRole("list", { name: "Saved teams" });
    await expect(teams.getByRole("button", { name: /^Load/ })).toHaveText([
      /Team 1/,
      /Sun/,
      /Rain/,
    ]);
    await expect(teams.getByRole("listitem").last()).toContainText(
      "Gen 9 (SV)",
    );
    await expect(teams.getByRole("listitem").last()).not.toContainText("DOU");
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Pelipper");
    await expect(page.getByLabel("Generation")).toContainText("Gen 9");
  });

  test("a pasted team name written as markup shows as text and runs nothing", async ({
    page,
  }) => {
    const name = `<img src=x onerror="window.injected=true">`;
    await openTeamsImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    await dialog
      .getByRole("textbox")
      .fill(`=== [gen9] ${name} ===\n\nPolitoed @ Damp Rock\n- Hydro Pump\n`);
    await dialog.getByRole("button", { name: "Add teams" }).click();
    const teams = page
      .getByRole("dialog", { name: "Teams" })
      .getByRole("list", { name: "Saved teams" });
    await expect(teams.getByRole("listitem").last()).toContainText(name);
    await expect(page.locator('img[src="x"]')).toHaveCount(0);
    expect(await page.evaluate(() => "injected" in window)).toBe(false);
  });

  test("Add teams says so, and adds nothing, for text without pokemon", async ({
    page,
  }) => {
    await openTeamsImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    await dialog.getByRole("textbox").fill("Pikablu @ Light Ball");
    await dialog.getByRole("button", { name: "Add teams" }).click();
    await expect(dialog).toContainText(
      "No pokemon found in that text. Write the pokemon names in English as Pokemon Showdown spells them, or paste a team exported from Pokemon Showdown.",
    );
    await expect(dialog.getByRole("textbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    // Going back shows the team list, still with the one team
    await dialog.getByRole("button", { name: "Go Back" }).click();
    await expect(
      page
        .getByRole("dialog", { name: "Teams" })
        .getByRole("button", { name: /^Load/ }),
    ).toHaveCount(1);
  });
});

test("Add teams restores named empty backups and rejects invalid populated bodies", async ({
  page,
}) => {
  await openTeamsImportExport(page);
  const importing = page.getByRole("dialog", { name: "Import/Export" });
  const addTeams = importing.getByRole("button", {
    name: "Add teams",
    exact: true,
  });
  await importing
    .getByRole("textbox")
    .fill("=== [gen2ou] Next season ===\n\nPikablu");
  await addTeams.click();
  await expect(importing).toContainText("No pokemon found in that text.");
  await importing
    .getByRole("textbox")
    .fill(
      "=== [gen2ou] Next season ===\n\n=== [gen8doublesou] Testing ===\n\n",
    );
  await addTeams.click();
  const teams = page
    .getByRole("dialog", { name: "Teams" })
    .getByRole("list", { name: "Saved teams" });
  await expect(
    teams.getByRole("button", { name: "Load Next season", exact: true }),
  ).toBeVisible();
  await expect(
    teams.getByRole("button", { name: "Load Testing", exact: true }),
  ).toBeVisible();
  await teams
    .getByRole("button", { name: "Load Next season", exact: true })
    .click();
  await expect(page.getByLabel("Generation")).toContainText("Gen 2");
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
});

test("zero-candidate random actions leave the saved team unchanged and explain why", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await selectPokemon(page, "Beartic");
  await openFilters(page);
  await selectDialogOption(page, "Type", "Dragon");
  const filters = page.getByRole("dialog", { name: "Filters", exact: true });
  await filters
    .getByRole("combobox", { name: "Ability", exact: true })
    .fill("Wonder Guard");
  await page.getByRole("option", { name: "Wonder Guard", exact: true }).click();
  await closeDialog(page);
  const state = () =>
    page.evaluate(() => localStorage.getItem("mypokemonteam"));
  await expect.poll(state).toContain("Wonder Guard");
  const before = await state();
  await page
    .getByRole("button", { name: "Randomize team", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "No Pokémon match the current filters",
  );
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Beartic");
  await openTeams(page);
  await page.getByRole("button", { name: "Random team", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Teams" })).toBeVisible();
  await expect(
    page.getByRole("alert", { includeHidden: true }).last(),
  ).toContainText("No Pokémon match the current filters");
  expect(await state()).toBe(before);
});

test("fallback Copy selects its textarea inside the active modal and restores focus", async ({
  page,
}) => {
  await selectPokemon(page, "Gothorita");
  await openTeamsImportExport(page);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    document.execCommand = () => {
      const active = document.activeElement;
      if (
        !(active instanceof HTMLTextAreaElement) ||
        !active.closest('[role="dialog"]') ||
        active.selectionEnd !== active.value.length
      )
        return false;
      document.documentElement.dataset.copiedText = active.value;
      return true;
    };
  });
  const copy = page
    .getByRole("dialog", { name: "Import/Export" })
    .getByRole("button", { name: "Copy", exact: true });
  await copy.focus();
  await copy.press("Enter");
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.dataset.copiedText),
    )
    .toContain("Gothorita");
  await expect(
    page.getByRole("alert", { includeHidden: true }).last(),
  ).toHaveText("Copied all teams");
  await expect(copy).toBeFocused();
  await page.evaluate(() => {
    document.execCommand = () => false;
  });
  await copy.press("Enter");
  await expect(
    page.getByRole("alert", { includeHidden: true }).last(),
  ).toContainText("Could not copy the teams. Use Download instead.");
});

test("fallback copying a link from the Teams row menu stays inside its focus trap", async ({
  page,
}) => {
  await selectPokemon(page, "Lombre");
  await openTeams(page);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    document.execCommand = () => {
      const active = document.activeElement;
      if (
        !(active instanceof HTMLTextAreaElement) ||
        !active.closest('[role="menu"]')
      )
        return false;
      document.documentElement.dataset.copiedText = active.value;
      return true;
    };
  });
  await page
    .getByRole("button", { name: "Options for Team 1", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Share", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.dataset.copiedText),
    )
    .toContain("team=");
  const link = await page.evaluate(
    () => document.documentElement.dataset.copiedText ?? "",
  );
  const team = new URL(link).searchParams.get("team");
  expect(fromBase64Url(team ?? "")).toContain("Lombre");
});

test("closing Import/Export opened from a team's menu returns focus to the Teams button", async ({
  page,
}) => {
  await selectPokemon(page, "Cetitan");
  const teamsButton = page.getByRole("button", { name: "Teams", exact: true });
  const editor = page.getByRole("dialog", {
    name: "Import/Export",
    exact: true,
  });
  for (const close of [
    () => editor.getByRole("button", { name: "Cancel", exact: true }).click(),
    () => page.keyboard.press("Escape"),
  ]) {
    await openTeams(page);
    await page
      .getByRole("button", { name: "Options for Team 1", exact: true })
      .press("Enter");
    await page
      .getByRole("menuitem", { name: "Import/Export", exact: true })
      .press("Enter");
    await expect(editor).toBeVisible();
    await close();
    await expect(editor).toBeHidden();
    await expect(teamsButton).toBeFocused();
  }
});
