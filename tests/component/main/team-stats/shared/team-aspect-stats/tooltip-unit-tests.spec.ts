import { test, expect } from "fixtures";
import { openAnalysis } from "helper";

for (const width of [320, 960]) {
  for (const analysis of ["Team Defence", "Team Type Coverage"]) {
    test(`${analysis}: type tooltip clears the score below and the label above at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 640 });
      await openAnalysis(page, analysis);
      await page.addStyleTag({
        content: "body { padding-block: 100vh; }",
      });
      const section = page.getByRole("region", { name: analysis });
      const type = section.getByRole("button", {
        name: "Electric",
        exact: true,
      });
      const score = section.getByLabel("Electric score: 0", { exact: true });
      const tooltip = page.getByRole("tooltip");

      for (const placement of ["bottom", "top"]) {
        await page.mouse.move(0, 0);
        await type.evaluate((element, placement) => {
          const top = placement === "bottom" ? 16 : window.innerHeight - 32;
          window.scrollBy(0, element.getBoundingClientRect().top - top);
        }, placement);
        await expect(async () => {
          await type.hover();
          await expect(tooltip).toBeVisible();
          await expect(tooltip).toHaveAttribute(
            "data-popper-placement",
            new RegExp(`^${placement}`),
          );
          const popup = await tooltip.boundingBox();
          const label = await type.boundingBox();
          const value = await score.boundingBox();
          if (!popup || !label || !value)
            throw new Error("Missing type tooltip");
          if (placement === "bottom") {
            expect(popup.y).toBeGreaterThanOrEqual(value.y + value.height - 1);
          } else {
            expect(popup.y + popup.height).toBeLessThanOrEqual(label.y + 1);
          }
        }).toPass();
      }
      await type.focus();
      await type.press("Escape");
      await expect(tooltip).toBeHidden();
    });
  }
}
