import { test, expect } from "fixtures";
import { expectImageToBeLoaded } from "helper";

// Test configuration based on component-tests.md requirements

test.describe("Header Tests", () => {
  test("should display header elements correctly", async ({ page }) => {
    const title = page.getByRole("heading", {
      name: "My Pokemon Team",
      level: 1,
    });
    await expect(title).toBeVisible();

    const images = page.locator("header img");
    await expect(images).toHaveCount(2);

    await expectImageToBeLoaded(images.nth(0));
    await expectImageToBeLoaded(images.nth(1));
    await expect(images.nth(0)).toHaveAttribute("alt", "");
    await expect(images.nth(1)).toHaveAttribute("alt", "");

    await expect(page.getByText("For Generations 6-9")).toBeVisible();

    const email = page.getByRole("link", {
      name: "Report Bugs to jeffery124@gmail.com",
    });
    await expect(email).toHaveAttribute("href", "mailto:jeffery124@gmail.com");
  });
});
