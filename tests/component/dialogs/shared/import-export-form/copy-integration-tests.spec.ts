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
  if (browserName !== "webkit" && testInfo.project.name !== "iPhone")
    return page.evaluate(() => navigator.clipboard.readText());

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

test.describe("Import/Export Form: Copy - Integration Tests", () => {
  test.beforeEach(async ({ context, browserName }, testInfo) => {
    if (browserName === "chromium" || testInfo.project.name === "Android") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
  });

  test("copies the team's text", async ({ page, browserName }, testInfo) => {
    await selectPokemon(page, "Girafarig");
    await selectMove(page, "Twin Beam", 1, 0);

    await openImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    const box = dialog.getByRole("textbox");
    await dialog.getByRole("button", { name: "Copy", exact: true }).click();

    await expect(snackbar(page)).toHaveText("Team copied.");
    const clipboardText = await readClipboard(page, browserName, testInfo);
    expect(clipboardText.split("\n")[0]).toBe("Girafarig");
    expect(clipboardText).toContain("- Twin Beam");
    expect(clipboardText).toBe(await box.inputValue());
    await expect(dialog).toBeVisible();
  });

  test("copies the text in the box, including edits the team does not have yet", async ({
    page,
    browserName,
  }, testInfo) => {
    await openImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    const text = "Delibird @ Leftovers\n- Present\n- Foul Play";
    await dialog.getByRole("textbox").fill(text);
    await dialog.getByRole("button", { name: "Copy", exact: true }).click();

    await expect(snackbar(page)).toHaveText("Team copied.");
    expect(
      (await readClipboard(page, browserName, testInfo)).replaceAll(
        "\r\n",
        "\n",
      ),
    ).toBe(text);

    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
  });

  test("points to the box, which holds the text, when the text cannot be copied", async ({
    page,
  }) => {
    await selectPokemon(page, "Piloswine");
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
    await expect(dialog.getByRole("textbox")).toHaveValue(/^Piloswine/);
  });
});
