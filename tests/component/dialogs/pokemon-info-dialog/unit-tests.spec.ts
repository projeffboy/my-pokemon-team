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
    for (const width of [320, 400, 960]) {
      await page.setViewportSize({ width, height: 640 });
      const metadata = dialog.getByText("#437 · Gen 4", { exact: true });
      await expect
        .poll(() =>
          metadata.evaluate(element => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const text = range.getBoundingClientRect();
            const bounds = element.getBoundingClientRect();
            return (
              text.height <=
                parseFloat(getComputedStyle(element).lineHeight) + 1 &&
              text.right <= bounds.right + 1
            );
          }),
        )
        .toBe(true);
      await expect
        .poll(() =>
          dialog
            .locator(".MuiDialogContent-root")
            .evaluate(element => element.scrollWidth - element.clientWidth),
        )
        .toBe(0);
    }
    await expect(dialog).toContainText("Levitate, Heatproof, Heavy Metal");
    await expect(dialog.getByLabel("Defense: 116")).toBeVisible();
    await expect(dialog).toContainText("Total 500");
    const links = {
      "Smogon dex": "https://www.smogon.com/dex/sv/pokemon/bronzong/",
      Bulbapedia:
        "https://bulbapedia.bulbagarden.net/wiki/Bronzong_(Pok%C3%A9mon)",
      Serebii: "https://www.serebii.net/pokemon/bronzong/",
      "Showdown dex": "https://dex.pokemonshowdown.com/pokemon/bronzong",
    };
    for (const [name, href] of Object.entries(links)) {
      await expect(dialog.getByRole("link", { name })).toHaveAttribute(
        "href",
        href,
      );
    }

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
