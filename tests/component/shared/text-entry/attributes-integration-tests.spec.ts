import { test, expect } from "fixtures";
import type { Locator } from "@playwright/test";
import {
  clickMenuItem,
  closeDialog,
  openAdvanced,
  openEditPokepaste,
  openFilters,
  selectPokemon,
} from "helper";

// No field offers saved passwords, cards, addresses, or contacts
const expectNoAutofill = async (field: Locator) => {
  await expect(field).toHaveAttribute("autocomplete", "off");
  await expect(field).toHaveAttribute("name", /^search-/);
};
// Team data and Showdown text are kept as typed
const expectVerbatim = async (field: Locator) => {
  await expectNoAutofill(field);
  await expect(field).toHaveAttribute("spellcheck", "false");
  await expect(field).toHaveAttribute("autocorrect", "off");
  await expect(field).toHaveAttribute("autocapitalize", "none");
};

test("a slot's dropdowns and set details keep their text as typed", async ({
  page,
}) => {
  await selectPokemon(page, "Tinkaton");
  for (const property of [
    "name",
    "move1",
    "move2",
    "move3",
    "move4",
    "item",
    "ability",
  ])
    await expectVerbatim(
      page.getByLabel(`Pokemon 1's ${property}`, { exact: true }),
    );
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  await expectVerbatim(dialog.getByLabel("Nickname", { exact: true }));
  const numbers = await dialog.getByRole("spinbutton").all();
  expect(numbers.length).toBeGreaterThan(12);
  for (const field of numbers) await expectVerbatim(field);
});

test("the ability filter, team text, and team names keep their text as typed", async ({
  page,
}) => {
  await openFilters(page);
  await expectVerbatim(
    page
      .getByRole("dialog", { name: "Filters" })
      .getByRole("combobox", { name: "Ability" }),
  );
  await closeDialog(page);
  await openEditPokepaste(page);
  await expectVerbatim(
    page.getByRole("dialog", { name: "Edit Pokepaste" }).getByRole("textbox"),
  );
  await closeDialog(page, "Cancel");
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await page
    .getByRole("button", { name: "Options for Team 1", exact: true })
    .click();
  await clickMenuItem(page, "Edit team name");
  const nameEditor = page.getByRole("dialog", { name: "Edit team name" });
  await expectVerbatim(nameEditor.getByLabel("Team name"));
  await nameEditor.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: "Import Team", exact: true }).click();
  await expectVerbatim(
    page.getByRole("dialog", { name: "Import Team" }).getByRole("textbox"),
  );
});
