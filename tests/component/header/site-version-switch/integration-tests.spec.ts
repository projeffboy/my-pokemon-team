import { test, expect } from "fixtures";
import { selectPokemon } from "helper";

const destination = "https://old.mypokemonteam.com/";

test("an empty team switches sites immediately without transferring URL parameters", async ({
  page,
}) => {
  await page.route(destination, route =>
    route.fulfill({ contentType: "text/html", body: "<h1>Other site</h1>" }),
  );
  await page
    .getByRole("banner")
    .getByRole("button", { name: /^(Go to (the )?)?old (web)?site$/i })
    .click();
  await expect(page).toHaveURL(destination);
  await expect(page.getByRole("heading", { name: "Other site" })).toBeVisible();
});

test("Cancel and Escape keep a nonempty team on the current site", async ({
  page,
}) => {
  await page.goto("/?gen=9");
  await selectPokemon(page, "Whiscash");
  await expect(page).toHaveURL(/[?&]team=/);
  const currentUrl = page.url();
  const button = page
    .getByRole("banner")
    .getByRole("button", { name: /^(Go to (the )?)?old (web)?site$/i });
  await button.click();
  const dialog = page.getByRole("dialog", {
    name: "Switch to the old website?",
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
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Whiscash");
  await button.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(currentUrl);
});

test("a nonempty team switches only after confirmation and does not transfer its team", async ({
  page,
}) => {
  await page.goto("/?gen=9");
  await selectPokemon(page, "Whiscash");
  await expect(page).toHaveURL(/[?&]team=/);
  await page.route(destination, route =>
    route.fulfill({ contentType: "text/html", body: "<h1>Other site</h1>" }),
  );
  await page
    .getByRole("banner")
    .getByRole("button", { name: /^(Go to (the )?)?old (web)?site$/i })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Switch to the old website?",
  });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Go to old website", exact: true })
    .click();
  await expect(page).toHaveURL(destination);
});

test("Japanese keeps its full label and both faces where they fit", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await page.getByRole("menuitem", { name: "日本語" }).click();
  for (const width of [360, 600, 760]) {
    await page.setViewportSize({ width, height: 800 });
    const button = page
      .getByRole("banner")
      .getByRole("button", { name: "旧サイトへ移動", exact: true });
    await expect(button).toBeVisible();
    await expect(button.locator("img")).toHaveCount(2);
  }
});

test("Spanish keeps one face where its shortest label needs the room", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await page.getByRole("menuitem", { name: "Español" }).click();
  const button = page
    .getByRole("banner")
    .getByRole("button", { name: "Sitio anterior", exact: true });
  await page.setViewportSize({ width: 320, height: 800 });
  await expect(button.locator("img")).toHaveCount(1);
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(button.locator("img")).toHaveCount(2);
});
