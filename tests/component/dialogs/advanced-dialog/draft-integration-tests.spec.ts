import { test, expect } from "fixtures";
import { getTeamTextFromUrl, openAdvanced, selectPokemon } from "helper";

for (const replacement of [true, false]) {
  test(`numeric drafts ${replacement ? "reset for a replaced Pokemon" : "stay active for the same Pokemon"}`, async ({
    page,
    context,
  }) => {
    await selectPokemon(page, "Mareep");
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    const level = dialog.getByRole("spinbutton", {
      name: "Level",
      exact: true,
    });
    await level.fill("40");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mypokemonteam")))
      .toContain('"level":40');
    const other = await context.newPage();
    await other.goto(page.url());
    if (replacement) {
      await selectPokemon(other, "Mantine");
      await expect(dialog.getByText("Mantine", { exact: true })).toBeVisible();
      await expect(level).toHaveValue("100");
      await expect
        .poll(() => getTeamTextFromUrl(page))
        .not.toContain("Level: 40");
    } else {
      await openAdvanced(other);
      await other
        .getByRole("spinbutton", { name: "Level", exact: true })
        .fill("70");
      await expect.poll(() => getTeamTextFromUrl(page)).toContain("Level: 70");
      await expect(level).toHaveValue("40");
      await expect(level).toBeFocused();
      await level.press("Tab");
      await expect(level).toHaveValue("70");
    }
    await other.close();
  });
}
