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
        // Icons that do not fit beside the text sit above it
        await expect(panel.locator("[data-type-label] img")).toHaveCount(18);
        await expect(panel.locator("[data-icon-above]")).toHaveCount(
          icons ? 0 : 18,
        );
        const [icon, text] = await Promise.all(
          [
            panel.locator("[data-type-label] img").first(),
            panel.locator("[data-type-label] span:visible").first(),
          ].map(part => part.boundingBox()),
        );
        if (!icon || !text) throw new Error("Missing type label");
        if (icons) expect(icon.x + icon.width).toBeLessThanOrEqual(text.x + 1);
        else expect(icon.y + icon.height).toBeLessThanOrEqual(text.y + 1);
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

  // Gen 9's team column leaves room for the checklist under the stats at these widths
  for (const width of [960, 1200, 1920]) {
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
        // The shorter column is centred against the taller one
        await expect
          .poll(() =>
            page.evaluate(() => {
              const [team, analysis] = [
                document.querySelector("main > *"),
                document.querySelector("main section"),
              ].map(column => column?.getBoundingClientRect());
              return Math.abs(
                (team?.top ?? 0) +
                  (team?.height ?? 0) / 2 -
                  ((analysis?.top ?? 0) + (analysis?.height ?? 0) / 2),
              );
            }),
          )
          .toBeLessThanOrEqual(1);
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

  // The stats stay laid out under the matrix, with abbreviated or full type names
  for (const width of [820, 1400]) {
    test(`${width}px Matrix Analysis shows nothing of the stats under it`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const panel = page.getByRole("region", { name: "Team analysis" });
      const stats = ["Team Defence", "Team Type Coverage"].map(name =>
        panel.getByRole("region", { name, includeHidden: true }),
      );
      for (const region of stats)
        await expect(
          region.locator("[data-type-label] > span:visible"),
        ).toHaveCount(18);
      await panel.getByRole("button", { name: "Matrix Analysis" }).click();
      const matrix = panel.getByRole("region", { name: "Matrix Analysis" });
      for (const kind of ["Defence", "Coverage"]) {
        const button = matrix.getByRole("button", { name: kind, exact: true });
        await button.click();
        await expect(button).toHaveAttribute("aria-pressed", "true");
        for (const region of stats)
          await expect(region.locator("*:visible")).toHaveCount(0);
      }
    });
  }

  test("the panel's title outranks its analyses' headings and sits just above their cards, with no space over it", async ({
    page,
  }) => {
    const panel = page.getByRole("region", { name: "Team analysis" });
    const size = (level: number) =>
      panel
        .getByRole("heading", { level })
        .first()
        .evaluate(heading => parseFloat(getComputedStyle(heading).fontSize));
    for (const width of [600, 700, 960, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect
        .poll(async () => (await size(2)) > (await size(3)))
        .toBe(true);
      await expect
        .poll(() =>
          page.evaluate(() => {
            const analysis = document.querySelector("main section");
            const title = analysis
              ?.querySelector("h2")
              ?.getBoundingClientRect();
            const card = analysis
              ?.querySelector(".MuiPaper-root")
              ?.getBoundingClientRect();
            const top = analysis?.getBoundingClientRect().top ?? NaN;
            return {
              above: (title?.top ?? NaN) - top < 12,
              below: (card?.top ?? NaN) - (title?.bottom ?? NaN) < 20,
            };
          }),
        )
        .toEqual({ above: true, below: true });
    }
  });

  test("Gen 1 on a wide screen keeps the checklist under the stats, a little past the team", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?gen=1");
    const panel = page.getByRole("region", { name: "Team analysis" });
    await expect(
      panel.getByRole("region", { name: "Team Checklist" }),
    ).toBeVisible();
    await expect(
      panel.getByRole("button", { name: "Team Checklist" }),
    ).toHaveCount(0);
    const [team, analysis] = await page.evaluate(() =>
      [
        document.querySelector("main > *"),
        document.querySelector("main section"),
      ].map(column => column?.getBoundingClientRect().height ?? 0),
    );
    // Showing it is worth running this far past the team column, and no further
    expect((analysis ?? 0) - (team ?? 0)).toBeGreaterThan(0);
    expect((analysis ?? 0) - (team ?? 0)).toBeLessThanOrEqual(165);
  });

  // The checklist leaves the stats' view when they alone come close to the team column's
  // height: on tablets, and where an early generation's cards are short
  for (const { width, generation } of [
    { width: 700, generation: 9 },
    { width: 800, generation: 2 },
    { width: 700, generation: 1 },
    { width: 959, generation: 1 },
  ]) {
    test(`Gen ${generation} at ${width}px gives the checklist a view of its own to keep the columns level`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/?gen=${generation}`);
      const panel = page.getByRole("region", { name: "Team analysis" });
      const checklist = panel.getByRole("region", { name: "Team Checklist" });
      const defence = panel.getByRole("region", { name: "Team Defence" });
      const own = panel.getByRole("button", { name: "Team Checklist" });
      await expect(own).toBeVisible();
      await expect(defence).toBeVisible();
      await expect(checklist).toBeHidden();

      // Without the checklist the panel ends within reach of the team beside it
      const heights = await page.evaluate(() => {
        const [team, analysis] = [...document.querySelectorAll("main > *")];
        return [team, analysis?.querySelector("section")].map(
          column => column?.getBoundingClientRect().height ?? 0,
        );
      });
      expect(Math.abs((heights[0] ?? 0) - (heights[1] ?? 0))).toBeLessThan(110);

      await own.click();
      await expect(own).toHaveAttribute("aria-pressed", "true");
      await expect(checklist).toBeVisible();
      await expect(defence).toBeHidden();
      await expect(
        panel.getByRole("heading", { name: "Team Checklist", level: 2 }),
      ).toBeVisible();
      // The matrix keeps the switch
      await panel.getByRole("button", { name: "Matrix Analysis" }).click();
      await expect(own).toBeVisible();
      await panel
        .getByRole("button", { name: "Team Stats", exact: true })
        .click();
      await expect(defence).toBeVisible();
      await expect(checklist).toBeHidden();

      // Widening Gen 9 gives the checklist its place under the stats back, even from
      // its own view
      if (generation === 9) {
        await own.click();
        await page.setViewportSize({ width: 1200, height: 900 });
        await expect(own).toHaveCount(0);
        await expect(checklist).toBeVisible();
        await expect(defence).toBeVisible();
      }
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
