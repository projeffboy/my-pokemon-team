import { test, expect } from "fixtures";

test.describe("Save/Load Team: Import/Export Team - Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Go to the "Save/Load Team" tab
    await page.getByRole("tab", { name: /Save\/Load/ }).click();

    // wait is necessary in short due to the tab transition animation
    await page.waitForTimeout(500); // TODO: turn wait time into a constant

    // Press the "Import/Export Team" button
    await page.getByRole("button", { name: "Import/Export Team" }).click();
  });

  test("Manually fill in a pokemon", async ({ page }) => {
    // 2. In the "Pokemon Showdown Team Raw Text", type Gigalith.
    const textArea = page.getByLabel("Pokemon Showdown Team Raw Text");
    await expect(textArea).toBeVisible();
    await textArea.fill("Gigalith");

    // 3. Press "Update".
    await page.getByRole("button", { name: "Update" }).click();

    // Wait for the dialog to close
    await expect(page.getByRole("dialog")).toBeHidden();

    // Expect that Gigalith shows up in the first card as a selected pokemon.
    // The input value itself might be empty as it's a custom select, so we check the text content of the select control.
    const firstCardNameSelect = page
      .locator(".Select-control")
      .filter({ has: page.locator("#react-select-single-0-name") });
    await expect(firstCardNameSelect).toContainText("Gigalith");

    // Also verify the sprite is updated (it shouldn't be a question mark)
    // The sprite alt text usually matches the pokemon name
    // On mobile, there might be two sprites (one in the tab, one in the card), so we check the first one.
    await expect(
      page.getByRole("img", { name: "Gigalith" }).first()
    ).toBeVisible();
  });

  test("Paste in a pokemon's details", async ({ page }) => {
    const pokemonText = `Weepinbell @ Life Orb
Ability: Chlorophyll
- Solar Beam
- Sludge Bomb
- Sleep Powder
- Sunny Day`;

    // 2. In the "Pokemon Showdown Team Raw Text", type the text.
    const textArea = page.getByLabel("Pokemon Showdown Team Raw Text");
    await expect(textArea).toBeVisible();
    await textArea.fill(pokemonText);
    await expect(textArea).toHaveValue(pokemonText);

    // 3. Press "Update".
    await page.getByRole("button", { name: "Update" }).click();

    // Wait for the dialog to close
    await expect(page.getByRole("dialog")).toBeHidden();

    // Helper to check value in custom select
    const checkValue = async (id, value) => {
      const control = page
        .locator(".Select-control")
        .filter({ has: page.locator(`#${id}`) });
      await expect(control).toContainText(value);
    };

    // Verify Name
    await checkValue("react-select-single-0-name", "Weepinbell");

    // Verify Item
    await checkValue("react-select-single-0-item", "Life Orb");

    // Verify Ability
    await checkValue("react-select-single-0-ability", "Chlorophyll");

    // Verify Moves
    await checkValue("react-select-single-0-move1", "Solar Beam");
    await checkValue("react-select-single-0-move2", "Sludge Bomb");
    await checkValue("react-select-single-0-move3", "Sleep Powder");
    await checkValue("react-select-single-0-move4", "Sunny Day");
  });
});
