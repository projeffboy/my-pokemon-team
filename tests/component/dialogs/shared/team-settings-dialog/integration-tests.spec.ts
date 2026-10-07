import { test, expect } from "fixtures";
import {
  clickMenuItem,
  closeDialog,
  openFilters,
  selectDialogOption,
  openTeamTools,
  selectPokemon,
} from "helper";
import type { Page } from "@playwright/test";

const openTeams = async (page: Page) => {
  await openTeamTools(page);
  await page.getByRole("button", { name: "Teams", exact: true }).click();
};
const openNameEditor = async (page: Page, teamName: string) => {
  await openTeams(page);
  await page
    .getByRole("button", { name: `Options for ${teamName}`, exact: true })
    .click();
  await clickMenuItem(page, "Edit team name");
};
const chooseGeneration = async (page: Page, generation: number) => {
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page
    .getByRole("option", { name: new RegExp(`^Gen ${generation} `) })
    .click();
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText(`Gen ${generation}`);
  await expect(page.locator(".MuiMenu-paper")).toBeHidden();
};

test("the team-name editor saves and cancels names without generation or format controls", async ({
  page,
}) => {
  await openFilters(page);
  await selectDialogOption(page, "Format", "RU: Rarely Used");
  await closeDialog(page);
  await openNameEditor(page, "Team 1");
  const dialog = page.getByRole("dialog", {
    name: "Edit team name",
    exact: true,
  });
  await expect(dialog.getByRole("combobox")).toHaveCount(0);
  await dialog.getByLabel("Team name").fill("My team");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();
  await closeDialog(page, "Close");
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText("Gen 9");
  await openNameEditor(page, "My team");
  await expect(dialog.getByLabel("Team name")).toHaveValue("My team");
  await dialog.getByLabel("Team name").fill("Cancelled name");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await closeDialog(page, "Close");
  await openFilters(page);
  await expect(page.getByRole("combobox", { name: "Format" })).toContainText(
    "RU: Rarely Used",
  );
  await closeDialog(page);
  await openNameEditor(page, "My team");
  await expect(dialog.getByLabel("Team name")).toHaveValue("My team");
});

test("Teams can rename another team without changing either team's generation", async ({
  page,
}) => {
  await chooseGeneration(page, 3);
  await selectPokemon(page, "Venonat");
  await openTeams(page);
  await page
    .getByRole("dialog", { name: "Teams" })
    .getByRole("button", { name: "New Team", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await selectPokemon(page, "Bellsprout");
  await chooseGeneration(page, 7);
  await openTeams(page);
  await page
    .getByRole("button", { name: "Options for Team 1", exact: true })
    .click();
  await clickMenuItem(page, "Edit team name");
  const dialog = page.getByRole("dialog", {
    name: "Edit team name",
    exact: true,
  });
  await expect(dialog.getByRole("combobox")).toHaveCount(0);
  await dialog.getByLabel("Team name").fill("Hoenn team");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect
    .poll(async () => {
      const state = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("mypokemonteam") ?? "{}"),
      );
      const source = state.teams?.find(
        (team: { name: string }) => team.name === "Hoenn team",
      );
      const current = state.teams?.find(
        (team: { id: string }) => team.id === state.currentTeamId,
      );
      return (
        source?.generation === 3 &&
        source?.team[0]?.name === "venonat" &&
        current?.generation === 7 &&
        current?.team[0]?.name === "bellsprout"
      );
    })
    .toBe(true);
  await page
    .getByRole("button", { name: "Load Hoenn team", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText("Gen 3");
});
