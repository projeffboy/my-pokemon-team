import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";
import { selectItem, selectMove, selectPokemon } from "helper";

const chooseToedscool = async (page: Page) => {
  await selectPokemon(page, "Toedscool");
  await selectMove(page, "Giga Drain");
  await selectItem(page, "Big Root");
  await page.keyboard.press("Escape");
  await page.getByRole("heading", { name: "My Pokemon Team" }).click();
};
const buttonsOf = (page: Page, property: string) => {
  const root = page
    .locator(".MuiAutocomplete-root")
    .filter({ has: page.getByLabel(`Pokemon 1's ${property}`) });
  return {
    // Touch screens hide it until the input has focus
    clear: root.getByRole("button", {
      name: "Clear",
      exact: true,
      includeHidden: true,
    }),
    open: root.getByRole("button", { name: "Open", exact: true }),
  };
};

test("a tap where touch screens hide the clear button opens the list", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.use.hasTouch, "Requires touch input");
  await page.setViewportSize({ width: 320, height: 700 });
  await chooseToedscool(page);
  for (const property of ["move1", "item"]) {
    const input = page.getByLabel(`Pokemon 1's ${property}`);
    const { clear } = buttonsOf(page, property);
    await expect(clear).toBeHidden();
    const bounds = await clear.boundingBox();
    if (!bounds) throw new Error(`No clear button for ${property}`);
    await page.touchscreen.tap(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    await expect(input).toHaveAttribute("aria-expanded", "true");
    // Once the input has focus, the clear button shows and still clears it
    await clear.tap();
    await expect(input).toHaveValue("");
  }
});

test("the clear and open buttons still work with a mouse", async ({
  page,
}, testInfo) => {
  test.skip(!!testInfo.project.use.hasTouch, "Requires a mouse");
  await chooseToedscool(page);
  const input = page.getByLabel("Pokemon 1's item");
  const { clear, open } = buttonsOf(page, "item");
  await open.click();
  await expect(input).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await input.hover();
  await clear.click();
  await expect(input).toHaveValue("");
});

test("a tap or click on a leading type or item icon opens the list", async ({
  page,
}, testInfo) => {
  await chooseToedscool(page);
  for (const [property, icon] of [
    ["move1", "Grass"],
    ["item", "Big Root icon"],
  ] as const) {
    const input = page.getByLabel(`Pokemon 1's ${property}`);
    const iconImage = page
      .locator(".MuiAutocomplete-root")
      .filter({ has: input })
      .getByRole("img", { name: icon });
    // Mouse and touchscreen coordinates do not scroll the page themselves
    await iconImage.scrollIntoViewIfNeeded();
    const bounds = await iconImage.boundingBox();
    if (!bounds) throw new Error(`No ${icon} for ${property}`);
    const [x, y] = [bounds.x + bounds.width / 2, bounds.y + bounds.height / 2];
    if (testInfo.project.use.hasTouch) await page.touchscreen.tap(x, y);
    else await page.mouse.click(x, y);
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await page.getByRole("heading", { name: "My Pokemon Team" }).click();
  }
});
