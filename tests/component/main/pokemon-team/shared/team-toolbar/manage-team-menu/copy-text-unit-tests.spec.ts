import { test, expect } from "fixtures";
import { clickMenuItem, openManageTeamMenu } from "helper";

test.describe("Manage Team: Copy text - Unit Tests", () => {
  test("should show error message when copying empty team", async ({
    page,
  }) => {
    await openManageTeamMenu(page);
    await clickMenuItem(page, "Copy text");

    // Verify snackbar message
    const snackbar = page
      .getByRole("alert")
      .getByText("The team is empty. Add a pokemon to copy it.");
    await expect(snackbar).toBeVisible();
  });
});
