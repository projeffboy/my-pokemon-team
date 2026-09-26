import { test, expect } from "fixtures";
import {
  clickMenuItem,
  closeDialog,
  getTeamTextFromUrl,
  openEditPokepaste,
  openFilters,
  openManageTeamMenu,
  selectAbility,
  selectDialogOption,
  selectMove,
  selectPokemon,
} from "helper";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Page } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ouTeamText = fs.readFileSync(
  path.join(__dirname, "sample-teams/ou-team.txt"),
  "utf8",
);

const doBasicCheck = async (page: Page) => {
  await expect(
    page.getByRole("region", { name: "Team Defence" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Team Type Coverage" }),
  ).toBeVisible();

  for (const type of ["Fire", "Water", "Grass"]) {
    await page
      .getByRole("region", { name: "Team Defence" })
      .getByLabel(type, { exact: true })
      .hover();
    await expect(
      page.getByRole("tooltip", { name: `${type} does...` }),
    ).toBeVisible();
  }

  await expect(page.getByText("Hazard", { exact: true })).toBeVisible();
};

const updatePokepaste = async (page: Page, text: string) => {
  await page.getByRole("textbox").fill(text);
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
};

test.describe("Importing an OU team", () => {
  test("should import and modify OU team correctly", async ({
    page,
    browserName,
    context,
  }, testInfo) => {
    test.skip(
      !["Desktop Safari"].includes(testInfo.project.name),
      "This test only runs on medium viewport (desktop Safari)",
    );

    test.setTimeout(60000);

    if (browserName === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }

    // Ensure page is loaded
    await expect(
      page.getByRole("heading", { name: "My Pokemon Team" }),
    ).toBeVisible();

    // 1. Import team
    await openEditPokepaste(page);
    await updatePokepaste(page, ouTeamText);

    // 2. Basic check
    await doBasicCheck(page);

    // The URL's `team` parameter should reflect the imported team
    await expect(page).toHaveURL(/[?&]team=/);
    expect(getTeamTextFromUrl(page)).toContain("Garchomp");

    // 3. Delete Garchomp (Slot 3)
    // Navigate to Pokemon 3-4 tab
    // (matched by visible text, not accessible name, since the tab's
    // aria-label contains the Pokemon names instead of "3 - 4")
    await page.getByRole("tab").filter({ hasText: "3 - 4" }).click();
    await page.getByLabel("Pokemon 3's name").fill("");
    await page.getByLabel("Pokemon 3's name").press("Tab"); // Trigger change

    // 4. Basic check
    await doBasicCheck(page);

    // The URL should no longer mention the deleted Garchomp
    await expect.poll(() => getTeamTextFromUrl(page)).not.toContain("Garchomp");

    // 5. Set filter to OU
    await openFilters(page);
    await selectDialogOption(page, "Format", "OU: Over Used");
    await closeDialog(page);

    // 6. Add Ogerpon-Wellspring manually (Slot 3)
    // Ensure we are on tab 3-4
    await page.getByRole("tab").filter({ hasText: "3 - 4" }).click();
    await selectPokemon(page, "Ogerpon-Wellspring", 2);
    await expect(page.getByLabel("Pokemon 3's item")).toHaveValue(
      "Wellspring Mask",
    ); // auto-selected
    await selectAbility(page, "Water Absorb", 2);
    await selectMove(page, "Ivy Cudgel", 1, 2);
    await selectMove(page, "U-turn", 2, 2);
    await selectMove(page, "Knock Off", 3, 2);
    await selectMove(page, "Spikes", 4, 2);

    // 7. Basic check
    await doBasicCheck(page);

    // 8. Copy the team's text and check
    await openManageTeamMenu(page);
    await clickMenuItem(page, "Copy text");
    await expect(page.getByRole("alert")).toHaveText("Team copied.");

    if (browserName === "chromium") {
      const clipboardText = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboardText).toContain("Iron Moth");
      expect(clipboardText).toContain("Discharge");
      expect(clipboardText).toContain("Glimmora");
      expect(clipboardText).toContain("Focus Sash");
      expect(clipboardText).toContain("Dragonite");
      expect(clipboardText).toContain("Multiscale");
    }

    // 9. Edit the team's text
    await openEditPokepaste(page);

    let currentTeamText = await page.getByRole("textbox").inputValue();

    currentTeamText = currentTeamText.replace("Thunder Wave", "Toxic");
    currentTeamText = currentTeamText.replace("Psyshock", "Focus Blast");

    await updatePokepaste(page, currentTeamText);

    // 10. Basic check
    await doBasicCheck(page);

    // The URL should reflect all the modifications made throughout the test
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Toxic");
    const finalTeamText = getTeamTextFromUrl(page);
    expect(finalTeamText).toContain("Ogerpon-Wellspring");
    expect(finalTeamText).toContain("Focus Blast");
    expect(finalTeamText).not.toContain("Garchomp");
    expect(finalTeamText).not.toContain("Thunder Wave");
    expect(finalTeamText).not.toContain("Psyshock");
  });
});
