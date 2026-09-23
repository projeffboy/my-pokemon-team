import { test, expect } from "fixtures";

test.describe("Theme - Unit Tests", () => {
  // Chrome renders an iframe whose colour scheme differs from its document's as an opaque
  // white box, so the (light) ad iframes must not inherit the page's dark scheme
  test("should give iframes a light colour scheme in dark mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");

    await page.evaluate(() => {
      const iframe = document.createElement("iframe");
      iframe.id = "ad-frame";
      document.body.append(iframe);
    });
    await expect(page.locator("#ad-frame")).toHaveCSS("color-scheme", "light");
  });
});
