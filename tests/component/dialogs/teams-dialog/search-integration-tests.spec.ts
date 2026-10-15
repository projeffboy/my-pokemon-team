import type { Page } from "@playwright/test";
import { test, expect } from "fixtures";
import { clickMenuItem, goToSite } from "helper";
import { LOCALES } from "@/i18n/locales";
import { loadTranslation } from "@/i18n/translation";
import { createSavedTeam } from "@/shared/team";
import type { SavedTeam } from "@/types";

const seedTeams = async (page: Page, teams: SavedTeam[], locale = "en") => {
  await page.evaluate(
    state => localStorage.setItem("mypokemonteam", JSON.stringify(state)),
    { teams, currentTeamId: teams[0]?.id, locale },
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
};

const exampleTeams = () => {
  const forest = createSavedTeam({
    name: "Forêt friends",
    generation: 3,
    format: "UU: Under Used",
  });
  const river = createSavedTeam({ name: "River friends", generation: 9 });
  Object.assign(forest.team[0] ?? {}, { name: "delcatty", nickname: "Velvet" });
  Object.assign(forest.team[1] ?? {}, { name: "farfetchd" });
  Object.assign(river.team[0] ?? {}, { name: "seaking" });
  return [forest, river];
};

test("finds teams by name, Pokémon and nickname, and clears or resets the search", async ({
  page,
}) => {
  await seedTeams(page, exampleTeams());
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Teams", exact: true });
  const search = dialog.getByRole("searchbox", { name: "Search teams" });
  const teams = dialog.getByRole("list", { name: "Saved teams" });
  await expect(dialog.getByRole("status")).toHaveText("2 teams");
  await expect(
    teams.getByRole("button", { name: "Load Forêt friends", exact: true }),
  ).toHaveAccessibleDescription(
    /Gen 3 \(RSE \/ FRLG\) · UU.*Velvet \(Delcatty\)/,
  );

  for (const query of [
    "  FORET  ",
    "Delcatty",
    "Farfetchd",
    "Farfetch'd",
    "Farfetch’d",
    "velvet",
    "friends velvet",
  ]) {
    await search.fill(query);
    await expect(teams.getByRole("button", { name: /^Load/ })).toHaveText([
      /Forêt friends/,
    ]);
    await expect(dialog.getByRole("status")).toHaveText("1 of 2 teams");
  }
  await search.fill("No such team");
  await expect(teams.getByRole("button", { name: /^Load/ })).toHaveCount(0);
  await expect(dialog.getByText("No teams match your search.")).toBeVisible();
  await expect(dialog.getByRole("status")).toHaveText("0 of 2 teams");
  await dialog.getByRole("button", { name: "Clear search" }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await expect(teams.getByRole("button", { name: /^Load/ })).toHaveCount(2);

  await search.fill("seaking");
  await teams.getByRole("button", { name: "Load River friends" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Seaking");
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(teams.getByRole("button", { name: /^Load/ })).toHaveCount(2);
});

test("searching keeps team menus and whole-collection exports working", async ({
  page,
}) => {
  await seedTeams(page, exampleTeams());
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Teams", exact: true });
  const search = dialog.getByRole("searchbox", { name: "Search teams" });
  await search.fill("Velvet");
  const options = dialog.getByRole("button", {
    name: "Options for Forêt friends",
  });
  await expect(options).toHaveAttribute("aria-expanded", "false");
  await options.click();
  await expect(
    page.getByRole("button", {
      name: "Options for Forêt friends",
      includeHidden: true,
    }),
  ).toHaveAttribute("aria-expanded", "true");
  await clickMenuItem(page, "Duplicate");
  const notice = page
    .getByRole("alert", { includeHidden: true })
    .filter({ hasText: "Team duplicated" });
  await notice
    .getByRole("button", { name: "Close", includeHidden: true })
    .click();
  await expect(notice).toBeHidden();
  await expect(dialog.getByRole("status")).toHaveText("3 teams");

  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Export All", exact: true }).click();
  const download = await downloadPromise;
  const chunks = await (await download.createReadStream()).toArray();
  const text = Buffer.concat(chunks).toString();
  expect(text).toContain("River friends");
  expect(text).toContain("Forêt friends");
  expect(text.match(/^=== /gm)).toHaveLength(3);

  await dialog
    .getByRole("button", { name: "Import Team", exact: true })
    .click();
  const importer = page.getByRole("dialog", {
    name: "Import Team",
    exact: true,
  });
  await importer
    .getByRole("textbox")
    .fill("=== [gen9] New arrival ===\n\nLumineon");
  await importer.getByRole("button", { name: "Import", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(
    dialog.getByRole("button", { name: "Load New arrival" }),
  ).toBeVisible();
});

test("renaming a filtered team keeps keyboard focus when its row disappears", async ({
  page,
}) => {
  await seedTeams(page, exampleTeams());
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Teams", exact: true });
  const search = dialog.getByRole("searchbox", { name: "Search teams" });
  await search.fill("Forêt");
  const options = dialog.getByRole("button", {
    name: "Options for Forêt friends",
  });
  await options.focus();
  await page.keyboard.press("Enter");
  const edit = page.getByRole("menuitem", {
    name: "Edit team name",
    exact: true,
  });
  await edit.focus();
  await page.keyboard.press("Enter");
  const editor = page.getByRole("dialog", {
    name: "Edit team name",
    exact: true,
  });
  const name = editor.getByRole("textbox", { name: "Team name" });
  await expect(name).toBeFocused();
  await name.fill("Evening friends");
  await name.press("Enter");
  await expect(editor).toBeHidden();
  await expect(search).toBeFocused();
  await expect(dialog.getByRole("status")).toHaveText("0 of 2 teams");
  await search.fill("evening");
  await expect(
    dialog.getByRole("button", { name: "Load Evening friends" }),
  ).toBeVisible();
});

test("short windows keep a usable list and scroll to every collection action", async ({
  page,
}) => {
  await seedTeams(page, exampleTeams());
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Teams", exact: true });
  const teams = dialog.getByRole("list", { name: "Saved teams" });
  for (const viewport of [
    { width: 600, height: 481 },
    { width: 600, height: 480 },
    { width: 600, height: 360 },
    { width: 600, height: 520 },
    { width: 320, height: 481 },
    { width: 320, height: 560 },
  ]) {
    await page.setViewportSize(viewport);
    await expect
      .poll(async () => (await teams.boundingBox())?.height)
      .toBeGreaterThanOrEqual(160);
    for (const control of [
      dialog.getByRole("searchbox", { name: "Search teams" }),
      teams.getByRole("button", { name: "Load Forêt friends", exact: true }),
      teams.getByRole("button", { name: "Load River friends", exact: true }),
      dialog.getByRole("button", { name: "Copy All", exact: true }),
      dialog.getByRole("button", { name: "Export All", exact: true }),
      dialog.getByRole("button", { name: "Team backups", exact: true }),
      dialog.getByText("Teams are saved in this browser.", { exact: true }),
    ]) {
      await control.scrollIntoViewIfNeeded();
      await expect(control).toBeInViewport({ ratio: 0.95 });
    }
    const options = teams.getByRole("button", {
      name: "Options for River friends",
    });
    await options.click();
    await expect(
      page.getByRole("menuitem", { name: "Edit team name", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
  }
});

test("deleting a filtered team's open menu in another tab restores search focus", async ({
  page,
  context,
}) => {
  await seedTeams(page, exampleTeams());
  const otherTab = await context.newPage();
  await goToSite(otherTab);
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Teams", exact: true });
  const search = dialog.getByRole("searchbox", { name: "Search teams" });
  await search.fill("Forêt");
  await dialog
    .getByRole("button", { name: "Options for Forêt friends" })
    .click();
  await expect(page.getByRole("menu")).toBeVisible();

  await otherTab.getByRole("button", { name: "Teams", exact: true }).click();
  await otherTab
    .getByRole("button", { name: "Options for Forêt friends" })
    .click();
  await clickMenuItem(otherTab, "Delete");
  await otherTab
    .getByRole("dialog", { name: "Delete Forêt friends?", exact: true })
    .getByRole("button", { name: "Delete", exact: true })
    .click();

  await expect(page.getByRole("menu")).toBeHidden();
  await expect(search).toBeFocused();
  await expect(dialog.getByRole("status")).toHaveText("0 of 1 team");
  await search.fill("River");
  await expect(
    dialog.getByRole("button", { name: "Load River friends" }),
  ).toBeVisible();
});

test("search and team actions fit a narrow phone in every language", async ({
  page,
}) => {
  test.slow();
  await page.setViewportSize({ width: 320, height: 560 });
  for (const locale of LOCALES) {
    const { t, names } = await loadTranslation(locale);
    await seedTeams(page, exampleTeams(), locale);
    await page.getByRole("button", { name: t.team.teams, exact: true }).click();
    const dialog = page.getByRole("dialog", {
      name: t.team.teams,
      exact: true,
    });
    const search = dialog.getByRole("searchbox", { name: t.teams.search });
    for (const query of [names.pokemon("delcatty"), "Delcatty"]) {
      await search.fill(query);
      await expect(dialog.getByRole("status")).toHaveText(
        t.teams.searchCount(1, 2),
      );
      await expect(
        dialog.getByRole("button", {
          name: t.teams.load("Forêt friends"),
          exact: true,
        }),
      ).toBeInViewport();
    }
    for (const control of [
      search,
      dialog.getByRole("button", { name: t.teams.clearSearch }),
      dialog.getByRole("button", { name: t.teams.newTeam, exact: true }),
      dialog.getByRole("button", { name: t.teams.importTeam, exact: true }),
      dialog.getByRole("button", { name: t.teams.exportAll, exact: true }),
      dialog.getByRole("button", { name: t.teamBackup.title, exact: true }),
    ]) {
      await expect(control).toBeInViewport();
      const bounds = await control.boundingBox();
      expect(bounds?.x).toBeGreaterThanOrEqual(0);
      expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(320);
    }
    await dialog.getByRole("button", { name: t.close, exact: true }).click();
    await expect(dialog).toBeHidden();
  }
});
