import { test, expect } from "fixtures";
import {
  selectPokemon,
  openAdvanced,
  closeDialog,
  getTeamTextFromUrl,
} from "helper";
import type { Page } from "@playwright/test";

async function generation(page: Page, name: RegExp) {
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name }).click();
  await expect(page.locator(".MuiMenu-paper")).toBeHidden();
}

test("Gen 1 hides later features and offers five stat-experience rows and linked DVs", async ({
  page,
}) => {
  await generation(page, /^Gen 1 /);
  await selectPokemon(page, "Nidorina");
  await expect(
    page.getByLabel("Pokemon 1's item", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByLabel("Pokemon 1's ability", { exact: true }),
  ).toHaveCount(0);
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  for (const name of ["Gender", "Shiny", "Nature", "Tera Type"])
    await expect(dialog.getByLabel(name, { exact: true })).toHaveCount(0);
  await expect(dialog.getByRole("slider")).toHaveCount(5);
  const attack = dialog.getByRole("slider", { name: "Atk Stat experience" });
  await expect(attack).toHaveAttribute("max", "65535");
  await attack.focus();
  await page.keyboard.press("End");
  await dialog.getByRole("slider", { name: "HP Stat experience" }).focus();
  await page.keyboard.press("End");
  await expect(dialog.getByLabel("HP DVs", { exact: true })).toHaveJSProperty(
    "readOnly",
    true,
  );
  await dialog.getByLabel("Atk DVs", { exact: true }).fill("0");
  await dialog.getByLabel("Nickname").focus();
  await expect(dialog.getByLabel("HP DVs", { exact: true })).toHaveValue("7");
  await expect(dialog.getByLabel(/EV total/)).toHaveCount(0);
  await closeDialog(page);
  expect(getTeamTextFromUrl(page)).toContain(
    "Stat Experience: 65535 HP / 65535 Atk",
  );
  await page.reload();
  await openAdvanced(page);
  await expect(attack).toHaveValue("65535");
  await expect(dialog.getByLabel("Atk DVs", { exact: true })).toHaveValue("0");
});

test("Gen 2 shiny is tied to DVs and gender is derived from the Attack DV", async ({
  page,
}) => {
  await generation(page, /^Gen 2 /);
  await selectPokemon(page, "Cyndaquil");
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  await expect(dialog.getByLabel("Nature", { exact: true })).toHaveCount(0);
  await expect(dialog.getByLabel("Gender", { exact: true })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await dialog.getByLabel("Atk DVs", { exact: true }).fill("0");
  await dialog.getByLabel("Nickname").focus();
  await expect(dialog.getByLabel("Gender", { exact: true })).toContainText(
    "Female",
  );
  await expect(dialog.getByTestId("FemaleIcon")).toBeVisible();
  await dialog.getByLabel("Shiny", { exact: true }).check();
  await expect(dialog.getByLabel("Special DVs", { exact: true })).toHaveValue(
    "10",
  );
  await expect(dialog.getByLabel("HP DVs", { exact: true })).toHaveValue("8");
  await expect(dialog.getByLabel("Gender", { exact: true })).toContainText(
    "Male",
  );
  await expect(dialog.getByTestId("MaleIcon")).toBeVisible();
  await dialog.getByLabel("Special DVs", { exact: true }).fill("9");
  await dialog.getByLabel("Nickname").focus();
  await expect(dialog.getByLabel("Shiny", { exact: true })).not.toBeChecked();
});

test("Gen 3 uses its ability pool and 255 EV cap with a 510 total", async ({
  page,
}) => {
  await generation(page, /^Gen 3 /);
  await selectPokemon(page, "Bulbasaur");
  await expect(
    page.getByLabel("Pokemon 1's ability", { exact: true }),
  ).toHaveValue("Overgrow");
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  const attack = dialog.getByRole("slider", { name: "Atk EVs" });
  await expect(attack).toHaveAttribute("max", "255");
  await attack.focus();
  await page.keyboard.press("End");
  await dialog.getByRole("slider", { name: "HP EVs" }).focus();
  await page.keyboard.press("End");
  await dialog.getByRole("slider", { name: "Spe EVs" }).focus();
  await page.keyboard.press("End");
  await expect(dialog.getByLabel(/^EV total/)).toHaveText("510 / 510");
  await expect(dialog.getByRole("slider", { name: "Spe EVs" })).toHaveValue(
    "0",
  );
  await closeDialog(page);
  await page.reload();
  await openAdvanced(page);
  await expect(attack).toHaveValue("255");
});

for (const variant of [
  {
    name: "Gen 8 · Legends: Arceus",
    display: /^Gen 8 · (Legends: Arceus|Legends Arceus|PLA)$/,
    training: "Effort Levels",
    max: "10",
    item: false,
    iv: false,
    gen: 8,
  },
  {
    name: "Gen 9 · Legends: Z-A",
    display: /^Gen 9 · (Legends: Z-A|Legends Z-A|Z-A)$/,
    training: "EVs",
    max: "252",
    item: true,
    iv: true,
    gen: 9,
  },
  {
    name: "Gen 7 · Let’s Go, Pikachu! / Eevee!",
    display: /Let’s Go|LGPE/,
    training: "AVs",
    max: "200",
    item: false,
    iv: true,
    gen: 7,
  },
]) {
  test(`${variant.name} has its own controls, limits and saved link context`, async ({
    page,
    browser,
  }) => {
    if (variant.name.includes("Legends:")) {
      const game = variant.name.split(" · ")[1] ?? "";
      const team = Buffer.from("Pikachu\n").toString("base64url");
      await page.goto(`/?team=${team}&game=${encodeURIComponent(game)}`);
    } else {
      await generation(
        page,
        new RegExp(`^${variant.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      );
    }
    await selectPokemon(page, "Pikachu");
    await expect(
      page.getByLabel("Pokemon 1's ability", { exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByLabel("Pokemon 1's item", { exact: true }),
    ).toHaveCount(variant.item ? 1 : 0);
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    await expect(dialog.getByLabel("Tera Type", { exact: true })).toHaveCount(
      0,
    );
    await expect(dialog.getByLabel("Atk IVs", { exact: true })).toHaveCount(
      variant.iv ? 1 : 0,
    );
    const hp = dialog.getByRole("slider", { name: `HP ${variant.training}` });
    await expect(hp).toHaveAttribute("max", variant.max);
    await hp.focus();
    await page.keyboard.press("End");
    await closeDialog(page);
    const url = page.url();
    const fresh = await browser.newPage();
    try {
      await fresh.goto(url);
      await expect(
        fresh.getByRole("combobox", { name: "Generation" }),
      ).toContainText(variant.display);
      await openAdvanced(fresh);
      await expect(
        fresh.getByRole("slider", { name: `HP ${variant.training}` }),
      ).toHaveValue(variant.max);
    } finally {
      await fresh.close();
    }
  });
}
