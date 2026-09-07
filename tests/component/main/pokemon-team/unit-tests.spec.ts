import { test, expect } from "fixtures";
import { createViewport, LARGE_VIEWPORT_WIDTH } from "helper";

test.describe("Pokemon Team - Unit Tests", () => {
  test.use({ viewport: createViewport(LARGE_VIEWPORT_WIDTH) });

  test("should not display team viewer", async ({ page }) => {
    // In large viewport, there should be no team viewer tabs
    // Check that no team viewer slots exist (tabs with question mark sprites)
    await expect(
      page.getByRole("tablist", { name: "Pokemon team slots" }),
    ).toHaveCount(0);
  });
});
