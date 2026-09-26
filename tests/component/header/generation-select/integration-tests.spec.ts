import { test, expect } from "fixtures";
import { closeDialog, openFilters } from "helper";
import type { Page } from "@playwright/test";

const expectSelectable = async (
  page: Page,
  name: string,
  isSelectable: boolean,
) => {
  const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
  await input.fill(name);
  const option = page.getByRole("listbox").getByText(name, { exact: true });
  await expect(option)[isSelectable ? "toBeVisible" : "toBeHidden"]();
  await input.press("Escape");
};

test.describe("Generation Select - Integration Tests", () => {
  test("lists only the pokemon of the chosen generation", async ({ page }) => {
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: /^Gen 1/ }).click();
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Gen 1 (RBY)");

    await expectSelectable(page, "Mew", true);
    await expectSelectable(page, "Chikorita", false);
    await expectSelectable(page, "Venusaur-Mega", false);

    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: /^Gen 7/ }).click();
    await expectSelectable(page, "Venusaur-Mega", true);
    await expectSelectable(page, "Meganium-Mega", false);
    await expectSelectable(page, "Rowlet", true);
    await expectSelectable(page, "Grookey", false);
  });

  test("Gen 9 · Champions sets the Pokemon Champions format", async ({
    page,
  }) => {
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: "Gen 9 · Champions" }).click();
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Champions");
    await expectSelectable(page, "Kommo-o", true);
    await expectSelectable(page, "Zekrom", false);

    await openFilters(page);
    await expect(page.getByRole("combobox", { name: "Format" })).toContainText(
      "Pokemon Champions (M-C)",
    );
    await closeDialog(page);
  });
});
