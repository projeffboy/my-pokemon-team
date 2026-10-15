import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";
import { isMdDown, selectPokemon, showSlot } from "helper";

const problems = (page: Page) =>
  page.getByRole("status", { name: "Team problems" });

// The marker on a slot's card, which shows only while the card does
const marker = async (page: Page, slotIndex: number, pokemon: string) => {
  await showSlot(page, slotIndex);
  return page
    .getByRole("region", { name: `Pokemon ${slotIndex + 1}`, exact: true })
    .getByRole("img", { name: `Problems with ${pokemon}` });
};

// Below md, the slot tabs mark each slot that has a problem
const expectTabMarkers = async (page: Page, count: number) => {
  if (!isMdDown(page)) return;
  await expect(
    page
      .getByRole("tablist", { name: "Pokemon team slots" })
      .getByTestId("WarningIcon"),
  ).toHaveCount(count);
};

test.describe("Team Problems and Pokemon Inputs - Integration Tests", () => {
  test("the problems follow each change to the team and mark the slots they concern", async ({
    page,
  }) => {
    await selectPokemon(page, "Azumarill", 0);
    await expect(problems(page)).toHaveText("No problems found for Gen 9.");

    // The empty slot between the two is not a problem
    await showSlot(page, 2);
    await selectPokemon(page, "Azumarill", 2);
    const speciesClause = "Two pokemon are Azumarill (Species Clause).";
    await expect(problems(page).getByRole("listitem")).toHaveText([
      speciesClause,
    ]);
    await expectTabMarkers(page, 2);
    const third = await marker(page, 2, "Azumarill");
    await expect(third).toBeVisible();
    await third.click();
    await expect(page.getByRole("tooltip")).toHaveText(speciesClause);
    await expect(await marker(page, 0, "Azumarill")).toBeVisible();

    await showSlot(page, 2);
    await selectPokemon(page, "Pawmot", 2);
    await expect(problems(page)).toHaveText("No problems found for Gen 9.");
    await expectTabMarkers(page, 0);
    await expect(await marker(page, 0, "Azumarill")).toHaveCount(0);
  });
});
