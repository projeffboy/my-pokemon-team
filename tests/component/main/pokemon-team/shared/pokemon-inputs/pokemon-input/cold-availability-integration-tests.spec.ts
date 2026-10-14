import { test, expect } from "fixtures";

test("cold past-generation choices wait for availability data and preserve imported names", async ({
  page,
}) => {
  let release = () => {};
  let requested = () => {};
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  const request = new Promise<void>(resolve => {
    requested = resolve;
  });
  await page.route("**/src/data/generation-transfer.json*", async route => {
    requested();
    await held;
    await route.continue();
  });
  await page.goto("/?gen=8", { waitUntil: "domcontentloaded" });
  await request;
  const name = page.getByLabel("Pokemon 1's name");
  await name.fill("Greninja");
  await expect(
    page.getByRole("option", { name: "Greninja", exact: true }),
  ).toHaveCount(0);
  release();
  await name.fill("Grookey");
  await expect(
    page.getByRole("option", { name: "Grookey", exact: true }),
  ).toBeVisible();
  await page.goto(
    `/?gen=8&team=${Buffer.from("Greninja\n- Surf").toString("base64url")}`,
  );
  await expect(name).toHaveValue("Greninja");
  await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("Surf");
});
