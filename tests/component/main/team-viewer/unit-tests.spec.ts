import { test, expect } from "fixtures";
import {
  createViewport,
  SMALL_VIEWPORT_WIDTH,
  MEDIUM_VIEWPORT_WIDTH,
  LARGE_VIEWPORT_WIDTH,
  selectPokemon,
} from "helper";

// Test configuration based on ui-main-tests.md requirements for Team Viewer Unit Tests

test.describe("Team Viewer - Unit Tests", () => {
  test.describe("Small viewport", () => {
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
      await expect(
        panel.getByRole("region", { name: "Pokemon 4" }),
      ).toBeVisible();
    });
  });

  test.describe("Medium viewport", () => {
    test.use({ viewport: createViewport(MEDIUM_VIEWPORT_WIDTH) });

    test("should display 3 team viewer slots with question mark sprites (pairs)", async ({
      page,
    }) => {
      // Get the team viewer tabs container
      const teamViewerTabs = page.getByRole("tablist", {
        name: "Pokemon team slots",
      });
      await expect(teamViewerTabs).toBeVisible();

      // Verify all 3 slot pairs exist with question mark sprites
      const slotPairs = [
        "Pokemon 1 (empty) and Pokemon 2 (empty)",
        "Pokemon 3 (empty) and Pokemon 4 (empty)",
        "Pokemon 5 (empty) and Pokemon 6 (empty)",
      ];

      for (const name of slotPairs) {
        const slot = page.getByRole("tab", { name });
        await expect(slot).toBeVisible();

        // Each slot pair should have 2 question mark images
        const questionMarkImgs = slot.locator('img[alt="question-mark"]');
        await expect(questionMarkImgs).toHaveCount(2);
      }
    });

    test("should have the first team viewer slot pair selected by default", async ({
      page,
    }) => {
      // The first slot pair (1-2) should have the selected attribute
      const firstSlotPair = page.getByRole("tab", {
        name: "Pokemon 1 (empty) and Pokemon 2 (empty)",
      });
      await expect(firstSlotPair).toHaveAttribute("aria-selected", "true");

      // Verify other slot pairs are not selected
      const otherSlotPairs = [
        "Pokemon 3 (empty) and Pokemon 4 (empty)",
        "Pokemon 5 (empty) and Pokemon 6 (empty)",
      ];

      for (const pattern of otherSlotPairs) {
        const slot = page.getByRole("tab", { name: pattern });
        await expect(slot).toHaveAttribute("aria-selected", "false");
      }
    });

    test("should display both Pokemon in the selected slot pair", async ({
      page,
    }) => {
      const finalSlotPair = page.getByRole("tab", {
        name: "Pokemon 5 (empty) and Pokemon 6 (empty)",
      });

      await finalSlotPair.click();

      await expect(finalSlotPair).toHaveAttribute("aria-selected", "true");
      const panel = page.getByRole("tabpanel", {
        name: "Pokemon 5 (empty) and Pokemon 6 (empty)",
      });
      await expect(
        panel.getByRole("region", { name: "Pokemon 5" }),
      ).toBeVisible();
      await expect(
        panel.getByRole("region", { name: "Pokemon 6" }),
      ).toBeVisible();
    });
  });

  test.describe("Large viewport", () => {
    test.use({ viewport: createViewport(LARGE_VIEWPORT_WIDTH) });

    test("should not display team viewer", async ({ page }) => {
      // In large viewport, there should be no team viewer tabs
      // Check that no team viewer slots exist (tabs with question mark sprites)
      await expect(
        page.getByRole("tablist", { name: "Pokemon team slots" }),
      ).toHaveCount(0);
    });
  });
});
