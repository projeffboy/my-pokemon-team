import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";

interface VerifyPokemonPropertyOptions {
  property?: string;
  teamIndex?: number;
}

test.describe("Save/Load Team: Import/Export Team - Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Go to the "Save/Load Team" tab
    await page.getByRole("tab", { name: /Save\/Load/ }).click();

    // wait is necessary in short due to the tab transition animation
    await page.waitForTimeout(500); // TODO: turn wait time into a constant

    // Press the "Import/Export Team" button
    await page.getByRole("button", { name: "Import/Export Team" }).click();
  });

  const importTeam = async (page: Page, text: string) => {
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

  const verifyPokemonProperty = async (
    page: Page,
    value: string,
    optionalParams: VerifyPokemonPropertyOptions = {}
  ) => {
    const { property = "name", teamIndex = 0 } = optionalParams;

    // The autocomplete input (role "combobox") displays the selected value
    const combobox = page.getByRole("combobox", {
      name: `Pokemon ${teamIndex + 1}'s ${property}`,
    });
    await expect(combobox).toHaveValue(value);

    if (property === "name") {
      // Verify the sprite is updated (it shouldn't be a question mark)
      // The sprite alt text usually matches the pokemon name
      const pokemonCard = page.getByRole("region", {
        name: `Pokemon ${teamIndex + 1}`,
      });
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
      ["Life Orb", "item"],
      ["Chlorophyll", "ability"],
      ["Solar Beam", "move1"],
      ["Sludge Bomb", "move2"],
      ["Sleep Powder", "move3"],
      ["Sunny Day", "move4"],
    ];

    await verifyPokemonProperty(page, "Weepinbell");
    for (const [value, property] of expectedValues) {
      await verifyPokemonProperty(page, value, { property });
    }
  });
});
