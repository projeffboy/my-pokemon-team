import { test, expect } from "fixtures";
import { expectImageToBeLoaded } from "helper";

test("the chart can be reached and scrolled with the keyboard", async ({
  page,
}) => {
  // A short window, so the chart is taller than the dialog
  await page.setViewportSize({ width: 1366, height: 600 });
  await page.getByRole("button", { name: "Type Chart" }).click();
  const chart = page.getByRole("region", { name: "Table" });
  await expectImageToBeLoaded(chart.getByRole("img"));

  await page.getByRole("tab", { name: "Table" }).focus();
  await page.keyboard.press("Tab");
  await expect(chart).toBeFocused();
  await page.keyboard.press("End");
  await expect
    .poll(() =>
      chart.evaluate(
        ({ scrollTop, scrollHeight, clientHeight }) =>
          scrollTop > 0 && scrollTop + clientHeight >= scrollHeight - 1,
      ),
    )
    .toBe(true);
});
