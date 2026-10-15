import { test, expect } from "fixtures";
import { isMdDown, selectPokemon, showSlot } from "helper";

test.describe("Tab Slot - Unit Tests", () => {
  test.use({ viewport: { width: 400, height: 800 } });

  test("a dragged slot leaves no grip behind in its place", async ({
    page,
  }) => {
    test.skip(!isMdDown(page), "Desktop has no slot tabs");
    await selectPokemon(page, "Spinda");
    await showSlot(page, 1);
    await selectPokemon(page, "Maushold", 1);
    const grip = page
      .getByRole("tablist", { name: "Pokemon team slots" })
      .getByRole("tab")
      .first()
      .getByTestId("DragIndicatorIcon");
    await expect(grip).toBeVisible();
    const from = await grip.boundingBox();
    if (!from) throw new Error("The slot tabs are not on screen");
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(from.x + 40, from.y + from.height / 2, { steps: 5 });
    await expect(grip).toBeHidden();
    await page.mouse.up();
    await expect(grip).toBeVisible();
  });
});
