import { test, expect } from "fixtures";
import { openAnalysis } from "helper";

for (const analysis of ["Team Defence", "Team Type Coverage"]) {
  test(`${analysis}: tooltip heading follows its chip's type icon as space changes`, async ({
    page,
  }) => {
    const team = Buffer.from("Rhyperior\n- Stone Edge\n").toString("base64url");
    await page.goto(`/?gen=9&team=${team}`);
    let sawIcon = false;
    let sawTextOnly = false;
    for (const width of [320, 480, 600, 1366]) {
      await page.setViewportSize({ width, height: 900 });
      await openAnalysis(page, analysis);
      const chip = page
        .getByRole("region", { name: analysis, exact: true })
        .getByRole("button", { name: "Bug", exact: true });
      await chip.focus();
      const heading = page.getByRole("tooltip").locator("p").first();
      await expect(heading).toContainText("Bug");
      await expect(async () => {
        const hasIcon = (await chip.locator("img").count()) > 0;
        await expect(heading.locator("img")).toHaveCount(hasIcon ? 1 : 0);
        if (hasIcon) {
          await expect(heading.locator("img")).toHaveAttribute(
            "src",
            (await chip.locator("img").getAttribute("src")) ?? "",
          );
          sawIcon = true;
        } else sawTextOnly = true;
      }).toPass();
      await chip.press("Escape");
      await chip.evaluate(element => element.blur());
    }
    expect(sawIcon).toBe(true);
    expect(sawTextOnly).toBe(true);
  });
}

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
