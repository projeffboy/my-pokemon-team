import { test, expect } from "fixtures";
import { createViewport, SMALL_VIEWPORT_WIDTH, selectPokemon } from "helper";

test.describe("Xs Team Viewer - Unit Tests", () => {
  test.use({ viewport: createViewport(SMALL_VIEWPORT_WIDTH) });

  test("should display 6 team viewer slots with question mark sprites", async ({
    page,
  }) => {
    // Verify there are exactly 6 question mark sprites in the team viewer
    const questionMarkSprites = page
      .getByRole("tablist", { name: "Pokemon team slots" })
      .locator('img[alt="question-mark"]');
    await expect(questionMarkSprites).toHaveCount(6);
  });

  test("should have the first team viewer slot selected by default", async ({
    page,
  }) => {
    // The first slot should have the selected attribute
    const firstSlot = page.getByRole("tab", { name: "Pokemon 1 (empty)" });
    await expect(firstSlot).toHaveAttribute("aria-selected", "true");

    // Verify other slots are not selected
    for (let i = 2; i <= 6; i++) {
      const slot = page.getByRole("tab", {
        name: `Pokemon ${i} (empty)`,
      });
      await expect(slot).toHaveAttribute("aria-selected", "false");
    }
  });

  test("should include the selected Pokemon name in the slot label", async ({
    page,
  }) => {
    await selectPokemon(page, "Mr. Mime-Galar");

    await expect(
      page.getByRole("tab", { name: "Pokemon 1 (Mr. Mime-Galar)" }),
    ).toBeVisible();
  });

  test("should display the selected Pokemon slot", async ({ page }) => {
    const fourthSlot = page.getByRole("tab", {
      name: "Pokemon 4 (empty)",
    });

    await fourthSlot.click();

    await expect(fourthSlot).toHaveAttribute("aria-selected", "true");
    const panel = page.getByRole("tabpanel", {
      name: "Pokemon 4 (empty)",
    });
    await expect(panel.getByRole("region", { name: "Pokemon 4" })).toBeVisible();
  });
});
