import { test, expect } from "fixtures";

test.describe("Name dropdown views - Unit Tests", () => {
  test("fits Dudunsparce-Three-Segment within two lines", async ({ page }) => {
    await page
      .getByRole("combobox", { name: "Pokemon 1's name" })
      .fill("Dudunsparce");
    await page.evaluate(() => document.fonts.ready);
    const option = page.getByRole("option", {
      name: "Dudunsparce-Three-Segment",
      exact: true,
    });
    await expect(option).toBeVisible();
    await expect(option).toHaveText("Dudunsparce-Three-Segment");
    await expect
      .poll(() =>
        option
          .locator("span")
          .first()
          .evaluate(icon => icon.getBoundingClientRect().width),
      )
      .toBe(40);
    await expect
      .poll(() =>
        option
          .locator("span")
          .last()
          .evaluate(label => {
            const lineHeight = parseFloat(getComputedStyle(label).lineHeight);
            return label.getBoundingClientRect().height / lineHeight;
          }),
      )
      .toBeLessThanOrEqual(2);
    await expect
      .poll(() =>
        option
          .locator("span")
          .last()
          .evaluate(label => {
            const row = label.parentElement;
            if (!row) return false;
            const bounds = label.getBoundingClientRect();
            const rowBounds = row.getBoundingClientRect();
            return (
              label.scrollWidth <= label.clientWidth &&
              label.scrollHeight <= label.clientHeight &&
              bounds.right <= rowBounds.right &&
              bounds.bottom <= rowBounds.bottom
            );
          }),
      )
      .toBe(true);
  });

  test("switches between the list and the grid of icons", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
    await input.fill("Wooper");
    const listbox = page.getByRole("listbox");
    await expect(
      listbox.getByRole("option", { name: "Wooper", exact: true }),
    ).toContainText("Wooper");

    const toggle = page.getByRole("group", { name: "Name list view" });
    const buttons = toggle.getByRole("button");
    const firstButton = await buttons.first().boundingBox();
    const lastButton = await buttons.last().boundingBox();
    const popup = await page.locator(".MuiAutocomplete-paper").boundingBox();
    expect(firstButton && lastButton && popup).toBeTruthy();
    if (firstButton && lastButton && popup)
      expect((firstButton.x + lastButton.x + lastButton.width) / 2).toBeCloseTo(
        popup.x + popup.width / 2,
        0,
      );
    const listBounds = await toggle.boundingBox();
    await page.getByRole("button", { name: "Grid view" }).click();
    await expect
      .poll(async () => (await toggle.boundingBox())?.x)
      .toBe(listBounds?.x);
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
    const gridBounds = await toggle.boundingBox();
    await page.getByRole("button", { name: "List view" }).click();
    await expect
      .poll(async () => (await toggle.boundingBox())?.x)
      .toBe(gridBounds?.x);
    await expect(
      listbox.getByRole("option", { name: "Clodsire" }),
    ).toContainText("Clodsire");
  });
});
