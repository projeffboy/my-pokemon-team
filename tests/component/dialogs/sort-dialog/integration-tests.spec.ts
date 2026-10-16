import { test, expect } from "fixtures";
import { closeDialog, openSort } from "helper";

test.describe("Sort Dialog - Integration Tests", () => {
  test("orders the Name dropdown", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
    const firstOption = page.getByRole("listbox").getByRole("option").first();

    await input.click();
    await expect(firstOption).toHaveText("Bulbasaur");
    await input.press("Escape");

    // Sort in the Name dropdown opens on the Pokemon tab
    await openSort(page);
    await expect(
      page.getByRole("tab", { name: "Pokemon", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page.getByRole("radio", { name: "Base stat total" }).check();
    await page.getByRole("button", { name: "Descending" }).click();
    await closeDialog(page);

    await input.click();
    await expect(firstOption).toHaveText("Eternatus-Eternamax");
    await input.press("Escape");

    await openSort(page);
    await page.getByRole("radio", { name: "Pokedex number" }).check();
    await page.getByRole("button", { name: "Ascending" }).click();
    await closeDialog(page);

    await input.click();
    await expect(firstOption).toHaveText("Bulbasaur");
  });
});

test("Gen 1 represents a saved Special Defense sort as Special", async ({
  page,
}) => {
  await openSort(page);
  await page.getByRole("radio", { name: "Sp. Def", exact: true }).check();
  await page.getByRole("button", { name: "Descending", exact: true }).click();
  await closeDialog(page);
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 1 / }).click();
  await openSort(page);
  await expect(
    page.getByRole("radio", { name: "Special", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("button", { name: "Descending", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await closeDialog(page);
  await page.reload();
  await openSort(page);
  await expect(
    page.getByRole("radio", { name: "Special", exact: true }),
  ).toBeChecked();
});
