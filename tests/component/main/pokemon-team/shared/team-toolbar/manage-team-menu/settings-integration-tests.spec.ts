import { test, expect } from "fixtures";
import { createViewport, selectMove, selectPokemon } from "helper";

test.describe("Manage team menu settings", () => {
  test.use({ viewport: createViewport(400) });

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
