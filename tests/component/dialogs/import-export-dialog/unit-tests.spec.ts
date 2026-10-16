import { test, expect } from "fixtures";
import { openImportExport } from "helper";

test.describe("Import/Export Dialog - Unit Tests", () => {
  test("opens from the More menu and closes with Cancel or Escape", async ({
    page,
  }) => {
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    for (const close of ["Cancel", "Escape"]) {
      await openImportExport(page);
      await expect(dialog.getByRole("textbox")).toBeVisible();
      if (close === "Cancel")
        await dialog
          .getByRole("button", { name: "Cancel", exact: true })
          .click();
      else await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
    }
  });

  test("cannot import while the learnsets fail to load", async ({ page }) => {
    // The learnsets load after the app (a JSON module in dev, a hashed chunk in the build),
    // and parsing a team depends on them
    await page.route(
      url => /learnsets(\.json|-[\w-]+\.js)$/.test(url.pathname),
      route => route.abort(),
    );
    await page.reload();

    await expect(
      page
        .getByRole("alert")
        .getByText(
          "The move lists could not be loaded. Reload the page to try again.",
        ),
    ).toBeVisible();

    await openImportExport(page);
    await expect(page.getByRole("button", { name: "Update" })).toBeDisabled();
  });
});
