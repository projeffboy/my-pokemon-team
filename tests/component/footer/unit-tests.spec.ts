import { test, expect } from "fixtures";

test.describe("Footer - Unit Tests", () => {
  test("should not reserve ad space in development", async ({ page }) => {
    await expect(page.getByRole("contentinfo")).toHaveCSS(
      "padding-bottom",
      "0px",
    );
  });
});
