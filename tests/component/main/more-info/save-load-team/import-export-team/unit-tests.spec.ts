import { test, expect } from "fixtures";

test.describe("Save/Load Team: Import/Export Team - Unit Tests", () => {
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

    await page.getByRole("tab", { name: /Save\/Load/ }).click();
    await page.getByRole("button", { name: "Import/Export Team" }).click();
    await expect(page.getByRole("button", { name: "Update" })).toBeDisabled();
  });
});
