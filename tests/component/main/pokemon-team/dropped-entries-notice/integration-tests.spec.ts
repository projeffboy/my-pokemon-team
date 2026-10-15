import { test, expect } from "fixtures";
import { showSlot } from "helper";
import type { Page } from "@playwright/test";
import { createSavedTeam } from "@/shared/team";

const notice = (page: Page) =>
  page.getByRole("alert").filter({ hasText: "removed from this team" });

const savedText = (page: Page) =>
  page.evaluate(() => localStorage.getItem("mypokemonteam") ?? "");

test.describe("Dropped entries notice - Integration Tests", () => {
  test("a saved team names what a data update removed, once", async ({
    page,
  }) => {
    const old = createSavedTeam({ name: "Old team", generation: 9 });
    old.id = "old";
    old.team[0] = {
      ...old.team[0],
      name: "arboliva",
      item: "imaginaryseed",
      ability: "Seed Sower",
      move1: "energyball",
      move2: "imaginarybloom",
    };
    old.team[1].name = "imaginarymon";
    await page.addInitScript(
      teams => {
        if (sessionStorage.getItem("seeded-dropped-entries")) return;
        localStorage.setItem(
          "mypokemonteam",
          JSON.stringify({ teams, currentTeamId: "old", locale: "en" }),
        );
        sessionStorage.setItem("seeded-dropped-entries", "true");
      },
      [old],
    );
    await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeHidden();

    await page.getByRole("button", { name: "Teams", exact: true }).click();
    await page
      .getByRole("dialog", { name: "Teams" })
      .getByRole("button", { name: "Load Old team" })
      .click();
    await expect(page.getByRole("dialog", { name: "Teams" })).toBeHidden();
    await expect(notice(page)).toContainText(
      "3 entries were removed from this team",
    );
    await expect(notice(page).getByRole("listitem")).toHaveText([
      "Arboliva, item: imaginaryseed",
      "Arboliva, move 2: imaginarybloom",
      "Pokemon 2: imaginarymon",
    ]);
    await showSlot(page, 0);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Arboliva");
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue(
      "Energy Ball",
    );
    await expect(page.getByLabel("Pokemon 1's move2")).toHaveValue("");
    await expect.poll(() => savedText(page)).not.toContain("imaginary");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Arboliva");
    await expect(notice(page)).toBeHidden();
  });
});
