import { test, expect } from "fixtures";
import { selectMove, selectPokemon } from "helper";

test.describe("Share Link - Integration Tests", () => {
  test.beforeEach(async ({ context, browserName }, testInfo) => {
    if (browserName === "chromium" || testInfo.project.name === "Android") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
  });

  test("copies the current team link to the clipboard", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["Android", "iPhone"].includes(testInfo.project.name),
      "This test only runs on mobile",
    );

    await selectPokemon(page, "Pikachu");
    await selectMove(page, "Thunderbolt", 1, 0);

    const shareButton = page.getByRole("button", {
      name: "Share pokemon team link",
    });
    await expect(shareButton).toBeVisible();
    await shareButton.click();

    await expect(page.getByRole("alert")).toContainText(
      "Pokemon team link copied",
    );

    let clipboardText: string;
    if (testInfo.project.name === "iPhone") {
      await page.evaluate(() => {
        const textarea = document.createElement("textarea");
        textarea.id = "paste-target";
        document.body.appendChild(textarea);
        textarea.focus();
      });

      const modifier = process.platform === "darwin" ? "Meta" : "Control";
      await page.keyboard.press(`${modifier}+V`);

      clipboardText = await page.evaluate(() => {
        const textarea = document.getElementById("paste-target");
        return textarea instanceof HTMLTextAreaElement ? textarea.value : "";
      });
    } else {
      clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    }

    expect(clipboardText).toBe(page.url());
  });

  test("points to the address bar, which holds the team, when the link cannot be copied", async ({
    page,
  }) => {
    await selectPokemon(page, "Bellossom");
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error("Denied")) },
      }),
    );
    await page.getByRole("button", { name: "Share pokemon team link" }).click();

    await expect(page.getByRole("alert").last()).toContainText(
      "Could not copy the link. Copy it from the address bar while the team is open.",
    );
    await expect
      .poll(() => {
        const team = new URL(page.url()).searchParams.get("team") ?? "";
        return Buffer.from(team, "base64url").toString();
      })
      .toContain("Bellossom");
  });
});
