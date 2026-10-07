import { test, expect } from "fixtures";
import {
  isXs,
  openAnalysis,
  selectAbility,
  selectItem,
  selectMove,
  selectPokemon,
} from "helper";

test.describe("Matrix Analysis - Integration Tests", () => {
  test("the defence matrix reflects Air Balloon and Dry Skin", async ({
    page,
  }) => {
    await selectPokemon(page, "Heatran");
    await selectItem(page, "Air Balloon");
    await openAnalysis(page, "Matrix Analysis");
    const matrix = page.getByRole("region", { name: "Matrix Analysis" });
    await expect(
      matrix.getByRole("cell", {
        name: "Ground does 0x to Heatran (Fire/Steel) with Air Balloon",
        exact: true,
      }),
    ).toHaveText("0");
    await selectPokemon(page, "Parasect");
    await selectAbility(page, "Dry Skin");
    await expect(
      matrix.getByRole("cell", {
        name: "Fire does 5x to Parasect (Bug/Grass) with Dry Skin",
        exact: true,
      }),
    ).toHaveText("×5");
  });

  test("the coverage matrix uses the user's forme-dependent move type", async ({
    page,
  }) => {
    await selectPokemon(page, "Oricorio-Sensu");
    await selectMove(page, "Revelation Dance");
    await openAnalysis(page, "Matrix Analysis");
    const matrix = page.getByRole("region", { name: "Matrix Analysis" });
    await matrix.getByRole("button", { name: "Coverage", exact: true }).click();
    await expect(
      matrix.getByRole("cell", {
        name: "Oricorio-Sensu's Revelation Dance (Ghost) does 2x to Psychic",
        exact: true,
      }),
    ).toHaveText("×2");
    await selectPokemon(page, "Tauros-Paldea-Blaze");
    await selectMove(page, "Raging Bull");
    await expect(
      matrix.getByRole("cell", {
        name: "Tauros-Paldea-Blaze's Raging Bull (Fire) does 2x to Grass",
        exact: true,
      }),
    ).toHaveText("×2");
  });

  test("Scrappy removes Exploud's Ghost immunity in coverage", async ({
    page,
  }) => {
    await selectPokemon(page, "Exploud");
    await selectMove(page, "Headbutt");
    await selectAbility(page, "Soundproof");
    await openAnalysis(page, "Matrix Analysis");
    const matrix = page.getByRole("region", { name: "Matrix Analysis" });
    await matrix.getByRole("button", { name: "Coverage", exact: true }).click();
    await expect(
      matrix.getByRole("cell", {
        name: "Exploud's Headbutt (Normal) does 0x to Ghost",
        exact: true,
      }),
    ).toHaveText("0");
    await selectAbility(page, "Scrappy");
    await expect(
      matrix.getByRole("cell", {
        name: "Exploud's Headbutt (Normal) does 1x to Ghost",
        exact: true,
      }),
    ).toHaveText("");
    await selectMove(page, "Low Kick");
    await expect(
      matrix.getByRole("cell", {
        name: "Exploud's Low Kick (Fighting) does 1x to Ghost",
        exact: true,
      }),
    ).toHaveText("");
    await expect(
      matrix.getByRole("cell", { name: "Ghost score: 0", exact: true }),
    ).toHaveText("0");
  });

  test("shows how each type hits each pokemon, and how each pokemon's moves hit each type", async ({
    page,
  }) => {
    await selectPokemon(page, "Heatran");
    await selectMove(page, "Earth Power");
    await openAnalysis(page, "Matrix Analysis");
    const matrix = page.getByRole("region", { name: "Matrix Analysis" });
    const cell = (name: string) =>
      matrix.getByRole("cell", { name, exact: true });

    const bugCell = cell("Bug does 0.25x to Heatran (Fire/Steel)");
    await expect(bugCell).toHaveText("¼");
    const weakCell = cell("Ground does 4x to Heatran (Fire/Steel)");
    await expect(weakCell).toHaveText("×4");
    // A strong hit is the bad colour on defence, and the good one for coverage
    const RED = /^rgba\(211, 47, 47/;
    const TEAL = /^rgba\(14, 122, 101/;
    await expect(weakCell).toHaveCSS("background-color", RED);
    await expect(bugCell).toHaveCSS("background-color", TEAL);
    await expect(
      matrix.getByRole("columnheader", { name: "Slot 1: Heatran" }),
    ).toBeVisible();
    // Empty slots get no column, and the last column is the team's score
    await expect(
      matrix.getByRole("columnheader", { name: /^Slot/ }),
    ).toHaveCount(1);
    await expect(
      matrix.getByRole("columnheader", { name: "Team score" }),
    ).toBeVisible();
    await expect(cell("Ground score: -1.5")).toHaveText("-1.5");
    await expect(cell("Bug score: +1.5")).toHaveText("+1.5");

    // A pokemon's icon names it. The last tooltip fades out as the next appears,
    // so each is found by its text.
    const tooltip = (text: string) =>
      page.getByRole("tooltip").filter({ hasText: text });
    await matrix.getByRole("columnheader", { name: "Slot 1: Heatran" }).hover();
    await expect(tooltip("Heatran")).toHaveText("Heatran");

    await bugCell.hover();
    await expect(tooltip("Bug does 0.25x to Heatran")).toBeVisible();

    await matrix.getByRole("button", { name: "Coverage" }).click();
    const strongCell = cell("Heatran's Earth Power (Ground) does 2x to Fire");
    await expect(strongCell).toHaveText("×2");
    await expect(strongCell).toHaveCSS("background-color", TEAL);
    await expect(matrix).toContainText("Super effective");
    await expect(
      cell("Heatran's Earth Power (Ground) does 0x to Flying"),
    ).toHaveText("0");
    // A type that no move is super effective against scores 0
    await expect(cell("Water score: 0")).toHaveText("0");

    // Leaving the matrix and coming back keeps the Coverage view
    if (isXs(page)) await page.getByRole("tab", { name: "Checklist" }).click();
    else await page.getByRole("button", { name: "Team Stats" }).click();
    await expect(matrix).toBeHidden();
    await openAnalysis(page, "Matrix Analysis");
    await expect(strongCell).toBeVisible();
  });
});
