import type { Page } from "@playwright/test";
import { test, expect } from "fixtures";
import { checklistRow, expectChecklistItem, openAnalysis } from "helper";
import { checklist } from "@/store/checklist";
import en from "@/i18n/en";

// The switch that opened the checklist may still show its own tooltip
const tooltip = (page: Page, text: string) =>
  page.getByRole("tooltip").filter({ hasText: text });

test.describe("Team Checklist - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    await openAnalysis(page, "Team Checklist");
  });

  test("should have no checkmarks by default", async ({ page }) => {
    for (const { key } of checklist.flatMap(group => group.items)) {
      await expectChecklistItem(page, en.checklist.items[key].label, false);
    }
  });

  test("an unfilled role's tooltip says what would fill it", async ({
    page,
  }, testInfo) => {
    const row = checklistRow(page, "Choice Item");
    if (testInfo.project.use.hasTouch) await row.tap();
    else await row.hover();
    await expect(tooltip(page, "Choice Band")).toHaveText(
      "Give a pokemon a Choice item to hold: Choice Band, Choice Specs, or Choice Scarf.",
    );
  });

  test("a tap opens a role's tooltip and the next tap closes it", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, "Requires touch input");
    const phazer = checklistRow(page, "Phazer");
    await phazer.tap();
    await expect(tooltip(page, "Dragon Tail")).toBeVisible();
    await phazer.tap();
    await expect(tooltip(page, "Dragon Tail")).toBeHidden();
    await checklistRow(page, "Cleric").tap();
    await expect(tooltip(page, "Heal Bell")).toBeVisible();
  });

  test("focus shows a role's tooltip and Escape hides it", async ({ page }) => {
    const spinner = checklistRow(page, "Spinner/Defogger");
    await spinner.focus();
    await expect(spinner).toHaveAccessibleDescription(
      "Give a pokemon a move that removes entry hazards from your side: Rapid Spin, Defog, Court Change, Tidy Up, or Mortal Spin.",
    );
    await spinner.press("Escape");
    await expect(tooltip(page, "Rapid Spin")).toBeHidden();
  });
});
