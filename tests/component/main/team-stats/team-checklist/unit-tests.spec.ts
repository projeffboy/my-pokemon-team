import { test } from "fixtures";
import { expectChecklistItem, openAnalysis } from "helper";
import { checklist } from "@/store/checklist";

test.describe("Team Checklist - Unit Tests", () => {
  test.beforeEach(async ({ page }) => {
    await openAnalysis(page, "Team Checklist");
  });

  test("should have no checkmarks by default", async ({ page }) => {
    for (const { label } of checklist.flatMap(group => group.items)) {
      await expectChecklistItem(page, label, false);
    }
  });
});
