import { test, expect } from "fixtures";
import {
  getTeamTextFromUrl,
  openTeamTools,
  selectAbility,
  selectItem,
  selectMove,
  selectPokemon,
} from "helper";
import type { Page } from "@playwright/test";
import ja from "@/i18n/ja";

test.describe("Pokemon Card - Unit Tests", () => {
  test("imported items and abilities stay visible outside the current options", async ({
    page,
  }) => {
    const team = Buffer.from(
      "Gengar @ Berserk Gene\nAbility: Levitate\n",
    ).toString("base64url");
    await page.goto(`/?gen=9&team=${team}`);
    await expect(page.getByLabel("Pokemon 1's item")).toHaveValue(
      "Berserk Gene",
    );
    await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue(
      "Levitate",
    );
    expect(getTeamTextFromUrl(page)).toContain("Gengar @ Berserk Gene");
    expect(getTeamTextFromUrl(page)).toContain("Ability: Levitate");

    await page.getByRole("button", { name: "Language", exact: true }).click();
    await page.getByRole("menuitem", { name: "日本語" }).click();
    await expect(page.getByLabel(ja.team.input(1, "ability"))).toHaveValue(
      "ふゆう",
    );
    await page.getByRole("button", { name: ja.language, exact: true }).click();
    await page.getByRole("menuitem", { name: "English", exact: true }).click();

    await selectAbility(page, "Cursed Body");
    await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue(
      "Cursed Body",
    );
    expect(getTeamTextFromUrl(page)).toContain("Ability: Cursed Body");
  });

  test("Hidden labels appear only with More and enough space beside a selected hidden ability", async ({
    page,
  }) => {
    const team = Buffer.from("Salamence\nAbility: Moxie\n").toString(
      "base64url",
    );
    await page.goto(`/?gen=9&team=${team}`);
    await page.setViewportSize({ width: 480, height: 1000 });
    const ability = page.getByLabel("Pokemon 1's ability");
    const field = ability.locator("..");
    const hidden = field.getByText("Hidden", { exact: true });
    await expect(hidden).toHaveCount(0);
    await openTeamTools(page);

    for (const { width, visible } of [
      { width: 480, visible: true },
      { width: 320, visible: false },
      { width: 600, visible: false },
      { width: 1366, visible: false },
      { width: 480, visible: true },
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(hidden)[visible ? "toBeVisible" : "toBeHidden"]();
      await expect(ability).toHaveValue("Moxie");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        ),
      ).toBe(false);
      if (visible) {
        const [labelBox, inputBox, controlsBox] = await Promise.all([
          hidden.boundingBox(),
          ability.boundingBox(),
          field.locator(".MuiAutocomplete-endAdornment").boundingBox(),
        ]);
        expect(labelBox).not.toBeNull();
        expect(inputBox).not.toBeNull();
        expect(controlsBox).not.toBeNull();
        if (!labelBox || !inputBox || !controlsBox) return;
        expect(labelBox.x).toBeGreaterThanOrEqual(inputBox.x + inputBox.width);
        expect(labelBox.x + labelBox.width).toBeLessThanOrEqual(controlsBox.x);
      }
    }
    await ability.fill("Intim");
    await expect(hidden).toHaveCount(0);
    await page.getByRole("option", { name: "Intimidate", exact: true }).click();
    await expect(hidden).toHaveCount(0);
  });

  test("Hidden labels follow past abilities and the chosen language", async ({
    page,
  }) => {
    const team = Buffer.from("Empoleon\nAbility: Defiant\n").toString(
      "base64url",
    );
    await page.goto(`/?gen=8&team=${team}`);
    await page.setViewportSize({ width: 480, height: 1000 });
    await openTeamTools(page);
    const ability = page.getByLabel("Pokemon 1's ability");
    await expect(ability.locator("..").getByText("Hidden")).toBeVisible();
    await page.getByRole("button", { name: "Language", exact: true }).click();
    await page.getByRole("menuitem", { name: "日本語" }).click();
    const translated = page.getByLabel(ja.team.input(1, "ability"));
    await expect(
      translated.locator("..").getByText(ja.team.hidden),
    ).toBeVisible();
    await page.getByRole("button", { name: ja.team.fewerTools }).click();
    await expect(
      translated.locator("..").getByText(ja.team.hidden),
    ).toHaveCount(0);
  });

  test("move selectors exclude duplicates and other Hidden Power types", async ({
    page,
  }) => {
    const team = Buffer.from(
      "Misdreavus\n- Hidden Power Ice\n- Shadow Ball\n",
    ).toString("base64url");
    await page.goto(`/?gen=3&team=${team}`);
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue(
      "Hidden Power Ice",
    );
    const empty = page.getByLabel("Pokemon 1's move3");
    await empty.fill("Hidden Power");
    await expect(page.getByRole("option")).toHaveCount(0);
    await expect(
      page.getByText("Nothing found", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("(you haven't selected a pokemon)"),
    ).toHaveCount(0);
    await expect(page.getByText("No other moves available.")).toHaveCount(0);
    await empty.fill("Shadow Ball");
    await expect(page.getByRole("option")).toHaveCount(0);
    await empty.press("Escape");
    await selectMove(page, "Hidden Power Fire");
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue(
      "Hidden Power Fire",
    );
    await selectMove(page, "Thunderbolt", 3);
    await expect(empty).toHaveValue("Thunderbolt");
  });

  test("Ditto's empty move slots explain that no other moves are available", async ({
    page,
  }) => {
    const team = Buffer.from(
      "Ditto @\nAbility: Limber\n- Transform\n",
    ).toString("base64url");
    await page.goto(`/?gen=3&team=${team}`);
    const transform = page.getByLabel("Pokemon 1's move1");
    await expect(transform).toHaveValue("Transform");
    await page.getByLabel("Pokemon 1's move2").press("ArrowDown");
    await expect(
      page.getByText("No other moves available.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("(you haven't selected a pokemon)"),
    ).toHaveCount(0);
    await page.getByLabel("Pokemon 1's move2").press("Escape");
    await transform.press("ArrowDown");
    await expect(
      page.getByRole("option").filter({
        has: page.getByText("Transform", { exact: true }),
      }),
    ).toBeVisible();
    await transform.press("Escape");
    await page.getByLabel("Pokemon 1's ability").fill("Intimidate");
    await expect(
      page.getByText("Nothing found", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("(you haven't selected a pokemon)"),
    ).toHaveCount(0);
  });

  // Helper to ensure card is visible (handles responsive tabs)
  const ensureCardVisible = async (page: Page, index: number) => {
    // If card is already visible (large viewport width), do nothing
    const card = page.getByRole("region", { name: `Pokemon ${index + 1}` });
    if (await card.isVisible()) {
      return card;
    }

    // Try to find a tab with the number (loose match handles various tab label formats)
    const tab = page.getByRole("tab", { name: `${index + 1}`, exact: false });
    if (await tab.isVisible()) {
      await tab.click();
      await expect(card).toBeVisible();
    }

    return card;
  };

  test("should have all fields empty by default", async ({ page }) => {
    // Check name fields for cards 1, 3, and 6
    for (const i of [0, 2, 5]) {
      await ensureCardVisible(page, i);
      const nameField = page.getByRole("combobox", {
        name: `Pokemon ${i + 1}'s name`,
      });
      await expect(nameField).toHaveValue("");
    }

    // Check move fields for cards 2, 4, 5
    for (const i of [1, 3, 4]) {
      await ensureCardVisible(page, i);
      for (let moveNumber = 1; moveNumber <= 4; moveNumber++) {
        const moveField = page.getByRole("combobox", {
          name: `Pokemon ${i + 1}'s move${moveNumber}`,
        });
        await expect(moveField).toHaveValue("");
      }
    }

    // Check item fields for cards 2, 5, 6
    for (const i of [1, 4, 5]) {
      await ensureCardVisible(page, i);
      const itemField = page.getByRole("combobox", {
        name: `Pokemon ${i + 1}'s item`,
      });
      await expect(itemField).toHaveValue("");
    }

    // Check ability fields for cards 1, 3, 4
    for (const i of [0, 2, 3]) {
      await ensureCardVisible(page, i);
      const abilityField = page.getByRole("combobox", {
        name: `Pokemon ${i + 1}'s ability`,
      });
      await expect(abilityField).toHaveValue("");
    }
  });

  test("should have question mark sprite by default", async ({ page }) => {
    for (const i of [1, 2, 5]) {
      const card = await ensureCardVisible(page, i);
      const questionMark = card.getByRole("img", { name: "question-mark" });
      await expect(questionMark).toBeVisible();
    }
  });

  test("tall sprites fit the card without changing its height", async ({
    page,
  }) => {
    await page.route(/\/sprites\/.*\/(chimecho|exeggutor-alola)\./, route => {
      const tall = route.request().url().includes("exeggutor-alola");
      return route.fulfill({
        contentType: "image/svg+xml",
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="${tall ? 111 : 64}" height="${tall ? 180 : 64}"><rect width="100%" height="100%" fill="green"/></svg>`,
      });
    });
    const card = page.getByRole("region", { name: "Pokemon 1", exact: true });
    for (const tools of [false, true]) {
      if (tools) await openTeamTools(page);
      await selectPokemon(page, "Chimecho");
      const small = card.getByRole("img", { name: "chimecho", exact: true });
      await expect(small).toHaveJSProperty("naturalHeight", 64);
      const before = await card.boundingBox();

      await selectPokemon(page, "Exeggutor-Alola");
      const sprite = card.getByRole("img", {
        name: "exeggutor-alola",
        exact: true,
      });
      await expect(sprite).toHaveJSProperty("naturalHeight", 180);
      await expect
        .poll(async () => (await card.boundingBox())?.height)
        .toBe(before?.height);
      const after = await card.boundingBox();
      const image = await sprite.boundingBox();
      expect(after).not.toBeNull();
      expect(image).not.toBeNull();
      if (!after || !image) return;
      expect(image.y).toBeGreaterThanOrEqual(after.y);
      expect(image.y + image.height).toBeLessThanOrEqual(
        after.y + after.height,
      );
    }
  });

  test("should list and select abilities for Vivillon-Garden", async ({
    page,
  }) => {
    await selectPokemon(page, "Vivillon-Garden");
    const ability = page.getByRole("combobox", { name: "Pokemon 1's ability" });
    await ability.click();
    await expect(page.getByRole("option")).toHaveText([
      "Shield Dust",
      "Compound Eyes",
      "Friend Guard",
    ]);
    await page
      .getByRole("option", { name: "Compound Eyes", exact: true })
      .click();
    await expect(ability).toHaveValue("Compound Eyes");
  });

  test("should show the selected item's icon in the item input", async ({
    page,
  }) => {
    const card = page.getByRole("region", { name: "Pokemon 1" });
    const rockyHelmetIcon = card.getByRole("img", {
      name: "Rocky Helmet icon",
    });
    const assaultVestIcon = card.getByRole("img", {
      name: "Assault Vest icon",
    });

    await selectItem(page, "Rocky Helmet");
    await expect(rockyHelmetIcon).toBeVisible();

    // Typing a different name hides the icon until an item is picked
    const input = page.getByLabel("Pokemon 1's item");
    await input.fill("Assault");
    await expect(rockyHelmetIcon).toBeHidden();

    await page.getByRole("listbox").getByText("Assault Vest").click();
    await expect(assaultVestIcon).toBeVisible();
    await expect(rockyHelmetIcon).toBeHidden();
  });

  test("should show a move's type icon before it once the team tools are shown", async ({
    page,
  }) => {
    // The card also shows the pokemon's own types, so look inside the input
    const input = page.getByLabel("Pokemon 1's move1");
    const field = input.locator("..");
    const electricIcon = field.getByRole("img", { name: "Electric" });

    await selectPokemon(page, "Dracozolt");
    await selectMove(page, "Bolt Beak");
    // Hidden with the rest of the tools, until More is pressed
    await expect(electricIcon).toBeHidden();
    await openTeamTools(page);
    await expect(electricIcon).toBeVisible();

    // The icon comes before the name
    const [iconBox, inputBox] = await Promise.all([
      electricIcon.boundingBox(),
      input.boundingBox(),
    ]);
    expect(iconBox!.x + iconBox!.width).toBeLessThanOrEqual(inputBox!.x);

    // Card types and move types follow the stats as available space changes.
    for (const width of [320, 480, 600, 960, 1200, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(
        page
          .getByRole("tablist", { name: "Pokemon team slots" })
          .getByRole("tab"),
      ).toHaveCount(
        width < 600 ? 6
        : width < 960 ? 3
        : 0,
      );
      const statsChip = page
        .getByRole("region", { name: "Team Defence", exact: true })
        .getByRole("button", { name: "Electric", exact: true });
      await expect(statsChip).toBeVisible();
      await expect(async () => {
        const hasIcon = (await statsChip.locator("img").count()) > 0;
        const card = page.getByRole("region", { name: "Pokemon 1" });
        const types = card.getByRole("img", { name: "Electric", exact: true });
        await expect(types).toHaveCount(2);
        for (const chip of await types.all()) {
          expect(await chip.evaluate(element => element.tagName)).toBe(
            hasIcon ? "IMG" : "SPAN",
          );
          if (!hasIcon) await expect(chip).toHaveText("ELC");
        }
      }).toPass();

      await input.press("ArrowDown");
      const option = page
        .getByRole("option")
        .filter({ has: page.getByText("Bolt Beak", { exact: true }) });
      const optionType = option.getByRole("img", {
        name: "Electric",
        exact: true,
      });
      await expect(optionType).toBeVisible();
      await expect(async () => {
        const hasIcon = (await statsChip.locator("img").count()) > 0;
        expect(await optionType.evaluate(element => element.tagName)).toBe(
          hasIcon ? "IMG" : "SPAN",
        );
        if (!hasIcon) await expect(optionType).toHaveText("ELC");
      }).toPass();
      await input.press("Escape");
    }

    // Typing a different name hides the icon until a move is picked
    await input.fill("Dragon");
    await expect(electricIcon).toBeHidden();
    await page.getByRole("listbox").getByText("Dragon Pulse").click();
    await expect(field.getByRole("img", { name: "Dragon" })).toBeVisible();
  });

  test("should show 'Nothing found' message in moves and abilities when no pokemon is selected", async ({
    page,
  }) => {
    const fieldsToCheck = [
      { name: "Pokemon 1's move1", input: "Thunder" },
      { name: "Pokemon 1's ability", input: "Intimidate" },
    ];

    for (const { name, input } of fieldsToCheck) {
      const field = page.getByRole("combobox", { name });
      await field.fill(input);

      // Check for "Nothing found" message
      await expect(
        page.getByText("Nothing found (you haven't selected a pokemon)"),
      ).toBeVisible();
    }
  });
});
