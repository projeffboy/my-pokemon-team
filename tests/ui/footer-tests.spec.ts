import { test, expect } from "fixtures";

// Test configuration based on ui-tests.md requirements

test.describe("Footer Tests", () => {
  test("should test Manual button and dialog", async ({ page }) => {
    const manualButton = page.getByRole("button", { name: "Manual" });
    await manualButton.click();

    // Should load popup/dialog - look for dialog or modal content
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Manual Help Guide");
  });

  test("should test Jeffery Tang button and external link", async ({
    page,
  }) => {
    const jefferyButton = page.getByRole("button", { name: "Jeffery Tang" });
    await expect(jefferyButton).toBeVisible();
    await expect(jefferyButton).toHaveAttribute(
      "href",
      "https://jefferytang.com"
    );
  });

  test("should test Credits button and dialog", async ({ page }) => {
    const creditsButton = page.getByRole("button", { name: "Credits" });
    await creditsButton.click();

    // Should open a dialog
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Credits");
  });

  test("should test Updates button and GitHub link", async ({ page }) => {
    const updatesButton = page.getByRole("button", { name: "Updates" });
    await updatesButton.click();

    // Should open a dialog
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Update Log");

    const link = dialog.locator(
      "a[href='https://github.com/projeffboy/my-pokemon-team']"
    );
    await expect(link).toBeVisible();
  });

  test("should test Privacy Policy button and dialog", async ({ page }) => {
    const privacyButton = page.getByRole("button", {
      name: "Privacy Policy",
    });
    await privacyButton.click();

    // Should open a dialog
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Privacy Policy");
  });

  test("should test Dark Mode functionality", async ({ page }) => {
    // Find elements
    const systemButton = page.getByRole("button", { name: "system" });
    const lightButton = page.getByRole("button", { name: "light" });
    const darkButton = page.getByRole("button", { name: "dark" });

    // Check system theme preference
    const systemPrefersDark = await page.evaluate(
      () => window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    // Verify color theme matches system preference
    async function verifyTheme(isDark) {
      const DARK_BODY_BG = "rgb(18, 18, 18)"; // TODO: change this to 48 when you update the site
      const DARK_TITLE_COLOR = "rgb(224, 224, 224)";
      const LIGHT_BODY_BG = "rgb(238, 238, 238)";
      const LIGHT_TITLE_COLOR = "rgba(0, 0, 0, 0.87)";

      const titleElement = page.getByRole("heading", {
        name: "My Pokemon Team",
      });
      const body = page.locator("body");

      if (isDark) {
        await expect(body).toHaveCSS("background-color", DARK_BODY_BG);
        await expect(titleElement).toHaveCSS("color", DARK_TITLE_COLOR);
      } else {
        await expect(body).toHaveCSS("background-color", LIGHT_BODY_BG);
        await expect(titleElement).toHaveCSS("color", LIGHT_TITLE_COLOR);
      }
    }

    // Verify default state (System)
    await expect(systemButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(systemPrefersDark);

    // Switch to Light
    await lightButton.click();
    await expect(lightButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(false);

    // Switch to Dark
    await darkButton.click();
    await expect(darkButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(true);

    // Switch back to System
    await systemButton.click();
    await expect(systemButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(systemPrefersDark);
  });
});
