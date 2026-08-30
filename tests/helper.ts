import { test, expect } from "./fixtures";
import type { Locator, Page } from "@playwright/test";

const ASPECT_RATIO = 16 / 9;

// Viewport width constants
export const SMALL_VIEWPORT_WIDTH = 390;
export const MEDIUM_VIEWPORT_WIDTH = 820;
export const LARGE_VIEWPORT_WIDTH = 1366;

// Helper function to create viewport object with 16:9 aspect ratio
export const createViewport = (width: number) => ({
  width,
  height: Math.round(width / ASPECT_RATIO),
});

// Helper function for navigation
export const goToSite = async (page: Page) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
};

// Helper function to verify that an image has loaded successfully (not broken/404)
export const expectImageToBeLoaded = async (locator: Locator) => {
  await expect(locator).toBeVisible();
  await expect(locator).toHaveJSProperty("complete", true);
  await expect(locator).not.toHaveJSProperty("naturalWidth", 0);
};

export const selectPokemon = async (
  page: Page,
  name: string,
  slotIndex = 0,
) => {
  const input = page.getByLabel(`Pokemon ${slotIndex + 1}'s name`);
  await input.click({ force: true });
  await input.fill(name);
  await page.getByRole("listbox").getByText(name, { exact: true }).click();
};

export const selectAbility = async (
  page: Page,
  ability: string,
  slotIndex = 0,
) => {
  const input = page.getByLabel(`Pokemon ${slotIndex + 1}'s ability`);
  await input.click({ force: true });
  await input.fill(ability);
  await page.getByRole("listbox").getByText(ability, { exact: true }).click();
};

export const selectItem = async (page: Page, item: string, slotIndex = 0) => {
  const input = page.getByLabel(`Pokemon ${slotIndex + 1}'s item`);
  await input.click({ force: true });
  await input.fill(item);
  await page.getByRole("listbox").getByText(item, { exact: true }).click();
};

export const selectMove = async (
  page: Page,
  move: string,
  moveIndex = 1,
  slotIndex = 0,
) => {
  const input = page.getByLabel(`Pokemon ${slotIndex + 1}'s move${moveIndex}`);
  await input.click({ force: true });
  await input.fill(move);
  await page.getByRole("listbox").getByText(move, { exact: true }).click();
};

// Shared unit tests for Team Defence and Team Type Coverage
export const teamScoreUnitTests = (headingName: string) => {
  test.describe(`${headingName} - Unit Tests`, () => {
    test("should display all 18 types with score of 0", async ({ page }) => {
      const section = page.getByRole("region", { name: headingName });
      await expect(section).toBeVisible();

      // Verify all scores are 0 in this section
      await expect(section.getByText("0", { exact: true })).toHaveCount(18);
    });

    test("should show 'First Select a Pokemon' popover when hovering over Dark type", async ({
      page,
    }) => {
      const section = page.getByRole("region", { name: headingName });
      await expect(section).toBeVisible();

      // Find the Dark type element within the section
      const darkTypeElement = section
        .locator("div")
        .filter({ hasText: /^(Dark|DRK)$/ })
        .first();

      // Hover over it and verify popover content
      // (retried because a late relayout, e.g. slow-loading fonts/images,
      // can move the element from under the pointer and close the popover)
      const popover = page.getByText("First Select a Pokemon");
      await expect(async () => {
        await darkTypeElement.hover();
        await expect(popover).toBeVisible({ timeout: 1000 });
      }).toPass({ timeout: 15000 });
    });
  });
};

const checkScoreAndPopover = async (
  page: Page,
  cardName: string,
  typeName: string,
  expectedScore: string,
  textToIdentifyPopover: string,
  expectedPopoverText: string[],
) => {
  const section = page.getByRole("region", { name: cardName });
  await expect(section).toBeVisible();

  // Find the type element (e.g. "Fire" or "FIR")
  const typeElement = section.getByLabel(typeName, { exact: true });

  // Find the score element by its accessible label
  // The label now includes the value, e.g. "Fire score: +1"
  // We use a regex to match the start of the label
  const scoreElement = section.getByLabel(new RegExp(`^${typeName} score:`));

  await expect(scoreElement).toHaveText(expectedScore);

  // Hover to check popover
  await typeElement.hover();

  // The popover content is usually in a portal, so we search globally in page.
  // Scope to the specific tooltip for this type to avoid ambiguity if multiple tooltips have same text (it is possible for playwright to activate another tooltip before the previous tooltip fades out)
  const tooltip = page.getByRole("tooltip", { name: textToIdentifyPopover });

  // Check for expected content
  for (const text of expectedPopoverText) {
    // We use a regex to be more robust against whitespace differences (e.g. "0.5xto" vs "0.5x to")
    const escapedText = text
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/ /g, "\\s*");
    await expect(tooltip).toContainText(new RegExp(escapedText));
  }

  // Move mouse away to close popover to avoid interference with next hover
  await page.mouse.move(0, 0);
};

export const checkTypeDefenceScoreAndPopover = async (
  page: Page,
  typeName: string,
  expectedScore: string,
  expectedPopoverText: string[],
) => {
  await checkScoreAndPopover(
    page,
    "Team Defence",
    typeName,
    expectedScore,
    `${typeName} does...`,
    expectedPopoverText,
  );
};

export const checkTypeCoverageScoreAndPopover = async (
  page: Page,
  typeName: string,
  expectedScore: string,
  expectedPopoverText: string[],
) => {
  await checkScoreAndPopover(
    page,
    "Team Type Coverage",
    typeName,
    expectedScore,
    `Super effective against ${typeName}:`,
    expectedPopoverText,
  );
};
