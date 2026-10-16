import { test, expect } from "fixtures";
import { expectToOpenInNewTab, openImportExport } from "helper";
import type { Page } from "@playwright/test";

const LINK = "https://pokepast.es/0123456789abcdef";

test.describe("Import/Export Form - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    await openImportExport(page);
  });

  const getDialog = (page: Page) =>
    page.getByRole("dialog", { name: "Import/Export" });

  test("says the set details are kept only when the selected game has them", async ({
    page,
  }) => {
    await expect(getDialog(page)).toContainText(
      "Nicknames, levels, genders, shiny, happiness, tera types, natures, EVs, and IVs are kept when the selected game has them.",
    );
  });

  test("describes the text and offers Copy, Upload to PokePaste, Cancel, and Update", async ({
    page,
  }) => {
    const dialog = getDialog(page);
    await expect(dialog).toContainText(
      "This is your team's text. Copy it to share it, or change it here and press Update. You can also paste a team from Pokemon Showdown or a pokepast.es link.",
    );
    const showdown = dialog.getByRole("link", { name: "Pokemon Showdown" });
    await expect(showdown).toHaveAttribute(
      "href",
      "https://play.pokemonshowdown.com/teambuilder",
    );
    await expectToOpenInNewTab(showdown);
    await expect(
      dialog.getByRole("textbox", { name: "Pokemon Showdown Team Raw Text" }),
    ).toBeVisible();
    for (const name of ["Copy", "Upload to PokePaste", "Cancel", "Update"])
      await expect(
        dialog.getByRole("button", { name, exact: true }),
      ).toBeVisible();
    for (const name of ["Download", "Add teams"])
      await expect(
        dialog.getByRole("button", { name, exact: true }),
      ).toHaveCount(0);
  });

  test("an empty team has an empty box with a hint, and Copy and Upload to PokePaste wait for text", async ({
    page,
  }) => {
    const dialog = getDialog(page);
    const box = dialog.getByRole("textbox");
    const copy = dialog.getByRole("button", { name: "Copy", exact: true });
    const upload = dialog.getByRole("button", {
      name: "Upload to PokePaste",
      exact: true,
    });
    await expect(box).toHaveValue("");
    await expect(box).toHaveAttribute(
      "placeholder",
      "Paste a team or a pokepast.es link here",
    );
    await expect(copy).toBeDisabled();
    await expect(upload).toBeDisabled();

    await box.fill(" \n\n ");
    await expect(copy).toBeDisabled();
    await expect(upload).toBeDisabled();

    await box.fill("Vigoroth");
    await expect(copy).toBeEnabled();
    await expect(upload).toBeEnabled();

    await box.fill("");
    await expect(copy).toBeDisabled();
    await expect(upload).toBeDisabled();
  });

  test("Upload to PokePaste is off for a box holding a pokepast.es link", async ({
    page,
  }) => {
    const dialog = getDialog(page);
    const box = dialog.getByRole("textbox");
    const copy = dialog.getByRole("button", { name: "Copy", exact: true });
    const upload = dialog.getByRole("button", {
      name: "Upload to PokePaste",
      exact: true,
    });
    for (const link of [
      LINK,
      `  http://www.pokepast.es/0123456789abcdef/raw?x \n`,
    ]) {
      await box.fill(link);
      await expect(copy).toBeEnabled();
      await expect(upload).toBeDisabled();
    }

    await box.fill(`Vigoroth\n${LINK}`);
    await expect(upload).toBeDisabled();
    await box.fill("Vigoroth");
    await expect(upload).toBeEnabled();
  });

  test("lists problems in the text but not for a pokepast.es link", async ({
    page,
  }) => {
    const dialog = getDialog(page);
    const box = dialog.getByRole("textbox");
    await box.fill("Vigoroth\n- Hyper Voic");
    await expect(dialog.getByRole("status")).toContainText(
      "Vigoroth, Move 1: “Hyper Voic”",
    );

    await box.fill(LINK);
    await expect(dialog.getByRole("status")).toHaveCount(0);
    await expect(
      dialog.getByRole("button", { name: "Update", exact: true }),
    ).toBeEnabled();
  });
});
