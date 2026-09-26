import { test, expect } from "./fixtures";
import type { Locator, Page } from "@playwright/test";
import { fromBase64Url } from "@/app/shared/base64url";
import { breakpointValues } from "@/app/shared/theme";
import { checklist, checklistLabel } from "@/store/checklist";

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

// Below md, the page's width decides whether the team tools hide behind the More button
export const isMdDown = (page: Page) =>
  (page.viewportSize()?.width ?? Infinity) < breakpointValues.md;

const isXs = (page: Page) =>
  (page.viewportSize()?.width ?? Infinity) < breakpointValues.sm;

// Brings a slot's card on screen: the tabbed viewers show one slot or one pair at a time
export const showSlot = async (page: Page, slotIndex: number) => {
  const input = page.getByLabel(`Pokemon ${slotIndex + 1}'s name`);
  if (await input.isVisible()) return;
  await page
    .getByRole("tab", { name: new RegExp(`Pokemon ${slotIndex + 1} \\(`) })
    .click();
  await expect(input).toBeVisible();
};

// Shows the team tools, filters, and advanced buttons on phones and tablets
export const openTeamTools = async (page: Page) => {
  const more = page.getByRole("button", { name: "More team tools" });
  if (await more.isVisible()) await more.click();
};

export const openManageTeamMenu = async (page: Page) => {
  await openTeamTools(page);
  await page.getByRole("button", { name: "Manage team" }).click();
  await expect(page.getByRole("menu")).toBeVisible();
};

export const clickMenuItem = async (page: Page, name: string) => {
  await page.getByRole("menuitem", { name, exact: true }).click();
  await expect(page.getByRole("menu")).toBeHidden();
};

// Opens the current team's text in the Edit Pokepaste dialog
export const openEditPokepaste = async (page: Page) => {
  await openManageTeamMenu(page);
  await clickMenuItem(page, "Edit Pokepaste");
  await expect(
    page.getByRole("dialog", { name: "Edit Pokepaste" }),
  ).toBeVisible();
};

// Opens a slot tool's dialog, such as Filters, Sort, or Advanced, from the first visible card
const openSlotDialog = async (page: Page, button: RegExp, dialog: string) => {
  await openTeamTools(page);
  await page.getByRole("button", { name: button }).first().click();
  await expect(page.getByRole("dialog", { name: dialog })).toBeVisible();
};

export const openFilters = (page: Page) =>
  openSlotDialog(page, /^Filters$/, "Filters");

export const openSort = (page: Page) => openSlotDialog(page, /^Sort$/, "Sort");

export const openAdvanced = (page: Page) =>
  openSlotDialog(page, /^Advanced options for slot/, "Advanced");

// Picks an option in a dialog's select, found by its label
export const selectDialogOption = async (
  page: Page,
  label: string,
  option: string,
) => {
  await page.getByRole("combobox", { name: label }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
};

export const closeDialog = async (page: Page, button = "Done") => {
  await page.getByRole("button", { name: button, exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
};

// Shows one of the analysis panel's views: on phones each is behind the panel's menu
export const openAnalysis = async (page: Page, name: string) => {
  if (name !== "Matrix Analysis" && !isXs(page)) return;
  await page.getByRole("button", { name: "More analyses" }).click();
  await clickMenuItem(page, name);
  await expect(page.getByRole("region", { name })).toBeVisible();
};

// Decodes the `team` URL parameter (see src/app/shared/team-link.ts) into Pokemon Showdown team
// text, or returns "" if the team is empty and the parameter is absent
export const getTeamTextFromUrl = (page: Page) => {
  const teamParameter = new URL(page.url()).searchParams.get("team");
  return teamParameter ? fromBase64Url(teamParameter) : "";
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

// The checklist label as shown at the page's viewport width
const pageChecklistLabel = (page: Page, label: string) => {
  const item = checklist
    .flatMap(group => group.items)
    .find(item => item.label === label);
  if (!item) throw new Error(`Unknown checklist item: ${label}`);

  const width = page.viewportSize()?.width ?? Infinity;
  return checklistLabel(item, {
    isMdDown: width < breakpointValues.md,
    isLgDown: width < breakpointValues.lg,
  });
};

export const expectChecklistItem = async (
  page: Page,
  label: string,
  isChecked: boolean,
) => {
  const row = page
    .getByText(pageChecklistLabel(page, label), { exact: true })
    .locator("..");
  await expect(
    row.getByRole("img", { name: isChecked ? "Checked" : "Unchecked" }),
  ).toBeVisible();
};

// Shared unit tests for Team Defence and Team Type Coverage
export const teamScoreUnitTests = (headingName: string) => {
  test.describe(`${headingName} - Unit Tests`, () => {
    test.beforeEach(async ({ page }) => {
      await openAnalysis(page, headingName);
    });

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
  await openAnalysis(page, cardName);
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
      .replaceAll(" ", "\\s*");
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
