import { test, expect } from "fixtures";

// Test configuration based on ui-tests.md requirements

test.describe("Footer Tests", () => {
  test("should test Manual button and dialog", async ({ page }) => {
    const manualButton = page.getByRole("button", { name: "Manual" });
    await manualButton.click();

    // Should load popup/dialog - look for dialog or modal content
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });

  test("should test Jeffery Tang button and external link", async ({
    page,
  }) => {
    const jefferyButton = page.getByRole("button", { name: "Jeffery Tang" });
    await expect(jefferyButton).toBeVisible();
    await expect(jefferyButton).toHaveAttribute("href", /jefferytang\.com/);
  });

  test("should test Credits button and dialog", async ({ page }) => {
    const creditsButton = page.getByRole("button", { name: "Credits" });
    await creditsButton.click();

    // Should lead to a dialog
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });

  test("should test Updates button and GitHub link", async ({ page }) => {
    const updatesButton = page.getByRole("button", {
      name: "Updates",
    });
    await updatesButton.click();

    // Should open a dialog
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const link = dialog.locator(
      "a[href*='github.com/projeffboy/my-pokemon-team']"
    );
    await expect(link).toBeVisible();
  });

  test("should test Privacy Policy button and dialog", async ({ page }) => {
    const privacyButton = page.getByRole("button", {
      name: "Privacy Policy",
    });
    await privacyButton.click();

    // Should load another dialog
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });

  test("should test Dark Mode functionality", async ({ page }) => {
    // Find dark mode checkbox
    const darkModeCheckbox = page.getByRole("checkbox", {
      name: "Dark Mode",
    });
    const darkModeLabel = page.getByText("Dark Mode");

    await expect(darkModeCheckbox).toBeVisible();
    await expect(darkModeLabel).toBeVisible();

    // Check system theme preference
    const systemPrefersDark = await page.evaluate(() => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const isInitiallyChecked = await darkModeCheckbox.isChecked();

    // Verify that the initial checkbox state matches the system preference
    expect(isInitiallyChecked).toBe(systemPrefersDark);

    // Get the website title element to check text color changes
    const titleElement = page.getByRole("heading", { name: "My Pokemon Team" });

    // Check initial theme colors
    const initialBodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    const initialTitleColor = await titleElement.evaluate(el => {
      return getComputedStyle(el).color;
    });

    // Verify initial colors match the system preference
    if (systemPrefersDark) {
      expect(initialBodyBg).toBe("rgb(48, 48, 48)"); // #303030
      expect(initialTitleColor).toBe("rgb(224, 224, 224)"); // #e0e0e0
    } else {
      expect(initialBodyBg).toBe("rgb(238, 238, 238)"); // #eee
      expect(initialTitleColor).toBe("rgba(0, 0, 0, 0.87)");
    }

    // Toggle dark mode
    await darkModeCheckbox.click();

    // Verify checkbox state changed
    const isNowChecked = await darkModeCheckbox.isChecked();
    expect(isNowChecked).toBe(!isInitiallyChecked);

    // Wait a moment for theme changes to apply
    await page.waitForTimeout(100);

    // Check colors after toggle
    const newBodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    const newTitleColor = await titleElement.evaluate(el => {
      return getComputedStyle(el).color;
    });

    // Verify colors match the new theme (opposite of initial)
    if (isNowChecked) {
      // Now in dark mode
      expect(newBodyBg).toBe("rgb(48, 48, 48)"); // #303030
      expect(newTitleColor).toBe("rgb(224, 224, 224)"); // #e0e0e0
    } else {
      // Now in light mode
      expect(newBodyBg).toBe("rgb(238, 238, 238)"); // #eee
      expect(newTitleColor).toBe("rgba(0, 0, 0, 0.87)");
    }

    // Toggle back to original state
    await darkModeCheckbox.click();
    const isFinallyChecked = await darkModeCheckbox.isChecked();
    expect(isFinallyChecked).toBe(isInitiallyChecked);

    // Wait for theme to revert
    await page.waitForTimeout(100);

    // Verify colors have reverted back to original
    const finalBodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    const finalTitleColor = await titleElement.evaluate(el => {
      return getComputedStyle(el).color;
    });

    // Verify colors match the original system theme
    if (systemPrefersDark) {
      expect(finalBodyBg).toBe("rgb(48, 48, 48)"); // #303030
      expect(finalTitleColor).toBe("rgb(224, 224, 224)"); // #e0e0e0
    } else {
      expect(finalBodyBg).toBe("rgb(238, 238, 238)"); // #eee
      expect(finalTitleColor).toBe("rgba(0, 0, 0, 0.87)");
    }
  });
});
