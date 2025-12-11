import { test, expect } from "fixtures";
import { expectImageToBeLoaded } from "helper";

// Test configuration based on ui-tests.md requirements

test.describe("Header Tests", () => {
  test("should display header elements correctly", async ({ page }) => {
    // Test that the title is still there
    await expect(
      page.getByRole("heading", { name: "My Pokemon Team" })
    ).toBeVisible();

    // Test that the two images to its left and right are as well (and that the images are loading properly)
    const leftImage = page.getByRole("img", { name: "Landorus Face" });
    const rightImage = page.getByRole("img", { name: "Virizion Face" });

    // Verify images are loaded successfully (not broken/404)
    await expectImageToBeLoaded(leftImage);
    await expectImageToBeLoaded(rightImage);

    // Check subtitle
    await expect(
      page.getByRole("heading", {
        name: "For Generation 6 to 9 (Scarlet/Violet)",
      })
    ).toBeVisible();

    // Check email contact info
    await expect(
      page.getByText("Report Bugs to jeffery124@gmail.com")
    ).toBeVisible();
  });
});
