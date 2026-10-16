import { test, expect } from "fixtures";
import { closeDialog, openSort, selectPokemon } from "helper";

test("the move dropdowns sort by name or type in place, apart from the pokemon, and remember it", async ({
  page,
}) => {
  await selectPokemon(page, "Eelektross");
  const input = page.getByRole("combobox", { name: "Pokemon 1's move1" });
  const list = page.getByRole("listbox");
  const header = (name: RegExp) =>
    page.getByRole("group", { name: "Sort by" }).getByRole("button", { name });
  const expectOrder = async (first: string, second: string) => {
    await expect(
      list.getByRole("option").filter({ hasText: first }),
    ).toBeVisible();
    await expect(
      list.getByRole("option").filter({ hasText: second }),
    ).toBeVisible();
    const labels = await list
      .getByRole("option")
      .locator(":scope > span:last-child")
      .allTextContents();
    expect(labels.indexOf(first)).toBeGreaterThanOrEqual(0);
    expect(labels.indexOf(first)).toBeLessThan(labels.indexOf(second));
  };

  await input.fill("Punch");
  await expect(header(/^Name/)).toHaveAccessibleName("Name, Ascending");
  await expect(header(/^Name/)).toHaveAttribute("aria-pressed", "true");
  await expectOrder("Drain Punch", "Thunder Punch");

  // Pressing the active header reverses it
  await header(/^Name/).click();
  await expect(header(/^Name/)).toHaveAccessibleName("Name, Descending");
  await expectOrder("Thunder Punch", "Drain Punch");
  await expect(input).toBeFocused();

  // Another header sorts by it from the start
  await header(/^Type/).click();
  await expect(header(/^Type/)).toHaveAccessibleName("Type, Ascending");
  await expect(header(/^Name/)).toHaveAttribute("aria-pressed", "false");
  await expectOrder("Thunder Punch", "Fire Punch");
  await header(/^Type/).click();
  await expectOrder("Fire Punch", "Thunder Punch");
  await input.press("Escape");

  // The pokemon keep their own order
  await openSort(page);
  await expect(
    page.getByRole("radio", { name: "Pokedex number", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("button", { name: "Ascending", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await closeDialog(page);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("combobox", { name: "Pokemon 1's name" }),
  ).toHaveValue("Eelektross");
  await input.fill("Punch");
  await expect(header(/^Type/)).toHaveAccessibleName("Type, Descending");
  await expectOrder("Fire Punch", "Thunder Punch");
});

test("Tab from a move dropdown reaches its sort headers, and Shift+Tab returns", async ({
  page,
}, testInfo) => {
  test.skip(!!testInfo.project.use.hasTouch, "Requires a keyboard");
  await selectPokemon(page, "Toxapex");
  const input = page.getByRole("combobox", { name: "Pokemon 1's move1" });
  const header = (name: RegExp) =>
    page.getByRole("group", { name: "Sort by" }).getByRole("button", { name });
  await input.fill("Toxic");
  await input.press("Tab");
  await expect(header(/^Name/)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(header(/^Name/)).toHaveAccessibleName("Name, Descending");
  await page.keyboard.press("Tab");
  await expect(header(/^Type/)).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(input).toBeFocused();
  await expect(page.getByRole("listbox")).toBeVisible();
});
