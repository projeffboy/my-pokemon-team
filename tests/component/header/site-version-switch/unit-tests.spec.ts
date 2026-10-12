import { test, expect } from "fixtures";

test("shows the old site switch near the title on a 320px phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const button = page
    .getByRole("banner")
    .getByRole("button", { name: "Old site", exact: true });
  await expect(button).toBeVisible();
  await expect(button).toBeInViewport();
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("button", { name: "Old site", exact: true }),
  ).toHaveCount(0);
  const fits = await button.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= innerWidth;
  });
  expect(fits).toBe(true);
});
