import { test, expect } from "fixtures";
import {
  closeDialog,
  openAnalysis,
  openFilters,
  selectDialogOption,
  selectPokemon,
  showChecklistTooltip,
} from "helper";

test.describe("Team Checklist and Dialogs - Integration Tests", () => {
  test("on a Generations 6–9 team, an unfilled role's tooltip leaves out what the format in the filters bans", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await selectPokemon(page, "Hatterene");
    await openFilters(page);
    await selectDialogOption(page, "Format", "OU: Over Used");
    await closeDialog(page);
    await openAnalysis(page, "Team Checklist");
    // OU bans Spore, Shadow Tag, and Arena Trap
    await expect(
      await showChecklistTooltip(page, testInfo, "Status Move", "Toxic"),
    ).toHaveText(
      "Give a pokemon a move that always inflicts a status condition when it hits, such as Toxic, Will-O-Wisp, or Thunder Wave.",
    );
    await expect(
      await showChecklistTooltip(page, testInfo, "Trapper", "Mean Look"),
    ).toHaveText(
      "Give a pokemon a move that stops the foe from switching out, such as Mean Look, Block, or Anchor Shot, or the ability Magnet Pull.",
    );
  });
});
