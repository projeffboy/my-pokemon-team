import { test, expect } from "fixtures";
import { openAnalysis, selectMove, selectPokemon } from "helper";

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
    await expect(cell("Ground does 4x to Heatran (Fire/Steel)")).toHaveText(
      "×4",
    );
    await expect(
      matrix.getByRole("columnheader", { name: "Slot 1: Heatran" }),
    ).toBeVisible();
    await expect(
      matrix.getByRole("columnheader", { name: "Slot 2", exact: true }),
    ).toBeVisible();

    await bugCell.hover();
    await expect(page.getByRole("tooltip")).toContainText(
      "Bug does 0.25x to Heatran",
    );

    await matrix.getByRole("button", { name: "Coverage" }).click();
    await expect(
      cell("Heatran's Earth Power (Ground) does 2x to Fire"),
    ).toHaveText("×2");
    await expect(
      cell("Heatran's Earth Power (Ground) does 0x to Flying"),
    ).toHaveText("0");
  });
});
