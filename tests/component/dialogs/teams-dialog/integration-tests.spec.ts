import { test, expect } from "fixtures";
import {
  clickMenuItem,
  getTeamTextFromUrl,
  openManageTeamMenu,
  openTeamTools,
  selectPokemon,
} from "helper";
import type { Page } from "@playwright/test";

const openTeams = async (page: Page) => {
  await openTeamTools(page);
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Teams" })).toBeVisible();
};

test.describe("Teams Dialog - Integration Tests", () => {
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
    await expect(teams.getByRole("listitem")).toContainText("Gen 9 (SV / ZA)");
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
    await selectPokemon(page, "Snorlax");
    await openTeams(page);
    await page.getByRole("button", { name: "New Team" }).click();
    // A click on the page would land on the dialog while it is closing
    await expect(page.getByRole("dialog")).toBeHidden();
    await selectPokemon(page, "Lapras");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Lapras");
    await openTeams(page);
    await page
      .getByRole("list", { name: "Saved teams" })
      .getByRole("button", { name: "Load Team 1" })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Snorlax");
  });

  test("a team made in another tab is kept when this tab saves", async ({
    page,
    context,
  }) => {
    await selectPokemon(page, "Snorlax");
    const otherTab = await context.newPage();
    await otherTab.goto("/", { waitUntil: "domcontentloaded" });
    await expect(otherTab.getByLabel("Pokemon 1's name")).toHaveValue(
      "Snorlax",
    );
    await openTeams(otherTab);
    await otherTab.getByRole("button", { name: "New Team" }).click();
    // A click on the page would land on the dialog while it is closing
    await expect(otherTab.getByRole("dialog")).toBeHidden();
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

  test("a random team fills the empty current team, and Export All downloads every team", async ({
    page,
  }) => {
    await openTeams(page);
    await page.getByRole("button", { name: "Random Team" }).click();
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
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export All" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("my-pokemon-teams.txt");
    const text = await (await download.createReadStream()).toArray();
    expect(Buffer.concat(text).toString()).toContain("=== [gen9] Team 1 ===");
  });

  test("Import Team is a page of the dialog that adds the pasted teams", async ({
    page,
  }) => {
    await openTeams(page);
    await page.getByRole("button", { name: "Import Team" }).click();
    const dialog = page.getByRole("dialog", { name: "Import Team" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Import" })).toBeDisabled();

    await dialog.getByRole("textbox").fill(`=== [gen8uu] Sun ===

Torkoal @ Heat Rock
Ability: Drought
- Eruption

=== [gen9doublesou] Rain ===

Pelipper @ Damp Rock
Ability: Drizzle
- Hurricane
`);
    await dialog.getByRole("button", { name: "Import" }).click();
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
      "Gen 9 (SV / ZA) · DOU",
    );
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Pelipper");
    await expect(page.getByLabel("Generation")).toContainText("Gen 9");
  });

  test("the Manage Team menu opens the import page, which imports nothing from text without pokemon", async ({
    page,
  }) => {
    await openManageTeamMenu(page);
    await clickMenuItem(page, "Import team");
    const dialog = page.getByRole("dialog", { name: "Import Team" });
    await dialog.getByRole("textbox").fill("Pikablu @ Light Ball");
    await dialog.getByRole("button", { name: "Import" }).click();
    await expect(dialog).toContainText("No pokemon found in that text.");

    // Going back shows the team list, still with the one team
    await dialog.getByRole("button", { name: "Go Back" }).click();
    await expect(
      page
        .getByRole("dialog", { name: "Teams" })
        .getByRole("button", { name: /^Load/ }),
    ).toHaveCount(1);
  });
});
