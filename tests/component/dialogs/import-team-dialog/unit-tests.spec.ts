import { test, expect } from "fixtures";
import { openEditPokepaste } from "helper";

test.describe("Import Team Dialog - Unit Tests", () => {
  test("cannot import while the learnsets fail to load", async ({ page }) => {
    // The learnsets load after the app (a JSON module in dev, a hashed chunk in the build),
    // and parsing a team depends on them
    await page.route(
      url => /learnsets(\.json|-[\w-]+\.js)$/.test(url.pathname),
      route => route.abort(),
    );
    await page.reload();

    await expect(
      page
        .getByRole("alert")
        .getByText(
          "The move lists could not be loaded. Reload the page to try again.",
        ),
    ).toBeVisible();

    await openEditPokepaste(page);
    await expect(page.getByRole("button", { name: "Update" })).toBeDisabled();
  });
});
