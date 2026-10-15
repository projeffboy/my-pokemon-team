import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";
import { selectPokemon } from "helper";

// The on-screen keyboard shows while a field has the focus, so a field that
// loses it closes the keyboard
const field = (page: Page, property: string) =>
  page.getByLabel(`Pokemon 1's ${property}`, { exact: true });

test.describe("with touch", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, "Requires touch input");
  });

  test("tapping an option closes the keyboard with the list, and tapping again reopens both", async ({
    page,
  }) => {
    const name = field(page, "name");
    await name.tap();
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-expanded", "true");
    await name.fill("Orthworm");
    await page
      .getByRole("listbox")
      .getByText("Orthworm", { exact: true })
      .tap();
    await expect(name).toHaveValue("Orthworm");
    await expect(name).not.toBeFocused();
    await expect(name).toHaveAttribute("aria-expanded", "false");

    await name.tap();
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.type("Dondoz");
    await expect(
      page.getByRole("listbox").getByText("Dondozo", { exact: true }),
    ).toBeVisible();
  });

  test("Enter picks the top match and closes the keyboard", async ({
    page,
  }) => {
    const name = field(page, "name");
    await name.tap();
    await name.fill("Flamig");
    await expect(
      page.getByRole("listbox").getByText("Flamigo", { exact: true }),
    ).toBeVisible();
    await name.press("Enter");
    await expect(name).toHaveValue("Flamigo");
    await expect(name).not.toBeFocused();
  });

  test("tapping the toggle or outside closes the keyboard and keeps the value", async ({
    page,
  }) => {
    await selectPokemon(page, "Bombirdier");
    const item = field(page, "item");
    const toggle = page
      .locator(".MuiAutocomplete-root")
      .filter({ has: item })
      .getByRole("button", { name: "Close", exact: true });
    await item.tap();
    await expect(item).toHaveAttribute("aria-expanded", "true");
    await toggle.tap();
    await expect(item).toHaveAttribute("aria-expanded", "false");
    await expect(item).not.toBeFocused();

    const name = field(page, "name");
    await name.tap();
    await page.keyboard.type("Cetit");
    await page.getByRole("heading", { name: "My Pokemon Team" }).tap();
    await expect(name).toHaveAttribute("aria-expanded", "false");
    await expect(name).not.toBeFocused();
    await expect(name).toHaveValue("Bombirdier");
  });

  test("tapping another field moves the focus to it", async ({ page }) => {
    const name = field(page, "name");
    const item = field(page, "item");
    await name.tap();
    await expect(name).toHaveAttribute("aria-expanded", "true");
    await item.tap();
    await expect(item).toBeFocused();
    await expect(item).toHaveAttribute("aria-expanded", "true");
    await expect(name).toHaveAttribute("aria-expanded", "false");
  });

  test("tapping the empty field itself closes the list but keeps the keyboard for typing", async ({
    page,
  }) => {
    const name = field(page, "name");
    await name.tap();
    await expect(name).toHaveAttribute("aria-expanded", "true");
    await name.tap();
    await expect(name).toHaveAttribute("aria-expanded", "false");
    await expect(name).toBeFocused();
  });
});

test("with a mouse, choosing an option keeps the focus in the field", async ({
  page,
}) => {
  const name = field(page, "name");
  await name.click();
  await name.fill("Veluza");
  await page.getByRole("listbox").getByText("Veluza", { exact: true }).click();
  await expect(name).toHaveValue("Veluza");
  await expect(name).toBeFocused();
});
