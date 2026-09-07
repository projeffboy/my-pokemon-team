import { test, expect } from "fixtures";
import { selectMove, selectPokemon } from "helper";

test.describe("Share Link - Integration Tests", () => {
  test.beforeEach(async ({ context, browserName }, testInfo) => {
    if (browserName === "chromium" || testInfo.project.name === "Android") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
  });

  test("copies the current team link to the clipboard", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["Android", "iPhone"].includes(testInfo.project.name),
      "This test only runs on mobile",
    );

    await selectPokemon(page, "Pikachu");
    await selectMove(page, "Thunderbolt", 1, 0);

    const shareButton = page.getByRole("button", {
      name: "Share pokemon team link",
    });
    await expect(shareButton).toBeVisible();
    await shareButton.click();

    await expect(page.getByRole("alert")).toContainText(
      "Pokemon team link copied",
    );

    let clipboardText = "";
    if (testInfo.project.name === "iPhone") {
      await page.evaluate(() => {
        const textarea = document.createElement("textarea");
        textarea.id = "paste-target";
        document.body.appendChild(textarea);
        textarea.focus();
      });

      const modifier = process.platform === "darwin" ? "Meta" : "Control";
      await page.keyboard.press(`${modifier}+V`);

      clipboardText = await page.evaluate(() => {
        const textarea = document.getElementById("paste-target");
        return textarea instanceof HTMLTextAreaElement ? textarea.value : "";
      });
    } else {
      clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    }

    expect(clipboardText).toBe(page.url());
  });
});
