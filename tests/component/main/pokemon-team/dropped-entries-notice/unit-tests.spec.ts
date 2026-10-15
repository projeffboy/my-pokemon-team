import { test, expect } from "fixtures";
import { getTeamTextFromUrl, showSlot } from "helper";
import type { Page } from "@playwright/test";

const notice = (page: Page) =>
  page.getByRole("alert").filter({ hasText: "were left out" });

const linkText = `Rabsca @ Imaginary Egg
Ability: Telepathy
- Bug Buzz
- Imaginary Roll
- Revival Blessing`;

const openLink = (page: Page) =>
  page.goto(`/?gen=9&team=${Buffer.from(linkText).toString("base64url")}`, {
    waitUntil: "domcontentloaded",
  });

test.describe("Dropped entries notice - Unit Tests", () => {
  test("names what a link lost above the team until dismissed", async ({
    page,
  }) => {
    await openLink(page);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Rabsca");
    await expect(notice(page)).toContainText(
      "2 entries in this link were left out",
    );
    await expect(notice(page).getByRole("listitem")).toHaveText([
      "Rabsca, item: Imaginary Egg",
      "Rabsca, move 2: Imaginary Roll",
    ]);
    await showSlot(page, 0);
    await expect(page.getByLabel("Pokemon 1's move2")).toHaveValue("");
    await expect(page.getByLabel("Pokemon 1's move3")).toHaveValue(
      "Revival Blessing",
    );

    // Above the team on every layout
    const noticeTop = (await notice(page).boundingBox())?.y ?? Infinity;
    const toolbarTop =
      (await page.getByRole("button", { name: "Manage team" }).boundingBox())
        ?.y ?? -Infinity;
    expect(noticeTop).toBeLessThan(toolbarTop);

    await notice(page).getByRole("button", { name: "Dismiss" }).click();
    await expect(notice(page)).toBeHidden();

    // The address now holds the team without them, so a reload names nothing
    expect(getTeamTextFromUrl(page)).not.toContain("Imaginary");
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Rabsca");
    await expect(notice(page)).toBeHidden();
  });

  test("Details shows the link's original text to copy", async ({ page }) => {
    await openLink(page);
    await notice(page).getByRole("button", { name: "Details" }).click();
    const details = page.getByRole("dialog", { name: "Original team text" });
    await expect(details.getByRole("textbox")).toHaveValue(linkText);

    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: (text: string) => {
            document.documentElement.dataset.copiedText = text;
            return Promise.resolve();
          },
        },
      });
    });
    await details.getByRole("button", { name: "Copy" }).click();
    // The open dialog hides the snackbar from the accessibility tree
    await expect(
      page
        .getByRole("alert", { includeHidden: true })
        .getByText("Team copied."),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.dataset.copiedText),
    ).toBe(linkText);

    await details.getByRole("button", { name: "Close" }).click();
    await expect(details).toBeHidden();
    await expect(notice(page)).toBeVisible();
  });

  test("names nothing for a link that lost nothing", async ({ page }) => {
    const text = "Rabsca\nAbility: Telepathy\n- Bug Buzz\n-\n-\n-";
    await page.goto(`/?gen=9&team=${Buffer.from(text).toString("base64url")}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Rabsca");
    await expect(page.getByRole("alert")).toHaveCount(0);
  });
});
