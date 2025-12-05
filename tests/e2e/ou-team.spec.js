import { test, expect } from "../fixtures";
import {
  createViewport,
  MEDIUM_VIEWPORT_WIDTH,
  selectPokemon,
  selectAbility,
  selectItem,
  selectMove,
} from "../helper";
import fs from "fs";
import path from "path";

const ouTeamText = fs.readFileSync(
  path.join(__dirname, "sample-teams/ou-team.txt"),
  "utf8"
);

const doBasicCheck = async page => {
  await expect(
    page.getByRole("region", { name: "Team Defence Card" })
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Team Type Coverage Card" })
  ).toBeVisible();

  const types = ["Fire", "Water", "Grass"];
  const typeMap = { Fire: "FIR", Water: "WTR", Grass: "GRS" };
  for (const type of types) {
    const abbr = typeMap[type];
    const typeElement = page
      .getByRole("region", { name: "Team Defence Card" })
      .getByText(abbr, { exact: false });
    await typeElement.first().hover();
    await page.waitForTimeout(500);
  }

  await page.getByText("Checklist", { exact: true }).click();
  await expect(page.getByText("Hazard", { exact: true })).toBeVisible();
};

test.describe("Importing an OU team", () => {
  test.use({ viewport: createViewport(MEDIUM_VIEWPORT_WIDTH) });

  test("should import and modify OU team correctly", async ({
    page,
    browserName,
    context,
  }) => {
    test.setTimeout(60000);

    if (browserName === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }

    // Ensure page is loaded
    await expect(
      page.getByRole("heading", { name: "My Pokemon Team" })
    ).toBeVisible();

    // 1. Import team
    await page.getByText("Save/Load", { exact: true }).click();
    await page.getByRole("button", { name: "Import/Export Team" }).click();

    await page.getByRole("textbox").fill(ouTeamText);
    await page.getByRole("button", { name: "Update" }).click();

    // 2. Basic check
    await doBasicCheck(page);

    // 3. Delete Garchomp (Slot 3)
    // Navigate to Pokemon 3-4 tab
    await page.getByRole("tab", { name: /3 - 4/ }).click();
    await page.getByLabel("Pokemon 3's name").fill("");
    await page.getByLabel("Pokemon 3's name").press("Tab"); // Trigger change

    // 4. Basic check
    await doBasicCheck(page);

    // 5. Set filter to OU
    await page.getByText("Filters", { exact: true }).click();
    await page
      .getByText("Format", { exact: true })
      .locator("..")
      .getByRole("button")
      .click();
    await page.getByRole("option", { name: "OU: Over Used" }).click();

    // 6. Add Ogerpon-Wellspring manually (Slot 3)
    // Ensure we are on tab 3-4
    await page.getByRole("tab", { name: /3 - 4/ }).click();
    await selectPokemon(page, "Ogerpon-Wellspring", 2);
    await selectItem(page, "Wellspring Mask", 2);
    await selectAbility(page, "Water Absorb", 2);
    await selectMove(page, "Ivy Cudgel", 1, 2);
    await selectMove(page, "U-turn", 2, 2);
    await selectMove(page, "Knock Off", 3, 2);
    await selectMove(page, "Spikes", 4, 2);

    // 7. Basic check
    await doBasicCheck(page);

    // 8. Press "Copy Team" and check
    // Navigate to Save/Load tab where Copy Team button is located
    await page.getByText("Save/Load", { exact: true }).click();
    await page.getByRole("button", { name: "Copy Team" }).click();

    if (browserName === "chromium") {
      await page.waitForTimeout(500);
      const clipboardText = await page.evaluate(() =>
        navigator.clipboard.readText()
      );
      expect(clipboardText).toContain("Iron Moth");
      expect(clipboardText).toContain("Discharge");
      expect(clipboardText).toContain("Glimmora");
      expect(clipboardText).toContain("Focus Sash");
      expect(clipboardText).toContain("Dragonite");
      expect(clipboardText).toContain("Multiscale");
    }

    // 9. Import/Export modifications
    // Already on Save/Load tab
    await page.getByRole("button", { name: "Import/Export Team" }).click();

    let currentTeamText = await page.getByRole("textbox").inputValue();

    currentTeamText = currentTeamText.replace("Thunder Wave", "Toxic");
    currentTeamText = currentTeamText.replace("Psyshock", "Focus Blast");

    await page.getByRole("textbox").fill(currentTeamText);
    await page.getByRole("button", { name: "Update" }).click();

    // 10. Basic check
    await doBasicCheck(page);
  });
});
