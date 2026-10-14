import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectItem,
  selectMove,
  selectAbility,
  turnOnAdvanced,
} from "helper";

test("Judgment's input and options follow its plate", async ({ page }) => {
  await selectPokemon(page, "Arceus");
  await selectItem(page, "Flame Plate");
  await selectMove(page, "Judgment");
  await turnOnAdvanced(page);
  const input = page.getByLabel("Pokemon 1's move1");
  await expect(
    input.locator("..").getByRole("img", { name: "Fire", exact: true }),
  ).toBeVisible();
  await input.click();
  const option = page.getByRole("option", {
    name: "Fire Judgment",
    exact: true,
  });
  await expect(
    option.getByRole("img", { name: "Fire", exact: true }),
  ).toBeVisible();
  await input.press("Escape");
  await selectItem(page, "Splash Plate");
  await expect(
    input.locator("..").getByRole("img", { name: "Water", exact: true }),
  ).toBeVisible();
  await expect(
    input.locator("..").getByRole("img", { name: "Fire", exact: true }),
  ).toBeHidden();
});

test("move icons update when an ability changes their type", async ({
  page,
}) => {
  await selectPokemon(page, "Sylveon");
  await selectMove(page, "Hyper Voice");
  await turnOnAdvanced(page);
  const input = page.getByLabel("Pokemon 1's move1");
  await expect(
    input.locator("..").getByRole("img", { name: "Normal", exact: true }),
  ).toBeVisible();
  await selectAbility(page, "Pixilate");
  await expect(
    input.locator("..").getByRole("img", { name: "Fairy", exact: true }),
  ).toBeVisible();
  await input.click();
  await expect(
    page.getByRole("option", { name: "Fairy Hyper Voice", exact: true }),
  ).toBeVisible();
});
