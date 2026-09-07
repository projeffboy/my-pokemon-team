import { test, expect } from "fixtures";

test.describe("Update Log - Unit Tests", () => {
  test("should test Updates button and GitHub link", async ({ page }) => {
    const updatesButton = page.getByRole("button", { name: "Updates" });
    await updatesButton.click();

    // Should open a dialog
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Update Log");

    const link = dialog.locator(
      "a[href='https://github.com/projeffboy/my-pokemon-team']",
    );
    await expect(link).toBeVisible();
  });
});
