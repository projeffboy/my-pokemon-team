import { test, expect } from "fixtures";
import { closeDialog, openSort, selectPokemon } from "helper";

test.describe("Sort Dialog - Integration Tests", () => {
  test("sorts moves by name or type independently and remembers the choice", async ({
    page,
  }) => {
    await selectPokemon(page, "Eelektross");
    const input = page.getByRole("combobox", { name: "Pokemon 1's move1" });
    const checkOrder = async (first: string, second: string) => {
      await input.fill("Punch");
      const list = page.getByRole("listbox");
      await expect(
        list.getByRole("option").filter({ hasText: first }),
      ).toBeVisible();
      await expect(
        list.getByRole("option").filter({ hasText: second }),
      ).toBeVisible();
      const labels = await list.getByRole("option").allTextContents();
      expect(labels.indexOf(first)).toBeLessThan(labels.indexOf(second));
      await input.press("Escape");
    };
    await checkOrder("Drain Punch", "Thunder Punch");
    await openSort(page);
    await page.getByRole("tab", { name: "Moves", exact: true }).click();
    await expect(
      page.getByRole("radio", { name: "Name", exact: true }),
    ).toBeChecked();
    await page.getByRole("button", { name: "Descending", exact: true }).click();
    await closeDialog(page);
    await checkOrder("Thunder Punch", "Drain Punch");

    await openSort(page);
    await page.getByRole("radio", { name: "Type", exact: true }).check();
    await page.getByRole("button", { name: "Ascending", exact: true }).click();
    await closeDialog(page);
    await checkOrder("Thunder Punch", "Fire Punch");
    await openSort(page);
    await page.getByRole("button", { name: "Descending", exact: true }).click();
    await page.getByRole("tab", { name: "Pokemon", exact: true }).click();
    await expect(
      page.getByRole("radio", { name: "Pokedex number", exact: true }),
    ).toBeChecked();
    await expect(
      page.getByRole("button", { name: "Ascending", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await closeDialog(page);
    await checkOrder("Fire Punch", "Thunder Punch");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("combobox", { name: "Pokemon 1's name" }),
    ).toHaveValue("Eelektross");
    await checkOrder("Fire Punch", "Thunder Punch");
  });
  test("orders the Name dropdown", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
    const firstOption = page.getByRole("listbox").getByRole("option").first();

    await input.click();
    await expect(firstOption).toHaveText("Bulbasaur");
    await input.press("Escape");

    await openSort(page);
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
