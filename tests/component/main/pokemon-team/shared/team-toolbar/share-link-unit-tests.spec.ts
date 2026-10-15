import { test, expect } from "fixtures";
import { createViewport, SMALL_VIEWPORT_WIDTH } from "helper";

test.describe("Share Link - Unit Tests", () => {
  test.use({ viewport: createViewport(SMALL_VIEWPORT_WIDTH) });

  test("shows an empty-team message when sharing before any Pokemon are selected", async ({
    page,
  }) => {
    const shareButton = page.getByRole("button", {
      name: "Share pokemon team link",
    });

    await expect(shareButton).toBeVisible();
    await shareButton.click();

    await expect(page.getByRole("alert")).toContainText(
      "Pokemon team is empty",
    );
  });
});
