import { test, expect } from "@playwright/test";
import { goToSite } from "helper.js";

test.describe("Save/Load Team: Copy Team - Integration Tests", () => {
  test.beforeEach(async ({ page, context, browserName }) => {
    if (browserName === "chromium" || browserName === "Mobile Chrome") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    await goToSite(page);
  });

  test("should copy team details to clipboard", async ({
    page,
    browserName,
  }) => {
    // 1. Select pokemon Pikachu
    // Click the name input of the first card
    const nameControl = page
      .locator(".Select-control")
      .filter({ has: page.locator("#react-select-single-0-name") });
    await nameControl.click();

    const nameInput = page.locator("#react-select-single-0-name");
    await nameInput.fill("Pikachu");
    await page
      .getByRole("listbox")
      .getByText("Pikachu", { exact: true })
      .click();

    // Select move Thunderbolt
    const moveControl = page
      .locator(".Select-control")
      .filter({ has: page.locator("#react-select-single-0-move1") });
    await moveControl.click();

    const moveInput = page.locator("#react-select-single-0-move1");
    await moveInput.fill("Thunderbolt");
    await page
      .getByRole("listbox")
      .getByText("Thunderbolt", { exact: true })
      .click();

    // 2. Go to Save/Load tab
    await page.getByRole("tab", { name: /Save\/Load/ }).click();

    await page.waitForTimeout(100);

    // 3. Press "Copy Team" button
    await page.getByRole("button", { name: "Copy Team" }).click();

    // Verify snackbar
    await expect(page.getByText("Team copied.")).toBeVisible();

    // Verify clipboard content
    let clipboardText;

    if (browserName === "webkit" || browserName === "Mobile Safari") {
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
        return textarea.value;
      });
    } else {
      // Chromium and Firefox support readText (Firefox via asyncClipboard pref)
      clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    }

    // We check for the expected format
    expect(clipboardText).toContain("Pikachu @");
    expect(clipboardText).toContain("Ability:"); // Should be empty
    expect(clipboardText).toContain("-Thunderbolt");
  });
});
