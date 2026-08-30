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

    const [titleBox, leftImageBox, rightImageBox] = await Promise.all([
      title.boundingBox(),
      leftImage.boundingBox(),
      rightImage.boundingBox(),
    ]);
    expect(titleBox).not.toBeNull();
    expect(leftImageBox).not.toBeNull();
    expect(rightImageBox).not.toBeNull();

    const titleCenter = titleBox!.y + titleBox!.height / 2;
    expect(leftImageBox!.y + leftImageBox!.height / 2).toBeCloseTo(
      titleCenter,
      0
    );
    expect(rightImageBox!.y + rightImageBox!.height / 2).toBeCloseTo(
      titleCenter,
      0
    );

    // Check email contact info
    await expect(
      page.getByText("Report Bugs to jeffery124@gmail.com")
    ).toBeVisible();
  });

  test("should resize the header within the xs breakpoint", async ({ page }) => {
    const title = page.getByRole("heading", { name: "My Pokemon Team" });
    const leftImage = page.getByRole("img", { name: "Garchomp Face" });

    await page.setViewportSize({ width: 320, height: 568 });
    await expect(title).toHaveCSS("font-size", "22.4px");
    await expect(leftImage).toHaveCSS("height", "28px");

    await page.setViewportSize({ width: 390, height: 693 });
    await expect(title).toHaveCSS("font-size", "25.6px");
    await expect(leftImage).toHaveCSS("height", "32px");
  });

  test("should expose page landmarks", async ({ page }) => {
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
});
