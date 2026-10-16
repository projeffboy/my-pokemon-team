import { readFile } from "node:fs/promises";
import { test, expect } from "fixtures";
import { openTeamsImportExport, selectPokemon } from "helper";
import type { Page } from "@playwright/test";

async function importText(page: Page, text: string) {
  await openTeamsImportExport(page);
  const dialog = page.getByRole("dialog", { name: "Import/Export" });
  await dialog.getByRole("textbox").fill(text);
  await dialog.getByRole("button", { name: "Add teams", exact: true }).click();
  await expect(dialog).toBeHidden();
  const teams = page.getByRole("dialog", { name: "Teams", exact: true });
  await teams.getByRole("button", { name: "Close", exact: true }).click();
  await expect(teams).toBeHidden();
}

for (const header of ["gen9", "gen9ou"]) {
  test(`importing ${header} while combined is selected uses regular Gen 9`, async ({
    page,
  }) => {
    await page.goto("/");
    const generation = page.getByRole("combobox", { name: "Generation" });
    await expect(generation).toContainText(/Generations 6–9|Gens 6–9/);
    await importText(
      page,
      `=== [${header}] Imported ===\n\nSerperior\nAbility: Contrary\n- Leaf Storm`,
    );
    await expect(generation).toContainText(/Scarlet|SV/);
    await expect(
      page.getByLabel("Pokemon 1's name", { exact: true }),
    ).toHaveValue("Serperior");
    await expect(page).toHaveURL(/gen=9/);
    await expect(page).not.toHaveURL(/gen=6-9/);
    await page.reload();
    await expect(generation).toContainText(/Scarlet|SV/);
  });
}

test("Download and Add teams in Import/Export retain a combined team even when Champions is selected", async ({
  page,
}) => {
  test.slow();
  await page.goto("/");
  await selectPokemon(page, "Miltank");
  await openTeamsImportExport(page);
  const downloading = page.waitForEvent("download");
  await page
    .getByRole("dialog", { name: "Import/Export" })
    .getByRole("button", { name: "Download", exact: true })
    .click();
  const file = await (await downloading).path();
  expect(file).not.toBeNull();
  if (!file) throw new Error("The text export was not downloaded");
  const text = await readFile(file, "utf8");
  expect(text).toContain("# mypokemonteam generation profile: 6-9");
  // As on another browser, which does not have the team yet
  await page.evaluate(() => localStorage.clear());
  await page.goto("/?game=champions");
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText("Champions");
  await importText(page, text);
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText(/Generations 6–9|Gens 6–9/);
  await expect(
    page.getByLabel("Pokemon 1's name", { exact: true }),
  ).toHaveValue("Miltank");
  await expect(page).toHaveURL(/gen=6-9/);
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText(/Generations 6–9|Gens 6–9/);
});

test("plain imported text uses the combined selection and keeps its moves after a reload", async ({
  page,
}) => {
  await page.goto("/?gen=6-9");
  await importText(
    page,
    "Vivillon-Fancy\nAbility: Compound Eyes\n- Weather Ball",
  );
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText(/Generations 6–9|Gens 6–9/);
  await expect(
    page.getByLabel("Pokemon 1's move1", { exact: true }),
  ).toHaveValue("Weather Ball");
  await expect(page).toHaveURL(/team=/);
  await page.reload();
  await expect(
    page.getByLabel("Pokemon 1's move1", { exact: true }),
  ).toHaveValue("Weather Ball");
});
