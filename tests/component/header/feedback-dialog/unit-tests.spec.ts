import { test, expect } from "fixtures";
import { selectPokemon } from "helper";

test.describe("Feedback Dialog - Unit Tests", () => {
  test("sends the message and team link by email", async ({ page }) => {
    await selectPokemon(page, "Wobbuffet");
    await page.getByRole("button", { name: "Send feedback" }).click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    await expect(dialog).toBeVisible();

    const send = dialog.getByRole("link", { name: "Send" });
    await expect(send).toHaveAttribute("aria-disabled", "true");

    await dialog
      .getByLabel("Your feedback")
      .fill("Wobbuffet is missing Counter");
    const href = (await send.getAttribute("href")) ?? "";
    expect(href).toMatch(/^mailto:jeffery124@gmail\.com\?subject=/);
    const body = new URLSearchParams(href.split("?")[1]).get("body") ?? "";
    expect(body).toContain("Wobbuffet is missing Counter");
    expect(body).toContain("?team=");

    await dialog.getByLabel("Attach my team link").uncheck();
    const bodyWithoutLink =
      new URLSearchParams(
        ((await send.getAttribute("href")) ?? "").split("?")[1],
      ).get("body") ?? "";
    expect(bodyWithoutLink).not.toContain("?team=");

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
  });
});
