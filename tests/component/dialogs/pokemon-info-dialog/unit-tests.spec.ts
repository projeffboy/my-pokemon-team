import { test, expect } from "fixtures";
import { selectPokemon } from "helper";

test.describe("Pokemon Info Dialog - Unit Tests", () => {
  test("shows the species' types, abilities, base stats, and weaknesses", async ({
    page,
  }) => {
    await selectPokemon(page, "Bronzong");
    await page.getByRole("button", { name: "About Bronzong" }).click();
    const dialog = page.getByRole("dialog", { name: "Bronzong" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("#437 · Gen 4");
    await expect(dialog).toContainText("Levitate, Heatproof, Heavy Metal");
    await expect(dialog.getByLabel("Defense: 116")).toBeVisible();
    await expect(dialog).toContainText("Total 500");
    await expect(
      dialog.getByRole("link", { name: "Smogon dex" }),
    ).toHaveAttribute(
      "href",
      "https://www.smogon.com/dex/sv/pokemon/bronzong/",
    );

    // Weak to Fire and Ground, unless it has Levitate
    const weakTo = dialog
      .getByRole("heading", { name: "Weak to" })
      .locator("..");
    await expect(weakTo).toContainText("Fire");
    await expect(weakTo).toContainText("Ground");
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();

    await page.getByLabel("Pokemon 1's ability").click();
    await page.getByRole("option", { name: "Levitate" }).click();
    await page.getByRole("button", { name: "About Bronzong" }).click();
    await expect(weakTo).toContainText("Fire");
    await expect(weakTo).not.toContainText("Ground");
  });
});
