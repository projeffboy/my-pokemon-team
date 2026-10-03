import { test, expect } from "fixtures";
import { closeDialog, openAnalysis, openFilters, selectPokemon } from "helper";
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

  test("an earlier generation uses its own types, type chart, and sprites", async ({
    page,
  }) => {
    // On a phone the menu is taller than the screen, and a click while it is
    // still scrolling into view can land on the neighbouring option
    await expect(async () => {
      await page.getByRole("combobox", { name: "Generation" }).click();
      await page.getByRole("option", { name: /^Gen 1/ }).click();
      await expect(
        page.getByRole("combobox", { name: "Generation" }),
      ).toContainText("Gen 1 (RBY)", { timeout: 1000 });
    }).toPass();
    // The helper's forced click would land on the menu while it is still closing
    await expect(page.locator(".MuiMenu-paper")).toBeHidden();
    await selectPokemon(page, "Clefable");
    await expect(
      page.locator('img[src*="/gen1rb/clefable.png"]').first(),
    ).toBeVisible();

    // Clefable was a Normal type, immune to Ghost, and gen 1 had no Dark, Steel, or Fairy
    await openAnalysis(page, "Team Defence");
    const defence = page.getByRole("region", { name: "Team Defence" });
    await expect(defence.getByRole("button")).toHaveCount(15);
    await expect(defence.getByLabel("Fairy", { exact: true })).toBeHidden();
    await expect(defence.getByLabel(/^Fighting score:/)).toHaveText("-1");
    await expect(defence.getByLabel(/^Ghost score:/)).toHaveText("+1.5");
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
