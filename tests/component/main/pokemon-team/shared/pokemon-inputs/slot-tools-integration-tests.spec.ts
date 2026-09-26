import { test, expect } from "fixtures";
import { getTeamTextFromUrl, isMdDown, selectPokemon } from "helper";

test.describe("Slot tools - Integration Tests", () => {
  test("Random fills the slot with a pokemon and four moves", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Random pokemon for slot 1" })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).not.toHaveValue("");
    for (const move of [1, 2, 3, 4]) {
      await expect(page.getByLabel(`Pokemon 1's move${move}`)).not.toHaveValue(
        "",
      );
    }
    await expect
      .poll(() =>
        getTeamTextFromUrl(page)
          .split("\n")
          .filter(line => line.startsWith("- ")),
      )
      .toHaveLength(4);
  });

  test("moves a pokemon to the next slot and back", async ({ page }) => {
    await selectPokemon(page, "Quagsire");
    await page
      .getByRole("button", { name: "Move to the next slot" })
      .first()
      .click();

    // A tabbed viewer follows the pokemon to its new slot
    if (isMdDown(page)) {
      await expect(
        page.getByRole("tab", {
          name: /^Pokemon 2 \(Quagsire\)|Pokemon 1 \(empty\) and Pokemon 2 \(Quagsire\)/,
        }),
      ).toHaveAttribute("aria-selected", "true");
    }
    await expect(page.getByLabel("Pokemon 2's name")).toHaveValue("Quagsire");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Quagsire");

    await page
      .getByRole("button", { name: "Move to the previous slot" })
      .nth(
        (
          isMdDown(page) &&
            !(await page.getByLabel("Pokemon 1's name").isVisible())
        ) ?
          0
        : 1,
      )
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Quagsire");
    await expect(
      page.getByRole("button", { name: "Move to the previous slot" }).first(),
    ).toBeDisabled();
  });
});
