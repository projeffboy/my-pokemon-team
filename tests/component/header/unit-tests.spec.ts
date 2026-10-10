import { test, expect } from "fixtures";
import { expectImageToBeLoaded } from "helper";

test.describe("Header Tests", () => {
  test("should display header elements correctly", async ({ page }) => {
    const title = page.getByRole("heading", {
      name: "My Pokemon Team",
      level: 1,
    });
    await expect(title).toBeVisible();

    const images = page.locator("header img:visible");
    await expect(images).toHaveCount(2);

    await expectImageToBeLoaded(images.nth(0));
    await expectImageToBeLoaded(images.nth(1));
    await expect(images.nth(0)).toHaveAttribute("alt", "");
    await expect(images.nth(1)).toHaveAttribute("alt", "");
    await expect(title).not.toHaveCSS("text-overflow", "ellipsis");
    for (const width of [
      300, 301, 310, 320, 360, 399, 400, 599, 600, 639, 640, 960, 1440, 1920,
    ]) {
      await page.setViewportSize({ width, height: 800 });
      await expect
        .poll(() => title.evaluate(el => el.scrollWidth <= el.clientWidth))
        .toBe(true);
      await expect
        .poll(() =>
          title.evaluate(element => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const text = range.getBoundingClientRect();
            const box = element.getBoundingClientRect();
            return text.left >= box.left - 1 && text.right <= box.right + 1;
          }),
        )
        .toBe(true);
      const bounds = await title.boundingBox();
      expect(bounds).not.toBeNull();
      if (bounds) {
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      }
      const [venusaur, charizard, language, feedback] = await Promise.all(
        [
          images.nth(0),
          images.nth(1),
          page.getByRole("button", { name: "Language", exact: true }),
          page.getByRole("button", { name: "Send feedback", exact: true }),
        ].map(element => element.boundingBox()),
      );
      expect(venusaur && charizard && language && feedback).toBeTruthy();
      if (venusaur && charizard && language && feedback) {
        expect(venusaur.x).toBeCloseTo(language.x, 0);
        expect(charizard.x + charizard.width).toBeCloseTo(
          feedback.x + feedback.width,
          0,
        );
      }
    }

    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Gen 9 ");
    await expect(
      page.getByRole("button", { name: "Send feedback" }),
    ).toBeVisible();
  });
});
