import { LEGENDS_ZA, LEGENDS_ARCEUS } from "@/shared/game-variants";
import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectAbility,
  selectItem,
  openTeamTools,
} from "helper";
import type { Page } from "@playwright/test";

async function generation(page: Page, gen: number) {
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page
    .getByRole("option")
    .and(page.locator(`[data-value="${gen}"]`))
    .click();
  await expect(page.locator("header .MuiSelect-nativeInput")).toHaveValue(
    `${gen}`,
  );
  await expect(page.locator(".MuiMenu-paper")).toBeHidden();
}

test("Dry Skin weaknesses show their actual damage multipliers", async ({
  page,
}) => {
  for (const [pokemon, fire] of [
    ["Parasect", "Fire ×5"],
    ["Toxicroak", "Fire ×1.25"],
  ]) {
    await selectPokemon(page, pokemon!);
    await selectAbility(page, "Dry Skin");
    await page.getByRole("button", { name: `About ${pokemon}` }).click();
    const dialog = page.getByRole("dialog", { name: pokemon!, exact: true });
    const weakTo = dialog
      .getByRole("heading", { name: "Weak to" })
      .locator("..");
    await expect(weakTo.getByText(fire!, { exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
  }
});

for (const profile of [
  {
    game: LEGENDS_ZA,
    slug: "legends-za",
    pokemon: "Mawile-Mega",
    attack: 147,
    total: 522,
  },
  {
    game: LEGENDS_ARCEUS,
    slug: "legends-arceus",
    pokemon: "Cherrim-Sunshine",
    attack: 90,
    total: 519,
  },
]) {
  test.fixme(`the Pokédex uses native stats in ${profile.game}`, async ({
    page,
  }) => {
    const team = Buffer.from(profile.pokemon).toString("base64url");
    await page.goto(`/?game=${profile.slug}&team=${team}`);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
      profile.pokemon,
    );
    await page
      .getByRole("button", { name: `About ${profile.pokemon}` })
      .click();
    const dialog = page.getByRole("dialog", {
      name: profile.pokemon,
      exact: true,
    });
    await expect(
      dialog.getByLabel(`Attack: ${profile.attack}`, { exact: true }),
    ).toBeVisible();
    await expect(dialog).toContainText(`Total ${profile.total}`);
  });
}

test("the Pokédex uses a single Special stat in Gen 1 and no abilities before Gen 3", async ({
  page,
}) => {
  await generation(page, 1);
  await selectPokemon(page, "Hypno");
  await page.getByRole("button", { name: "About Hypno" }).click();
  const dialog = page.getByRole("dialog", { name: "Hypno" });
  await expect(
    dialog.getByLabel("Special: 115", { exact: true }),
  ).toBeVisible();
  await expect(dialog).toContainText("Total 410");
  await expect(dialog.getByText("Sp. Atk", { exact: true })).toBeHidden();
  await expect(dialog.getByText("Sp. Def", { exact: true })).toBeHidden();
  await expect(dialog.getByRole("heading", { name: "Abilities" })).toBeHidden();
  await dialog.getByRole("button", { name: "Close" }).click();
  await generation(page, 2);
  await page.getByRole("button", { name: "About Hypno" }).click();
  await expect(dialog.getByLabel("Sp. Atk: 73", { exact: true })).toBeVisible();
  await expect(
    dialog.getByLabel("Sp. Def: 115", { exact: true }),
  ).toBeVisible();
  await expect(dialog).toContainText("Total 483");
  await expect(dialog.getByRole("heading", { name: "Abilities" })).toBeHidden();
});

test("Pidgeot's stats and abilities follow the selected generation", async ({
  page,
}) => {
  await generation(page, 3);
  await selectPokemon(page, "Pidgeot");
  await page.getByRole("button", { name: "About Pidgeot" }).click();
  const dialog = page.getByRole("dialog", { name: "Pidgeot" });
  await expect(dialog.getByLabel("Speed: 91", { exact: true })).toBeVisible();
  await expect(dialog).toContainText("Total 469");
  await expect(dialog).toContainText("Keen Eye");
  await expect(dialog).not.toContainText("Tangled Feet");
  await expect(dialog).not.toContainText("Big Pecks");
  await dialog.getByRole("button", { name: "Close" }).click();
  await generation(page, 6);
  await page.getByRole("button", { name: "About Pidgeot" }).click();
  await expect(dialog.getByLabel("Speed: 101", { exact: true })).toBeVisible();
  await expect(dialog).toContainText("Total 479");
  await expect(dialog).toContainText("Keen Eye, Tangled Feet, Big Pecks");
});
test("Dry Skin weaknesses use the same Fire multiplier as the matrix", async ({
  page,
}) => {
  await selectPokemon(page, "Parasect");
  await selectAbility(page, "Dry Skin");
  await page.getByRole("button", { name: "About Parasect" }).click();
  const dialog = page.getByRole("dialog", { name: "Parasect", exact: true });
  await expect(dialog.getByText("Fire ×5", { exact: true })).toBeVisible();
});

test("held-item typing stays consistent between the slot and its Pokédex", async ({
  page,
}) => {
  await selectPokemon(page, "Arceus");
  await selectItem(page, "Flame Plate");
  await openTeamTools(page);
  const slot = page.getByRole("region", { name: "Pokemon 1", exact: true });
  await expect(
    slot.getByRole("img", { name: "Fire", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "About Arceus" }).click();
  const dialog = page.getByRole("dialog", { name: "Arceus", exact: true });
  await expect(dialog.getByText("Fire", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Normal", { exact: true })).toBeHidden();
  await expect(dialog.getByText("Ground", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await selectItem(page, "Splash Plate");
  await expect(
    slot.getByRole("img", { name: "Water", exact: true }),
  ).toBeVisible();
  await expect(
    slot.getByRole("img", { name: "Fire", exact: true }),
  ).toBeHidden();
});
