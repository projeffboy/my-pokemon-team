import { test, expect } from "fixtures";
import { openEditPokepaste, selectPokemon } from "helper";

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
});
