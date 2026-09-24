import { test, expect } from "fixtures";
import { selectItem, selectPokemon } from "helper";
import type { Page } from "@playwright/test";

test.describe("Pokemon Card - Unit Tests", () => {
  // Helper to ensure card is visible (handles responsive tabs)
  const ensureCardVisible = async (page: Page, index: number) => {
    // If card is already visible (large viewport width), do nothing
    const card = page.getByRole("region", { name: `Pokemon ${index + 1}` });
    if (await card.isVisible()) {
      return card;
    }

    // Try to find a tab with the number (loose match handles various tab label formats)
    const tab = page.getByRole("tab", { name: `${index + 1}`, exact: false });
    if (await tab.isVisible()) {
      await tab.click();
      await expect(card).toBeVisible();
    }

    return card;
  };

  test("should have all fields empty by default", async ({ page }) => {
    // Check name fields for cards 1, 3, and 6
    for (const i of [0, 2, 5]) {
      await ensureCardVisible(page, i);
      const nameField = page.getByRole("combobox", {
        name: `Pokemon ${i + 1}'s name`,
      });
      await expect(nameField).toHaveValue("");
    }

    // Check move fields for cards 2, 4, 5
    for (const i of [1, 3, 4]) {
      await ensureCardVisible(page, i);
      for (let moveNumber = 1; moveNumber <= 4; moveNumber++) {
        const moveField = page.getByRole("combobox", {
          name: `Pokemon ${i + 1}'s move${moveNumber}`,
        });
        await expect(moveField).toHaveValue("");
      }
    }

    // Check item fields for cards 2, 5, 6
    for (const i of [1, 4, 5]) {
      await ensureCardVisible(page, i);
      const itemField = page.getByRole("combobox", {
        name: `Pokemon ${i + 1}'s item`,
      });
      await expect(itemField).toHaveValue("");
    }

    // Check ability fields for cards 1, 3, 4
    for (const i of [0, 2, 3]) {
      await ensureCardVisible(page, i);
      const abilityField = page.getByRole("combobox", {
        name: `Pokemon ${i + 1}'s ability`,
      });
      await expect(abilityField).toHaveValue("");
    }
  });

  test("should have question mark sprite by default", async ({ page }) => {
    for (const i of [1, 2, 5]) {
      const card = await ensureCardVisible(page, i);
      const questionMark = card.getByRole("img", { name: "question-mark" });
      await expect(questionMark).toBeVisible();
    }
  });

  test("should list and select abilities for Vivillon-Garden", async ({
    page,
  }) => {
    await selectPokemon(page, "Vivillon-Garden");
    const ability = page.getByRole("combobox", { name: "Pokemon 1's ability" });
    await ability.click();
    await expect(page.getByRole("option")).toHaveText([
      "Shield Dust",
      "Compound Eyes",
      "Friend Guard",
    ]);
    await page
      .getByRole("option", { name: "Compound Eyes", exact: true })
      .click();
    await expect(ability).toHaveValue("Compound Eyes");
  });

  test("should show the selected item's icon in the item input", async ({
    page,
  }) => {
    const card = page.getByRole("region", { name: "Pokemon 1" });
    const rockyHelmetIcon = card.getByRole("img", {
      name: "Rocky Helmet icon",
    });
    const assaultVestIcon = card.getByRole("img", {
      name: "Assault Vest icon",
    });

    await selectItem(page, "Rocky Helmet");
    await expect(rockyHelmetIcon).toBeVisible();

    // Typing a different name hides the icon until an item is picked
    const input = page.getByLabel("Pokemon 1's item");
    await input.fill("Assault");
    await expect(rockyHelmetIcon).toBeHidden();

    await page.getByRole("listbox").getByText("Assault Vest").click();
    await expect(assaultVestIcon).toBeVisible();
    await expect(rockyHelmetIcon).toBeHidden();
  });

  test("should show 'Nothing found' message in moves and abilities when no pokemon is selected", async ({
    page,
  }) => {
    const fieldsToCheck = [
      { name: "Pokemon 1's move1", input: "Thunder" },
      { name: "Pokemon 1's ability", input: "Intimidate" },
    ];

    for (const { name, input } of fieldsToCheck) {
      const field = page.getByRole("combobox", { name });
      await field.fill(input);

      // Check for "Nothing found" message
      await expect(
        page.getByText("Nothing found (you haven't selected a pokemon)"),
      ).toBeVisible();
    }
  });
});
