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

  const importTeam = async (page, text) => {
    // 2. In the "Pokemon Showdown Team Raw Text", type the text.
    const textArea = page.getByRole("textbox", {
      name: "Pokemon Showdown Team Raw Text",
    });
    await expect(textArea).toBeVisible();
    await textArea.fill(text);

    // 3. Press "Update".
    await page.getByRole("button", { name: "Update" }).click();

    // Wait for the dialog to close
    await expect(page.getByRole("dialog")).toBeHidden();
  };

  const verifyPokemonProperty = async (page, value, optionalParams) => {
    const { isNameProperty = false, teamIndex = 0 } = optionalParams || {};

    const pokemonCard = page.getByRole("region", {
      name: `Pokemon ${teamIndex + 1}`,
    });
    const option = pokemonCard.getByRole("option", { name: value });
    await expect(option).toBeVisible();

    if (isNameProperty) {
      // Verify the sprite is updated (it shouldn't be a question mark)
      // The sprite alt text usually matches the pokemon name
      const pokemonSprite = pokemonCard.getByRole("img", { name: value });
      await expect(pokemonSprite).toBeVisible();
    }
  };

  test("Manually fill in a pokemon", async ({ page }) => {
    await importTeam(page, "Gigalith");

    await verifyPokemonProperty(page, "Gigalith");
  });

  test("Paste in a pokemon's details", async ({ page }) => {
    const pokemonText = `Weepinbell @ Life Orb
Ability: Chlorophyll
- Solar Beam
- Sludge Bomb
- Sleep Powder
- Sunny Day`;
    await importTeam(page, pokemonText);

    const expectedValues = [
      "Life Orb",
      "Chlorophyll",
      "Solar Beam",
      "Sludge Bomb",
      "Sleep Powder",
      "Sunny Day",
    ];

    verifyPokemonProperty(page, "Weepinbell", { isNameProperty: true });
    for (const value of expectedValues) {
      await verifyPokemonProperty(page, value);
    }
  });
});
