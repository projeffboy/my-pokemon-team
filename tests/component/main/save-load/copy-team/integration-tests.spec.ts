import { test, expect } from "fixtures";
import { selectPokemon, selectMove } from "helper";

test.describe("Save/Load Team: Copy Team - Integration Tests", () => {
  test.beforeEach(async ({ context, browserName }, testInfo) => {
    if (
      browserName === "chromium" ||
      testInfo.project.name === "Android"
    ) {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
  });

  test("should copy team details to clipboard", async ({
    page,
    browserName,
  }, testInfo) => {
    // 1. Select pokemon Pikachu
    // Click the name input of the first card
    await selectPokemon(page, "Pikachu");

    // Select move Thunderbolt
    await selectMove(page, "Thunderbolt", 1, 0);

    // 2. Go to Save/Load tab
    await page.getByRole("tab", { name: /Save\/Load/ }).click();

    await page.waitForTimeout(500);

    // 3. Press "Copy Team" button
    await page.getByRole("button", { name: "Copy Team" }).click();

    // Verify snackbar
    const snackbar = page.getByRole("alert").getByText("Team copied.");
    await expect(snackbar).toBeVisible();

    // Verify clipboard content
    let clipboardText;

    if (browserName === "webkit" || testInfo.project.name === "iPhone") {
      // WebKit workaround: Paste into a textarea
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
      // Chromium and Firefox support readText (Firefox via asyncClipboard pref)
      clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    }

    // We check for the expected format
    const expectedSubstrings = ["Pikachu @", "Ability:", "-Thunderbolt"];
    for (const substring of expectedSubstrings) {
      expect(clipboardText).toContain(substring);
    }
  });
});
