import type { Page } from "@playwright/test";
import { test, expect } from "fixtures";
import { findOption, optionLabelLines, resizeTeamViewport } from "helper";
import de from "@/i18n/de";
import fr from "@/i18n/fr";
import it from "@/i18n/it";

// The Name popup's width, and the most lines any of its listed names takes
const measureNameList = async (
  page: Page,
  label: string,
  search = "Urshifu",
) => {
  const input = page.getByRole("combobox", { name: label });
  const labels = page.getByRole("option").locator("span:last-child");
  // Resizing can swap the team viewer, which remounts the input and drops its text
  await expect(async () => {
    await input.fill(search);
    await expect(labels.first()).toBeVisible({ timeout: 1000 });
  }).toPass();
  const lines = await labels.evaluateAll(spans =>
    Math.max(
      ...spans.map(span =>
        Math.round(
          span.getBoundingClientRect().height /
            parseFloat(getComputedStyle(span).lineHeight),
        ),
      ),
    ),
  );
  const popup = page.locator(".MuiAutocomplete-popper");
  await expect
    .poll(async () => (await popup.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(168);
  const bounds = await popup.boundingBox();
  await input.press("Escape");
  return { lines, width: bounds?.width ?? 0 };
};

test("the Name list is as wide as each language's longest name needs", async ({
  page,
}) => {
  await resizeTeamViewport(page, 320, 900);
  await page.evaluate(() => document.fonts.ready);
  const english = await measureNameList(page, "Pokemon 1's name");
  expect(english.lines).toBeLessThanOrEqual(2);

  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitem", { name: "Français" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  const french = await measureNameList(page, fr.team.input(1, "name"));
  expect(french.lines).toBeLessThanOrEqual(2);
  // French has longer names than English, such as Alcremie's formes
  expect(french.width).toBeGreaterThan(english.width);
  expect(french.width).toBeLessThanOrEqual(320);
});

test("the Name list is only as wide as the generation's names need", async ({
  page,
}) => {
  await resizeTeamViewport(page, 320, 900);
  await page.evaluate(() => document.fonts.ready);
  // Gen 9 has Ogerpon-Hearthflame-Tera; Gen 1's names all fit the narrowest list
  const latest = await measureNameList(page, "Pokemon 1's name", "Ogerpon");
  expect(latest.lines).toBe(2);

  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 1/ }).click();
  const first = await measureNameList(page, "Pokemon 1's name", "Nidoran");
  expect(first.lines).toBe(1);
  expect(first.width).toBe(168);
  expect(latest.width).toBeGreaterThan(first.width);
});

test("the Name list keeps each word of a name whole", async ({ page }) => {
  await page.goto("/?game=champions");
  await resizeTeamViewport(page, 320, 900);
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await page.getByRole("menuitem", { name: "Italiano" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "it");
  // Italian writes Champions' Mega formes as one word
  const option = await findOption(
    page,
    it.team.input(1, "name"),
    "MegaCrabominable",
  );
  await expect.poll(() => optionLabelLines(option)).toBe(1);
  const [sprite, label, popup] = await Promise.all([
    option.locator("span").first().boundingBox(),
    option.locator("span").last().boundingBox(),
    page.locator(".MuiAutocomplete-popper").boundingBox(),
  ]);
  expect(sprite && label && label.x >= sprite.x + sprite.width).toBe(true);
  expect(popup && popup.x >= 0 && popup.x + popup.width <= 320).toBe(true);
});

test("the item, move, and ability lists keep each word whole", async ({
  page,
}) => {
  const team = Buffer.from("Baxcalibur\n").toString("base64url");
  await page.goto(`/?gen=9&team=${team}`);
  await resizeTeamViewport(page, 1200, 900);
  await page.evaluate(() => document.fonts.ready);
  const expectOneLine = async (input: string, label: string) => {
    const option = await findOption(page, input, label);
    await expect.poll(() => optionLabelLines(option)).toBe(1);
    await page.keyboard.press("Escape");
  };

  await page.getByRole("button", { name: "Language", exact: true }).click();
  await page.getByRole("menuitem", { name: "Deutsch" }).click();
  await expectOneLine(de.team.input(1, "item"), "Fähigkeitenschild");
  // With its type icon, Snowscape needs more room than the move list's minimum
  await expectOneLine(de.team.input(1, "move1"), "Schneelandschaft");

  await page.getByRole("button", { name: de.language, exact: true }).click();
  await page.getByRole("menuitem", { name: "Français" }).click();
  await expectOneLine(fr.team.input(1, "ability"), "Thermodynamique");
});

test("the ability list widens only for the game's abilities", async ({
  page,
}) => {
  const team = Buffer.from("Hatterene\n").toString("base64url");
  await page.goto(`/?gen=8&team=${team}`);
  await resizeTeamViewport(page, 1200, 900);
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await page.getByRole("menuitem", { name: "Français" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  const input = page.getByRole("combobox", {
    name: fr.team.input(1, "ability"),
  });
  const popup = page.locator(".MuiAutocomplete-popper");
  const popupWidth = async () => (await popup.boundingBox())?.width ?? 0;

  // Only Gen 9 has Thermodynamique, which needs more than the list's minimum
  await input.click();
  await expect.poll(popupWidth).toBeCloseTo(152, 0);
  await input.press("Escape");

  await page.getByRole("combobox", { name: fr.generationSelect }).click();
  await page
    .getByRole("option", { name: new RegExp(fr.generationGames[9]) })
    .click();
  await input.click();
  await expect.poll(popupWidth).toBeGreaterThan(152);
});
