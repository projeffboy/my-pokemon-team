import { test, expect } from "fixtures";
import {
  createViewport,
  SMALL_VIEWPORT_WIDTH,
  MEDIUM_VIEWPORT_WIDTH,
  LARGE_VIEWPORT_WIDTH,
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
        .getByRole("tablist")
        .first()
        .getByAltText("question-mark");
      await expect(questionMarkSprites).toHaveCount(6);
    });

    test("should have the first team viewer slot selected by default", async ({
      page,
    }) => {
      // The first slot should have the selected attribute
      const firstSlot = page.getByRole("tab", { name: /question-mark 1/ });
      await expect(firstSlot).toHaveAttribute("aria-selected", "true");

      // Verify other slots are not selected
      for (let i = 2; i <= 6; i++) {
        const slot = page.getByRole("tab", {
          name: new RegExp(`question-mark ${i}`),
        });
        await expect(slot).toHaveAttribute("aria-selected", "false");
      }
    });
  });

  test.describe("Medium viewport", () => {
    test.use({ viewport: createViewport(MEDIUM_VIEWPORT_WIDTH) });

    test("should display 3 team viewer slots with question mark sprites (pairs)", async ({
      page,
    }) => {
      // Get the team viewer tabs container
      const teamViewerTabs = page.getByRole("tablist").first();
      await expect(teamViewerTabs).toBeVisible();

      // Verify all 3 slot pairs exist with question mark sprites
      const slotPairs = [
        { name: /question-mark question-mark 1 - 2/, label: "1 - 2" },
        { name: /question-mark question-mark 3 - 4/, label: "3 - 4" },
        { name: /question-mark question-mark 5 - 6/, label: "5 - 6" },
      ];

      for (const slotPair of slotPairs) {
        const slot = page.getByRole("tab", { name: slotPair.name });
        await expect(slot).toBeVisible();

        // Each slot pair should have 2 question mark images
        const questionMarkImgs = slot.getByAltText("question-mark");
        await expect(questionMarkImgs).toHaveCount(2);
      }
    });

    test("should have the first team viewer slot pair selected by default", async ({
      page,
    }) => {
      // The first slot pair (1-2) should have the selected attribute
      const firstSlotPair = page.getByRole("tab", {
        name: /question-mark question-mark 1 - 2/,
      });
      await expect(firstSlotPair).toHaveAttribute("aria-selected", "true");

      // Verify other slot pairs are not selected
      const otherSlotPairs = [
        /question-mark question-mark 3 - 4/,
        /question-mark question-mark 5 - 6/,
      ];

      for (const pattern of otherSlotPairs) {
        const slot = page.getByRole("tab", { name: pattern });
        await expect(slot).toHaveAttribute("aria-selected", "false");
      }
    });
  });

  test.describe("Large viewport", () => {
    test.use({ viewport: createViewport(LARGE_VIEWPORT_WIDTH) });

    test("should not display team viewer", async ({ page }) => {
      // In large viewport, there should be no team viewer tabs
      // Check that no team viewer slots exist (tabs with question mark sprites)
      const hasTeamViewerSlots = await page
        .getByRole("tab", { name: /question-mark/ })
        .count();
      expect(hasTeamViewerSlots).toBe(0);
    });
  });
});
