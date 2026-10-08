import { test, expect } from "fixtures";
import { createViewport, SMALL_VIEWPORT_WIDTH } from "helper";

test.describe("More toggle - Unit Tests", () => {
  test.use({ viewport: createViewport(SMALL_VIEWPORT_WIDTH) });

  test("shows and hides the team tools, filters, and advanced options", async ({
    page,
  }) => {
    const toolbar = page
      .getByRole("toolbar", { name: "Team actions", includeHidden: true })
      .filter({
        has: page.getByRole("button", {
          name: "Share pokemon team link",
          includeHidden: true,
        }),
      });
    const filters = page.getByRole("button", { name: "Filters" });
    await expect(toolbar).toBeHidden();
    await expect(filters).toBeHidden();

    await page.getByRole("button", { name: "More team tools" }).click();
    await expect(toolbar).toBeVisible();
    await expect(filters).toBeVisible();
    await expect(
      page.getByRole("button", { name: "More details for slot 1" }),
    ).toBeVisible();

    // The choice survives a reload
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(toolbar).toBeVisible();

    await page.getByRole("button", { name: "Fewer team tools" }).click();
    await expect(toolbar).toBeHidden();
  });

  test("keeps Advanced from md, with a colored toggle when on", async ({
    page,
  }) => {
    for (const width of [599, 600, 959, 960, 1200]) {
      await page.setViewportSize({ width, height: 1000 });
      const compact = width < 960;
      const expand = page.getByRole("button", {
        name: compact ? "More team tools" : "Advanced",
        exact: true,
      });
      await expect(expand).toHaveText(compact ? "More" : "Advanced");
      const offIcon = expand.getByTestId(
        compact ? "ExpandMoreIcon" : "ToggleOffOutlinedIcon",
      );
      await expect(offIcon).toBeVisible();
      const offColor = await offIcon.evaluate(
        icon => getComputedStyle(icon).color,
      );
      if (!compact)
        await expect(expand).toHaveAttribute("aria-pressed", "false");
      await expand.click();
      await expect(
        page.getByRole("button", { name: "Filters" }).first(),
      ).toBeVisible();
      const collapse = page.getByRole("button", {
        name: compact ? "Fewer team tools" : "Advanced",
        exact: true,
      });
      await expect(collapse).toHaveText(compact ? "Less" : "Advanced");
      await expect(collapse).toHaveAttribute("aria-expanded", "true");
      const onIcon = collapse.getByTestId(
        compact ? "ExpandLessIcon" : "ToggleOnOutlinedIcon",
      );
      await expect(onIcon).toBeVisible();
      if (!compact) {
        await expect(collapse).toHaveAttribute("aria-pressed", "true");
        await expect(onIcon).not.toHaveCSS("color", offColor);
      }
      await collapse.click();
      await expect(
        page.getByRole("button", { name: "Filters" }).first(),
      ).toBeHidden();
    }
  });

  for (const width of [320, 400, 600, 959, 960, 1200]) {
    test(`${width}px keeps Filters and Sort beside the toggle and makes room with history icons`, async ({
      page,
    }) => {
      if (width >= 960) test.setTimeout(60000);
      await page.setViewportSize({ width, height: 1000 });
      const compact = width < 960;
      const toggle = page.getByRole("button", {
        name: compact ? "More team tools" : "Advanced",
        exact: true,
      });
      const row = page
        .getByRole("toolbar", { name: "Team actions" })
        .filter({ has: toggle });
      const undo = row.getByRole("button", { name: "Undo", exact: true });
      const redo = row.getByRole("button", { name: "Redo", exact: true });
      await expect(
        page.getByRole("button", { name: "Filters", exact: true }),
      ).toHaveCount(0);
      await toggle.click();
      const filters = page.getByRole("button", {
        name: "Filters",
        exact: true,
      });
      const sort = page.getByRole("button", { name: "Sort", exact: true });
      await expect(filters).toHaveCount(1);
      await expect(sort).toHaveCount(1);
      const expanded = page.getByRole("button", {
        name: compact ? "Fewer team tools" : "Advanced",
        exact: true,
      });
      const expandedRow = page
        .getByRole("toolbar", { name: "Team actions" })
        .filter({ has: expanded });
      const names =
        compact ?
          ["Undo", "Redo", "Filters", "Sort", "Fewer team tools"]
        : [
            "Teams",
            "Randomize team",
            "Share pokemon team link",
            "Undo",
            "Redo",
            "Manage team",
            "Filters",
            "Sort",
            "Advanced",
          ];
      await expect(expandedRow.getByRole("button")).toHaveCount(names.length);
      for (const [index, name] of names.entries())
        await expect(
          expandedRow.getByRole("button").nth(index),
        ).toHaveAccessibleName(name);
      await expect(
        page
          .getByRole("region", { name: /^Pokemon \d$/ })
          .getByRole("button", { name: /^(Filters|Sort)$/ }),
      ).toHaveCount(0);
      if (width === 320 || width === 600) {
        await expect(
          expandedRow
            .getByRole("button", { name: "Undo", exact: true })
            .locator(".history-label"),
        ).toBeHidden();
        await expect(
          expandedRow
            .getByRole("button", { name: "Redo", exact: true })
            .locator(".history-label"),
        ).toBeHidden();
      }
      if (width === 400 || width === 959) {
        await expect(
          expandedRow
            .getByRole("button", { name: "Undo", exact: true })
            .locator(".history-label"),
        ).toBeVisible();
      }
      const bounds = await expandedRow
        .getByRole("button")
        .evaluateAll(buttons =>
          buttons.map(button => {
            const { left, right } = button.getBoundingClientRect();
            return { left, right };
          }),
        );
      for (let i = 1; i < bounds.length; i++)
        expect(bounds[i]?.left).toBeGreaterThanOrEqual(
          (bounds[i - 1]?.right ?? 0) - 0.5,
        );
      await filters.click();
      await expect(
        page.getByRole("dialog", { name: "Filters", exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Done", exact: true }).click();
      await expect(
        page.getByRole("dialog", { name: "Filters", exact: true }),
      ).toBeHidden();
      await sort.click();
      await expect(
        page.getByRole("dialog", { name: "Sort", exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Done", exact: true }).click();
      await expect(
        page.getByRole("dialog", { name: "Sort", exact: true }),
      ).toBeHidden();
      await expanded.click();
      if (compact) {
        await expect(undo.locator(".history-label")).toBeVisible();
        await expect(redo.locator(".history-label")).toBeVisible();
      }
      expect(
        await page.locator("body").evaluate(el => el.scrollWidth),
      ).toBeLessThanOrEqual(width);
    });
  }
});
