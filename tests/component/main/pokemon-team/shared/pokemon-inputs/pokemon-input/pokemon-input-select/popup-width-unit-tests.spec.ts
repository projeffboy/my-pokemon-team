import { test, expect } from "fixtures";
import { openTeamTools, selectPokemon } from "helper";

test("expanded small phone move, item, and ability lists keep their 400px viewport width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 400, height: 900 });
  await selectPokemon(page, "Eldegoss");
  await openTeamTools(page);
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

test("collapsed move and ability lists are at least their 360px viewport width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await selectPokemon(page, "Dolliv");
  const popup = page.locator(".MuiAutocomplete-popper");
  for (const property of ["move1", "ability"]) {
    const input = page.getByRole("combobox", {
      name: `Pokemon 1's ${property}`,
    });
    const field = input.locator(
      "xpath=ancestor::*[contains(@class, 'MuiAutocomplete-root')]",
    );
    for (const width of [320, 360, 390, 600]) {
      await page.setViewportSize({ width, height: 900 });
      await input.click();
      await expect(popup).toBeVisible();
      await expect
        .poll(async () => (await popup.boundingBox())?.width)
        .toBeCloseTo(Math.max(152, (await field.boundingBox())?.width ?? 0), 0);
      await input.press("Escape");
    }
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.getByRole("combobox", { name: "Pokemon 1's item" }).click();
  await expect.poll(async () => (await popup.boundingBox())?.width).toBe(172);
});
