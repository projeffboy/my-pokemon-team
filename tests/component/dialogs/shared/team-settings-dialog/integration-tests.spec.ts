import { test, expect } from "fixtures";
import {
  clickMenuItem,
  openManageTeamMenu,
  selectDialogOption,
  selectPokemon,
  showSlot,
} from "helper";

test.describe("Team Settings Dialog - Integration Tests", () => {
  test("renames the team, sets its format, and checks it", async ({ page }) => {
    await selectPokemon(page, "Koraidon");
    await showSlot(page, 1);
    await selectPokemon(page, "Koraidon", 1);

    await openManageTeamMenu(page);
    await clickMenuItem(page, "Name and Format");
    const dialog = page.getByRole("dialog", { name: "Name and Format" });
    await dialog.getByLabel("Team name").fill("Ubers sun");
    await selectDialogOption(page, "Format", "OU: Over Used");

    await dialog
      .getByRole("button", { name: "Check team for Gen 9 OU: Over Used" })
      .click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Koraidon is not allowed in Gen 9 OU: Over Used.",
    );
    await expect(dialog.getByRole("alert")).toContainText("Species Clause");

    // The check was of OU
    await selectDialogOption(page, "Format", "Uber");
    await expect(dialog.getByRole("alert")).toBeHidden();
    await dialog
      .getByRole("button", { name: "Check team for Gen 9 Uber" })
      .click();
    await expect(dialog.getByRole("alert")).not.toContainText("not allowed");

    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(dialog).toBeHidden();

    await openManageTeamMenu(page);
    await clickMenuItem(page, "Name and Format");
    await expect(dialog.getByLabel("Team name")).toHaveValue("Ubers sun");
    await expect(
      dialog.getByRole("combobox", { name: "Format" }),
    ).toContainText("Uber");
  });

  test("Pokemon Champions is a Gen 9 format", async ({ page }) => {
    await openManageTeamMenu(page);
    await clickMenuItem(page, "Name and Format");
    const dialog = page.getByRole("dialog", { name: "Name and Format" });
    const generation = dialog.getByRole("combobox", { name: "Generation" });
    const format = dialog.getByRole("combobox", { name: "Format" });

    await selectDialogOption(page, "Generation", "Gen 5 (BW / B2W2)");
    await selectDialogOption(page, "Format", "Pokemon Champions (M-C)");
    await expect(generation).toContainText("Gen 9");

    await generation.click();
    await page.getByRole("option", { name: "Gen 5 (BW / B2W2)" }).click();
    await expect(format).not.toContainText("Champions");
  });
});
