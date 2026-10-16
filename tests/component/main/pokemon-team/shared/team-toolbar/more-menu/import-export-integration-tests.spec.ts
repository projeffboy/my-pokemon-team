import { test, expect } from "fixtures";
import { openImportExport, selectMove, selectPokemon } from "helper";
import type { Page, TestInfo } from "@playwright/test";

// The open dialog hides the snackbar from assistive technology
const snackbar = (page: Page) =>
  page.getByRole("alert", { includeHidden: true });

const readClipboard = async (
  page: Page,
  browserName: string,
  testInfo: TestInfo,
) => {
  if (browserName !== "webkit" && testInfo.project.name !== "iPhone") {
    // Chromium and Firefox support readText (Firefox via asyncClipboard pref)
    return page.evaluate(() => navigator.clipboard.readText());
  }

  // WebKit workaround: paste into a textarea, which the open dialog's focus trap
  // allows only inside the dialog
  await page.evaluate(() => {
    const textarea = document.createElement("textarea");
    textarea.id = "paste-target";
    document.querySelector('[role="dialog"]')?.appendChild(textarea);
    textarea.focus();
  });
  const modifier = process.platform === "darwin" ? "Meta" : "Control";
  await page.keyboard.press(`${modifier}+V`);
  return page.evaluate(() => {
    const textarea = document.getElementById("paste-target");
    return textarea instanceof HTMLTextAreaElement ? textarea.value : "";
  });
};

test.describe("More menu: Import/Export - Integration Tests", () => {
  test.beforeEach(async ({ context, browserName }, testInfo) => {
    if (browserName === "chromium" || testInfo.project.name === "Android") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
  });

  test("copies the team's text from the dialog's Copy button", async ({
    page,
    browserName,
  }, testInfo) => {
    await selectPokemon(page, "Luxray");
    await selectMove(page, "Wild Charge", 1, 0);

    await openImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    await dialog.getByRole("button", { name: "Copy", exact: true }).click();

    await expect(snackbar(page)).toHaveText("Team copied.");
    const clipboardText = await readClipboard(page, browserName, testInfo);
    // Without an item there is no " @ "
    expect(clipboardText.split("\n")[0]).toBe("Luxray");
    for (const substring of ["Ability:", "- Wild Charge"])
      expect(clipboardText).toContain(substring);
    expect(clipboardText).toBe(await dialog.getByRole("textbox").inputValue());
    await expect(dialog).toBeVisible();
  });

  test("points to the dialog's text when the team cannot be copied", async ({
    page,
  }) => {
    await selectPokemon(page, "Gliscor");
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error("Denied")) },
      }),
    );
    await openImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    await dialog.getByRole("button", { name: "Copy", exact: true }).click();

    await expect(snackbar(page).last()).toHaveText(
      "Could not copy the team. Select its text in Import/Export and copy it.",
    );
    await expect(dialog.getByRole("textbox")).toHaveValue(/^Gliscor/);
  });

  test("an empty team has nothing to copy or upload", async ({ page }) => {
    await openImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });

    await expect(dialog.getByRole("textbox")).toHaveValue("");
    await expect(
      dialog.getByRole("button", { name: "Copy", exact: true }),
    ).toBeDisabled();
    await expect(
      dialog.getByRole("button", { name: "Upload to PokePaste", exact: true }),
    ).toBeDisabled();

    await dialog.getByRole("textbox").fill("Dusknoir");
    await expect(
      dialog.getByRole("button", { name: "Copy", exact: true }),
    ).toBeEnabled();
  });
});
