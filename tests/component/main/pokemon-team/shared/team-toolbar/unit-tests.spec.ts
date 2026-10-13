import type { Locator } from "@playwright/test";
import { test, expect } from "fixtures";

const ACTIONS = [
  "Teams",
  "Randomize team",
  "Share pokemon team link",
  "Undo",
  "Redo",
  "Manage team",
];

// Each button's box and the box of its label, which must be shown in full below its icon
const measure = (buttons: Locator) =>
  buttons.evaluateAll(elements =>
    elements.map(element => {
      const button = element.getBoundingClientRect();
      const label = element.querySelector("span");
      const icon = element.querySelector("svg");
      if (!label || !icon) throw new Error("Missing label or icon");
      const text = label.getBoundingClientRect();
      return {
        top: Math.round(button.top),
        left: button.left,
        right: button.right,
        height: button.height,
        text: label.textContent ?? "",
        labelled:
          text.width > 0 &&
          text.left >= button.left - 0.5 &&
          text.right <= button.right + 0.5 &&
          text.top >= icon.getBoundingClientRect().bottom - 0.5 &&
          // One line, unbroken
          text.height < 20,
      };
    }),
  );

test("every team action keeps its label, on two rows where one cannot hold them", async ({
  page,
}) => {
  const toolbar = page.getByRole("toolbar", { name: "Team actions" });
  const buttons = toolbar.getByRole("button");
  for (const { width, rows } of [
    { width: 320, rows: 2 },
    { width: 375, rows: 1 },
    { width: 599, rows: 1 },
    // A tablet's team column is narrower than a phone's
    { width: 600, rows: 2 },
    { width: 760, rows: 1 },
    { width: 959, rows: 1 },
    { width: 960, rows: 1 },
    { width: 1200, rows: 1 },
  ]) {
    await page.setViewportSize({ width, height: 900 });
    const names = width < 960 ? ACTIONS : [...ACTIONS, "Advanced"];
    await expect(buttons).toHaveCount(names.length);
    for (const [index, name] of names.entries())
      await expect(buttons.nth(index)).toHaveAccessibleName(name);
    await expect
      .poll(
        async () => new Set((await measure(buttons)).map(box => box.top)).size,
      )
      .toBe(rows);

    // The Random and Manage labels shorten a moment after the toolbar resizes
    await expect
      .poll(async () =>
        (await measure(buttons))
          .filter(box => !box.labelled)
          .map(box => box.text),
      )
      .toEqual([]);
    const boxes = await measure(buttons);
    const bar = await toolbar.boundingBox();
    if (!bar) throw new Error("Missing toolbar");
    for (const box of boxes) {
      expect(box.text, `${width}px`).not.toBe("");
      expect(box.height).toBeGreaterThanOrEqual(48);
      expect(box.left).toBeGreaterThanOrEqual(bar.x - 0.5);
      expect(box.right).toBeLessThanOrEqual(bar.x + bar.width + 0.5);
    }
    // On two rows the team's actions sit above its history and settings
    if (rows === 2)
      expect(boxes.map(box => box.top === boxes[0]?.top)).toEqual(
        names.map((_, index) => index < 3),
      );
  }
});

test("from md the toolbar holds the Advanced switch, colored when on", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  const advanced = page
    .getByRole("toolbar", { name: "Team actions" })
    .getByRole("button", { name: "Advanced", exact: true });
  await expect(advanced).toHaveAttribute("aria-pressed", "false");
  const offColor = await advanced
    .getByTestId("ToggleOffOutlinedIcon")
    .evaluate(icon => getComputedStyle(icon).color);
  await advanced.click();
  await expect(advanced).toHaveAttribute("aria-pressed", "true");
  const onIcon = advanced.getByTestId("ToggleOnOutlinedIcon");
  await expect(onIcon).toBeVisible();
  expect(await onIcon.evaluate(icon => getComputedStyle(icon).color)).not.toBe(
    offColor,
  );
  await advanced.click();
  await expect(advanced).toHaveAttribute("aria-pressed", "false");
});

test("a language with longer labels wraps onto two rows instead of dropping them", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await page.getByRole("menuitem", { name: "Deutsch" }).click();
  const buttons = page.getByRole("toolbar").first().getByRole("button");
  await expect(buttons).toHaveCount(ACTIONS.length);
  await expect
    .poll(
      async () => new Set((await measure(buttons)).map(box => box.top)).size,
    )
    .toBe(2);
  await expect
    .poll(async () =>
      (await measure(buttons))
        .filter(box => !box.labelled)
        .map(box => box.text),
    )
    .toEqual([]);
});
