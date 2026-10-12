import { test, expect } from "fixtures";

test("shows the old website switch near the title on a 320px phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const button = page
    .getByRole("banner")
    .getByRole("button", { name: "Old website", exact: true });
  await expect(button).toBeVisible();
  await expect(button).toBeInViewport();
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("button", { name: "Old website", exact: true }),
  ).toHaveCount(0);
  const fits = await button.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= innerWidth;
  });
  expect(fits).toBe(true);
});

for (const width of [320, 400, 599, 600, 640, 680, 960, 1200]) {
  test(`${width}px places the version switch alongside language and feedback`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    const header = page.getByRole("banner");
    const oldSite = header.getByRole("button", {
      name:
        width >= 680 ? "Go to the old website"
        : (width >= 400 && width < 600) || width === 640 ? "Go to old website"
        : "Old website",
      exact: true,
    });
    const language = header.getByRole("button", {
      name: "Language",
      exact: true,
    });
    const feedback = header.getByRole("button", {
      name: "Send feedback",
      exact: true,
    });
    const boxes = await Promise.all(
      [oldSite, language, feedback].map(async button => {
        await expect(button).toBeVisible();
        return button.boundingBox();
      }),
    );
    const [oldBounds, languageBounds, feedbackBounds] = boxes;
    expect(oldBounds).not.toBeNull();
    expect(languageBounds).not.toBeNull();
    expect(feedbackBounds).not.toBeNull();
    if (!oldBounds || !languageBounds || !feedbackBounds)
      throw new Error("Missing header controls");
    const middle = (box: typeof oldBounds) => box.y + box.height / 2;
    expect(middle(oldBounds)).toBeCloseTo(middle(languageBounds), 0);
    expect(middle(oldBounds)).toBeCloseTo(middle(feedbackBounds), 0);
    expect(oldBounds.x + oldBounds.width).toBeLessThanOrEqual(languageBounds.x);
    expect(feedbackBounds.x + feedbackBounds.width).toBeLessThanOrEqual(width);
    if (width >= 600) {
      const generation = await header
        .getByRole("combobox", { name: "Generation", exact: true })
        .boundingBox();
      expect(generation).not.toBeNull();
      if (!generation) throw new Error("Missing generation selector");
      expect(oldBounds.x + oldBounds.width).toBeLessThan(generation.x);
      expect(generation.x + generation.width).toBeLessThan(languageBounds.x);
    }
  });
}
