import { test, expect } from "fixtures";
import { clickMenuItem, openMoreMenu } from "helper";

test.describe("More menu: Copy text - Unit Tests", () => {
  test("should show error message when copying empty team", async ({
    page,
  }) => {
    await openMoreMenu(page);
    await clickMenuItem(page, "Copy text");

    // Verify snackbar message
    const snackbar = page
      .getByRole("alert")
      .getByText("The team is empty. Add a pokemon to copy it.");
    await expect(snackbar).toBeVisible();
  });
});
