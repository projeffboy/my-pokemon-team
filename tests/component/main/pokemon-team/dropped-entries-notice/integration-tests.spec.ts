import { test, expect } from "fixtures";
import { showSlot } from "helper";
import type { Page } from "@playwright/test";
import type { SavedTeam, TeamPokemon } from "@/types";
import { createSavedTeam } from "@/shared/team";

const notice = (page: Page) =>
  page.getByRole("alert").filter({ hasText: "removed from this team" });

const savedText = (page: Page) =>
  page.evaluate(() => localStorage.getItem("mypokemonteam") ?? "");

const savedTeam = (name: string, ...members: Partial<TeamPokemon>[]) => {
  const team = createSavedTeam({ name, generation: 9 });
  members.forEach((member, i) => Object.assign(team.team[i], member));
  return team;
};

// Saves the teams once, so that a reload keeps what the page saved since
const seed = (page: Page, teams: SavedTeam[]) =>
  page.addInitScript(teams => {
    if (sessionStorage.getItem("seeded-dropped-entries")) return;
    localStorage.setItem(
      "mypokemonteam",
      JSON.stringify({ teams, currentTeamId: teams[0]?.id, locale: "en" }),
    );
    sessionStorage.setItem("seeded-dropped-entries", "true");
  }, teams);

async function loadTeam(page: Page, name: string) {
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Teams" });
  await dialog.getByRole("button", { name: `Load ${name}` }).click();
  await expect(dialog).toBeHidden();
}

test.describe("Dropped entries notice - Integration Tests", () => {
  test("a saved team names what a data update removed, once", async ({
    page,
  }) => {
    await seed(page, [
      savedTeam(
        "Old team",
        {
          name: "arboliva",
          item: "imaginaryseed",
          ability: "Seed Sower",
          move1: "energyball",
          move2: "imaginarybloom",
        },
        { name: "imaginarymon" },
      ),
    ]);
    await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeHidden();

    await loadTeam(page, "Old team");
    await expect(notice(page)).toContainText(
      "3 entries were removed from this team",
    );
    await expect(notice(page)).toContainText(
      "A game data update renamed or removed them.",
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

  test("each saved team keeps its notice while another opens, until dismissed", async ({
    page,
  }) => {
    await seed(page, [
      savedTeam("Team A", { name: "bellibolt", move1: "imaginaryzap" }),
      savedTeam("Team B", { name: "toedscruel", move1: "imaginaryspore" }),
    ]);
    await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });

    const teamA = ["Bellibolt, move 1: imaginaryzap"];
    await loadTeam(page, "Team A");
    await expect(notice(page).getByRole("listitem")).toHaveText(teamA);
    await expect(notice(page)).toContainText(
      "1 entry was removed from this team",
    );
    await expect(notice(page)).toContainText(
      "A game data update renamed or removed it.",
    );
    await loadTeam(page, "Team B");
    await expect(notice(page).getByRole("listitem")).toHaveText([
      "Toedscruel, move 1: imaginaryspore",
    ]);
    await loadTeam(page, "Team A");
    await expect(notice(page).getByRole("listitem")).toHaveText(teamA);

    await notice(page).getByRole("button", { name: "Dismiss" }).click();
    await expect(notice(page)).toBeHidden();
    await loadTeam(page, "Team B");
    await expect(notice(page)).toBeVisible();
    await loadTeam(page, "Team A");
    await expect(notice(page)).toBeHidden();
  });

  test("a reload names nothing the saved team still holds", async ({
    page,
  }) => {
    // Arboliva cannot learn Spore, which the link's text therefore leaves out
    await seed(page, [
      savedTeam("Spore team", {
        name: "arboliva",
        ability: "Seed Sower",
        move1: "gigadrain",
        move2: "spore",
      }),
    ]);
    await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });
    await loadTeam(page, "Spore team");
    await expect(page).toHaveURL(/team=/);

    await page.reload({ waitUntil: "domcontentloaded" });
    await showSlot(page, 0);
    await expect(page.getByLabel("Pokemon 1's move2")).toHaveValue("Spore");
    await expect(page.getByRole("alert")).toHaveCount(0);
  });
});
