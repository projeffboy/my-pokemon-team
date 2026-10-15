import { test, expect } from "fixtures";
import {
  findOption,
  optionLabelLines,
  selectPokemon,
  resizeTeamViewport,
} from "helper";

test("small phone move, item, and ability lists keep their 400px viewport width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 400, height: 900 });
  await selectPokemon(page, "Eldegoss");
  const popup = page.locator(".MuiAutocomplete-popper");
  for (const property of ["move1", "item", "ability"]) {
    const input = page.getByRole("combobox", {
      name: `Pokemon 1's ${property}`,
    });
    await input.click();
    await expect(popup).toBeVisible();
    const reference = await popup.boundingBox();
    expect(reference).not.toBeNull();
    if (!reference) return;
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await expect
        .poll(async () => (await popup.boundingBox())?.width)
        .toBeCloseTo(reference.width, 0);
      await expect
        .poll(async () => {
          const bounds = await popup.boundingBox();
          return !!bounds && bounds.x >= 0 && bounds.x + bounds.width <= width;
        })
        .toBe(true);
    }
    await input.press("Escape");
    await page.setViewportSize({ width: 400, height: 900 });
  }
});

test("the Name list fits its longest names within two lines", async ({
  page,
}) => {
  const popup = page.locator(".MuiAutocomplete-popper");
  for (const width of [320, 1200]) {
    await resizeTeamViewport(page, width, 900);
    await page.evaluate(() => document.fonts.ready);
    const option = await findOption(
      page,
      "Pokemon 1's name",
      "Ogerpon-Hearthflame-Tera",
    );
    await expect.poll(() => optionLabelLines(option)).toBe(2);
    await expect(async () => {
      const bounds = await popup.boundingBox();
      expect(bounds?.width).toBeGreaterThanOrEqual(168);
      expect(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width).toBe(
        true,
      );
    }).toPass({ timeout: 5000 });
    await page.keyboard.press("Escape");
  }
});

test("one-word names and items take one line", async ({ page }) => {
  for (const width of [320, 1200]) {
    await resizeTeamViewport(page, width, 900);
    await page.evaluate(() => document.fonts.ready);
    for (const [property, label] of [
      ["name", "Charmeleon"],
      ["name", "Crabominable"],
      // At 1200px, wider than the room the item list's 130px minimum leaves
      ["item", "Kangaskhanite"],
    ]) {
      const option = await findOption(page, `Pokemon 1's ${property}`, label);
      await expect.poll(() => optionLabelLines(option)).toBe(1);
      await page.keyboard.press("Escape");
    }
  }
});
