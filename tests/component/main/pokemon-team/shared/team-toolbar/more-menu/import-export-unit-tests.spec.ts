import { test, expect } from "fixtures";
import { clickMenuItem, openMoreMenu, selectPokemon } from "helper";

test.describe("More menu: Import/Export - Unit Tests", () => {
  test("lists Import/Export and Delete, without the actions they replaced", async ({
    page,
  }) => {
    await openMoreMenu(page);
    const items = page.getByRole("menu").getByRole("menuitem");

    await expect(items).toHaveText(["Import/Export", "Delete"]);
    for (const removed of ["Copy text", "Edit Pokepaste", "Import Team"])
      await expect(items.filter({ hasText: removed })).toHaveCount(0);
  });

  test("Import/Export opens the dialog with the team's text, and closing it returns focus to More", async ({
    page,
  }) => {
    await selectPokemon(page, "Ambipom");
    await openMoreMenu(page);
    await clickMenuItem(page, "Import/Export");

    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("textbox", { name: "Pokemon Showdown Team Raw Text" }),
    ).toHaveValue(/^Ambipom/);

    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(
      page.getByRole("button", { name: "More", exact: true }),
    ).toBeFocused();
  });

  test("Escape closes the dialog and returns focus to More", async ({
    page,
  }) => {
    await openMoreMenu(page);
    await clickMenuItem(page, "Import/Export");
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(
      page.getByRole("button", { name: "More", exact: true }),
    ).toBeFocused();
  });
});
