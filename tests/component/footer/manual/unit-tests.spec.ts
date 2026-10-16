import { test, expect } from "fixtures";

test.describe("Manual - Unit Tests", () => {
  test("should test Manual button and dialog", async ({ page }) => {
    const manualButton = page.getByRole("button", { name: "Manual" });
    await manualButton.click();

    // Should load popup/dialog - look for dialog or modal content
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Manual Help Guide");
  });

  test("lists questions that each open to their answer", async ({ page }) => {
    await page.getByRole("button", { name: "Manual" }).click();
    const dialog = page.getByRole("dialog", { name: "Manual Help Guide" });
    const question = dialog.getByRole("button", {
      name: "Where are my teams saved?",
    });
    const answer = dialog.getByText(/^Your teams are saved in this browser/);
    await expect(question).toHaveAttribute("aria-expanded", "false");
    await expect(answer).toBeHidden();
    await question.click();
    await expect(question).toHaveAttribute("aria-expanded", "true");
    await expect(answer).toBeVisible();
  });
});
