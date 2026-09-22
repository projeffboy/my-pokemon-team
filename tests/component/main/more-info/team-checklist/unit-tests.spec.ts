import { test } from "fixtures";
import { expectChecklistItem } from "helper";
import { checklist } from "@/store/checklist";

test.describe("Team Checklist - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Click on the "Team Checklist" tab
    await page.getByRole("tab", { name: /Checklist/ }).click();
  });

  test("should have no checkmarks by default", async ({ page }) => {
    for (const { label } of checklist.flatMap(group => group.items)) {
      await expectChecklistItem(page, label, false);
    }
  });
});
