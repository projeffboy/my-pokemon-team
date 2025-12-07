import { test, expect } from "fixtures";

test.describe("Save/Load Team: Copy Team - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Go to Save/Load tab
    await page.getByRole("tab", { name: /Save\/Load/ }).click();
    await page.waitForTimeout(500);
  });

  test("should show error message when copying empty team", async ({
    page,
  }) => {
    // Press "Copy Team" button
    await page.getByRole("button", { name: "Copy Team" }).click();

    // Verify snackbar message
    const snackbar = page.getByText("Empty team, nothing to copy.");
    await expect(snackbar).toBeVisible();
  });
});
