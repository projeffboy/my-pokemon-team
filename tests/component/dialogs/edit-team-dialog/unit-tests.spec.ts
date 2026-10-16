import { test, expect } from "fixtures";
import { openEditPokepaste } from "helper";

test.describe("Edit Team Dialog - Unit Tests", () => {
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

  test("Copy copies the text as it stands, edits included", async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Reads the clipboard directly");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const text = "Mudsdale\nAbility: Stamina\n- High Horsepower";
    await page.goto(`/?team=${Buffer.from(text).toString("base64url")}`);
    await openEditPokepaste(page);
    const field = page.getByRole("textbox", {
      name: "Pokemon Showdown Team Raw Text",
    });
    await expect(field).toHaveValue(new RegExp(`^${text}`));
    await field.fill(`${text}\n- Rock Slide`);
    await page.getByRole("button", { name: "Copy", exact: true }).click();
    // The snackbar shows over the dialog, which hides the rest of the page from screen readers
    await expect(
      page.getByRole("alert", { includeHidden: true }).last(),
    ).toHaveText("Team copied.");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      `${text}\n- Rock Slide`,
    );

    await field.fill("");
    await expect(
      page.getByRole("button", { name: "Copy", exact: true }),
    ).toBeDisabled();
  });
});
