import { test, expect } from "fixtures";
import { closeDialog, openSort } from "helper";

test.describe("Sort Dialog - Integration Tests", () => {
  test("orders the Name dropdown", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
    const firstOption = page.getByRole("listbox").getByRole("option").first();

    await input.click();
    await expect(firstOption).toHaveText("Abomasnow");
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
