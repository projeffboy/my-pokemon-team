import { test, expect } from "fixtures";
import { openFilters } from "helper";

test.describe("Filters Dialog - Unit Tests", () => {
  test("a tap where touch screens hide the Ability clear button opens the list", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, "Requires touch input");
    await openFilters(page);
    const dialog = page.getByRole("dialog", { name: "Filters" });
    const ability = dialog.getByRole("combobox", { name: "Ability" });
    await ability.fill("Levitate");
    await page.getByRole("option", { name: "Levitate", exact: true }).click();
    await dialog.getByRole("heading", { name: "Filters" }).click();
    await expect(ability).not.toBeFocused();
    const clear = dialog.getByRole("button", {
      name: "Clear",
      exact: true,
      includeHidden: true,
    });
    await expect(clear.first()).toBeHidden();
    const bounds = await clear.first().boundingBox();
    if (!bounds) throw new Error("No clear button for Ability");
    await page.touchscreen.tap(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    await expect(ability).toHaveAttribute("aria-expanded", "true");
    // Once the field has focus, the clear button shows and still clears it
    await clear.first().tap();
    await expect(ability).toHaveValue("");
  });
});
