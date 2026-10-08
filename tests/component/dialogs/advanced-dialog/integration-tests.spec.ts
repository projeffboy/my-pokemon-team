import { test, expect } from "fixtures";
import {
  getTeamTextFromUrl,
  closeDialog,
  clickMenuItem,
  openAdvanced,
  openTeamTools,
  selectDialogOption,
  selectPokemon,
  selectMove,
} from "helper";

test.describe("Advanced Dialog - Integration Tests", () => {
  test("deleting the detailed team in another tab preserves the remaining team's details", async ({
    page,
    context,
  }) => {
    test.slow();
    await selectPokemon(page, "Magcargo");
    await openAdvanced(page);
    const details = page.getByRole("dialog", { name: "More details" });
    await details.getByLabel("Level", { exact: true }).fill("50");
    await closeDialog(page);
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mypokemonteam")))
      .toContain('"level":50');

    const otherTab = await context.newPage();
    await otherTab.goto(page.url());
    await expect(otherTab.getByLabel("Pokemon 1's name")).toHaveValue(
      "Magcargo",
    );
    await openTeamTools(otherTab);
    await otherTab.getByRole("button", { name: "Teams", exact: true }).click();
    await otherTab
      .getByRole("button", { name: "New Team", exact: true })
      .click();
    await selectPokemon(otherTab, "Haxorus");
    await openAdvanced(otherTab);
    await otherTab
      .getByRole("dialog", { name: "More details" })
      .getByLabel("Level", { exact: true })
      .fill("60");
    await closeDialog(otherTab);
    await expect
      .poll(() => getTeamTextFromUrl(otherTab))
      .toContain("Level: 60");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Magcargo");
    await openAdvanced(page);

    await otherTab.getByRole("button", { name: "Teams", exact: true }).click();
    await otherTab
      .getByRole("button", { name: "Options for Team 1", exact: true })
      .click();
    await clickMenuItem(otherTab, "Delete");
    await otherTab
      .getByRole("dialog", { name: "Delete Team 1?" })
      .getByRole("button", { name: "Delete", exact: true })
      .click();
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Haxorus");
    if (await details.isVisible())
      await details.getByRole("button", { name: "Reset", exact: true }).click();

    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Level: 60");
    await expect(details).toBeHidden();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Haxorus");
    await otherTab.close();
  });

  for (const generation of [2, 3, 7, 8]) {
    test(`Gen ${generation} Hidden Power updates the displayed IVs or DVs and persists them`, async ({
      page,
    }) => {
      const pokemon = generation === 8 ? "Unown" : "Dunsparce";
      const team = Buffer.from(`${pokemon}\n- Return\n`).toString("base64url");
      await page.goto(`/?gen=${generation}&team=${team}`);
      await selectMove(page, "Hidden Power Fire", 2);
      await openAdvanced(page);
      const dialog = page.getByRole("dialog", { name: "More details" });
      const legacy = generation === 2;
      for (const [stat, value] of legacy ?
        [
          ["Atk", "14"],
          ["Def", "12"],
          ["HP", "3"],
          ["Special", "15"],
        ]
      : [
          ["Atk", "30"],
          ["Def", "31"],
          ["SpA", "30"],
          ["Spe", "30"],
        ]) {
        await expect(
          dialog.getByLabel(`${stat} ${legacy ? "DVs" : "IVs"}`, {
            exact: true,
          }),
        ).toHaveValue(value ?? "");
      }
      await closeDialog(page);
      await expect.poll(() => getTeamTextFromUrl(page)).toContain("IVs:");
      await page.reload();
      await expect(page.getByLabel("Pokemon 1's move2")).toHaveValue(
        "Hidden Power Fire",
      );
      await openAdvanced(page);
      await expect(
        dialog.getByLabel(`Atk ${legacy ? "DVs" : "IVs"}`, { exact: true }),
      ).toHaveValue(legacy ? "14" : "30");
      await closeDialog(page);
      await selectMove(page, "Hidden Power Ice", 2);
      await openAdvanced(page);
      await expect(
        dialog.getByLabel(`Def ${legacy ? "DVs" : "IVs"}`, { exact: true }),
      ).toHaveValue(legacy ? "13" : "30");
      await expect(
        dialog.getByLabel(`Spe ${legacy ? "DVs" : "IVs"}`, { exact: true }),
      ).toHaveValue(legacy ? "15" : "31");
    });
  }
  test("gender defaults to the only available option and shows its symbol", async ({
    page,
  }) => {
    for (const { pokemon, gender, icon } of [
      { pokemon: "Mothim", gender: "Male", icon: "MaleIcon" },
      { pokemon: "Vespiquen", gender: "Female", icon: "FemaleIcon" },
      { pokemon: "Carbink", gender: "Genderless", icon: undefined },
      { pokemon: "Swablu", gender: "Any", icon: undefined },
    ]) {
      await selectPokemon(page, pokemon);
      await openAdvanced(page);
      const dialog = page.getByRole("dialog", { name: "More details" });
      await expect(dialog.getByLabel("Gender", { exact: true })).toHaveText(
        gender,
      );
      if (icon) await expect(dialog.getByTestId(icon)).toBeVisible();
      else {
        await expect(dialog.getByTestId("MaleIcon")).toHaveCount(0);
        await expect(dialog.getByTestId("FemaleIcon")).toHaveCount(0);
      }
      await dialog.getByRole("button", { name: "Reset", exact: true }).click();
      await expect(dialog.getByLabel("Gender", { exact: true })).toHaveText(
        gender,
      );
      await closeDialog(page);
      await page.reload();
      await openAdvanced(page);
      await expect(dialog.getByLabel("Gender", { exact: true })).toHaveText(
        gender,
      );
      await closeDialog(page);
    }
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    await selectDialogOption(page, "Gender", "Male");
    await expect(dialog.getByTestId("MaleIcon")).toBeVisible();
    await expect(dialog.getByTestId("FemaleIcon")).toHaveCount(0);
    await selectDialogOption(page, "Gender", "Female");
    await expect(dialog.getByTestId("FemaleIcon")).toBeVisible();
    await expect(dialog.getByTestId("MaleIcon")).toHaveCount(0);
    await selectDialogOption(page, "Gender", "Any");
    await expect(dialog.getByTestId("MaleIcon")).toHaveCount(0);
    await expect(dialog.getByTestId("FemaleIcon")).toHaveCount(0);
  });

  for (const generation of [8]) {
    test(`Gen ${generation} has EVs and IVs but no Tera Type`, async ({
      page,
    }) => {
      await page.getByRole("combobox", { name: "Generation" }).click();
      await page.locator(`[role="option"][data-value="${generation}"]`).click();
      await expect(
        page.getByRole("combobox", { name: "Generation" }),
      ).toContainText(`Gen ${generation} `);
      await expect(page.locator(".MuiMenu-paper")).toBeHidden();
      await selectPokemon(page, "Psyduck");
      await openAdvanced(page);
      const dialog = page.getByRole("dialog", { name: "More details" });
      await expect(dialog.getByLabel("Tera Type")).toHaveCount(0);
      await expect(
        dialog.getByRole("slider", { name: "Atk EVs" }),
      ).toBeVisible();
      await expect(dialog.getByLabel("Atk IVs")).toHaveCount(1);
    });
  }

  test("Champions uses single-point SPs, hides IVs and Tera Type, and saves the spread", async ({
    page,
  }) => {
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: "Gen 9 · Champions" }).click();
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Champions");
    await expect(page.locator(".MuiMenu-paper")).toBeHidden();
    await selectPokemon(page, "Kommo-o");
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    await expect(dialog.getByLabel("Tera Type")).toHaveCount(0);
    await expect(dialog.getByLabel(/ IVs$/)).toHaveCount(0);
    await expect(
      dialog.getByRole("heading", { name: "SPs", exact: true }),
    ).toBeVisible();
    const attack = dialog.getByRole("slider", { name: "Atk SPs" });
    await expect(attack).toHaveAttribute("max", "32");
    await expect(attack).toHaveAttribute("step", "1");
    await attack.focus();
    await page.keyboard.press("End");
    await dialog.getByRole("slider", { name: "Spe SPs" }).focus();
    await page.keyboard.press("End");
    await dialog.getByRole("slider", { name: "HP SPs" }).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByLabel(/^SP total/)).toHaveText("66 / 66");
    await closeDialog(page);
    await expect
      .poll(() => getTeamTextFromUrl(page))
      .toContain("EVs: 2 HP / 32 Atk / 32 Spe");
    await page.reload();
    await openAdvanced(page);
    await expect(dialog.getByLabel(/^SP total/)).toHaveText("66 / 66");
    await expect(dialog.getByLabel(/ IVs$/)).toHaveCount(0);
    await dialog.getByRole("button", { name: "Reset" }).click();
    await expect(dialog.getByLabel(/^SP total/)).toHaveText("0 / 66");
  });

  test("set details reach the share link and can be reset", async ({
    page,
  }) => {
    await selectPokemon(page, "Mudsdale");
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    await expect(dialog.locator(".MuiDialogTitle-root")).toContainText(
      "Mudsdale",
    );
    await expect(dialog.locator(".MuiDialogTitle-root")).not.toContainText(
      "slot 1",
    );

    // Typed key by key, so the space between the words has to survive
    await dialog.getByLabel("Nickname").pressSequentially("Big Clyde ");
    await dialog.getByLabel("Level").fill("50");
    await selectDialogOption(page, "Gender", "Female");
    await selectDialogOption(page, "Tera Type", "Steel");
    await selectDialogOption(page, "Nature", "Adamant (+Atk, -SpA)");
    await dialog.getByLabel("Shiny").check();
    await dialog.getByRole("slider", { name: "Atk EVs" }).focus();
    await page.keyboard.press("End");
    await dialog.getByLabel("SpA IVs").fill("0");
    await expect(dialog.getByLabel(/^EV total/)).toContainText("252 / 510");
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toBeHidden();

    await expect
      .poll(() => getTeamTextFromUrl(page))
      .toContain("Adamant Nature");
    const text = getTeamTextFromUrl(page);
    expect(text).toContain("Big Clyde (Mudsdale) (F) @ ");
    expect(text).toContain("Level: 50");
    expect(text).toContain("Shiny: Yes");
    expect(text).toContain("Tera Type: Steel");
    expect(text).toContain("EVs: 252 Atk");
    expect(text).toContain("IVs: 0 SpA");

    await openAdvanced(page);
    await dialog.getByRole("button", { name: "Reset" }).click();
    await expect(dialog.getByLabel("Nickname")).toHaveValue("");
    await expect(dialog.getByLabel("Level")).toHaveValue("100");
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect
      .poll(() => getTeamTextFromUrl(page))
      .not.toContain("Level: 50");
  });

  test("an IV can be deleted and typed again, and is 31 when left empty", async ({
    page,
  }) => {
    await selectPokemon(page, "Stakataka");
    await openAdvanced(page);
    const dialog = page.getByRole("dialog", { name: "More details" });
    const speed = dialog.getByLabel("Spe IVs");

    await speed.focus();
    await speed.press("End");
    await speed.press("Backspace");
    await speed.press("Backspace");
    await expect(speed).toHaveValue("");
    await speed.pressSequentially("15");
    await expect(speed).toHaveValue("15");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("IVs: 15 Spe");

    await speed.fill("");
    await dialog.getByLabel("Nickname").focus();
    await expect(speed).toHaveValue("31");
    await expect.poll(() => getTeamTextFromUrl(page)).not.toContain("IVs:");
  });
});
