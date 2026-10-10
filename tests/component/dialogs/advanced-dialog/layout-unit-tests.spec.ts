import { test, expect } from "fixtures";
import type { Locator } from "@playwright/test";
import { openAdvanced, closeDialog } from "helper";

for (const game of [
  { query: "gen=1", level: true, gender: false, nature: false, tera: false },
  { query: "gen=2", level: true, gender: true, nature: false, tera: false },
  { query: "gen=3", level: true, gender: true, nature: true, tera: false },
  { query: "gen=9", level: true, gender: true, nature: true, tera: true },
  {
    query: "game=Pokemon+Champions+%28M-C%29",
    level: false,
    gender: true,
    nature: true,
    tera: false,
  },
]) {
  test(`details fit responsive rows for ${game.query}`, async ({ page }) => {
    test.setTimeout(60000);
    const team = Buffer.from("Golduck (F)\n").toString("base64url");
    await page.goto(`/?${game.query}&team=${team}`);
    for (const width of [320, 400, 600, 960, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await openAdvanced(page);
      const dialog = page.getByRole("dialog", { name: "More details" });
      const title = dialog.locator(".MuiDialogTitle-root");
      await expect(title).toContainText("Golduck");
      await expect(title).not.toContainText("slot 1");
      await expect(dialog.getByLabel("Level", { exact: true })).toHaveCount(
        game.level ? 1 : 0,
      );
      await expect(dialog.getByLabel("Gender", { exact: true })).toHaveCount(
        game.gender ? 1 : 0,
      );
      await expect(dialog.getByLabel("Tera Type", { exact: true })).toHaveCount(
        game.tera ? 1 : 0,
      );
      const natureLabel = game.level ? "Nature" : "Stat alignment";
      await expect(dialog.getByLabel(natureLabel, { exact: true })).toHaveCount(
        game.nature ? 1 : 0,
      );
      const content = dialog.locator(".MuiDialogContent-root");
      await expect
        .poll(() => content.evaluate(el => el.scrollWidth <= el.clientWidth))
        .toBe(true);
      const nickname = dialog.getByRole("textbox", { name: "Nickname" });
      const fieldWidth = await nickname.evaluate(
        el =>
          el.closest(".MuiFormControl-root")?.getBoundingClientRect().width ??
          Infinity,
      );
      expect(fieldWidth).toBeLessThan(200);
      expect(fieldWidth).toBeLessThan(
        await content.evaluate(el => el.clientWidth - 48),
      );
      const rowDistance = async (first: Locator, second: Locator) => {
        const a = await first.boundingBox();
        const b = await second.boundingBox();
        return a && b ? Math.abs(a.y - b.y) : Infinity;
      };
      if (game.level) {
        await expect
          .poll(() =>
            rowDistance(nickname, dialog.getByLabel("Level", { exact: true })),
          )
          .toBeLessThan(1);
      } else if (width === 320) {
        await expect
          .poll(() =>
            rowDistance(
              dialog.getByLabel("Gender", { exact: true }),
              dialog.getByLabel("Shiny", { exact: true }),
            ),
          )
          .toBeLessThan(20);
      }
      if (!game.level && width >= 400) {
        await expect
          .poll(() =>
            rowDistance(nickname, dialog.getByLabel("Gender", { exact: true })),
          )
          .toBeLessThan(1);
      }
      const fieldsFit = await content.evaluate(el => {
        const bounds = el.getBoundingClientRect();
        return [
          ...el.querySelectorAll(
            ".MuiFormControl-root, .MuiFormControlLabel-root",
          ),
        ].every(field => {
          const rect = field.getBoundingClientRect();
          return rect.left >= bounds.left && rect.right <= bounds.right + 1;
        });
      });
      expect(fieldsFit).toBe(true);
      if (
        !game.level &&
        width === 320 &&
        test.info().project.name === "Desktop Chrome"
      )
        await dialog.screenshot({ path: "/tmp/advanced-details-320.png" });
      await closeDialog(page);
    }
  });
}
