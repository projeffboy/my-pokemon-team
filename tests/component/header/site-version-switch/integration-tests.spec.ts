import { test, expect } from "fixtures";
import { getTeamTextFromUrl, selectMove, selectPokemon } from "helper";

const destination = "https://old.mypokemonteam.com/";
const oldSite = /^https:\/\/old\.mypokemonteam\.com\//;

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
  await expect(dialog).toContainText(
    "Your current team will open on the old website.",
  );
  await expect(dialog.getByRole("alert")).toHaveCount(0);
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

test("a nonempty team goes with the player after confirmation", async ({
  page,
}) => {
  await page.goto("/?gen=9");
  await selectPokemon(page, "Whiscash");
  await expect(page).toHaveURL(/[?&]team=/);
  await page.route(oldSite, route =>
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
    .getByRole("button", { name: "Go with my team", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Other site" })).toBeVisible();
  expect(page.url()).toMatch(/^https:\/\/old\.mypokemonteam\.com\/\?team=/);
  expect(getTeamTextFromUrl(page)).toMatch(/^Whiscash\n/);
});

test("names what a Gen 2 team leaves behind and carries the rest", async ({
  page,
}) => {
  const team = "Pory (Porygon2) @ Berserk Gene\n- Barrier\n- Tri Attack\n\n";
  await page.goto(`/?gen=2&team=${Buffer.from(team).toString("base64url")}`);
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Porygon2");
  await page.route(oldSite, route =>
    route.fulfill({ contentType: "text/html", body: "<h1>Other site</h1>" }),
  );
  await page
    .getByRole("banner")
    .getByRole("button", { name: /^(Go to (the )?)?old (web)?site$/i })
    .click();
  const warning = page.getByRole("dialog").getByRole("alert");
  await expect(warning).toContainText(
    "The old website has Generations 6–9 only.",
  );
  await expect(warning).toContainText("These won’t carry over:");
  await expect(warning.getByRole("listitem")).toHaveText([
    "Porygon2: Berserk Gene, Barrier, and Nickname",
  ]);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Go with my team", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Other site" })).toBeVisible();
  const carried = getTeamTextFromUrl(page);
  expect(carried).toMatch(/^Porygon2\n/);
  expect(carried).toContain("- Tri Attack");
  expect(carried).not.toMatch(/Berserk Gene|Barrier|Pory /);
});

test("names the set details of a Gen 6–9 team, and Cancel keeps them", async ({
  page,
}) => {
  const team =
    "Annihilape @ Leftovers\nAbility: Defiant\nEVs: 252 Atk\nAdamant Nature\n- Rage Fist\n\n";
  await page.goto(`/?team=${Buffer.from(team).toString("base64url")}`);
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Annihilape");
  const currentUrl = page.url();
  await page
    .getByRole("banner")
    .getByRole("button", { name: /^(Go to (the )?)?old (web)?site$/i })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Switch to the old website?",
  });
  const warning = dialog.getByRole("alert");
  await expect(warning.getByRole("listitem")).toHaveText([
    "Annihilape: Nature and EVs",
  ]);
  await expect(warning).not.toContainText("Generations 6–9");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(currentUrl);
  expect(getTeamTextFromUrl(page)).toContain("Adamant Nature");
});

test("names what the old website's own data lacks, apart from the generation", async ({
  page,
}) => {
  const team =
    "Smeargle @ Focus Sash\nAbility: Own Tempo\n- Sticky Web\n- Spore\n\n" +
    "Gengar\nAbility: Levitate\n- Shadow Ball\n\n";
  await page.goto(`/?team=${Buffer.from(team).toString("base64url")}`);
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Smeargle");
  await page.route(oldSite, route =>
    route.fulfill({ contentType: "text/html", body: "<h1>Other site</h1>" }),
  );
  await page
    .getByRole("banner")
    .getByRole("button", { name: /^(Go to (the )?)?old (web)?site$/i })
    .click();
  const warning = page.getByRole("dialog").getByRole("alert");
  await expect(warning.getByRole("listitem")).toHaveText([
    "Smeargle: Sticky Web",
    "Gengar: Levitate → Cursed Body",
  ]);
  await expect(warning).not.toContainText("Generations 6–9");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Go with my team", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Other site" })).toBeVisible();
  const carried = getTeamTextFromUrl(page);
  expect(carried).toContain("- Spore");
  expect(carried).not.toMatch(/Sticky Web|Levitate/);
});

test("an edit from another tab while the dialog is open goes with the player", async ({
  page,
  context,
}) => {
  await page.goto("/?gen=9");
  await selectPokemon(page, "Toucannon");
  await expect(page).toHaveURL(/[?&]team=/);
  await page.route(oldSite, route =>
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
  await expect(dialog.getByRole("alert")).toHaveCount(0);

  const other = await context.newPage();
  await other.goto(page.url());
  await selectPokemon(other, "Smeargle");
  await selectMove(other, "Sticky Web");
  await expect(dialog.getByRole("alert").getByRole("listitem")).toHaveText([
    "Smeargle: Sticky Web",
  ]);
  await dialog
    .getByRole("button", { name: "Go with my team", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Other site" })).toBeVisible();
  expect(getTeamTextFromUrl(page)).toMatch(/^Smeargle\n/);
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
