import { test, expect } from "@playwright/test";
import {
  expectImageToBeLoaded,
  openAnalysis,
  selectAbility,
  selectPokemon,
} from "helper";

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
  ).toContainText("Generations 6–9");
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

test("shows a pokemon and its analysis without Showdown's sprites or the ad script", async ({
  page,
}) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", error => pageErrors.push(error));

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await selectPokemon(page, "Steelix");
  // Every outside request is blocked, so the slot falls back to the bundled placeholder
  await expectImageToBeLoaded(
    page.getByRole("img", { name: "Steelix", exact: true }).first(),
  );
  await openAnalysis(page, "Team Defence");
  await expect(
    page
      .getByRole("region", { name: "Team Defence" })
      .getByLabel("Electric score: +1.5", { exact: true }),
  ).toBeVisible();
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

  // The replacement worker reloads this document as it unregisters itself.
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-smoke-worker", "before");
    void navigator.serviceWorker.register("/service-worker.js");
  });
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-smoke-worker",
    "before",
  );
  await page.waitForLoadState("domcontentloaded");

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

test("an offline lazy-load failure keeps the page and uses the dialog fallback", async ({
  page,
  context,
}) => {
  const errors: Error[] = [];
  page.on("pageerror", error => errors.push(error));
  await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });
  await selectPokemon(page, "Pelipper");
  await expect(page).toHaveURL(/[?&]team=/);
  const url = page.url();
  await page.evaluate(() => {
    addEventListener("vite:preloadError", event => {
      document.documentElement.dataset.offlinePreloadCancelled = String(
        event.defaultPrevented,
      );
    });
  });
  await context.setOffline(true);
  await page.getByRole("button", { name: "Credits", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Credits", exact: true });
  await expect(dialog.getByRole("alert")).toContainText("Something went wrong");
  await expect(page.locator("html")).toHaveAttribute(
    "data-offline-preload-cancelled",
    "true",
  );
  await expect(page).toHaveURL(url);
  await dialog.getByRole("button", { name: "Go Back", exact: true }).click();
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Pelipper");
  expect(errors).toEqual([]);
});
