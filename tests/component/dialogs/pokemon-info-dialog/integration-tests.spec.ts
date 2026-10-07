import { test, expect } from "fixtures";
import { selectPokemon } from "helper";
import type { Page } from "@playwright/test";

async function generation(page: Page, gen: number) {
  await expect(async () => {
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page
      .getByRole("option", { name: new RegExp(`^Gen ${gen}\\b`) })
      .click();
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText(`Gen ${gen} (`, { timeout: 1000 });
  }).toPass();
  await expect(page.locator(".MuiMenu-paper")).toBeHidden();
}

test("the Pokédex uses a single Special stat in Gen 1 and no abilities before Gen 3", async ({
  page,
}) => {
  await generation(page, 1);
  await selectPokemon(page, "Hypno");
  await page.getByRole("button", { name: "About Hypno" }).click();
  const dialog = page.getByRole("dialog", { name: "Hypno" });
  await expect(
    dialog.getByLabel("Special: 115", { exact: true }),
  ).toBeVisible();
  await expect(dialog).toContainText("Total 410");
  await expect(dialog.getByText("Sp. Atk", { exact: true })).toBeHidden();
  await expect(dialog.getByText("Sp. Def", { exact: true })).toBeHidden();
  await expect(dialog.getByRole("heading", { name: "Abilities" })).toBeHidden();
  await dialog.getByRole("button", { name: "Close" }).click();
  await generation(page, 2);
  await page.getByRole("button", { name: "About Hypno" }).click();
  await expect(dialog.getByLabel("Sp. Atk: 73", { exact: true })).toBeVisible();
  await expect(
    dialog.getByLabel("Sp. Def: 115", { exact: true }),
  ).toBeVisible();
  await expect(dialog).toContainText("Total 483");
  await expect(dialog.getByRole("heading", { name: "Abilities" })).toBeHidden();
});

test("Pidgeot's stats and abilities follow the selected generation", async ({
  page,
}) => {
  await generation(page, 3);
  await selectPokemon(page, "Pidgeot");
  await page.getByRole("button", { name: "About Pidgeot" }).click();
  const dialog = page.getByRole("dialog", { name: "Pidgeot" });
  await expect(dialog.getByLabel("Speed: 91", { exact: true })).toBeVisible();
  await expect(dialog).toContainText("Total 469");
  await expect(dialog).toContainText("Keen Eye");
  await expect(dialog).not.toContainText("Tangled Feet");
  await expect(dialog).not.toContainText("Big Pecks");
  await dialog.getByRole("button", { name: "Close" }).click();
  await generation(page, 6);
  await page.getByRole("button", { name: "About Pidgeot" }).click();
  await expect(dialog.getByLabel("Speed: 101", { exact: true })).toBeVisible();
  await expect(dialog).toContainText("Total 479");
  await expect(dialog).toContainText("Keen Eye, Tangled Feet, Big Pecks");
});
