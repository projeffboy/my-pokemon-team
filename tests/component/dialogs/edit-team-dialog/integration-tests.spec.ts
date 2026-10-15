import { test, expect } from "fixtures";
import {
  clickMenuItem,
  getTeamTextFromUrl,
  openEditPokepaste,
  selectPokemon,
} from "helper";
import type { Page } from "@playwright/test";

interface VerifyPokemonPropertyOptions {
  property?: string;
  teamIndex?: number;
}

test.describe("Edit Team Dialog - Integration Tests", () => {
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

  test("invalid replacement text preserves the team until a valid update or intentional clear", async ({
    page,
  }) => {
    await importTeam(page, "Maractus\n- Energy Ball");
    const before = getTeamTextFromUrl(page);
    await openEditPokepaste(page);
    const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
    const text = dialog.getByRole("textbox");
    await text.fill("This is not a Pokémon set");
    await dialog.getByRole("button", { name: "Update", exact: true }).click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("No pokemon found in that text.");
    expect(getTeamTextFromUrl(page)).toBe(before);

    await text.fill("Maractus\n- Giga Drain");
    await expect(
      dialog.getByText("No pokemon found in that text."),
    ).toHaveCount(0);
    await dialog.getByRole("button", { name: "Update", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Giga Drain");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mypokemonteam")))
      .toContain("gigadrain");
    await page.reload();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Maractus");

    await openEditPokepaste(page);
    await text.fill("   ");
    await dialog.getByRole("button", { name: "Update", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
  });

  test("updating unchanged text preserves edits made in another tab", async ({
    page,
    context,
  }) => {
    await importTeam(page, "Magcargo");
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem("mypokemonteam") ?? ""),
      )
      .toContain("magcargo");
    const otherTab = await context.newPage();
    await otherTab.goto(page.url());
    await expect(otherTab.getByLabel("Pokemon 1's name")).toHaveValue(
      "Magcargo",
    );

    await openEditPokepaste(page);
    const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
    const text = dialog.getByRole("textbox");
    await expect(text).toHaveValue(/Magcargo/);
    await selectPokemon(otherTab, "Froslass");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Froslass");
    await expect(text).toHaveValue(/Magcargo/);
    await dialog.getByRole("button", { name: "Update", exact: true }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Froslass");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Froslass");
    await otherTab.close();
  });

  test("deleting the edited team in another tab cannot overwrite the remaining team", async ({
    page,
    context,
  }) => {
    await importTeam(page, "Houndoom");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mypokemonteam")))
      .toContain("houndoom");
    const otherTab = await context.newPage();
    await otherTab.goto(page.url());
    await otherTab.getByRole("button", { name: "Teams", exact: true }).click();
    await otherTab
      .getByRole("button", { name: "New Team", exact: true })
      .click();
    // The slot inputs are tapped by force, so the closing dialog must be out of the way
    await expect(otherTab.getByRole("dialog")).toBeHidden();
    await selectPokemon(otherTab, "Haxorus");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Houndoom");

    await openEditPokepaste(page);
    const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
    await dialog.getByRole("textbox").fill("Alakazam");
    await otherTab.getByRole("button", { name: "Teams", exact: true }).click();
    await otherTab
      .getByRole("button", { name: "Options for Team 1", exact: true })
      .click();
    await clickMenuItem(otherTab, "Delete");
    await otherTab
      .getByRole("dialog", { name: "Delete Team 1?" })
      .getByRole("button", { name: "Delete", exact: true })
      .click();
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Haxorus");
    if (await dialog.isVisible())
      await dialog.getByRole("button", { name: "Update", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Haxorus");
    await openEditPokepaste(page);
    await expect(dialog.getByRole("textbox")).toHaveValue(/Haxorus/);
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await otherTab.close();
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
});
