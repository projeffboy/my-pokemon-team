import { test, expect } from "fixtures";
import {
  openAdvanced,
  closeDialog,
  getTeamTextFromUrl,
  openEditPokepaste,
} from "helper";

test("happiness survives links and reloads, is editable, and resets to its default", async ({
  page,
  browser,
}) => {
  const team = Buffer.from("Kangaskhan\nHappiness: 0\n- Frustration").toString(
    "base64url",
  );
  await page.goto(`/?gen=3&team=${team}`);
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  const happiness = dialog.getByLabel("Happiness", { exact: true });
  await expect(happiness).toHaveValue("0");
  await happiness.fill("70");
  await closeDialog(page);
  await expect.poll(() => getTeamTextFromUrl(page)).toContain("Happiness: 70");
  const url = page.url();
  await page.reload();
  await openAdvanced(page);
  await expect(happiness).toHaveValue("70");
  const fresh = await browser.newPage();
  try {
    await fresh.goto(url);
    await openAdvanced(fresh);
    await expect(fresh.getByLabel("Happiness", { exact: true })).toHaveValue(
      "70",
    );
  } finally {
    await fresh.close();
  }
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

test("Gen 1 and Champions omit happiness from imported links and their editors", async ({
  page,
}) => {
  const team = Buffer.from("Psyduck\nHappiness: 0\n- Water Gun").toString(
    "base64url",
  );
  for (const profile of ["gen=1", "game=Pokemon+Champions+%28M-C%29"]) {
    await page.goto(`/?${profile}&team=${team}`);
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
  }
});
