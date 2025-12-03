import { test, expect } from "fixtures";

// Test configuration based on ui-main-tests.md requirements for Pokemon Card Unit Tests

test.describe("Pokemon Card - Unit Tests", () => {
  // Helper to ensure card is visible (handles responsive tabs)
  const ensureCardVisible = async (page, index) => {
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
      for (let moveNum = 1; moveNum <= 4; moveNum++) {
        const moveField = page.getByRole("combobox", {
          name: `Pokemon ${i + 1}'s move${moveNum}`,
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
      const questionMark = card.getByAltText("question-mark");
      await expect(questionMark).toBeVisible();
    }
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
        page.getByText("Nothing found (Or you haven't selected a Pokemon)")
      ).toBeVisible();
    }
  });
});
