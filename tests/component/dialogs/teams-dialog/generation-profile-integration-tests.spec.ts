import { readFile } from "node:fs/promises";
import { test, expect } from "fixtures";
import { clickMenuItem, openManageTeamMenu, selectPokemon } from "helper";
import type { Page } from "@playwright/test";

async function importText(page: Page, text: string) {
  await openManageTeamMenu(page);
  await clickMenuItem(page, "Import team");
  const dialog = page.getByRole("dialog", { name: "Import Team" });
  await dialog.getByRole("textbox").fill(text);
  await dialog.getByRole("button", { name: "Import", exact: true }).click();
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

test("Export All and Import team retain a combined team even when Champions is selected", async ({
  page,
}) => {
  await page.goto("/");
  await selectPokemon(page, "Miltank");
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  const teams = page.getByRole("dialog", { name: "Teams", exact: true });
  const downloading = page.waitForEvent("download");
  await teams.getByRole("button", { name: "Export All", exact: true }).click();
  const file = await (await downloading).path();
  expect(file).not.toBeNull();
  if (!file) throw new Error("The text export was not downloaded");
  const text = await readFile(file, "utf8");
  expect(text).toContain("# mypokemonteam generation profile: 6-9");
  await teams.getByRole("button", { name: "Close", exact: true }).click();
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

test("plain imported text uses the combined selection and preserves union-only moves", async ({
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
  await page.reload();
  await expect(
    page.getByLabel("Pokemon 1's move1", { exact: true }),
  ).toHaveValue("Weather Ball");
});
