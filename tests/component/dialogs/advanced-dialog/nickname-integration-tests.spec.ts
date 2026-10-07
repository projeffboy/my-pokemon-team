import { test, expect } from "fixtures";
import { openAdvanced, closeDialog, getTeamTextFromUrl } from "helper";
import ja from "@/i18n/ja";

test("nickname entry uses each game's limit and preserves imported nicknames until edited", async ({
  page,
}) => {
  test.setTimeout(90000);
  const original = "ABCDEFGHIJKLMNO";
  for (let generation = 1; generation <= 9; generation++) {
    const team = Buffer.from(`${original} (Golduck)\n-\n`).toString(
      "base64url",
    );
    await page.goto(`/?gen=${generation}&team=${team}`);
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    const nickname = dialog.getByRole("textbox", {
      name: "Nickname",
      exact: true,
    });
    const max = generation <= 5 ? 10 : 12;
    await expect(nickname).toHaveValue(original);
    await expect(nickname).toHaveAttribute("aria-invalid", "true");
    await expect(dialog).toContainText(
      `Golduck's nickname must be ${max} characters or fewer.`,
    );
    await closeDialog(page);
    expect(getTeamTextFromUrl(page)).toContain(`${original} (Golduck)`);
    await openAdvanced(page);
    await nickname.fill("PQRSTUVWXYZABCDE");
    const expected = "PQRSTUVWXYZABCDE".slice(0, max);
    await expect(nickname).toHaveValue(expected);
    await expect(nickname).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.getByRole("status")).toHaveText(
      `Maximum ${max} characters.`,
    );
    await nickname.press("End");
    await nickname.press("Backspace");
    await nickname.pressSequentially(expected.slice(-1));
    await expect(nickname).not.toHaveAttribute("aria-invalid", "true");
    await closeDialog(page);
    await expect
      .poll(() => getTeamTextFromUrl(page))
      .toContain(`${expected} (Golduck)`);
  }
});

test("a generation change previews and applies the shorter nickname limit", async ({
  page,
}) => {
  const team = Buffer.from("ABCDEFGHIJKL (Golduck)\n-\n").toString("base64url");
  await page.goto(`/?gen=6&team=${team}`);
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 5/ }).press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Nickname: ABCDEFGHIJKL → ABCDEFGHIJ");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toBeHidden();
  expect(getTeamTextFromUrl(page)).toContain("ABCDEFGHIJKL (Golduck)");
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 5/ }).press("Enter");
  await dialog
    .getByRole("button", { name: "Update existing team", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect
    .poll(() => getTeamTextFromUrl(page))
    .toContain("ABCDEFGHIJ (Golduck)");
});

test("nickname entry follows the selected language without renaming an existing team", async ({
  page,
}) => {
  const team = Buffer.from("ABCDEFGHIJKL (Golduck)\n-\n").toString("base64url");
  await page.goto(`/?gen=9&team=${team}`);
  await openAdvanced(page);
  await closeDialog(page);
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await page.getByRole("menuitem", { name: "日本語" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await page
    .getByRole("button", { name: ja.team.advancedFor(1), exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: ja.team.advanced,
  });
  const nickname = dialog.getByRole("textbox", {
    name: ja.advanced.nickname,
    exact: true,
  });
  await expect(nickname).toHaveValue("ABCDEFGHIJKL");
  await expect(nickname).toHaveAttribute("aria-invalid", "true");
  expect(getTeamTextFromUrl(page)).toContain("ABCDEFGHIJKL (Golduck)");
  await nickname.fill("あいうえおかきく");
  await expect(nickname).toHaveValue("あいうえおか");
  await expect(dialog.getByRole("status")).toHaveText(
    ja.advanced.nicknameLimit(6),
  );
  await dialog.getByRole("button", { name: ja.done, exact: true }).click();
  await expect
    .poll(() => getTeamTextFromUrl(page))
    .toContain("あいうえおか (Golduck)");
});

for (const game of [
  { query: "gen=3", max: 10 },
  { query: "game=Pokemon+Champions+%28M-C%29", max: 12 },
]) {
  test(`exceeding the nickname limit notifies the player for ${game.query}`, async ({
    page,
  }) => {
    const team = Buffer.from("Golduck\n-\n").toString("base64url");
    await page.goto(`/?${game.query}&team=${team}`);
    await page.setViewportSize({ width: 320, height: 900 });
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    const nickname = dialog.getByRole("textbox", {
      name: "Nickname",
      exact: true,
    });
    const legal = "ABCDEFGHIJKL".slice(0, game.max);
    await nickname.fill(legal);
    await expect(dialog.getByRole("status")).toHaveCount(0);
    await nickname.pressSequentially("M");
    await expect(nickname).toHaveValue(legal);
    await expect(nickname).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.getByRole("status")).toHaveText(
      `Maximum ${game.max} characters.`,
    );
    expect(getTeamTextFromUrl(page)).not.toContain(`${legal}M (Golduck)`);
    await nickname.press("End");
    await nickname.press("Backspace");
    await expect(nickname).not.toHaveAttribute("aria-invalid", "true");
    await expect(dialog.getByRole("status")).toHaveCount(0);
    await nickname.fill("PQRSTUVWXYZABCDE");
    await expect(nickname).toHaveValue("PQRSTUVWXYZABCDE".slice(0, game.max));
    await expect(dialog.getByRole("status")).toHaveText(
      `Maximum ${game.max} characters.`,
    );
    await dialog.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(nickname).toHaveValue("");
    await expect(dialog.getByRole("status")).toHaveCount(0);
    await expect(nickname).not.toHaveAttribute("aria-invalid", "true");
    await closeDialog(page);
    await openAdvanced(page);
    await expect(dialog.getByRole("status")).toHaveCount(0);
  });
}
