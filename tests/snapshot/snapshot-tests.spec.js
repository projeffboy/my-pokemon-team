import { test, expect } from "fixtures";

const LIGHT_PROJECTS = ["Desktop Chrome", "iPhone"];

const screenshotName = (projectName, theme) =>
  `${projectName.toLowerCase().replace(/\s+/g, "-")}-${theme}.png`;

test.describe("Snapshot Tests", () => {
  test("Homepage should match the visual baseline for each browser in the configured theme", async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name;
    const requestedTheme = LIGHT_PROJECTS.includes(projectName)
      ? "light" : "dark";

    await page.emulateMedia({ colorScheme: requestedTheme });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveScreenshot(
      screenshotName(projectName, requestedTheme),
      {
        fullPage: true,
      }
    );
  });
});