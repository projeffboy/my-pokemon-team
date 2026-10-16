import { readFile } from "node:fs/promises";
import { test, expect } from "fixtures";
import { clickMenuItem, openTeamsImportExport, selectPokemon } from "helper";
import type { BrowserContext, Page } from "@playwright/test";
import { createSavedTeam } from "@/shared/team";
import type { Generation, TeamPokemon } from "@/types";

const HARIYAMA =
  "Hariyama @ Assault Vest\nAbility: Guts\n- Close Combat\n- Knock Off\n- Bullet Punch\n- Fake Out";
const WAILORD =
  "Wailord @ Leftovers\nAbility: Water Veil\n- Water Spout\n- Hydro Pump\n- Rest\n- Sleep Talk";
const PROBOPASS =
  "Probopass @ Leftovers\nAbility: Sturdy\n- Stealth Rock\n- Power Gem\n- Earth Power\n- Volt Switch";
const SUDOWOODO =
  "Sudowoodo @ Life Orb\nAbility: Rock Head\n- Wood Hammer\n- Earthquake\n- Sucker Punch\n- Stealth Rock";

const team = (header: string, sets: string) =>
  `=== ${header} ===\n\n${sets}\n\n`;
const ALPHA = team("[gen9] Alpha", HARIYAMA);
const BETA = team("[gen8ou] Beta", WAILORD);
const GAMMA = team("[gen7] Gamma", SUDOWOODO);
const DELTA = team("[gen4ou] Delta", PROBOPASS);

const openTeams = async (page: Page) => {
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Teams" })).toBeVisible();
};

// The Teams dialog is one dialog: its title is "Teams" on the list and "Import/Export"
// on the page that holds every team's text
const teamsDialog = (page: Page) =>
  page.getByRole("dialog", { name: "Teams", exact: true });

const exportDialog = (page: Page) =>
  page.getByRole("dialog", { name: "Import/Export", exact: true });

const savedTeams = (page: Page) =>
  teamsDialog(page).getByRole("list", { name: "Saved teams" });

const load = (page: Page, name: string) =>
  savedTeams(page).getByRole("button", { name: `Load ${name}`, exact: true });

const box = (page: Page) =>
  exportDialog(page).getByRole("textbox", {
    name: "Pokemon Showdown Team Raw Text",
  });

const button = (page: Page, name: string) =>
  exportDialog(page).getByRole("button", { name, exact: true });

// The open dialog hides the snackbar from assistive technology
const snackbar = (page: Page) =>
  page.getByRole("alert", { includeHidden: true }).last();

const savedTeam = (
  name: string,
  generation: Generation,
  format: string,
  pokemon: TeamPokemon,
) => {
  const saved = createSavedTeam({ name, generation, format });
  saved.id = name.toLowerCase();
  saved.team[0] = pokemon;
  return saved;
};

// Alpha in Gen 9 and Beta in Gen 8 OU, with the named one open
const seedTeams = async (page: Page, open: "Alpha" | "Beta" = "Alpha") => {
  const teams = [
    savedTeam("Alpha", 9, "", {
      name: "hariyama",
      item: "assaultvest",
      ability: "Guts",
      move1: "closecombat",
      move2: "knockoff",
      move3: "bulletpunch",
      move4: "fakeout",
    }),
    savedTeam("Beta", 8, "OU: Over Used", {
      name: "wailord",
      item: "leftovers",
      ability: "Water Veil",
      move1: "waterspout",
      move2: "hydropump",
      move3: "rest",
      move4: "sleeptalk",
    }),
  ];
  await page.addInitScript(
    state => {
      if (sessionStorage.getItem("seeded-teams")) return;
      localStorage.setItem("mypokemonteam", JSON.stringify(state));
      sessionStorage.setItem("seeded-teams", "true");
    },
    { teams, currentTeamId: "alpha" },
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  // The site opens a new team, not the current one, when its address has no team
  await openTeams(page);
  await load(page, open).click();
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
    open === "Alpha" ? "Hariyama" : "Wailord",
  );
};

// Adds text to the end of what the box holds
const append = async (page: Page, text: string) =>
  box(page).fill((await box(page).inputValue()) + text);

// Answers pokepast.es' /<id>/json as the site does, with CORS open to any page, and
// lists the paths it is asked for. The sandbox cannot reach the site.
const mockPokepaste = async (
  context: BrowserContext,
  pastes: Record<string, object>,
) => {
  const requests: string[] = [];
  await context.route("https://pokepast.es/**", route => {
    const { pathname } = new URL(route.request().url());
    requests.push(pathname);
    const paste = pastes[pathname.split("/")[1] ?? ""];
    return route.fulfill({
      status: paste ? 200 : 404,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(paste ?? { error: "Not found" }),
    });
  });
  return requests;
};

const RAIN_ID = "0123456789abcdef";
const UNTITLED_ID = "fedcba9876543210";
const LINK_FAILED =
  "Could not fetch a team from that link. Make sure you copied the full link, or paste the team text instead.";

test.describe("Teams Dialog: Import/Export - Integration Tests", () => {
  test.beforeEach(() => {
    test.slow();
  });

  test("opens a page with every saved team as text, in place of the old import and export buttons", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeams(page);
    const teams = teamsDialog(page);
    for (const name of [
      "Import Team",
      "Copy All",
      "Export All",
      "Team backups",
    ])
      await expect(
        teams.getByRole("button", { name, exact: true }),
      ).toHaveCount(0);
    await expect(savedTeams(page).getByRole("listitem")).toHaveText([
      /Alpha\s*Current\s*Gen 9 \(SV\)/,
      /Beta\s*Open\s*Gen 8 \(SwSh \/ BDSP\)/,
    ]);

    await teams
      .getByRole("button", { name: "Import/Export", exact: true })
      .click();

    const dialog = exportDialog(page);
    await expect(
      dialog.getByRole("heading", { name: "Import/Export" }),
    ).toBeVisible();
    await expect(box(page)).toHaveValue(ALPHA + BETA);
    await expect(dialog).toContainText("These are all your teams.");
    for (const name of ["Copy", "Download", "Cancel", "Add teams", "Go Back"])
      await expect(button(page, name)).toBeVisible();
    await expect(button(page, "Upload to PokePaste")).toHaveCount(0);
    await expect(button(page, "Close")).toHaveCount(0);
  });

  test("Go Back and Cancel return to the team list, and the page starts afresh each time", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    for (const leave of ["Go Back", "Cancel"]) {
      await box(page).fill("Edited text");
      await button(page, leave).click();

      await expect(exportDialog(page)).toBeHidden();
      await expect(teamsDialog(page).getByRole("heading")).toHaveText("Teams");
      await expect(savedTeams(page).getByRole("listitem")).toHaveCount(2);
      await expect(
        teamsDialog(page).getByRole("button", { name: "Close", exact: true }),
      ).toBeVisible();

      await teamsDialog(page)
        .getByRole("button", { name: "Import/Export", exact: true })
        .click();
      await expect(box(page)).toHaveValue(ALPHA + BETA);
    }
  });

  test("Escape closes the Teams dialog from the page, which opens at the team list again", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    await box(page).fill("Edited text");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await openTeams(page);
    await expect(savedTeams(page).getByRole("listitem")).toHaveCount(2);
    await expect(
      teamsDialog(page).getByRole("button", {
        name: "Import/Export",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("Add teams adds nothing for the unchanged text", async ({ page }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("These teams are already saved.");
    await expect(savedTeams(page).getByRole("listitem")).toHaveCount(2);
    await expect(load(page, "Alpha")).toHaveAttribute("aria-current", "true");
    await teamsDialog(page)
      .getByRole("button", { name: "Close", exact: true })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Hariyama");
  });

  test("Add teams adds a team with changed pokemon beside the original", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    await box(page).fill((ALPHA + BETA).replace(HARIYAMA, PROBOPASS));
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("Team imported");
    await expect(savedTeams(page).getByRole("listitem")).toHaveCount(3);
    await expect(load(page, "Alpha")).toHaveCount(2);
    await expect(load(page, "Alpha").first()).not.toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(load(page, "Beta")).toHaveCount(1);
    // The new team is the one that opens
    await expect(load(page, "Alpha").last()).toHaveAttribute(
      "aria-current",
      "true",
    );
    await load(page, "Alpha").last().click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Probopass");
    await expect(page.getByLabel("Pokemon 1's move2")).toHaveValue("Power Gem");

    await openTeams(page);
    await load(page, "Alpha").first().click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Hariyama");
  });

  test("Add teams adds text without a header as one team, named by the numbering and in the current game", async ({
    page,
  }) => {
    await seedTeams(page, "Beta");
    await openTeamsImportExport(page);
    await box(page).fill(SUDOWOODO);
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("Team imported");
    await expect(
      savedTeams(page).getByRole("button", { name: /^Load/ }),
    ).toHaveText([/Alpha/, /Beta/, /Team 3/]);
    await expect(savedTeams(page).getByRole("listitem").last()).toContainText(
      "Gen 8 (SwSh / BDSP)",
    );
    await load(page, "Team 3").click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Sudowoodo");
  });

  test("Add teams adds text without a header put after the last team as a team of its own", async ({
    page,
  }) => {
    await seedTeams(page, "Beta");
    await openTeamsImportExport(page);
    await append(page, SUDOWOODO);
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("Team imported");
    await expect(
      savedTeams(page).getByRole("button", { name: /^Load/ }),
    ).toHaveText([/Alpha/, /Beta/, /Team 3/]);
    await load(page, "Beta").click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Wailord");
    await expect(page.getByLabel("Pokemon 2's name")).toHaveValue("");
  });

  test("Add teams adds several teams, the last of which opens", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    await append(page, GAMMA + DELTA);
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("2 teams imported");
    const teams = savedTeams(page).getByRole("listitem");
    await expect(teams).toHaveText([
      /Alpha/,
      /Beta/,
      /Gamma\s*Open\s*Gen 7 \(SM \/ USUM\)/,
      /Delta\s*Current\s*Gen 4 \(DPPt \/ HGSS\)/,
    ]);
    await expect(load(page, "Delta")).toHaveAttribute("aria-current", "true");
    await teamsDialog(page)
      .getByRole("button", { name: "Close", exact: true })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Probopass");
  });

  test("Add teams skips the teams already saved when new ones come with them", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    await append(page, GAMMA);
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("Team imported");
    await expect(
      savedTeams(page).getByRole("button", { name: /^Load/ }),
    ).toHaveText([/Alpha/, /Beta/, /Gamma/]);
  });

  test("Add teams adds a repeated team as many times as the saved ones fall short", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    await append(page, ALPHA);
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("Team imported");
    await expect(
      savedTeams(page).getByRole("button", { name: /^Load/ }),
    ).toHaveText([/Alpha/, /Beta/, /Alpha/]);
  });

  test("Download saves the text in the box, edits included", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    const edited = BETA + ALPHA;
    await box(page).fill(edited);
    const downloading = page.waitForEvent("download");
    await button(page, "Download").click();

    const download = await downloading;
    expect(download.suggestedFilename()).toBe("my-pokemon-teams.txt");
    const file = await download.path();
    if (!file) throw new Error("The text was not downloaded");
    expect(await readFile(file, "utf8")).toBe(edited);
    await expect(snackbar(page)).toHaveText("Exported all teams");
    // Nothing is added or changed
    await expect(box(page)).toHaveValue(edited);
    await button(page, "Cancel").click();
    await expect(savedTeams(page).getByRole("listitem")).toHaveCount(2);
  });

  test("Copy copies the text in the box", async ({ page }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: (text: string) => {
            document.documentElement.dataset.copiedText = text;
            return Promise.resolve();
          },
        },
      });
    });
    const edited = BETA + ALPHA;
    await box(page).fill(edited);
    await button(page, "Copy").click();

    await expect(snackbar(page)).toHaveText("Copied all teams");
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.dataset.copiedText),
      )
      .toBe(edited);
    await expect(exportDialog(page)).toBeVisible();
  });

  test("Copy, Download and Add teams need text in the box", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeamsImportExport(page);
    const actions = ["Copy", "Download", "Add teams"];
    for (const name of actions) await expect(button(page, name)).toBeEnabled();

    await box(page).fill(" \n");
    for (const name of actions) await expect(button(page, name)).toBeDisabled();

    await box(page).fill(ALPHA);
    for (const name of actions) await expect(button(page, name)).toBeEnabled();
  });

  test("Add teams reads a pokepast.es link, naming the team after the paste and setting its game", async ({
    page,
    context,
  }) => {
    const requests = await mockPokepaste(context, {
      [RAIN_ID]: {
        title: "Rain team",
        author: "someone",
        notes: "Format: gen8ou",
        paste:
          "Zangoose @ Toxic Orb\r\nAbility: Toxic Boost\r\n- Facade\r\n- Close Combat\r\n",
      },
    });
    await seedTeams(page);
    await openTeamsImportExport(page);
    await append(page, `https://pokepast.es/${RAIN_ID}\n`);
    expect(requests).toEqual([]);
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("Team imported");
    expect(requests).toEqual([`/${RAIN_ID}/json`]);
    await expect(
      savedTeams(page).getByRole("button", { name: /^Load/ }),
    ).toHaveText([/Alpha/, /Beta/, /Rain team/]);
    await expect(savedTeams(page).getByRole("listitem").last()).toContainText(
      "Gen 8 (SwSh / BDSP)",
    );
    await teamsDialog(page)
      .getByRole("button", { name: "Close", exact: true })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Zangoose");
    await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue(
      "Toxic Boost",
    );
  });

  test("Add teams numbers an untitled paste and gives it the current game", async ({
    page,
    context,
  }) => {
    await mockPokepaste(context, {
      [UNTITLED_ID]: {
        title: "Untitled",
        notes: "",
        paste: "Lunatone @ Leftovers\r\n- Psychic\r\n",
      },
    });
    await seedTeams(page);
    await openTeamsImportExport(page);
    await box(page).fill(`https://pokepast.es/${UNTITLED_ID}`);
    await button(page, "Add teams").click();

    await expect(snackbar(page)).toHaveText("Team imported");
    await expect(
      savedTeams(page).getByRole("button", { name: /^Load/ }),
    ).toHaveText([/Alpha/, /Beta/, /Team 3/]);
    await expect(savedTeams(page).getByRole("listitem").last()).toContainText(
      "Gen 9 (SV)",
    );
  });

  test("a link that cannot be fetched is reported, and nothing is added", async ({
    page,
    context,
  }) => {
    const requests = await mockPokepaste(context, {});
    await seedTeams(page);
    await openTeamsImportExport(page);
    await append(page, `https://pokepast.es/${RAIN_ID}\n`);
    const text = await box(page).inputValue();
    await button(page, "Add teams").click();

    await expect(exportDialog(page).getByText(LINK_FAILED)).toBeVisible();
    await expect(box(page)).toHaveAttribute("aria-invalid", "true");
    await expect(box(page)).toHaveValue(text);
    await expect(button(page, "Add teams")).toBeEnabled();
    expect(requests).toEqual([`/${RAIN_ID}/json`]);

    await button(page, "Go Back").click();
    await expect(savedTeams(page).getByRole("listitem")).toHaveCount(2);
  });

  test("a team's menu has its own Import/Export, which opens that team's text", async ({
    page,
  }) => {
    await seedTeams(page);
    await openTeams(page);
    await page.getByRole("button", { name: "Options for Beta" }).click();
    await expect(page.getByRole("menuitem")).toHaveText([
      "Edit team name",
      "Share",
      "Duplicate",
      "Import/Export",
      "Delete",
    ]);
    await clickMenuItem(page, "Import/Export");

    // Beta is not the current team, but its text is what the dialog holds
    await expect(exportDialog(page)).toBeVisible();
    await expect(box(page)).toHaveValue(`${WAILORD}\n\n`);
    await expect(button(page, "Upload to PokePaste")).toBeVisible();
    await expect(button(page, "Add teams")).toHaveCount(0);

    await box(page).fill(`${SUDOWOODO}\n\n`);
    await button(page, "Update").click();
    await expect(exportDialog(page)).toBeHidden();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Sudowoodo");

    await openTeams(page);
    await expect(savedTeams(page).getByRole("listitem")).toHaveCount(2);
    await load(page, "Alpha").click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Hariyama");
  });

  test("when the browser cannot save the teams, Teams points to Import/Export, which holds the unsaved work", async ({
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
    await page.reload({ waitUntil: "domcontentloaded" });
    await selectPokemon(page, "Absol");
    await openTeams(page);
    await expect(
      page.getByText(
        "Your browser couldn’t save your teams. Copy them from Import/Export to keep them.",
        { exact: true },
      ),
    ).toBeVisible();

    await teamsDialog(page)
      .getByRole("button", { name: "Import/Export", exact: true })
      .click();
    await expect(box(page)).toHaveValue(/^=== \[gen9\] Team 1 ===\n\nAbsol/);
    const downloading = page.waitForEvent("download");
    await button(page, "Download").click();
    const file = await (await downloading).path();
    if (!file) throw new Error("The text was not downloaded");
    expect(await readFile(file, "utf8")).toContain("Absol");
  });
});
