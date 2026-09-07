import { test, expect } from "fixtures";
import { toBase64Url } from "@/app/shared/base64url";
import { getTeamTextFromUrl, selectPokemon } from "helper";

test.describe("Save/Load Team: Share Link - Integration Tests", () => {
  test("keeps the URL stable after a single UI edit", async ({ page }) => {
    const teamText = `Tyranitar
Ability: Sand Stream
- Crunch
- Stone Edge
- Ice Punch
- Earthquake`;

    await page.goto(`/?team=${toBase64Url(teamText)}`);

    const initialUrl = page.url();
    await selectPokemon(page, "Pikachu");

    await expect
      .poll(() => new URL(page.url()).searchParams.get("team"))
      .toBeTruthy();
    const nextUrl = page.url();
    expect(nextUrl).not.toBe(initialUrl);

    await page.waitForTimeout(250);
    expect(page.url()).toBe(nextUrl);
  });

  test("preserves the expected values during a full Showdown round trip", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: /Save\/Load/ }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Import/Export Team" }).click();

    const teamText = `Gengar (Giga) @ Choice Specs
Ability: Cursed Body
- Shadow Ball
- Sludge Bomb
- Destiny Bond
- Focus Blast`;

    const textArea = page.getByRole("textbox", {
      name: "Pokemon Showdown Team Raw Text",
    });
    await textArea.fill(teamText);
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    const decodedTeamText = getTeamTextFromUrl(page);
    expect(decodedTeamText).toContain("Gengar @ Choice Specs");
    expect(decodedTeamText).toContain("Ability: Cursed Body");
    expect(decodedTeamText).toContain("- Shadow Ball");
    expect(decodedTeamText).toContain("- Sludge Bomb");
    expect(decodedTeamText).toContain("- Destiny Bond");
    expect(decodedTeamText).toContain("- Focus Blast");
  });

  test("drops any team entries beyond the first six pokemon", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["Android", "iPhone"].includes(testInfo.project.name),
      "This test only runs on mobile",
    );

    await page.getByRole("tab", { name: /Save\/Load/ }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Import/Export Team" }).click();

    const teamText = Array.from({ length: 8 }, (_, index) => {
      const pokemon = index % 2 === 0 ? "Pikachu" : "Bulbasaur";
      return `${pokemon}
Ability: ${index % 2 === 0 ? "Static" : "Overgrow"}
- Thunderbolt
- Quick Attack
- Slam
- Nuzzle`;
    }).join("\n\n");

    const textArea = page.getByRole("textbox", {
      name: "Pokemon Showdown Team Raw Text",
    });
    await textArea.fill(teamText);
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    const expectedNames = [
      "Pikachu",
      "Bulbasaur",
      "Pikachu",
      "Bulbasaur",
      "Pikachu",
      "Bulbasaur",
    ];

    for (let slotIndex = 0; slotIndex < expectedNames.length; slotIndex++) {
      await page
        .getByRole("tab", { name: new RegExp(`^Pokemon ${slotIndex + 1}`) })
        .click();

      await expect(
        page.getByRole("combobox", {
          name: `Pokemon ${slotIndex + 1}'s name`,
        }),
      ).toHaveValue(expectedNames[slotIndex]);
    }
  });

  test("ignores invalid pokemon rows without breaking valid ones", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["Android", "iPhone"].includes(testInfo.project.name),
      "This test only runs on mobile",
    );

    await page.getByRole("tab", { name: /Save\/Load/ }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Import/Export Team" }).click();

    const teamText = `DefinitelyNotAPokemon
Ability: Static
- Thunderbolt

Bulbasaur
Ability: Overgrow
- Vine Whip
- Razor Leaf
- Sleep Powder
- Sludge Bomb

Charmander
Ability: Blaze
- Flamethrower
- Dragon Rage
- Slash
- Ember`;

    const textArea = page.getByRole("textbox", {
      name: "Pokemon Showdown Team Raw Text",
    });
    await textArea.fill(teamText);
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    const expectedNames = ["", "Bulbasaur", "Charmander", "", "", ""];

    for (let slotIndex = 0; slotIndex < expectedNames.length; slotIndex++) {
      await page
        .getByRole("tab", { name: new RegExp(`^Pokemon ${slotIndex + 1}`) })
        .click();

      const input = page.getByRole("combobox", {
        name: `Pokemon ${slotIndex + 1}'s name`,
      });
      await expect(input).toHaveValue(expectedNames[slotIndex]);
    }

    const names = expectedNames.filter(Boolean);
    expect(names).toEqual(expect.arrayContaining(["Bulbasaur", "Charmander"]));
    expect(names).not.toContain("DefinitelyNotAPokemon");
  });
});
