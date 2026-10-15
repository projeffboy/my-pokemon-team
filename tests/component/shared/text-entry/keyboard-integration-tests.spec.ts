import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";

// The on-screen keyboard shows while a field has the focus, so a field that
// loses it closes the keyboard
const field = (page: Page, property: string) =>
  page.getByLabel(`Pokemon 1's ${property}`, { exact: true });

test.describe("with touch", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, "Requires touch input");
  });

  test("the ability filter closes the keyboard, and closing Filters leaves no field focused", async ({
    page,
  }) => {
    const name = field(page, "name");
    await name.tap();
    await page.getByRole("button", { name: "Filters", exact: true }).tap();
    const dialog = page.getByRole("dialog", { name: "Filters" });
    const ability = dialog.getByRole("combobox", { name: "Ability" });
    await ability.tap();
    await expect(ability).toBeFocused();
    await ability.fill("Levitat");
    await page.getByRole("option", { name: "Levitate", exact: true }).tap();
    await expect(ability).toHaveValue("Levitate");
    await expect(ability).not.toBeFocused();

    await ability.tap();
    await expect(ability).toBeFocused();
    await dialog.getByRole("button", { name: "Done", exact: true }).tap();
    await expect(dialog).toBeHidden();
    await expect(name).not.toBeFocused();
    await expect(page.locator("input:focus, textarea:focus")).toHaveCount(0);
  });

  test("closing Sort leaves the dropdown's field without focus", async ({
    page,
  }) => {
    const name = field(page, "name");
    await name.tap();
    await page.getByRole("button", { name: "Sort", exact: true }).tap();
    const dialog = page.getByRole("dialog", { name: "Sort" });
    await dialog.getByRole("button", { name: "Done", exact: true }).tap();
    await expect(dialog).toBeHidden();
    await expect(name).not.toBeFocused();
  });
});
