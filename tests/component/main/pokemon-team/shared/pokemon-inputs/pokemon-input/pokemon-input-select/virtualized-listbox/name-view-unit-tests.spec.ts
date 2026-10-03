import { test, expect } from "fixtures";

test.describe("Name dropdown views - Unit Tests", () => {
  test("switches between the list and the grid of icons", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
    await input.fill("Wooper");
    const listbox = page.getByRole("listbox");
    await expect(
      listbox.getByRole("option", { name: "Wooper", exact: true }),
    ).toContainText("Wooper");

    await page.getByRole("button", { name: "Grid view" }).click();
    const gridOption = listbox.getByRole("option", {
      name: "Wooper-Paldea",
      exact: true,
    });
    await expect(gridOption).toBeVisible();
    await expect(gridOption).toHaveText("");
    await gridOption.click();
    await expect(input).toHaveValue("Wooper-Paldea");

    // The chosen view is remembered for the next time the dropdown opens
    await input.fill("Clod");
    await expect(
      page.getByRole("button", { name: "Grid view" }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "List view" }).click();
    await expect(
      listbox.getByRole("option", { name: "Clodsire" }),
    ).toContainText("Clodsire");
  });
});
