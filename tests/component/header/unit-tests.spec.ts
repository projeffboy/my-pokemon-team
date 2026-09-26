import { test, expect } from "fixtures";
import { expectImageToBeLoaded } from "helper";

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

    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Gen 9 (SV / ZA)");
    await expect(
      page.getByRole("button", { name: "Send feedback" }),
    ).toBeVisible();
  });
});
