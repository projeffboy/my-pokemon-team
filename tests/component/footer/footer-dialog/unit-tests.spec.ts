import { test, expect } from "fixtures";
import { selectPokemon } from "helper";

test.describe("Footer Dialog - Unit Tests", () => {
  test("a dialog whose content cannot load says so, and the page keeps working", async ({
    page,
  }) => {
    await page.route(/\/footer\/Credits\./, route => route.abort());
    await page.getByRole("button", { name: "Credits" }).click();

    const dialog = page.getByRole("dialog", { name: "Credits" });
    await expect(dialog.getByRole("alert")).toContainText(
      "Something went wrong",
    );
    await expect(dialog.getByRole("alert")).toContainText(
      "Teams are saved in this browser. Reload the page to try again.",
    );
    await expect(dialog.getByRole("button", { name: "Reload" })).toBeVisible();

    await dialog.getByRole("button", { name: "Go Back" }).click();
    await expect(dialog).toBeHidden();
    await selectPokemon(page, "Araquanid");
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Araquanid");
  });
});
