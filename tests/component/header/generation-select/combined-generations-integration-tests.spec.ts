import { test, expect } from "fixtures";
import type { Browser, Page, TestInfo } from "@playwright/test";
import { openFilters, selectPokemon, selectAbility, showSlot } from "helper";

const generationLabel = /Generations 6–9|Gens 6–9/;

test("fresh combined teams mix generations and keep their profile through a shared link and reload", async ({
  page,
}) => {
  await page.goto("/");
  const generation = page.getByRole("combobox", { name: "Generation" });
  await expect(generation).toContainText(generationLabel);
  await selectPokemon(page, "Greninja");
  await showSlot(page, 1);
  await selectPokemon(page, "Urshifu", 1);
  await expect(page).toHaveURL(/gen=6-9/);
  const link = page.url();
  await page.reload();
  await showSlot(page, 1);
  await expect(generation).toContainText(generationLabel);
  await expect(page.getByLabel("Pokemon 2's name")).toHaveValue("Urshifu");
  await page.goto(link.replace("gen=6-9", "gen=9"));
  await expect(generation).toContainText(/Scarlet|SV/);
  expect(new URL(page.url()).searchParams.get("gen")).toBe("9");
  await page.reload();
  await expect(generation).toContainText(/Scarlet|SV/);
  await page.goto(link);
  await expect(generation).toContainText(generationLabel);
});

test("a tier filter does not replace the combined generation profile", async ({
  page,
}) => {
  await page.goto("/");
  await openFilters(page);
  const dialog = page.getByRole("dialog", { name: "Filters" });
  await dialog.getByRole("combobox", { name: "Format", exact: true }).click();
  await page
    .getByRole("option", { name: "OU: Over Used", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText(generationLabel);
  await expect(page).toHaveURL(/gen=6-9/);
});

test("switching an imported Gen 8 team to the combined pool preserves Greninja and Pursuit", async ({
  page,
}) => {
  const text =
    "Greninja @\nAbility: Protean\n- Water Pulse\n\nTyranitar @\nAbility: Sand Stream\n- Pursuit\n";
  await page.goto(`/?gen=8&team=${Buffer.from(text).toString("base64url")}`);
  const generation = page.getByRole("combobox", { name: "Generation" });
  await generation.click();
  await page.locator('[role="option"][data-value="6-9"]').click();
  await expect(generation).toContainText(generationLabel);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Greninja");
  await showSlot(page, 1);
  await expect(page.getByLabel("Pokemon 2's move1")).toHaveValue("Pursuit");
  await expect(page).toHaveURL(/gen=6-9/);
});

test("combined Gengar retains Levitate and offers both abilities after reload", async ({
  page,
}) => {
  const text = "Gengar\nAbility: Levitate\n- Shadow Ball\n- Rage";
  await page.goto(`/?gen=6&team=${Buffer.from(text).toString("base64url")}`);
  const ability = page.getByLabel("Pokemon 1's ability", { exact: true });
  await expect(ability).toHaveValue("Levitate");
  const generation = page.getByRole("combobox", { name: "Generation" });
  await generation.click();
  await page.locator('[role="option"][data-value="6-9"]').click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(generation).toContainText(generationLabel);
  await expect(ability).toHaveValue("Levitate");
  await expect(page.getByLabel("Pokemon 1's move2")).toHaveValue("Rage");
  await page.reload();
  await expect(ability).toHaveValue("Levitate");
  await ability.click();
  await expect(
    page.getByRole("option", { name: "Levitate", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("option", { name: "Cursed Body", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("option", { name: "No Ability", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("option", { name: "Cursed Body", exact: true }).click();
  await page.reload();
  await expect(ability).toHaveValue("Cursed Body");
});

test("combined choices become usable when availability loads without waiting for moves", async ({
  page,
}) => {
  let releaseAvailability = () => {};
  let releaseMoves = () => {};
  const availability = new Promise<void>(resolve => {
    releaseAvailability = resolve;
  });
  const moves = new Promise<void>(resolve => {
    releaseMoves = resolve;
  });
  await page.route("**/src/data/generation-transfer.json*", async route => {
    await availability;
    await route.continue();
  });
  await page.route("**/src/data/learnsets.json*", async route => {
    await moves;
    await route.continue();
  });
  await page.goto("/?gen=6-9", { waitUntil: "domcontentloaded" });
  const name = page.getByLabel("Pokemon 1's name", { exact: true });
  await name.fill("Gengar");
  await expect(
    page.getByRole("option", { name: "Gengar", exact: true }),
  ).toHaveCount(0);
  const loaded = page.waitForResponse("**/src/data/generation-transfer.json*");
  releaseAvailability();
  await loaded;
  await selectPokemon(page, "Gengar");
  await selectAbility(page, "Levitate");
  await showSlot(page, 1);
  await selectPokemon(page, "Blastoise-Mega", 1);
  await expect(
    page.getByLabel("Pokemon 2's ability", { exact: true }),
  ).toHaveValue("Mega Launcher");
  releaseMoves();
  await page.reload();
  await showSlot(page, 0);
  await expect(
    page.getByLabel("Pokemon 1's ability", { exact: true }),
  ).toHaveValue("Levitate");
});

async function freshRecipient(
  browser: Browser,
  page: Page,
  testInfo: TestInfo,
) {
  const options = testInfo.project.use;
  return browser.newPage({
    viewport: page.viewportSize(),
    isMobile: options.isMobile,
    hasTouch: options.hasTouch,
    userAgent: options.userAgent,
    deviceScaleFactor: options.deviceScaleFactor,
  });
}

test("union-only moves survive shared links in a fresh browser and subsequent reload", async ({
  page,
  browser,
}, testInfo) => {
  await page.goto("/?gen=6-9");
  await selectPokemon(page, "Vivillon-Fancy");
  const move = page.getByLabel("Pokemon 1's move1", { exact: true });
  await move.fill("Weather Ball");
  await page.getByRole("option", { name: "Weather Ball", exact: true }).click();
  await expect(move).toHaveValue("Weather Ball");
  const recipient = await freshRecipient(browser, page, testInfo);
  try {
    await recipient.goto(page.url());
    await expect(
      recipient.getByLabel("Pokemon 1's name", { exact: true }),
    ).toHaveValue("Vivillon-Fancy");
    await expect(
      recipient.getByLabel("Pokemon 1's move1", { exact: true }),
    ).toHaveValue("Weather Ball");
    await recipient.reload();
    await expect(
      recipient.getByLabel("Pokemon 1's name", { exact: true }),
    ).toHaveValue("Vivillon-Fancy");
    await expect(
      recipient.getByLabel("Pokemon 1's move1", { exact: true }),
    ).toHaveValue("Weather Ball");
  } finally {
    await recipient.close();
  }
});

test("a union link without an ability leaves Gengar's choice blank while native Gen 9 fills Cursed Body", async ({
  page,
}) => {
  const text = Buffer.from("Gengar\n- Shadow Ball").toString("base64url");
  await page.goto(`/?gen=6-9&team=${text}`);
  await expect(
    page.getByLabel("Pokemon 1's name", { exact: true }),
  ).toHaveValue("Gengar");
  await expect(
    page.getByLabel("Pokemon 1's ability", { exact: true }),
  ).toHaveValue("");
  await page.goto(`/?gen=9&team=${text}`);
  await expect(
    page.getByLabel("Pokemon 1's name", { exact: true }),
  ).toHaveValue("Gengar");
  await expect(
    page.getByLabel("Pokemon 1's ability", { exact: true }),
  ).toHaveValue("Cursed Body");
});

test("an ability-less union Pokemon stays complete for a fresh share-link recipient", async ({
  page,
  browser,
}, testInfo) => {
  await page.goto("/?gen=6-9");
  await selectPokemon(page, "Eevee-Starter");
  const item = page.getByLabel("Pokemon 1's item", { exact: true });
  await item.fill("Leftovers");
  await page.getByRole("option", { name: "Leftovers", exact: true }).click();
  for (const [index, value] of [
    "Baddy Bad",
    "Swift",
    "Double-Edge",
    "Protect",
  ].entries()) {
    const input = page.getByLabel(`Pokemon 1's move${index + 1}`, {
      exact: true,
    });
    await input.fill(value);
    await page.getByRole("option", { name: value, exact: true }).click();
  }
  await expect(
    page.getByLabel("Pokemon 1's ability", { exact: true }),
  ).toHaveValue("No Ability");
  const recipient = await freshRecipient(browser, page, testInfo);
  try {
    await recipient.goto(page.url());
    await expect(
      recipient.getByLabel("Pokemon 1's name", { exact: true }),
    ).toHaveValue("Eevee-Starter");
    await expect(
      recipient.getByLabel("Pokemon 1's ability", { exact: true }),
    ).toHaveValue("No Ability");
    await recipient
      .getByRole("button", { name: "Random pokemon for slot 1", exact: true })
      .click();
    await expect(
      recipient.getByLabel("Pokemon 1's name", { exact: true }),
    ).not.toHaveValue("Eevee-Starter");
  } finally {
    await recipient.close();
  }
});
