import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";
import { isMdDown, selectPokemon, showSlot } from "helper";
import { toBase64Url } from "@/app/shared/base64url";

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
    // The Species Clause applies in a format such as Champions
    await page.goto(`/?game=champions&team=${toBase64Url("Azumarill")}`, {
      waitUntil: "domcontentloaded",
    });
    const noProblems = "No problems found for Gen 9 Pokemon Champions (M-C).";
    await expect(problems(page)).toHaveText(noProblems);

    // The empty slot between the two is not a problem
    await showSlot(page, 2);
    await selectPokemon(page, "Azumarill", 2);
    const speciesClause = "Only one pokemon may be Azumarill (Species Clause).";
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
    await expect(problems(page)).toHaveText(noProblems);
    await expectTabMarkers(page, 0);
    await expect(await marker(page, 0, "Azumarill")).toHaveCount(0);
  });

  test("an ability a link keeps in Gen 2 shows its field until it is cleared", async ({
    page,
  }) => {
    await page.goto(
      `/?gen=2&team=${toBase64Url("Magneton\nAbility: Sturdy\n- Thunderbolt")}`,
      { waitUntil: "domcontentloaded" },
    );
    await expect(problems(page).getByRole("listitem")).toHaveText([
      "Magneton cannot have Sturdy.",
    ]);
    await expect(await marker(page, 0, "Magneton")).toBeVisible();
    const ability = page.getByLabel("Pokemon 1's ability", { exact: true });
    await expect(ability).toHaveValue("Sturdy");
    await ability.click();
    await ability
      .locator("..")
      .getByRole("button", { name: "Clear", exact: true })
      .click();
    await expect(problems(page)).toHaveText(/^No problems found/);
    await expect(ability).toHaveCount(0);
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue(
      "Thunderbolt",
    );
  });
});
