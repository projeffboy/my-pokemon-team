import { test, expect } from "fixtures";

test.describe("Footer - Unit Tests", () => {
  test("should link an empty team to the pinned old version", async ({
    page,
  }) => {
    await expect(
      page.getByRole("link", { name: "Old version" }),
    ).toHaveAttribute(
      "href",
      "https://my-pokemon-team-9tnxdj5hn-jeffery-tangs-projects.vercel.app/",
    );
  });

  test("should not reserve ad space in development", async ({ page }) => {
    await expect(page.getByRole("contentinfo")).toHaveCSS(
      "padding-bottom",
      "0px",
    );
  });
});
