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

    await selectDialogOption(page, "Format", "Uber");
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
});
