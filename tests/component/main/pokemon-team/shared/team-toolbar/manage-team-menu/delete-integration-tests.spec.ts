import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";
import {
  clickMenuItem,
  getTeamTextFromUrl,
  openManageTeamMenu,
  selectPokemon,
} from "helper";

const openTeams = async (page: Page) => {
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Teams" })).toBeVisible();
};

for (const action of ["Clear", "Teams Delete"]) {
  test(`${action} closes when another tab removes its captured team, preserving the fallback`, async ({
    page,
    context,
  }) => {
    await openManageTeamMenu(page);
    await clickMenuItem(page, "Import team");
    const importer = page.getByRole("dialog", { name: "Import Team" });
    await importer
      .getByRole("textbox")
      .fill(
        "=== [gen9] Alpha ===\n\nCloyster\n- Surf\n\n=== [gen9] Beta ===\n\nTorkoal\n- Flamethrower",
      );
    await importer.getByRole("button", { name: "Import", exact: true }).click();
    await page.getByRole("button", { name: "Load Alpha", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const state = JSON.parse(
            localStorage.getItem("mypokemonteam") ?? "{}",
          );
          return state.teams
            ?.filter((team: { name: string }) =>
              ["Alpha", "Beta"].includes(team.name),
            )
            .map(
              (team: { name: string; team: { name: string }[] }) =>
                `${team.name}:${team.team[0]?.name}`,
            );
        }),
      )
      .toEqual(["Alpha:cloyster", "Beta:torkoal"]);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Cloyster");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Cloyster");
    const otherTab = await context.newPage();
    await otherTab.goto(page.url(), { waitUntil: "domcontentloaded" });
    await expect(otherTab.getByLabel("Pokemon 1's name")).toHaveValue(
      "Cloyster",
    );

    if (action === "Clear") {
      await openManageTeamMenu(page);
      await clickMenuItem(page, "Clear");
    } else {
      await openTeams(page);
      await page.getByRole("button", { name: "Options for Alpha" }).click();
      await clickMenuItem(page, "Delete");
    }
    const confirmation = page.getByRole("dialog", { name: "Delete Alpha?" });
    await expect(confirmation).toBeVisible();
    await openManageTeamMenu(otherTab);
    await clickMenuItem(otherTab, "Clear");
    await otherTab
      .getByRole("dialog", { name: "Delete Alpha?" })
      .getByRole("button", { name: "Delete", exact: true })
      .click();

    await expect(confirmation).toBeHidden();
    await expect(
      page.getByRole("dialog", { name: "Delete Beta?" }),
    ).toHaveCount(0);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Torkoal");
    if (action === "Teams Delete")
      await page
        .getByRole("dialog", { name: "Teams" })
        .getByRole("button", { name: "Close", exact: true })
        .click();
    await openManageTeamMenu(page);
    await clickMenuItem(page, "Clear");
    const nextConfirmation = page.getByRole("dialog", { name: "Delete Beta?" });
    await expect(nextConfirmation).toBeVisible();
    await nextConfirmation
      .getByRole("button", { name: "Cancel", exact: true })
      .click();
    await expect
      .poll(() =>
        otherTab.evaluate(() => {
          const state = JSON.parse(
            localStorage.getItem("mypokemonteam") ?? "{}",
          );
          return state.teams?.map((team: { name: string }) => team.name);
        }),
      )
      .toEqual(["Team 1", "Beta"]);
  });
}

test("Clear still clears an unsaved empty team without removing the saved team", async ({
  page,
}) => {
  await selectPokemon(page, "Dewgong");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const state = JSON.parse(localStorage.getItem("mypokemonteam") ?? "{}");
        return state.teams?.[0]?.team[0]?.name;
      }),
    )
    .toBe("dewgong");
  await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
  await openManageTeamMenu(page);
  await clickMenuItem(page, "Clear");
  const confirmation = page.getByRole("dialog", { name: "Delete Team 2?" });
  await expect(confirmation).toBeVisible();
  await confirmation
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(confirmation).toBeHidden();
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
  await openTeams(page);
  const teams = page.getByRole("list", { name: "Saved teams" });
  await expect(teams.getByRole("listitem")).toHaveCount(1);
  await teams.getByRole("button", { name: "Load Team 1", exact: true }).click();
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Dewgong");
});
