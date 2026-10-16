import { test, expect } from "fixtures";
import { openEditPokepaste, selectPokemon } from "helper";
import de from "@/i18n/de";

test.describe("Team Text Problems - Unit Tests", () => {
  test("names each problem's pokemon, field, value, reason, and result", async ({
    page,
  }) => {
    await openEditPokepaste(page);
    const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
    await dialog.getByRole("textbox").fill(`Toucannon @ Leftover
Level: 120
- Beak Blast
- Surf
- Bullet Seed

Pikachuu

Zacian-Crowned @ Rusted Swrd
Abilty: Intrepid Sword`);

    const report = dialog.getByRole("status");
    await expect(report).toContainText(
      "6 problems found. Update still applies the text as follows:",
    );
    await expect(report.getByRole("listitem")).toHaveText(
      [
        "Toucannon, Item: “Leftover” Not recognized. It is left out.",
        "Toucannon, Level: “120” Not a whole number from 1 to 100. 100 is used instead.",
        "Toucannon, Move 2: “Surf” Toucannon cannot learn this move in the selected game. The move slot is left empty.",
        "Pokemon 2: “Pikachuu” Not recognized. The team slot is left empty.",
        "Zacian-Crowned, Item: “Rusted Swrd” Not recognized. Rusted Sword is used instead.",
        "Zacian-Crowned: “Abilty: Intrepid Sword” Not a detail the site reads. It is left out.",
      ],
      { useInnerText: true },
    );
  });

  test("names a gender the selected game lacks", async ({ page }) => {
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page
      .getByRole("option")
      .and(page.locator('[data-value="1"]'))
      .click();
    await expect(page.locator(".MuiMenu-paper")).toBeHidden();
    await openEditPokepaste(page);
    const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
    await dialog.getByRole("textbox").fill("Jynx (F)\n- Lovely Kiss");

    await expect(dialog.getByRole("status").getByRole("listitem")).toHaveText(
      [
        "Jynx, Gender: “F” The selected game does not have this detail. It is left out.",
      ],
      { useInnerText: true },
    );
  });

  test("shows nothing for the team's own text or intentionally empty move slots", async ({
    page,
  }) => {
    await selectPokemon(page, "Tinkaton");
    await openEditPokepaste(page);
    const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
    const textbox = dialog.getByRole("textbox");
    await expect(textbox).toHaveValue(/^Tinkaton/);
    await expect(dialog.getByRole("status")).toHaveCount(0);

    await textbox.fill("Tinkaton\n- Gigaton Hammer\n-\n- Play Rough");
    await expect(dialog.getByRole("status")).toHaveCount(0);

    await textbox.fill("Tinkaton\n- Gigaton Hamer");
    await expect(dialog.getByRole("status")).toContainText(
      "Tinkaton, Move 1: “Gigaton Hamer”",
    );
    await textbox.fill("Tinkaton\n- Gigaton Hammer");
    await expect(dialog.getByRole("status")).toHaveCount(0);
  });

  test("stays in view on a phone while the first pokemon of a full team is edited", async ({
    page,
  }) => {
    // An iPhone SE's browser viewport
    await page.setViewportSize({ width: 375, height: 548 });
    await openEditPokepaste(page);
    const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
    const textbox = dialog.getByRole("textbox");
    await textbox.fill(
      [
        "Great Tusk @ Booster Energy\nAbility: Protosynthesis\nTera Type: Ground\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Headlong Rush\n- Ice Spinner\n- Knock Off\n- Rapid Spin",
        "Dragapult @ Choice Specs\nAbility: Infiltrator\nTera Type: Ghost\nEVs: 252 SpA / 4 SpD / 252 Spe\nTimid Nature\n- Shadow Ball\n- Draco Meteor\n- Flamethrower\n- U-turn",
        "Iron Valiant @ Booster Energy\nAbility: Quark Drive\nTera Type: Fairy\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Spirit Break\n- Close Combat\n- Knock Off\n- Swords Dance",
        "Hatterene @ Leftovers\nAbility: Magic Bounce\nTera Type: Water\nEVs: 252 HP / 252 Def / 4 SpA\nBold Nature\nIVs: 0 Atk\n- Psychic\n- Draining Kiss\n- Calm Mind\n- Mystical Fire",
        "Baxcalibur @ Loaded Dice\nAbility: Thermal Exchange\nTera Type: Ground\nEVs: 252 Atk / 4 SpD / 252 Spe\nAdamant Nature\n- Icicle Spear\n- Scale Shot\n- Earthquake\n- Dragon Dance",
        "Garganacl @ Leftovers\nAbility: Purifying Salt\nTera Type: Water\nEVs: 252 HP / 4 Def / 252 SpD\nCareful Nature\n- Salt Cure\n- Recover\n- Protect\n- Iron Defense",
      ].join("\n\n"),
    );
    await dialog.getByRole("button", { name: "Update", exact: true }).click();
    await expect(dialog).toBeHidden();

    await openEditPokepaste(page);
    // Type "x" after "- " on Great Tusk's first move line. Long lines wrap on a phone, so
    // the caret goes there directly rather than by arrow keys.
    await textbox.click();
    await textbox.evaluate((element: HTMLTextAreaElement) => {
      const at = element.value.indexOf("- Headlong Rush") + 2;
      element.setSelectionRange(at, at);
    });
    await textbox.press("x");

    const report = dialog.getByRole("status");
    await expect(report).toContainText("Great Tusk, Move 1: “xHeadlong Rush”");
    await expect(report).toBeInViewport();
    await expect(
      dialog.getByRole("button", { name: "Update" }),
    ).toBeInViewport();
  });

  test("names the stat of a capped training value in the chosen language", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Language", exact: true }).click();
    await page.getByRole("menuitem", { name: "Deutsch" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await page.getByRole("button", { name: de.team.more, exact: true }).click();
    await page
      .getByRole("menuitem", { name: de.team.editPokepaste, exact: true })
      .click();
    const dialog = page.getByRole("dialog", {
      name: de.importDialog.editTitle,
    });
    await dialog
      .getByRole("textbox")
      .fill("Palafin\nEVs: 300 Atk\nIVs: 40 Spe");

    await expect(dialog.getByRole("status").getByRole("listitem")).toHaveText(
      [
        /Stattdessen wird 255 Ang verwendet\.$/,
        /Stattdessen wird 31 Init verwendet\.$/,
      ],
      { useInnerText: true },
    );
  });
});
