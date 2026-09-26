import { test, expect } from "fixtures";
import {
  getTeamTextFromUrl,
  openEditPokepaste,
  openManageTeamMenu,
  clickMenuItem,
} from "helper";
import type { Page } from "@playwright/test";

interface VerifyPokemonPropertyOptions {
  property?: string;
  teamIndex?: number;
}

test.describe("Import Team Dialog - Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await openEditPokepaste(page);
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
    optionalParams: VerifyPokemonPropertyOptions = {},
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

    // The URL's `team` parameter should stay in sync with the store
    await expect(page).toHaveURL(/[?&]team=/);
    expect(getTeamTextFromUrl(page)).toContain("Gigalith");
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

    // The URL's `team` parameter should decode back to the imported team
    await expect(page).toHaveURL(/[?&]team=/);
    const teamText = getTeamTextFromUrl(page);
    expect(teamText).toContain("Weepinbell @ Life Orb");
    expect(teamText).toContain("Ability: Chlorophyll");
    for (const move of [
      "Solar Beam",
      "Sludge Bomb",
      "Sleep Powder",
      "Sunny Day",
    ]) {
      expect(teamText).toContain(`- ${move}`);
    }
  });

  test("Import team adds the pasted teams as new teams", async ({ page }) => {
    await page.getByRole("button", { name: "Cancel" }).click();
    await openManageTeamMenu(page);
    await clickMenuItem(page, "Import team");
    const dialog = page.getByRole("dialog", { name: "Import Team" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Import" })).toBeDisabled();

    await dialog.getByRole("textbox").fill(`=== [gen8uu] Sun ===

Torkoal @ Heat Rock
Ability: Drought
- Eruption

=== [gen9doublesou] Rain ===

Pelipper @ Damp Rock
Ability: Drizzle
- Hurricane
`);
    await dialog.getByRole("button", { name: "Import" }).click();
    await expect(page.getByRole("alert")).toContainText("2 teams imported");
    await verifyPokemonProperty(page, "Pelipper");
    await expect(page.getByLabel("Generation")).toContainText("Gen 9");

    await openManageTeamMenu(page);
    await clickMenuItem(page, "Name and Format");
    await expect(page.getByLabel("Team name")).toHaveValue("Rain");
    await expect(page.getByRole("combobox", { name: "Format" })).toContainText(
      "Doubles OU",
    );
  });
});
