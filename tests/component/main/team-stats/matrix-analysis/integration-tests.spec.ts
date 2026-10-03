import { test, expect } from "fixtures";
import { isXs, openAnalysis, selectMove, selectPokemon } from "helper";

test.describe("Matrix Analysis - Integration Tests", () => {
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
