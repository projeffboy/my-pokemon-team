import { test, expect } from "fixtures";

// Test configuration based on component-tests.md requirements

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
    // Buttons with an href render as anchors (role "link")
    const jefferyButton = page.getByRole("link", { name: "Jeffery Tang" });
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
    // Find elements (MUI's Switch exposes role="switch")
    const darkModeChecked = page.getByRole("switch", { name: "Dark Mode" });

    // Check system theme preference
    const systemPrefersDark = await page.evaluate(() => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    // Verify color theme matches system preference
    async function verifyTheme(systemPrefersDark: boolean) {
      const DARK_BODY_BG = "rgb(48, 48, 48)";
      const DARK_TITLE_COLOR = "rgb(224, 224, 224)";
      const LIGHT_BODY_BG = "rgb(238, 238, 238)";
      const LIGHT_TITLE_COLOR = "rgba(0, 0, 0, 0.87)";

      const titleElement = page.getByRole("heading", {
        name: "My Pokemon Team",
      });
      const body = page.locator("body");

      if (systemPrefersDark) {
        await expect(body).toHaveCSS("background-color", DARK_BODY_BG);
        await expect(titleElement).toHaveCSS("color", DARK_TITLE_COLOR);
      } else {
        await expect(body).toHaveCSS("background-color", LIGHT_BODY_BG);
        await expect(titleElement).toHaveCSS("color", LIGHT_TITLE_COLOR);
      }
    }

    // Verify website color theme matches system preference
    await expect(darkModeChecked).toBeChecked({ checked: systemPrefersDark });
    await verifyTheme(systemPrefersDark);

    // Toggle to opposite state
    await darkModeChecked.click();

    // Verify color theme changed
    await expect(darkModeChecked).toBeChecked({ checked: !systemPrefersDark });
    await verifyTheme(!systemPrefersDark);

    // Toggle back to original state
    await darkModeChecked.click();

    // Verify color theme reverted
    await expect(darkModeChecked).toBeChecked({ checked: systemPrefersDark });
    await verifyTheme(systemPrefersDark);
  });

  test("should follow system theme changes", async ({ page }) => {
    const darkModeSwitch = page.getByRole("switch", { name: "Dark Mode" });
    const initiallyDark = await darkModeSwitch.isChecked();

    await page.emulateMedia({ colorScheme: initiallyDark ? "light" : "dark" });

    await expect(darkModeSwitch).toBeChecked({ checked: !initiallyDark });
  });

  test("should not reserve ad space in development", async ({ page }) => {
    await expect(page.getByRole("contentinfo")).toHaveCSS(
      "padding-bottom",
      "0px"
    );
  });
});
