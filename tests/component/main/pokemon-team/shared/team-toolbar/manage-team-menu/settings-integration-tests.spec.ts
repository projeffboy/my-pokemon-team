import { test, expect } from "fixtures";
import { createViewport, selectMove, selectPokemon } from "helper";

test.describe("Manage team menu settings", () => {
  test.use({ viewport: createViewport(400) });

  test("Advanced puts Filters and Sort in the dropdowns and survives a reload", async ({
    page,
  }) => {
    const nameInput = page.getByRole("combobox", { name: "Pokemon 1's name" });
    const filters = page.getByRole("button", { name: "Filters", exact: true });
    const advanced = page.getByRole("menuitemcheckbox", { name: "Advanced" });
    const expectFilters = async (shown: boolean) => {
      await nameInput.click();
      await expect(
        page.getByRole("button", { name: "Grid view", exact: true }),
      ).toBeVisible();
      await expect(filters).toHaveCount(shown ? 1 : 0);
      await nameInput.press("Escape");
    };
    await expectFilters(false);

    await page.getByRole("button", { name: "Manage team" }).click();
    await expect(advanced).toHaveAttribute("aria-checked", "false");
    await advanced.click();
    // The menu stays open, so the switch is seen to flip
    await expect(advanced).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Escape");
    await expectFilters(true);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expectFilters(true);

    // From md the toolbar has the switch, so the menu leaves it out
    await page.setViewportSize({ width: 1200, height: 900 });
    await expect(
      page.getByRole("button", { name: "Advanced", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Manage team" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(advanced).toHaveCount(0);
  });

  test("Show move types hides each move's type icon when turned off", async ({
    page,
  }) => {
    await selectPokemon(page, "Arctozolt");
    await selectMove(page, "Icicle Crash");
    const field = page.getByLabel("Pokemon 1's move1").locator("..");
    const icon = field.getByRole("img", { name: "Ice" });
    const setting = page.getByRole("menuitemcheckbox", {
      name: "Show move types",
    });
    await expect(icon).toBeVisible();

    await page.getByRole("button", { name: "Manage team" }).click();
    await expect(setting).toHaveAttribute("aria-checked", "true");
    await setting.click();
    await expect(setting).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Escape");
    await expect(icon).toHaveCount(0);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue(
      "Icicle Crash",
    );
    await expect(icon).toHaveCount(0);
  });
});
