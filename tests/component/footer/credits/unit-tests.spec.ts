import { test, expect } from "fixtures";

test.describe("Credits - Unit Tests", () => {
  test("should open the Credits dialog with its links", async ({ page }) => {
    await page.getByRole("button", { name: "Credits" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Credits");
    await expect(
      dialog.getByRole("link", { name: "Pokemon Showdown" }),
    ).toHaveAttribute("href", "https://pokemonshowdown.com");
    await expect(dialog.getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "https://react.dev/",
    );
  });
});
