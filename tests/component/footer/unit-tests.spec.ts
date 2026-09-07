import { test, expect } from "fixtures";

test.describe("Footer - Unit Tests", () => {
  test("should test Jeffery Tang button and external link", async ({
    page,
  }) => {
    // Buttons with an href render as anchors (role "link")
    const jefferyButton = page.getByRole("link", { name: "Jeffery Tang" });
    await expect(jefferyButton).toBeVisible();
    await expect(jefferyButton).toHaveAttribute(
      "href",
      "https://jefferytang.com",
    );
  });

  test("should not reserve ad space in development", async ({ page }) => {
    await expect(page.getByRole("contentinfo")).toHaveCSS(
      "padding-bottom",
      "0px",
    );
  });
});
