import { test, expect } from "fixtures";
import { expectImageToBeLoaded } from "helper";

test.describe("Header Tests", () => {
  test("should display header elements correctly", async ({ page }) => {
    const title = page.getByRole("heading", {
      name: "My Pokemon Team",
      level: 1,
    });
    await expect(title).toBeVisible();

    const images = page.locator("header img:visible:not(button img)");
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
      const [leftFace, rightFace] = await Promise.all(
        [images.nth(0), images.nth(1)].map(element => element.boundingBox()),
      );
      expect(leftFace && rightFace).toBeTruthy();
      if (leftFace && rightFace && bounds) {
        expect(leftFace.x + leftFace.width).toBeLessThanOrEqual(bounds.x);
        expect(rightFace.x).toBeGreaterThanOrEqual(bounds.x + bounds.width);
        expect((leftFace.x + rightFace.x + rightFace.width) / 2).toBeCloseTo(
          width / 2,
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

  test("puts the language and feedback icons beside their captions where there is room", async ({
    page,
  }) => {
    const header = page.getByRole("banner");
    const buttons = ["Language", "Send feedback"].map(name =>
      header.getByRole("button", { name, exact: true }),
    );
    // How far right of the button's middle its icon's middle is
    const iconOffsets = () =>
      Promise.all(
        buttons.map(button =>
          button.evaluate(element => {
            const middle = (box: DOMRect) => box.x + box.width / 2;
            const icon = element.querySelector("svg");
            if (!icon) throw new Error("Missing icon");
            return Math.round(
              middle(icon.getBoundingClientRect()) -
                middle(element.getBoundingClientRect()),
            );
          }),
        ),
      );

    for (const width of [320, 600, 760]) {
      await page.setViewportSize({ width, height: 800 });
      await expect
        .poll(async () => (await iconOffsets()).every(offset => !offset))
        .toBe(true);
    }
    // The icons move beside the captions before the language is named in full
    for (const [width, language] of [
      [790, "EN"],
      [840, "ENGLISH"],
      [1200, "ENGLISH"],
    ] as const) {
      await page.setViewportSize({ width, height: 800 });
      await expect
        .poll(async () => (await iconOffsets()).every(offset => offset < -5))
        .toBe(true);
      await expect(buttons[0]!).toHaveText(language, { useInnerText: true });
      await expect(buttons[1]!).toHaveText("FEEDBACK", { useInnerText: true });
      await expect(
        header.getByRole("button", { name: "Go to the old website" }),
      ).toBeVisible();
    }
  });
});
