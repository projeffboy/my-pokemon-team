import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";
import { toBase64Url } from "@/app/shared/base64url";
import ja from "@/i18n/ja";

const problems = (page: Page) =>
  page.getByRole("status", { name: "Team problems" });

// Opens a share link, e.g. `openTeam(page, "gen=9", "Amoonguss\n- Spore")`
const openTeam = (page: Page, settings: string, text: string) =>
  page.goto(`/?${settings}&team=${toBase64Url(text)}`, {
    waitUntil: "domcontentloaded",
  });

test.describe("Team Problems - Unit Tests", () => {
  // One team for each rule in src/store/validation.ts that a share link can break. The
  // level rule needs a saved team, as links and the level field keep levels in range.
  const rules = [
    {
      rule: "a pokemon from a later generation",
      settings: "gen=1",
      team: "Togepi\n- Metronome",
      message: "Togepi is not allowed in Gen 1.",
    },
    {
      rule: "a pokemon outside the format",
      settings: "game=champions",
      team: "Dondozo\n- Wave Crash",
      message: "Dondozo is not allowed in Gen 9 Pokemon Champions (M-C).",
    },
    {
      rule: "an ability from a later generation",
      settings: "gen=4",
      team: "Heracross\nAbility: Moxie\n- Megahorn",
      message: "Heracross cannot have Moxie.",
    },
    {
      rule: "a missing required item",
      settings: "gen=9",
      team: "Ogerpon-Cornerstone\n- Ivy Cudgel",
      message: "Ogerpon-Cornerstone must hold Cornerstone Mask.",
    },
    {
      rule: "a repeated move",
      settings: "gen=9",
      team: "Amoonguss\n- Spore\n- Spore",
      message: "Amoonguss has Spore twice.",
    },
    {
      rule: "too many EVs in total",
      settings: "gen=9",
      team: "Baxcalibur\nEVs: 252 HP / 252 Atk / 252 Spe\n- Glaive Rush",
      message: "Baxcalibur has 756 EVs (at most 510).",
    },
    {
      rule: "too many EVs in one stat",
      settings: "gen=6",
      team: "Hawlucha\nEVs: 255 Spe\n- Acrobatics",
      message: "Hawlucha has more than 252 EVs in one stat.",
    },
    {
      rule: "a long nickname",
      settings: "gen=5",
      team: "ABCDEFGHIJKLMNO (Krookodile)\n- Earthquake",
      message: "Krookodile's nickname must be 10 characters or fewer.",
    },
    {
      rule: "a tera type before Gen 9",
      settings: "gen=8",
      team: "Dracovish\nTera Type: Water\n- Fishious Rend",
      message: "Dracovish has a Tera Type, which only exists in Gen 9.",
    },
    {
      rule: "the Species Clause",
      settings: "game=champions",
      team: "Gholdengo\n- Make It Rain\n\nGholdengo\n- Shadow Ball",
      message: "Only one pokemon may be Gholdengo (Species Clause).",
    },
    {
      rule: "the Item Clause",
      settings: "game=champions",
      team: "Corviknight @ Leftovers\n- Roost\n\nToxapex @ Leftovers\n- Recover",
      message: "Only one pokemon may hold Leftovers (Item Clause).",
    },
  ];

  for (const { rule, settings, team, message } of rules) {
    test(`lists ${rule}`, async ({ page }) => {
      await openTeam(page, settings, team);
      await expect(problems(page)).toContainText("Team problems (1)");
      await expect(problems(page).getByRole("listitem")).toHaveText([message]);
    });
  }

  test("lists every problem, each once", async ({ page }) => {
    await openTeam(
      page,
      "game=champions",
      "Garganacl\n- Salt Cure\n- Salt Cure\n\nGarganacl\n- Salt Cure\n- Salt Cure",
    );
    await expect(problems(page)).toContainText("Team problems (2)");
    await expect(problems(page).getByRole("listitem")).toHaveText([
      "Garganacl has Salt Cure twice.",
      "Only one pokemon may be Garganacl (Species Clause).",
    ]);
  });

  test("says when the team breaks no rule, naming the game and format", async ({
    page,
  }) => {
    // The games allow two of a species, and earlier games the Griseous Orb
    await openTeam(page, "gen=9", "Hatterene\n- Psychic\n\nHatterene");
    await expect(problems(page)).toHaveText("No problems found for Gen 9.");
    await openTeam(page, "gen=4", "Giratina-Origin @ Griseous Orb");
    await expect(problems(page)).toHaveText("No problems found for Gen 4.");
    await openTeam(page, "game=champions", "Corviknight @ Leftovers");
    await expect(problems(page)).toHaveText(
      "No problems found for Gen 9 Pokemon Champions (M-C).",
    );
    await openTeam(page, "gen=6-9", "Gengar\nAbility: Levitate");
    await expect(problems(page)).toHaveText(
      "No problems found for Generations 6–9.",
    );
  });

  test("shows nothing for an empty team", async ({ page }) => {
    await expect(
      page.getByRole("region", { name: "Team Defence" }),
    ).toBeVisible();
    await expect(problems(page)).toHaveCount(0);
  });

  test.describe("in Japanese", () => {
    test.use({ locale: "ja-JP" });

    test("lists the problems in the site's language", async ({ page }) => {
      await openTeam(
        page,
        "game=champions",
        "Annihilape\n- Rage Fist\n\nAnnihilape\n- Bulk Up",
      );
      const card = page.getByRole("status", {
        name: ja.validation.teamProblems,
      });
      await expect(card).toContainText(ja.validation.problemCount(1));
      await expect(card.getByRole("listitem")).toHaveText([
        ja.validation.speciesClause("コノヨザル"),
      ]);
    });
  });
});
