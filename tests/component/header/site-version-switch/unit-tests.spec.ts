import { test, expect } from "fixtures";

const switchButton = (page: import("@playwright/test").Page) =>
  page.getByRole("banner").getByRole("button", { name: /new website/i });

test("shows the new website switch under the bug report link on a 320px phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const button = switchButton(page);
  await expect(button).toBeVisible();
  await expect(button).toBeInViewport();
  await expect(
    page.getByRole("contentinfo").getByRole("button", { name: /new website/i }),
  ).toHaveCount(0);
  const fits = await button.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= innerWidth;
  });
  expect(fits).toBe(true);
  const reportLink = page.getByRole("link", { name: /report bugs/i });
  const below = await button.evaluate(
    (element, linkBottom) => element.getBoundingClientRect().top >= linkBottom,
    (await reportLink.boundingBox())?.y ?? 0,
  );
  expect(below).toBe(true);
});

test("uses the longest label that fits", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(switchButton(page)).toHaveText("Go to the new website");
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(switchButton(page)).toHaveText(/^(Go to (the )?)?new website$/i);
});

test("sits beside the generation line and bug report link where there is room", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const button = (await switchButton(page).boundingBox())!;
  const link = (await page
    .getByRole("link", { name: /report bugs/i })
    .boundingBox())!;
  expect(button.x).toBeGreaterThan(link.x + link.width);
  expect(button.y).toBeLessThan(link.y + link.height);
});
