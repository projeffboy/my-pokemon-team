import { test, expect } from "fixtures";

test.describe("Team Checklist - Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Click on the "Team Checklist" tab
    await page.getByRole("tab", { name: /Checklist/ }).click();
  });

  const CHECKLIST_MAPPINGS = {
    "Entry Hazard": {
      medium: "Hazard",
      small: "Hazard",
    },
    "Spinner/Defogger": {
      medium: "Spinner",
      small: "Spin",
    },
    "Reliable Recovery": {
      medium: "Recovery",
      small: "Heal",
    },
    Cleric: {
      medium: "Cleric",
      small: "Cleric",
    },
    "Status Move": {
      medium: "Status",
      small: "Status",
    },
    Phazer: {
      medium: "Phazer",
      small: "Phazer",
    },
    "Boosting Move": {
      medium: "Setup",
      small: "Setup",
    },
    "Volt-turn Move": {
      medium: "Volt-turn",
      small: "Volturn",
    },
    "Choice Item": {
      medium: "Choice",
      small: "Choice",
    },
  };

  const selectPokemon = async (page, pokemonName) => {
    const control = page
      .locator(".Select-control")
      .filter({ has: page.locator("#react-select-single-0-name") });
    await control.click();

    const input = page.locator("#react-select-single-0-name");
    await input.fill(pokemonName);

    // Use listbox role to find the option
    await page
      .getByRole("listbox")
      .getByText(pokemonName, { exact: true })
      .click();
  };

  const selectMove = async (page, moveName) => {
    const control = page
      .locator(".Select-control")
      .filter({ has: page.locator("#react-select-single-0-move1") });
    await control.click();

    const input = page.locator("#react-select-single-0-move1");
    await input.fill(moveName);

    await page
      .getByRole("listbox")
      .getByText(moveName, { exact: true })
      .click();
  };

  const selectItem = async (page, itemName) => {
    const control = page
      .locator(".Select-control")
      .filter({ has: page.locator("#react-select-single-0-item") });
    await control.click();

    const input = page.locator("#react-select-single-0-item");
    await input.fill(itemName);

    await page
      .getByRole("listbox")
      .getByText(itemName, { exact: true })
      .click();
  };

  const expectChecklistItemChecked = async (page, itemName) => {
    const viewportSize = page.viewportSize();
    let targetName = itemName;

    if (viewportSize) {
      if (viewportSize.width < 960 /* TODO: replace with constant */) {
        targetName = CHECKLIST_MAPPINGS[itemName].small;
      } else if (viewportSize.width < 1280 /* TODO: replace with constant */) {
        targetName = CHECKLIST_MAPPINGS[itemName].medium;
      }
    }

    const itemText = page.getByText(targetName, { exact: true });
    const container = itemText.locator("xpath=..");
    const iconDiv = container.locator("div").first();
    const iconSvg = iconDiv.locator("svg");

    await expect(iconSvg).toBeVisible();
    // CheckCircle has style={{ color: "#16a085" }}
    // We expect it to have this style
    await expect(iconSvg).toHaveAttribute(
      "style",
      /color: #16a085|color: rgb\(22, 160, 133\)/
    );
  };

  const testCases = [
    {
      pokemon: "Garchomp",
      move: "Stealth Rock",
      item: null,
      checklistItem: "Entry Hazard",
    },
    {
      pokemon: "Corviknight",
      move: "Defog",
      item: null,
      checklistItem: "Spinner/Defogger",
    },
    {
      pokemon: "Toxapex",
      move: "Recover",
      item: null,
      checklistItem: "Reliable Recovery",
    },
    {
      pokemon: "Blissey",
      move: "Heal Bell",
      item: null,
      checklistItem: "Cleric",
    },
    {
      pokemon: "Toxapex",
      move: "Toxic",
      item: null,
      checklistItem: "Status Move",
    },
    {
      pokemon: "Skarmory",
      move: "Whirlwind",
      item: null,
      checklistItem: "Phazer",
    },
    {
      pokemon: "Dragonite",
      move: "Dragon Dance",
      item: null,
      checklistItem: "Boosting Move",
    },
    {
      pokemon: "Tapu Koko",
      move: "Volt Switch",
      item: null,
      checklistItem: "Volt-turn Move",
    },
    {
      pokemon: "Garchomp",
      move: null,
      item: "Choice Scarf",
      checklistItem: "Choice Item",
    },
  ];

  for (const { pokemon, move, item, checklistItem } of testCases) {
    test(`should check '${checklistItem}' when ${pokemon} with ${
      move || item
    } is selected`, async ({ page }) => {
      await selectPokemon(page, pokemon);
      if (move) {
        await selectMove(page, move);
      }
      if (item) {
        await selectItem(page, item);
      }
      await expectChecklistItemChecked(page, checklistItem);
    });
  }
});
