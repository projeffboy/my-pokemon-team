import { test, expect } from "fixtures";
import { selectPokemon } from "helper";

const destination = "https://mypokemonteam.com/";

test("an empty team switches sites immediately without transferring URL parameters", async ({
  page,
}) => {
  await page.route(destination, route =>
    route.fulfill({ contentType: "text/html", body: "<h1>Other site</h1>" }),
  );
  await page
    .getByRole("banner")
    .getByRole("button", { name: /new website/i })
    .click();
  await expect(page).toHaveURL(destination);
  await expect(page.getByRole("heading", { name: "Other site" })).toBeVisible();
});

test("Cancel and Escape keep a nonempty team on the current site", async ({
  page,
}) => {
  await selectPokemon(page, "Lanturn");
  await expect(page).toHaveURL(/[?&]team=/);
  const currentUrl = page.url();
  const button = page
    .getByRole("banner")
    .getByRole("button", { name: /new website/i });
  await button.click();
  const dialog = page.getByRole("dialog", {
    name: "Switch to the new website?",
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Your current team won’t transfer");
  await expect(
    dialog.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(currentUrl);
  await expect(button).toBeFocused();
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Lanturn");
  await button.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(currentUrl);
});

test("a nonempty team switches only after confirmation and does not transfer its team", async ({
  page,
}) => {
  await selectPokemon(page, "Lanturn");
  await expect(page).toHaveURL(/[?&]team=/);
  await page.route(destination, route =>
    route.fulfill({ contentType: "text/html", body: "<h1>Other site</h1>" }),
  );
  await page
    .getByRole("banner")
    .getByRole("button", { name: /new website/i })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Switch to the new website?",
  });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Go to new website", exact: true })
    .click();
  await expect(page).toHaveURL(destination);
});
