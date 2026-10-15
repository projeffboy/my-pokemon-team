import { test, expect } from "fixtures";
import { clickMenuItem, openMoreMenu, selectPokemon, selectMove } from "helper";

test.describe("More menu: Copy text - Integration Tests", () => {
  test.beforeEach(async ({ context, browserName }, testInfo) => {
    if (browserName === "chromium" || testInfo.project.name === "Android") {
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

    // 2. Copy the team's text from the More menu
    await openMoreMenu(page);
    await clickMenuItem(page, "Copy text");

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

    // We check for the expected format; without an item there is no " @ "
    expect(clipboardText.split("\n")[0]).toBe("Pikachu");
    const expectedSubstrings = ["Ability:", "- Thunderbolt"];
    for (const substring of expectedSubstrings) {
      expect(clipboardText).toContain(substring);
    }
  });

  test("points to Edit Pokepaste, which shows the text, when the team cannot be copied", async ({
    page,
  }) => {
    await selectPokemon(page, "Furret");
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error("Denied")) },
      }),
    );
    await openMoreMenu(page);
    await clickMenuItem(page, "Copy text");

    await expect(page.getByRole("alert").last()).toContainText(
      "Could not copy the team. Copy its text from Edit Pokepaste instead.",
    );
    await openMoreMenu(page);
    await clickMenuItem(page, "Edit Pokepaste");
    await expect(
      page.getByRole("dialog", { name: "Edit Pokepaste" }).getByRole("textbox"),
    ).toHaveValue(/^Furret/);
  });
});
