import { test, expect } from "@playwright/test";
import { expectImageToBeLoaded, selectAbility, selectPokemon } from "helper";

test.beforeEach(async ({ page, baseURL }) => {
  const appHost = new URL(baseURL!).host;
  await page.route("**/*", route => {
    const requestUrl = new URL(route.request().url());
    const protocol = requestUrl.protocol;
    const isNetworkProtocol =
      protocol === "http:" ||
      protocol === "https:" ||
      protocol === "ws:" ||
      protocol === "wss:";
    if (isNetworkProtocol && requestUrl.host !== appHost) {
      void route.abort();
      return;
    }
    void route.continue();
  });
});

test("preserves selections after reloading", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", error => pageErrors.push(error));

  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);

  await expect(
    page.getByRole("heading", { name: "My Pokemon Team", level: 1 }),
  ).toBeVisible();
  await expectImageToBeLoaded(page.locator("header img").first());

  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText("Champions");
  await selectPokemon(page, "Gyarados");
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Gyarados");
  await selectAbility(page, "Moxie");
  await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue("Moxie");
  await expect(page).toHaveURL(/[?&]team=/);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Gyarados");
  await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue("Moxie");
  expect(pageErrors).toEqual([]);
});

test("opens a saved team link in the built app", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", error => pageErrors.push(error));

  const team = Buffer.from(
    "Claydol @ Leftovers\nAbility: Levitate\n- Earth Power",
  ).toString("base64url");
  const response = await page.goto(`/?team=${team}`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);

  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Claydol");
  await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue("Levitate");
  await expect(page.getByLabel("Pokemon 1's item")).toHaveValue("Leftovers");
  await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("Earth Power");
  expect(pageErrors).toEqual([]);
});

test("removes the service worker left by the old build", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", error => pageErrors.push(error));
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Stand in for a browser that still has the Create React App worker
  await page.evaluate(() =>
    navigator.serviceWorker.register("/service-worker.js"),
  );

  await expect(async () => {
    const registrations = await page.evaluate(() =>
      navigator.serviceWorker.getRegistrations().then(list => list.length),
    );
    expect(registrations).toBe(0);
  }).toPass();
  await expect(
    page.getByRole("heading", { name: "My Pokemon Team", level: 1 }),
  ).toBeVisible();
  expect(pageErrors).toEqual([]);
});
