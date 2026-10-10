import { test, expect } from "fixtures";
import { openTeamTools, selectPokemon } from "helper";
import type { Page } from "@playwright/test";
import { createSavedTeam } from "@/shared/team";

const openTeams = async (page: Page) => {
  await openTeamTools(page);
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Teams", exact: true }),
  ).toBeVisible();
};

const openBackups = async (page: Page) => {
  await page
    .getByRole("dialog", { name: "Teams", exact: true })
    .getByRole("button", { name: "Team backups", exact: true })
    .click();
  return page.getByRole("dialog", { name: "Team backups", exact: true });
};

test.describe("Team backups", () => {
  test("a backup that would exceed collection capacity leaves current work unchanged", async ({
    page,
  }) => {
    test.slow();
    const current = createSavedTeam({ name: "Current work", generation: 9 });
    current.id = "current";
    const existing = createSavedTeam({ name: "Stored", generation: 9 });
    existing.id = "stored";
    existing.filters.moves = "x".repeat(2 * 1024 * 1024);
    const incoming = createSavedTeam({ name: "Incoming", generation: 9 });
    incoming.id = "incoming";
    incoming.filters.moves = "y".repeat(9 * 1024 * 1024);
    await page.addInitScript(
      teams => {
        if (sessionStorage.getItem("seeded-backup-capacity")) return;
        localStorage.setItem(
          "mypokemonteam",
          JSON.stringify({ teams, currentTeamId: "current" }),
        );
        sessionStorage.setItem("seeded-backup-capacity", "true");
      },
      [current, existing],
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await openTeams(page);
    await page
      .getByRole("button", { name: "Load Current work", exact: true })
      .click();
    const storedState = () =>
      page.evaluate(async () => {
        const { teams, currentTeamId } = JSON.parse(
          localStorage.getItem("mypokemonteam")!,
        );
        const digest = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(JSON.stringify({ teams, currentTeamId })),
        );
        return Array.from(new Uint8Array(digest), byte =>
          byte.toString(16).padStart(2, "0"),
        ).join("");
      });
    const before = await storedState();
    await openTeams(page);
    const dialog = await openBackups(page);
    const choose = async () => {
      await dialog.locator("input[type=file]").setInputFiles({
        name: "backup.json",
        mimeType: "application/json",
        buffer: Buffer.from(
          JSON.stringify({
            format: "mypokemonteam",
            version: 1,
            teams: [incoming],
            currentTeamId: incoming.id,
          }),
        ),
      });
    };
    await choose();
    const add = dialog.getByRole("button", { name: "Add teams", exact: true });
    await expect(dialog.getByText("Teams in this backup: 1")).toBeVisible();
    await expect(add).toBeEnabled();
    await add.click();
    await expect(dialog.getByRole("alert")).toHaveText(
      "This backup has too many teams to add. Try a smaller backup file.",
    );
    await expect(add).toBeDisabled();
    expect(await storedState()).toBe(before);

    incoming.filters.moves = "Protect";
    await choose();
    await expect(dialog.getByRole("alert")).toHaveCount(0);
    await expect(add).toBeEnabled();
    await add.click();
    await expect(
      page
        .getByRole("dialog", { name: "Teams", exact: true })
        .getByRole("list", { name: "Saved teams" })
        .getByRole("listitem"),
    ).toHaveCount(3);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("mypokemonteam")!).currentTeamId,
        ),
      )
      .toBe("current");
  });

  test("downloaded backups restore complete teams without replacing current work or duplicating repeated imports", async ({
    page,
  }) => {
    test.slow();
    const modern = createSavedTeam({
      name: "Favorites",
      generation: 9,
      format: "OU",
    });
    modern.id = "favorites";
    modern.filters = {
      type: "Water",
      region: "Sinnoh",
      ability: "Hydration",
      moves: "Tail Glow",
    };
    modern.team[0] = {
      name: "manaphy",
      nickname: "Kai",
      item: "leftovers",
      ability: "Hydration",
      move1: "surf",
      move2: "tailglow",
      move3: "icebeam",
      move4: "rest",
      level: 61,
      gender: "N",
      happiness: 80,
      shiny: true,
      teraType: "Water",
      nature: "Modest",
      evs: { hp: 4, spa: 252, spe: 252 },
      ivs: { atk: 0 },
    };
    const legacy = createSavedTeam({
      name: "Old friends",
      generation: 2,
      format: "UU",
    });
    legacy.id = "old-friends";
    legacy.team[0] = {
      name: "porygon",
      item: "leftovers",
      ability: "",
      move1: "recover",
      move2: "icebeam",
      move3: "thunderbolt",
      move4: "conversion",
      happiness: 100,
      ivs: { hp: 7, atk: 3, def: 9, spa: 11, spd: 11, spe: 13 },
      statExperience: { hp: 9999, spa: 12345 },
    };
    const empty = createSavedTeam({
      name: "Spare",
      generation: 7,
      format: "letsgo",
    });
    empty.id = "spare";
    const saved = [modern, legacy, empty];
    await page.addInitScript(teams => {
      if (sessionStorage.getItem("seeded-backup-test")) return;
      localStorage.setItem(
        "mypokemonteam",
        JSON.stringify({ teams, currentTeamId: "favorites" }),
      );
      sessionStorage.setItem("seeded-backup-test", "true");
    }, saved);
    await page.reload();
    await openTeams(page);
    await page
      .getByRole("button", { name: "Load Favorites", exact: true })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Manaphy");
    await openTeams(page);
    let dialog = await openBackups(page);
    const downloaded = page.waitForEvent("download");
    await dialog
      .getByRole("button", { name: "Save backup", exact: true })
      .click();
    const download = await downloaded;
    expect(download.suggestedFilename()).toBe("my-pokemon-teams-backup.json");
    const chunks = await (await download.createReadStream()).toArray();
    const buffer = Buffer.concat(chunks);
    const backup = JSON.parse(buffer.toString());
    expect(backup.teams).toEqual(saved);
    expect(backup.currentTeamId).toBe("favorites");

    await page.evaluate(() => localStorage.clear());
    await page.goto("/?gen=9");
    await selectPokemon(page, "Skarmory");
    await openTeams(page);
    dialog = await openBackups(page);
    await dialog.locator("input[type=file]").setInputFiles({
      name: "my-backup.json",
      mimeType: "application/json",
      buffer,
    });
    await expect(dialog.getByText("Teams in this backup: 3")).toBeVisible();
    await dialog
      .getByRole("button", { name: "Add teams", exact: true })
      .click();
    const teams = page
      .getByRole("dialog", { name: "Teams", exact: true })
      .getByRole("list", { name: "Saved teams" });
    await expect(teams.getByRole("listitem")).toHaveCount(4);
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem("mypokemonteam")!).teams.length,
        ),
      )
      .toBe(4);
    const restored = await page.evaluate(
      () => JSON.parse(localStorage.getItem("mypokemonteam")!).teams,
    );
    for (const source of saved) {
      const match = restored.find(
        (team: typeof source) => team.name === source.name,
      );
      expect(match).toEqual({ ...source, id: expect.any(String) });
      expect(match.id).not.toBe(source.id);
    }
    await expect(
      teams.getByRole("button", { name: "Load Team 1", exact: true }),
    ).toHaveAttribute("aria-current", "true");
    dialog = await openBackups(page);
    await dialog.locator("input[type=file]").setInputFiles({
      name: "same-backup.json",
      mimeType: "application/json",
      buffer,
    });
    await dialog
      .getByRole("button", { name: "Add teams", exact: true })
      .click();
    await expect(teams.getByRole("listitem")).toHaveCount(4);
    await expect(
      page.getByText("These teams are already in your collection.", {
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Skarmory");
    await page.reload();
    await openTeams(page);
    await page
      .getByRole("button", { name: "Load Favorites", exact: true })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Manaphy");
    await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue(
      "Hydration",
    );
  });

  test("invalid or newer backup files cannot change existing teams", async ({
    page,
  }) => {
    await selectPokemon(page, "Drapion");
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("mypokemonteam") ?? "null")
              ?.teams?.[0]?.team?.[0]?.name,
        ),
      )
      .toBe("drapion");
    const before = await page.evaluate(() => {
      const { teams, currentTeamId } = JSON.parse(
        localStorage.getItem("mypokemonteam")!,
      );
      return { teams, currentTeamId };
    });
    await openTeams(page);
    const dialog = await openBackups(page);
    const chooser = page.waitForEvent("filechooser");
    await dialog
      .getByRole("button", { name: "Choose backup file", exact: true })
      .press("Enter");
    await (
      await chooser
    ).setFiles({
      name: "valid.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({ format: "mypokemonteam", version: 1, ...before }),
      ),
    });
    await expect(
      dialog.getByRole("button", { name: "Add teams", exact: true }),
    ).toBeEnabled();
    for (const contents of [
      "not a backup",
      JSON.stringify({ format: "mypokemonteam", version: 2, teams: [] }),
    ]) {
      await dialog.locator("input[type=file]").setInputFiles({
        name: "wrong.json",
        mimeType: "application/json",
        buffer: Buffer.from(contents),
      });
      await expect(dialog.getByRole("alert")).toContainText(
        "This file couldn't be read.",
      );
      await expect(
        dialog.getByRole("button", { name: "Add teams", exact: true }),
      ).toBeDisabled();
      expect(
        await page.evaluate(() => {
          const { teams, currentTeamId } = JSON.parse(
            localStorage.getItem("mypokemonteam")!,
          );
          return { teams, currentTeamId };
        }),
      ).toEqual(before);
    }
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Drapion");
  });

  test("backup controls remain reachable on a narrow phone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 560 });
    await openTeams(page);
    const dialog = await openBackups(page);
    await expect(dialog).toBeInViewport();
    for (const name of [
      "Save backup",
      "Choose backup file",
      "Cancel",
      "Add teams",
    ])
      await expect(
        dialog.getByRole("button", { name, exact: true }),
      ).toBeInViewport();
    const overflow = await dialog.evaluate(
      element => element.scrollWidth > element.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("failed browser saves show a backup option that preserves unsaved work", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const save = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (this === localStorage && key === "mypokemonteam")
          throw new DOMException("Storage is full", "QuotaExceededError");
        save.call(this, key, value);
      };
    });
    await page.reload();
    await selectPokemon(page, "Drapion");
    await openTeams(page);
    await expect(
      page.getByText(
        "Your browser couldn’t save your teams. Save a backup to keep them.",
        { exact: true },
      ),
    ).toBeVisible();
    const dialog = await openBackups(page);
    const downloaded = page.waitForEvent("download");
    await dialog
      .getByRole("button", { name: "Save backup", exact: true })
      .click();
    const download = await downloaded;
    const chunks = await (await download.createReadStream()).toArray();
    const backup = JSON.parse(Buffer.concat(chunks).toString());
    const current = backup.teams.find(
      (team: { id: string }) => team.id === backup.currentTeamId,
    );
    expect(current?.team[0].name).toBe("drapion");
  });
});
