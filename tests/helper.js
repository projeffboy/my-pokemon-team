import { test, expect } from "fixtures";

const ASPECT_RATIO = 16 / 9;

// Viewport width constants
export const SMALL_VIEWPORT_WIDTH = 390;
export const MEDIUM_VIEWPORT_WIDTH = 820;
export const MEDIUM_VIEWPORT_MIN_WIDTH = 600;
export const LARGE_VIEWPORT_WIDTH = 1366;
export const LARGER_VIEWPORT_WIDTH = 1920;

// Pokemon type names and their abbreviations for smaller viewports
export const POKEMON_TYPES = [
  { full: "Bug", abbr: "BUG" },
  { full: "Dark", abbr: "DRK" },
  { full: "Dragon", abbr: "DRG" },
  { full: "Electric", abbr: "ELC" },
  { full: "Fairy", abbr: "FRY" },
  { full: "Fighting", abbr: "FGT" },
  { full: "Fire", abbr: "FIR" },
  { full: "Flying", abbr: "FLY" },
  { full: "Ghost", abbr: "GHT" },
  { full: "Grass", abbr: "GRS" },
  { full: "Ground", abbr: "GRD" },
  { full: "Ice", abbr: "ICE" },
  { full: "Normal", abbr: "NRM" },
  { full: "Poison", abbr: "PSN" },
  { full: "Psychic", abbr: "PSY" },
  { full: "Rock", abbr: "RCK" },
  { full: "Steel", abbr: "STL" },
  { full: "Water", abbr: "WTR" },
];

// Helper function to create viewport object with 16:9 aspect ratio
export const createViewport = width => ({
  width,
  height: Math.round(width / ASPECT_RATIO),
});

// Helper function for navigation
export const goToSite = async page => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
};

// Helper function to verify that an image has loaded successfully (not broken/404)
export const expectImageToBeLoaded = async locator => {
  await expect(locator).toBeVisible();
  await expect(locator).toHaveJSProperty("complete", true);
  await expect(locator).not.toHaveJSProperty("naturalWidth", 0);
};

export const selectPokemon = async (page, name, slotIndex = 0) => {
  const id = `#react-select-single-${slotIndex}-name`;
  const nameControl = page
    .locator(".Select-control")
    .filter({ has: page.locator(id) });
  await nameControl.click();
  await page.locator(id).fill(name);
  await page.getByRole("listbox").getByText(name, { exact: true }).click();
};

export const selectAbility = async (page, ability, slotIndex = 0) => {
  const id = `#react-select-single-${slotIndex}-ability`;
  const abilityControl = page
    .locator(".Select-control")
    .filter({ has: page.locator(id) });
  await abilityControl.click();
  await page.locator(id).fill(ability);
  await page.getByRole("listbox").getByText(ability, { exact: true }).click();
};

export const selectItem = async (page, item, slotIndex = 0) => {
  const id = `#react-select-single-${slotIndex}-item`;
  const itemControl = page
    .locator(".Select-control")
    .filter({ has: page.locator(id) });
  await itemControl.click();
  await page.locator(id).fill(item);
  await page.getByRole("listbox").getByText(item, { exact: true }).click();
};

export const selectMove = async (page, move, slotIndex = 0, moveIndex = 1) => {
  const id = `#react-select-single-${slotIndex}-move${moveIndex}`;
  const moveControl = page
    .locator(".Select-control")
    .filter({ has: page.locator(id) });
  await moveControl.click();
  await page.locator(id).fill(move);
  await page.getByRole("listbox").getByText(move, { exact: true }).click();
};

// Shared unit tests for Team Defence and Team Type Coverage
export const teamScoreUnitTests = headingName => {
  test.describe(`${headingName} - Unit Tests`, () => {
    test("should display all 18 types with score of 0", async ({ page }) => {
      // Find the heading
      const heading = page.getByRole("heading", { name: headingName });
      await expect(heading).toBeVisible();

      // The section is the container of this heading.
      const section = heading.locator("xpath=../..");
      await expect(section).toBeVisible();

      // Verify all scores are 0 in this section
      const zeros = section
        .locator('div[class*="MuiTypography-root"]')
        .filter({ hasText: /^0$/ });
      const count = await zeros.count();

      expect(count).toBe(18);
    });

    test("should show 'First Select a Pokemon' popover when hovering over Dark type", async ({
      page,
    }) => {
      const heading = page.getByRole("heading", { name: headingName });
      await expect(heading).toBeVisible();
      const section = heading.locator("xpath=../..");

      // Find the Dark type element within the section
      const darkTypeElement = section
        .locator("div")
        .filter({ hasText: /^(Dark|DRK)$/ })
        .first();

      // Hover over it
      await darkTypeElement.hover();

      // Wait for popover
      await page.waitForTimeout(500);

      // Verify popover content
      const popover = page.getByText("First Select a Pokemon");
      await expect(popover).toBeVisible();
    });
  });
};
