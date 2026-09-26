import type { Page } from "@playwright/test";
import { test, expect } from "fixtures";
import { getTeamTextFromUrl } from "helper";
import ja from "@/i18n/ja";
import fr from "@/i18n/fr";

const openLanguageMenu = async (page: Page) => {
  await page.getByRole("button", { name: /^(Language|言語|Langue)$/ }).click();
  await expect(page.getByRole("menu")).toBeVisible();
};

// Like the helper's selectPokemon, but by the label in the current language
const selectPokemon = async (page: Page, label: string, name: string) => {
  const input = page.getByLabel(label);
  await input.click({ force: true });
  await input.fill(name);
  await page.getByRole("listbox").getByText(name, { exact: true }).click();
  await expect(input).toHaveValue(name);
};

test.describe("Language Select - Integration Tests", () => {
  test("translates the page, keeps the team text English, and remembers the choice", async ({
    page,
  }) => {
    await openLanguageMenu(page);
    await page.getByRole("menuitem", { name: "日本語" }).click();
    await expect(page.getByRole("menu")).toBeHidden();

    // The UI text, the document language, and the data names follow the choice
    await expect(
      page.getByRole("combobox", { name: ja.generationSelect }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: ja.team.slot(1) }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await selectPokemon(page, ja.team.input(1, "name"), "ラプラス");
    expect(getTeamTextFromUrl(page)).toContain("Lapras");

    // Typing the English name still finds the pokemon
    const input = page.getByLabel(ja.team.input(1, "name"));
    await input.click({ force: true });
    await input.fill("Vaporeon");
    await page
      .getByRole("listbox")
      .getByText("シャワーズ", { exact: true })
      .click();
    await expect(input).toHaveValue("シャワーズ");
    expect(getTeamTextFromUrl(page)).toContain("Vaporeon");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.getByLabel(ja.team.input(1, "name"))).toHaveValue(
      "シャワーズ",
    );

    await openLanguageMenu(page);
    await page.getByRole("menuitem", { name: "Français" }).click();
    await expect(page.getByLabel(fr.team.input(1, "name"))).toHaveValue(
      "Aquali",
    );
  });
});
