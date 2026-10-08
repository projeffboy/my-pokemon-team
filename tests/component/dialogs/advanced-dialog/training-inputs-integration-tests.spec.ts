import { test, expect } from "fixtures";
import {
  openAdvanced,
  closeDialog,
  getTeamTextFromUrl,
  selectPokemon,
} from "helper";

test("Reset clears a training amount while its field is still being edited", async ({
  page,
  isMobile,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(
    page.getByRole("tablist", { name: "Pokemon team slots" }).getByRole("tab"),
  ).toHaveCount(6);
  await selectPokemon(page, "Eiscue");
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  const attack = dialog.getByRole("spinbutton", {
    name: "Atk EVs",
    exact: true,
  });
  await attack.fill("137");
  await expect(attack).toBeFocused();
  await expect.poll(() => getTeamTextFromUrl(page)).toContain("137 Atk");

  const reset = dialog.getByRole("button", { name: "Reset", exact: true });
  if (isMobile) await reset.tap();
  else await reset.click();
  await expect(attack).toHaveValue("0");
  await expect(
    dialog.getByRole("slider", { name: "Atk EVs", exact: true }),
  ).toHaveValue("0");
  await expect.poll(() => getTeamTextFromUrl(page)).not.toContain("EVs:");
});

for (const variant of [
  { query: "gen=9", pokemon: "Crustle", training: "EVs", amount: 137 },
  { query: "gen=3", pokemon: "Kecleon", training: "EVs", amount: 255 },
  {
    query: "gen=2",
    pokemon: "Chinchou",
    training: "Stat experience",
    amount: 43210,
  },
  {
    query: "game=Pokemon+Champions+%28M-C%29",
    pokemon: "Escavalier",
    training: "SPs",
    amount: 17,
  },
  {
    query: "game=Legends%3A+Arceus",
    pokemon: "Shinx",
    training: "Effort Levels",
    amount: 7,
  },
  {
    query: "game=Let%E2%80%99s+Go",
    pokemon: "Pikachu",
    training: "AVs",
    amount: 134,
  },
]) {
  test(`exact ${variant.training} amounts can be typed on a narrow phone in ${variant.query}`, async ({
    page,
  }) => {
    test.slow();
    await page.setViewportSize({ width: 320, height: 640 });
    const team = Buffer.from(`${variant.pokemon}\n`).toString("base64url");
    await page.goto(`/?${variant.query}&team=${team}`);
    await expect(
      page.getByLabel("Pokemon 1's name", { exact: true }),
    ).toHaveValue(variant.pokemon);
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    const amount = dialog.getByRole("spinbutton", {
      name: `Atk ${variant.training}`,
      exact: true,
    });
    const slider = dialog.getByRole("slider", {
      name: `Atk ${variant.training}`,
      exact: true,
    });
    await expect(amount).toBeVisible();
    await expect(amount).toHaveAttribute("inputmode", "numeric");
    await amount.fill(String(variant.amount));
    await dialog.getByLabel("Nickname", { exact: true }).focus();
    await expect(amount).toHaveValue(String(variant.amount));
    await expect(slider).toHaveValue(String(variant.amount));
    await expect
      .poll(() => dialog.evaluate(el => el.scrollWidth <= el.clientWidth))
      .toBe(true);

    await closeDialog(page);
    await expect
      .poll(() => getTeamTextFromUrl(page))
      .toContain(`${variant.amount} Atk`);
    await page.reload();
    await expect(
      page.getByLabel("Pokemon 1's name", { exact: true }),
    ).toHaveValue(variant.pokemon);
    await openAdvanced(page);
    await expect(amount).toHaveValue(String(variant.amount));
    await amount.fill("");
    await dialog.getByLabel("Nickname", { exact: true }).focus();
    await expect(amount).toHaveValue("0");
    await expect(slider).toHaveValue("0");
  });
}

test("typed EV amounts obey the per-stat and total limits", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const team = Buffer.from("Bruxish\nEVs: 252 HP / 252 Atk\n").toString(
    "base64url",
  );
  await page.goto(`/?gen=9&team=${team}`);
  await expect(
    page.getByLabel("Pokemon 1's name", { exact: true }),
  ).toHaveValue("Bruxish");
  await openAdvanced(page);
  const dialog = page.getByRole("dialog", { name: "More details" });
  const speed = dialog.getByRole("spinbutton", {
    name: "Spe EVs",
    exact: true,
  });
  const attack = dialog.getByRole("spinbutton", {
    name: "Atk EVs",
    exact: true,
  });
  const endEditing = () =>
    dialog.getByLabel("Nickname", { exact: true }).focus();

  await speed.fill("65");
  await endEditing();
  await expect(speed).toHaveValue("6");
  await expect(dialog.getByLabel(/^EV total/)).toHaveText("510 / 510");
  await attack.fill("");
  await endEditing();
  await expect(attack).toHaveValue("0");
  await attack.fill("999");
  await endEditing();
  await expect(attack).toHaveValue("252");
  await expect(dialog.getByLabel(/^EV total/)).toHaveText("510 / 510");
  await speed.fill("-7");
  await endEditing();
  await expect(speed).toHaveValue("0");
  await expect(dialog.getByLabel(/^EV total/)).toHaveText("504 / 510");
});
