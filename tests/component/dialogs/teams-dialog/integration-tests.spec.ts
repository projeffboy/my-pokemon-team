import { test, expect } from "fixtures";
import {
  clickMenuItem,
  getTeamTextFromUrl,
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

  test("a random team fills every slot, and Export All downloads every team", async ({
    page,
  }) => {
    await openTeams(page);
    await page.getByRole("button", { name: "Random Team" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect
      .poll(() => getTeamTextFromUrl(page).split("\n\n").filter(Boolean))
      .toHaveLength(6);

    await openTeams(page);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export All" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("my-pokemon-teams.txt");
    const text = await (await download.createReadStream()).toArray();
    expect(Buffer.concat(text).toString()).toContain("=== [gen9] Team 2 ===");
  });
});
