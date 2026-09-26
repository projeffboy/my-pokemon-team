import { test, expect } from "fixtures";
import { createViewport, SMALL_VIEWPORT_WIDTH } from "helper";

test.describe("More toggle - Unit Tests", () => {
  test.use({ viewport: createViewport(SMALL_VIEWPORT_WIDTH) });

  test("shows and hides the team tools, filters, and advanced options", async ({
    page,
  }) => {
    const toolbar = page.getByRole("toolbar", { name: "Team actions" });
    const filters = page.getByRole("button", { name: "Filters" });
    await expect(toolbar).toBeHidden();
    await expect(filters).toBeHidden();

    await page.getByRole("button", { name: "More team tools" }).click();
    await expect(toolbar).toBeVisible();
    await expect(filters).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Advanced options for slot 1" }),
    ).toBeVisible();

    // The choice survives a reload
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(toolbar).toBeVisible();

    await page.getByRole("button", { name: "Fewer team tools" }).click();
    await expect(toolbar).toBeHidden();
  });
});
