import type { Page } from "@playwright/test";
import { test, expect } from "fixtures";
import { resizeTeamViewport } from "helper";
import fr from "@/i18n/fr";

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
