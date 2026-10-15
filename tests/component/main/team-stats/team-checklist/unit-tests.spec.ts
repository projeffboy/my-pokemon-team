import { test, expect } from "fixtures";
import { expectChecklistItem, openAnalysis } from "helper";
import { checklist } from "@/store/checklist";
import en from "@/i18n/en";

test.describe("Team Checklist - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    await openAnalysis(page, "Team Checklist");
  });

  test("should have no checkmarks by default", async ({ page }) => {
    for (const { key } of checklist.flatMap(group => group.items)) {
      await expectChecklistItem(page, en.checklist.items[key].label, false);
    }
  });

  test("the battle format starts not set, and the team's link keeps the one picked", async ({
    page,
  }) => {
    const button = (name: string) =>
      page
        .getByRole("region", { name: "Team Checklist" })
        .getByRole("group", { name: "Battle format" })
        .getByRole("button", { name, exact: true });
    await expect(button("Not set")).toHaveAttribute("aria-pressed", "true");
    await expect(page).not.toHaveURL(/battle=/);

    await button("Doubles").click();
    await expect(button("Doubles")).toHaveAttribute("aria-pressed", "true");
    await expect(button("Not set")).toHaveAttribute("aria-pressed", "false");
    await expect(page).toHaveURL(/battle=doubles/);

    await page.reload();
    await openAnalysis(page, "Team Checklist");
    await expect(button("Doubles")).toHaveAttribute("aria-pressed", "true");

    await button("Not set").click();
    await expect(page).not.toHaveURL(/battle=/);
  });
});
