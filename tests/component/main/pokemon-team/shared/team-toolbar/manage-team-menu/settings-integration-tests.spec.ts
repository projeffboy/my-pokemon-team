import { test, expect } from "fixtures";
import { createViewport, selectMove, selectPokemon } from "helper";

test.describe("Manage team menu settings", () => {
  test.use({ viewport: createViewport(400) });

  test("Show types hides the pokemon's and each move's type icons when turned off", async ({
    page,
  }) => {
    await selectPokemon(page, "Arctozolt");
    await selectMove(page, "Icicle Crash");
    const slot = page.getByRole("region", { name: "Pokemon 1", exact: true });
    const pokemonType = slot.getByRole("img", { name: "Electric" });
    const move = page.getByLabel("Pokemon 1's move1");
    const moveType = move.locator("..").getByRole("img", { name: "Ice" });
    const setting = page.getByRole("menuitemcheckbox", { name: "Show types" });
    await expect(pokemonType).toBeVisible();
    await expect(moveType).toBeVisible();

    await page.getByRole("button", { name: "Manage team" }).click();
    await expect(setting).toHaveAttribute("aria-checked", "true");
    await setting.click();
    await expect(setting).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Escape");
    await expect(pokemonType).toHaveCount(0);
    await expect(moveType).toHaveCount(0);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(move).toHaveValue("Icicle Crash");
    await expect(pokemonType).toHaveCount(0);
    await expect(moveType).toHaveCount(0);
    await page.getByLabel("Pokemon 1's move2").click({ force: true });
    const options = page.getByRole("listbox");
    await expect(options.getByRole("option").first()).toBeVisible();
    await expect(options.getByRole("img")).toHaveCount(0);
  });
});
