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

  const verifyPokemonProperty = async (page, property, value) => {
    const pokemonCard = page.getByRole("region", { name: "Pokemon 1" });
    const input = pokemonCard.getByRole("combobox", {
      name: `Pokemon 1's ${property}`,
    });
    await expect(input).toHaveValue(value);

    if (property === "name") {
      // Verify the sprite is updated (it shouldn't be a question mark)
      // The sprite alt text usually matches the pokemon name
      const pokemonSprite = pokemonCard.getByRole("img", { name: value });
      await expect(pokemonSprite).toBeVisible();
    }
  };

  test("Manually fill in a pokemon", async ({ page }) => {
    await importTeam(page, "Gigalith");

    await verifyPokemonProperty(page, "name", "Gigalith");
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
      { name: "Weepinbell" },
      { item: "Life Orb" },
      { ability: "Chlorophyll" },
      { move1: "Solar Beam" },
      { move2: "Sludge Bomb" },
      { move3: "Sleep Powder" },
      { move4: "Sunny Day" },
    ];

    for (const expectedValue of expectedValues) {
      const [[key, value]] = Object.entries(expectedValue);
      await verifyPokemonProperty(page, key, value);
    }
  });
});
