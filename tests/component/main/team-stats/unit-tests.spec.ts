import { test, expect } from "fixtures";
import { createViewport } from "helper";

test.describe("Team Stats - Unit Tests", () => {
  for (const { width, icons, fullNames } of [
    { width: 320, icons: false, fullNames: false },
    { width: 450, icons: true, fullNames: false },
    { width: 590, icons: true, fullNames: true },
    { width: 600, icons: false, fullNames: false },
    { width: 820, icons: false, fullNames: false },
    { width: 930, icons: true, fullNames: false },
    { width: 1400, icons: true, fullNames: true },
    { width: 1920, icons: true, fullNames: true },
  ]) {
    test.describe(`${width}px type labels`, () => {
      test.use({ viewport: createViewport(width) });

      test("expand all type names together when they fit", async ({ page }) => {
        const panel = page.getByRole("region", { name: "Team Defence" });
        await expect(panel.locator("[data-type-label] img")).toHaveCount(
          icons ? 18 : 0,
        );
        await expect(panel.locator("[data-type-name]:visible")).toHaveCount(
          fullNames ? 18 : 0,
        );
        await expect(
          panel.locator("[data-type-abbreviation]:visible"),
        ).toHaveCount(fullNames ? 0 : 18);
        await expect
          .poll(() =>
            panel.getByRole("button").evaluateAll(
              (buttons, shouldShrink) =>
                buttons.every(button => {
                  const first = buttons[0];
                  if (
                    !first ||
                    Math.abs(
                      button.getBoundingClientRect().width -
                        first.getBoundingClientRect().width,
                    ) >= 1
                  )
                    return false;
                  const space = button.parentElement;
                  if (!space) return false;
                  const style = getComputedStyle(space);
                  const available =
                    space.getBoundingClientRect().width -
                    parseFloat(style.paddingLeft) -
                    parseFloat(style.paddingRight);
                  const chipWidth = button.getBoundingClientRect().width;
                  return shouldShrink ?
                      chipWidth < available - 1
                    : Math.abs(chipWidth - available) < 1;
                }),
              width >= 1200 && icons && fullNames,
            ),
          )
          .toBe(true);
      });
    });
  }

  for (const width of [600, 960, 1200, 1920]) {
    test.describe(`${width}px combined analysis`, () => {
      test.use({ viewport: createViewport(width) });

      test("show the checklist together with defence and coverage", async ({
        page,
      }) => {
        const panel = page.getByRole("region", { name: "Team analysis" });
        const regions = [
          "Team Defence",
          "Team Type Coverage",
          "Team Checklist",
        ];
        for (const name of regions)
          await expect(panel.getByRole("region", { name })).toBeVisible();
        const teamContent =
          width < 960 ?
            page.getByRole("tablist", { name: "Pokemon team slots" })
          : page
              .getByRole("region", { name: "Pokemon 1", exact: true })
              .locator("..");
        const defence = panel.getByRole("region", { name: "Team Defence" });
        await expect(async () => {
          const leftBox = await teamContent.boundingBox();
          const rightBox = await defence.boundingBox();
          expect(leftBox).not.toBeNull();
          expect(rightBox).not.toBeNull();
          expect(Math.abs(leftBox!.y - rightBox!.y)).toBeLessThanOrEqual(1);
        }).toPass();
        const checklist = panel.getByRole("region", { name: "Team Checklist" });
        const panelBox = await panel.boundingBox();
        const checklistBox = await checklist.boundingBox();
        expect(panelBox).not.toBeNull();
        expect(checklistBox).not.toBeNull();
        expect(checklistBox!.y + checklistBox!.height).toBeLessThanOrEqual(
          panelBox!.y + panelBox!.height,
        );
        expect(
          await checklist.evaluate(element => {
            for (
              let parent = element.parentElement;
              parent;
              parent = parent.parentElement
            ) {
              if (
                getComputedStyle(parent).overflowY === "auto" &&
                parent.scrollHeight > parent.clientHeight
              )
                return true;
            }
            return false;
          }),
        ).toBe(false);
        await expect(
          panel.getByRole("button", { name: "Team Checklist" }),
        ).toHaveCount(0);
        await panel.getByRole("button", { name: "Matrix Analysis" }).click();
        for (const name of regions)
          await expect(panel.getByRole("region", { name })).toBeHidden();
        await expect(
          panel.getByRole("region", { name: "Matrix Analysis" }),
        ).toBeVisible();
        await panel
          .getByRole("button", { name: "Team Stats", exact: true })
          .click();
        for (const name of regions)
          await expect(panel.getByRole("region", { name })).toBeVisible();
      });
    });
  }

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
