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
      "https://jefferytang.com",
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
      "a[href='https://github.com/projeffboy/my-pokemon-team']",
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

  test("should select system, light, and dark themes", async ({ page }) => {
    const systemButton = page.getByRole("button", { name: "Use system theme" });
    const lightButton = page.getByRole("button", { name: "Use light theme" });
    const darkButton = page.getByRole("button", { name: "Use dark theme" });
    const systemPrefersDark = await page.evaluate(() => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    async function verifyTheme(darkMode: boolean) {
      const DARK_BODY_BG = "rgb(48, 48, 48)";
      const DARK_TITLE_COLOR = "rgb(224, 224, 224)";
      const LIGHT_BODY_BG = "rgb(238, 238, 238)";
      const LIGHT_TITLE_COLOR = "rgba(0, 0, 0, 0.87)";

      const titleElement = page.getByRole("heading", {
        name: "My Pokemon Team",
      });
      const body = page.locator("body");

      if (darkMode) {
        await expect(body).toHaveCSS("background-color", DARK_BODY_BG);
        await expect(titleElement).toHaveCSS("color", DARK_TITLE_COLOR);
      } else {
        await expect(body).toHaveCSS("background-color", LIGHT_BODY_BG);
        await expect(titleElement).toHaveCSS("color", LIGHT_TITLE_COLOR);
      }
    }

    await expect(systemButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(systemPrefersDark);

    await darkButton.click();
    await expect(darkButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(true);

    const [modeCookie] = await page.context().cookies();
    expect(modeCookie.name).toBe("mui-mode");
    expect(modeCookie.value).toBe("dark");
    expect(modeCookie.expires).toBeGreaterThan(
      Date.now() / 1000 + 6.9 * 24 * 60 * 60,
    );
    expect(modeCookie.expires).toBeLessThan(
      Date.now() / 1000 + 7.1 * 24 * 60 * 60,
    );

    await page.reload();
    await expect(darkButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(true);

    await lightButton.click();
    await expect(lightButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(false);

    await systemButton.click();
    await expect(systemButton).toHaveAttribute("aria-pressed", "true");
    await verifyTheme(systemPrefersDark);
    expect(await page.context().cookies()).toEqual([]);
  });

  test("should follow system theme changes", async ({ page }) => {
    const systemButton = page.getByRole("button", { name: "Use system theme" });
    const body = page.locator("body");
    const initiallyDark = await page.evaluate(
      () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    await page.emulateMedia({ colorScheme: initiallyDark ? "light" : "dark" });

    await expect(systemButton).toHaveAttribute("aria-pressed", "true");
    await expect(body).toHaveCSS(
      "background-color",
      initiallyDark ? "rgb(238, 238, 238)" : "rgb(48, 48, 48)",
    );
  });

  test("should not reserve ad space in development", async ({ page }) => {
    await expect(page.getByRole("contentinfo")).toHaveCSS(
      "padding-bottom",
      "0px",
    );
  });
});
