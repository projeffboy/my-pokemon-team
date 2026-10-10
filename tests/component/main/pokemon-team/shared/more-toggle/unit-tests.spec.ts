import type { Locator } from "@playwright/test";
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
    const nameInput = page.getByRole("combobox", { name: "Pokemon 1's name" });
    const filters = page.getByRole("button", { name: "Filters", exact: true });
    await expect(toolbar).toBeHidden();
    await nameInput.click();
    await expect(
      page.getByRole("button", { name: "Grid view", exact: true }),
    ).toBeVisible();
    await expect(filters).toHaveCount(0);
    await nameInput.press("Escape");

    await page.getByRole("button", { name: "More team tools" }).click();
    await expect(toolbar).toBeVisible();
    await nameInput.click();
    await expect(filters).toBeVisible();
    await nameInput.press("Escape");
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
    const moreDetails = page.getByRole("button", {
      name: "More details for slot 1",
    });
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
      await expect(moreDetails).toBeVisible();
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
      await expect(moreDetails).toBeHidden();
    }
  });

  test("keeps the toggle's row in place and puts Filters and Sort in the Name dropdown", async ({
    page,
  }) => {
    const nameInput = page.getByRole("combobox", { name: "Pokemon 1's name" });
    const layout = (row: Locator) =>
      row.getByRole("button").evaluateAll(buttons =>
        buttons.map(button => {
          const { left, right } = button.getBoundingClientRect();
          return { text: button.textContent, left, right };
        }),
      );
    for (const width of [320, 400, 600, 959, 960, 1200]) {
      await page.setViewportSize({ width, height: 1000 });
      const compact = width < 960;
      const toggle = page.getByRole("button", {
        name: compact ? "More team tools" : "Advanced",
        exact: true,
      });
      const row = page
        .getByRole("toolbar", { name: "Team actions" })
        .filter({ has: toggle });
      const names =
        compact ?
          ["Undo", "Redo"]
        : [
            "Teams",
            "Randomize team",
            "Share pokemon team link",
            "Undo",
            "Redo",
            "Manage team",
          ];
      await expect(row.getByRole("button")).toHaveCount(names.length + 1);
      for (const [index, name] of names.entries())
        await expect(row.getByRole("button").nth(index)).toHaveAccessibleName(
          name,
        );
      const collapsed = await layout(row);
      await toggle.click();
      const expanded = page.getByRole("button", {
        name: compact ? "Fewer team tools" : "Advanced",
        exact: true,
      });
      const expandedRow = page
        .getByRole("toolbar", { name: "Team actions" })
        .filter({ has: expanded });
      await expect(expanded).toBeVisible();

      // Nothing in the row moves, and only the toggle's own label changes
      const open = await layout(expandedRow);
      expect(open).toHaveLength(collapsed.length);
      for (const [index, button] of open.entries()) {
        expect(button.left).toBeCloseTo(collapsed[index]?.left ?? NaN, 0);
        expect(button.right).toBeCloseTo(collapsed[index]?.right ?? NaN, 0);
        if (index < names.length)
          expect(button.text).toBe(collapsed[index]?.text);
      }
      await expect(
        page
          .getByRole("toolbar")
          .getByRole("button", { name: /^(Filters|Sort)$/ }),
      ).toHaveCount(0);

      for (const name of ["Filters", "Sort"]) {
        await nameInput.click();
        await page.getByRole("button", { name, exact: true }).click();
        const dialog = page.getByRole("dialog", { name, exact: true });
        await expect(dialog).toBeVisible();
        await page.getByRole("button", { name: "Done", exact: true }).click();
        await expect(dialog).toBeHidden();
      }
      await expanded.click();
      await expect(toggle).toBeVisible();
      expect(
        await page.locator("body").evaluate(el => el.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  });
});
