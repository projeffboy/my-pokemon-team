import { test, expect } from "fixtures";
import {
  openAdvanced,
  closeDialog,
  getTeamTextFromUrl,
  openEditPokepaste,
} from "helper";
import type { Page } from "@playwright/test";

// Every case opens its own game-specific team link.
test.use({
  autoGoToSite: async ({}, use) => {
    await use();
  },
});

const editHappiness = async (page: Page) => {
  const team = Buffer.from("Kangaskhan\nHappiness: 0\n- Frustration").toString(
    "base64url",
  );
  await page.goto(`/?gen=3&team=${team}`, { waitUntil: "domcontentloaded" });
  await expect(
    page.getByLabel("Pokemon 1's name", { exact: true }),
  ).toHaveValue("Kangaskhan");
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  const happiness = dialog.getByLabel("Happiness", { exact: true });
  await expect(happiness).toHaveValue("0");
  await happiness.fill("70");
  await closeDialog(page);
  await expect.poll(() => getTeamTextFromUrl(page)).toContain("Happiness: 70");
};

test("edited happiness survives reloads", async ({ page }) => {
  await editHappiness(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(
    page.getByLabel("Pokemon 1's name", { exact: true }),
  ).toHaveValue("Kangaskhan");
  await openAdvanced(page);
  await expect(
    page
      .getByRole("dialog", { name: "More details" })
      .getByLabel("Happiness", { exact: true }),
  ).toHaveValue("70");
});

test("edited happiness survives a fresh shared link", async ({
  page,
  browser,
}) => {
  await editHappiness(page);
  const url = page.url();
  const fresh = await browser.newPage();
  try {
    await fresh.goto(url, { waitUntil: "domcontentloaded" });
    await expect(
      fresh.getByLabel("Pokemon 1's name", { exact: true }),
    ).toHaveValue("Kangaskhan");
    await openAdvanced(fresh);
    await expect(fresh.getByLabel("Happiness", { exact: true })).toHaveValue(
      "70",
    );
  } finally {
    await fresh.close();
  }
});

test("happiness defaults when cleared or reset after a raw-text import", async ({
  page,
}) => {
  const team = Buffer.from("Kangaskhan\nHappiness: 70\n- Frustration").toString(
    "base64url",
  );
  await page.goto(`/?gen=3&team=${team}`, { waitUntil: "domcontentloaded" });
  await expect(
    page.getByLabel("Pokemon 1's name", { exact: true }),
  ).toHaveValue("Kangaskhan");
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  const happiness = dialog.getByLabel("Happiness", { exact: true });
  await expect(happiness).toHaveValue("70");
  await happiness.fill("");
  await dialog.getByLabel("Nickname").focus();
  await expect(happiness).toHaveValue("255");
  await expect.poll(() => getTeamTextFromUrl(page)).not.toContain("Happiness:");
  await closeDialog(page);
  await openEditPokepaste(page);
  await page
    .getByRole("textbox", { name: "Pokemon Showdown Team Raw Text" })
    .fill("Kangaskhan\nHappiness: 0\n- Frustration");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await expect.poll(() => getTeamTextFromUrl(page)).toContain("Happiness: 0");
  await openAdvanced(page);
  await expect(happiness).toHaveValue("0");
  await happiness.fill("0");
  await dialog.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(happiness).toHaveValue("255");
  await expect.poll(() => getTeamTextFromUrl(page)).not.toContain("Happiness:");
});

for (const { name, profile } of [
  { name: "Gen 1", profile: "gen=1" },
  { name: "Champions", profile: "game=Pokemon+Champions+%28M-C%29" },
]) {
  test(`${name} omits happiness from imported links and its editor`, async ({
    page,
  }) => {
    const team = Buffer.from("Psyduck\nHappiness: 0\n- Water Gun").toString(
      "base64url",
    );
    await page.goto(`/?${profile}&team=${team}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByLabel("Pokemon 1's name", { exact: true }),
    ).toHaveValue("Psyduck");
    await openAdvanced(page);
    await expect(
      page
        .getByRole("dialog", { name: "More details" })
        .getByLabel("Happiness", { exact: true }),
    ).toHaveCount(0);
    await expect
      .poll(() => getTeamTextFromUrl(page))
      .not.toContain("Happiness:");
    await closeDialog(page);
    await openEditPokepaste(page);
    await page
      .getByRole("textbox", { name: "Pokemon Showdown Team Raw Text" })
      .fill("Psyduck\nHappiness: 100\n- Water Gun");
    await page.getByRole("button", { name: "Update", exact: true }).click();
    await expect
      .poll(() => getTeamTextFromUrl(page))
      .not.toContain("Happiness:");
  });
}
