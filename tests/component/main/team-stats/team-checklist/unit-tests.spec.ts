import { test } from "fixtures";
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
});
