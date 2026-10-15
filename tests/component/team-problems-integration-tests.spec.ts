import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";
import {
  closeDialog,
  openFilters,
  selectDialogOption,
  selectMove,
  selectPokemon,
} from "helper";
import { createSavedTeam } from "@/shared/team";

const problems = (page: Page) =>
  page.getByRole("status", { name: "Team problems" });

test.describe("Team Problems and Dialogs - Integration Tests", () => {
  test("a format chosen in the filters checks the team against it", async ({
    page,
  }) => {
    await selectPokemon(page, "Altaria");
    await expect(problems(page)).toHaveText("No problems found for Gen 9.");
    await openFilters(page);
    await selectDialogOption(page, "Format", "Little Cup (LC)");
    await closeDialog(page);
    await expect(problems(page).getByRole("listitem")).toHaveText([
      "Altaria is not allowed in Gen 9 Little Cup (LC).",
    ]);
  });

  test("a format chosen in the filters lists the moves it bans", async ({
    page,
  }) => {
    await selectPokemon(page, "Breloom");
    await selectMove(page, "Spore");
    await openFilters(page);
    await selectDialogOption(page, "Format", "OU: Over Used");
    await closeDialog(page);
    await expect(problems(page).getByRole("listitem")).toHaveText([
      "Breloom has Spore, which is banned in Gen 9 OU: Over Used.",
    ]);
  });

  // Share links and the level field keep levels in range, but saved teams keep any level
  test("a saved team's level outside 1 to 100 is a problem", async ({
    page,
  }) => {
    const saved = createSavedTeam({ name: "Level 101", generation: 9 });
    saved.id = "level-101";
    saved.team[0] = { ...saved.team[0], name: "dragapult", level: 101 };
    await page.addInitScript(
      teams => {
        if (sessionStorage.getItem("seeded-level-101")) return;
        localStorage.setItem(
          "mypokemonteam",
          JSON.stringify({ teams, currentTeamId: "level-101" }),
        );
        sessionStorage.setItem("seeded-level-101", "true");
      },
      [saved],
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Teams", exact: true }).click();
    await page
      .getByRole("button", { name: "Load Level 101", exact: true })
      .click();
    await expect(problems(page).getByRole("listitem")).toHaveText([
      "Dragapult's level must be 1 to 100.",
    ]);
  });
});
