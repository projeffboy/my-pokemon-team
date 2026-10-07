import { test, expect } from "fixtures";
import { openTeamTools, selectItem, selectMove, selectPokemon } from "helper";
import type { Page } from "@playwright/test";

test.describe("Pokemon Card - Unit Tests", () => {
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
      const hasIcon = (await statsChip.locator("img").count()) > 0;
      expect(await optionType.evaluate(element => element.tagName)).toBe(
        hasIcon ? "IMG" : "SPAN",
      );
      if (!hasIcon) await expect(optionType).toHaveText("ELC");
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
