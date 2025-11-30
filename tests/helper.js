import { expect } from "@playwright/test";

const ASPECT_RATIO = 16 / 9;

// Viewport width constants
export const SMALL_VIEWPORT_WIDTH = 390;
export const MEDIUM_VIEWPORT_WIDTH = 820;
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
