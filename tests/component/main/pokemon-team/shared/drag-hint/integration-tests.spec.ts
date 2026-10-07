import { test, expect } from "fixtures";
import { isMdDown, selectPokemon, showSlot } from "helper";
import type { Page } from "@playwright/test";

const hint = (page: Page) => page.getByText("Hold and drag to reorder");

const pickTwo = async (page: Page) => {
  await selectPokemon(page, "Sableye");
  await showSlot(page, 1);
  await selectPokemon(page, "Klefki", 1);
};

test.describe("Drag hint - Integration Tests", () => {
  test.beforeEach(({ page }) => {
    test.skip(!isMdDown(page), "Desktop has no slot tabs");
  });

  test.describe("after sprite animations", () => {
    test.use({ viewport: { width: 320, height: 800 } });

    for (const generation of [2, 3, 4]) {
      test(`Gen ${generation} waits for all viewer sprites, including slow loads`, async ({
        page,
      }) => {
        await page.clock.install();
        for (const width of [320, 800]) {
          await page.setViewportSize({ width, height: 800 });
          let release = () => {};
          const loading = new Promise<void>(resolve => {
            release = resolve;
          });
          const pattern = `**/sprite-animations/${generation}/qwilfish.*`;
          await page.route(pattern, async route => {
            if (route.request().resourceType() === "image") await loading;
            await route.continue();
          });
          const team = "Dunsparce @\n-\n\nQwilfish @\n-\n";
          await page.goto(
            `/?team=${Buffer.from(team).toString("base64url")}&gen=${generation}`,
            { waitUntil: "domcontentloaded" },
          );
          const viewer = page.getByRole("tablist", {
            name: "Pokemon team slots",
          });
          const wiggle = viewer.locator(".slot-lift").first();
          const first = viewer.locator('img[alt="dunsparce"]');
          const second = viewer.locator('img[alt="qwilfish"]');
          await expect(second).toHaveAttribute("data-selection-animating", "");
          await expect
            .poll(() =>
              first.evaluate(image =>
                image.style.getPropertyValue("--sprite-scale"),
              ),
            )
            .not.toBe("");
          await expect(wiggle).toHaveCSS("animation-play-state", "paused");
          await wiggle.evaluate(element => {
            element.addEventListener(
              "animationstart",
              () => {
                element.setAttribute(
                  "data-wiggle-sprites-active",
                  String(
                    !!element
                      .closest('[role="tablist"]')
                      ?.querySelector("[data-selection-animating]"),
                  ),
                );
              },
              { once: true },
            );
          });
          await page.clock.fastForward(10000);
          await expect(first).not.toHaveAttribute("data-selection-animating");
          await expect(wiggle).toHaveCSS("animation-play-state", "paused");
          await expect(wiggle).not.toHaveAttribute(
            "data-wiggle-sprites-active",
          );
          release();
          await expect
            .poll(() =>
              second.evaluate(image =>
                image.style.getPropertyValue("--sprite-scale"),
              ),
            )
            .not.toBe("");
          await expect(wiggle).toHaveCSS("animation-play-state", "paused");
          await page.clock.fastForward(10000);
          await expect(
            viewer.locator("[data-selection-animating]"),
          ).toHaveCount(0);
          await expect(wiggle).toHaveCSS("animation-play-state", "running");
          await expect(wiggle).toHaveAttribute(
            "data-wiggle-sprites-active",
            "false",
          );
          await page.unroute(pattern);
        }
      });
    }
  });

  test("appears once there are two pokemon, and stays closed after a reload", async ({
    page,
  }) => {
    await selectPokemon(page, "Sableye");
    await expect(hint(page)).toBeHidden();
    await showSlot(page, 1);
    await selectPokemon(page, "Klefki", 1);
    await expect(hint(page)).toBeVisible();

    await hint(page)
      .locator("..")
      .getByRole("button", { name: "Close" })
      .click();
    await expect(hint(page)).toBeHidden();
    await page.reload();
    await expect(page.getByLabel(/^Pokemon \d's name$/).first()).toBeVisible();
    await expect(hint(page)).toBeHidden();
  });

  test("goes away once a slot is dragged", async ({ page }) => {
    await pickTwo(page);
    await expect(hint(page)).toBeVisible();

    const grips = page
      .getByRole("tablist", { name: "Pokemon team slots" })
      .getByTestId("DragIndicatorIcon");
    await grips.nth(1).scrollIntoViewIfNeeded();
    const from = await grips.nth(1).boundingBox();
    if (!from) throw new Error("The slot tabs are not on screen");
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(from.x + 40, from.y + from.height / 2, { steps: 5 });
    await page.mouse.up();

    await expect(hint(page)).toBeHidden();
  });
});
