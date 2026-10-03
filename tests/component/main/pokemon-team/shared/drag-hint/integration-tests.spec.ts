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
