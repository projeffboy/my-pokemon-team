import { test, expect } from "fixtures";
import { expectImageToBeLoaded } from "helper";

// Test configuration based on component-tests.md requirements

test.describe("Header Tests", () => {
  test("should display header elements correctly", async ({ page }) => {
    // Test that the title is still there
    const title = page.getByRole("heading", { name: "My Pokemon Team" });
    await expect(title).toBeVisible();

    // Test that the two images to its left and right are as well (and that the images are loading properly)
    const leftImage = page.getByRole("img", { name: "Garchomp Face" });
    const rightImage = page.getByRole("img", {
      name: "Eternal Flower Floette Face",
    });

    // Verify images are loaded successfully (not broken/404)
    await expectImageToBeLoaded(leftImage);
    await expectImageToBeLoaded(rightImage);

    // Check email contact info
    await expect(
      page.getByText("Report Bugs to jeffery124@gmail.com"),
    ).toBeVisible();
  });
