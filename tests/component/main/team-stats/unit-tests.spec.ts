import { test, expect } from "fixtures";
import { createViewport } from "helper";

test.describe("Team Stats - Unit Tests", () => {
  for (const width of [320, 450]) {
    test.describe(`${width}px phones`, () => {
      test.use({ viewport: createViewport(width) });

      test("give every analysis its own tab", async ({ page }) => {
        const panel = page.getByRole("region", { name: "Team analysis" });
        const tabs = panel.getByRole("tablist", { name: "Team analysis" });
        await expect(tabs.getByRole("tab")).toHaveText([
          "Defence",
          "Coverage",
          "Matrix",
          "Checklist",
        ]);
        // The header's switch between the stats and the matrix is for wider screens
        await expect(
          panel.getByRole("button", { name: "Matrix Analysis" }),
        ).toBeHidden();

        await tabs.getByRole("tab", { name: "Checklist" }).click();
        await expect(
          panel.getByRole("region", { name: "Team Checklist" }),
        ).toBeVisible();
        await tabs.getByRole("tab", { name: "Matrix" }).click();
        await expect(
          panel.getByRole("region", { name: "Matrix Analysis" }),
        ).toBeVisible();
      });
    });
  }
});
