import { test, expect } from "fixtures";
import {
  getTeamTextFromUrl,
  openAdvanced,
  selectDialogOption,
  selectPokemon,
} from "helper";

test.describe("Advanced Dialog - Integration Tests", () => {
  test("set details reach the share link and can be reset", async ({
    page,
  }) => {
    await selectPokemon(page, "Mudsdale");
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "Advanced" });
    await expect(dialog).toContainText("Mudsdale, slot 1");

    await dialog.getByLabel("Nickname").fill("Clyde");
    await dialog.getByLabel("Level").fill("50");
    await selectDialogOption(page, "Gender", "Female");
    await selectDialogOption(page, "Tera Type", "Steel");
    await selectDialogOption(page, "Nature", "Adamant (+Atk, -SpA)");
    await dialog.getByLabel("Shiny").check();
    await dialog.getByLabel("Atk EVs").focus();
    await page.keyboard.press("End");
    await dialog.getByLabel("SpA IVs").fill("0");
    await expect(dialog.getByLabel(/^EV total/)).toContainText("252 / 510");
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toBeHidden();

    await expect
      .poll(() => getTeamTextFromUrl(page))
      .toContain("Adamant Nature");
    const text = getTeamTextFromUrl(page);
    expect(text).toContain("Clyde (Mudsdale) (F) @ ");
    expect(text).toContain("Level: 50");
    expect(text).toContain("Shiny: Yes");
    expect(text).toContain("Tera Type: Steel");
    expect(text).toContain("EVs: 252 Atk");
    expect(text).toContain("IVs: 0 SpA");

    await openAdvanced(page);
    await dialog.getByRole("button", { name: "Reset" }).click();
    await expect(dialog.getByLabel("Nickname")).toHaveValue("");
    await expect(dialog.getByLabel("Level")).toHaveValue("100");
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect
      .poll(() => getTeamTextFromUrl(page))
      .not.toContain("Level: 50");
  });
});
