import { test, expect } from "fixtures";
import { createViewport, MEDIUM_VIEWPORT_WIDTH } from "helper";

test.describe("Sm Team Viewer - Unit Tests", () => {
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
