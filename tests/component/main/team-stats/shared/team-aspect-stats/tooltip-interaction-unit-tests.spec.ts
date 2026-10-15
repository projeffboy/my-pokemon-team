import { test, expect } from "fixtures";

test("a single touch opens a type explanation and the next closes it", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.use.hasTouch, "Requires touch input");
  await page.setViewportSize({ width: 390, height: 844 });
  const bug = page.getByRole("button", { name: "Bug", exact: true });
  await bug.tap();
  await expect(page.getByRole("tooltip")).toContainText(
    "First select a pokemon.",
  );
  await bug.tap();
  await expect(page.getByRole("tooltip")).toBeHidden();
  await page.getByRole("button", { name: "Dark", exact: true }).tap();
  await expect(page.getByRole("tooltip")).toBeVisible();
});

test("defence and coverage descriptions stay distinct when both are open", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const defence = page.getByRole("region", {
    name: "Team Defence",
    exact: true,
  });
  const coverage = page.getByRole("region", {
    name: "Team Type Coverage",
    exact: true,
  });
  const defenceBug = defence.getByRole("button", { name: "Bug", exact: true });
  const coverageBug = coverage.getByRole("button", {
    name: "Bug",
    exact: true,
  });
  await coverageBug.focus();
  await defenceBug.hover();
  const defenceId = await defenceBug.getAttribute("aria-describedby");
  const coverageId = await coverageBug.getAttribute("aria-describedby");
  expect(defenceId).toBeTruthy();
  expect(coverageId).toBeTruthy();
  expect(defenceId).not.toBe(coverageId);
  for (const id of [defenceId, coverageId])
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  await defenceBug.focus();
  await defenceBug.press("Escape");
  for (const id of [defenceId, coverageId])
    await expect(page.locator(`[id="${id}"]`)).toBeHidden();
});

test("a type reached with the keyboard is outlined", async ({ page }) => {
  const bug = page
    .getByRole("region", { name: "Team Defence", exact: true })
    .getByRole("button", { name: "Bug", exact: true });
  const outline = () =>
    bug.evaluate(tile => getComputedStyle(tile).outlineStyle);
  expect(await outline()).toBe("none");
  await bug.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(bug).toBeFocused();
  await expect.poll(outline).toBe("solid");
});
