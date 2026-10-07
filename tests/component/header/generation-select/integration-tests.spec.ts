import { test, expect } from "fixtures";
import {
  closeDialog,
  openAnalysis,
  openFilters,
  selectPokemon,
  selectMove,
  showSlot,
} from "helper";
import type { Page } from "@playwright/test";

const expectSelectable = async (
  page: Page,
  name: string,
  isSelectable: boolean,
) => {
  const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
  await input.fill(name);
  const option = page.getByRole("listbox").getByText(name, { exact: true });
  await expect(option)[isSelectable ? "toBeVisible" : "toBeHidden"]();
  await input.press("Escape");
};

test.describe("Generation Select - Integration Tests", () => {
  test("lists only the pokemon of the chosen generation", async ({ page }) => {
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: /^Gen 1/ }).click();
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Gen 1 ");

    await expectSelectable(page, "Mew", true);
    await expectSelectable(page, "Chikorita", false);
    await expectSelectable(page, "Venusaur-Mega", false);

    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: /^Gen 7/ }).click();
    await expectSelectable(page, "Venusaur-Mega", true);
    await expectSelectable(page, "Meganium-Mega", false);
    await expectSelectable(page, "Rowlet", true);
    await expectSelectable(page, "Grookey", false);
  });

  test("an earlier generation uses its own types, type chart, and sprites", async ({
    page,
  }) => {
    // On a phone the menu is taller than the screen, and a click while it is
    // still scrolling into view can land on the neighbouring option
    await expect(async () => {
      await page.getByRole("combobox", { name: "Generation" }).click();
      await page.getByRole("option", { name: /^Gen 1/ }).click();
      await expect(
        page.getByRole("combobox", { name: "Generation" }),
      ).toContainText("Gen 1 ", { timeout: 1000 });
    }).toPass();
    // The helper's forced click would land on the menu while it is still closing
    await expect(page.locator(".MuiMenu-paper")).toBeHidden();
    await selectPokemon(page, "Clefable");
    await expect(
      page.locator('img[src*="/gen1rb/clefable.png"]').first(),
    ).toBeVisible();

    // Clefable was a Normal type, immune to Ghost, and gen 1 had no Dark, Steel, or Fairy
    await openAnalysis(page, "Team Defence");
    const defence = page.getByRole("region", { name: "Team Defence" });
    await expect(defence.getByRole("button")).toHaveCount(15);
    await expect(defence.getByLabel("Fairy", { exact: true })).toBeHidden();
    await expect(defence.getByLabel(/^Fighting score:/)).toHaveText("-1");
    await expect(defence.getByLabel(/^Ghost score:/)).toHaveText("+1.5");
  });

  test("Gen 9 · Champions sets the Pokemon Champions format", async ({
    page,
  }) => {
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: "Gen 9 · Champions" }).click();
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Champions");
    await expectSelectable(page, "Kommo-o", true);
    await expectSelectable(page, "Zekrom", false);

    await openFilters(page);
    await expect(page.getByRole("combobox", { name: "Format" })).toContainText(
      "Pokemon Champions (M-C)",
    );
    await closeDialog(page);
  });
});

const transferText = `Slowbro @ Rocky Helmet
Ability: Regenerator
Shiny: Yes
Tera Type: Water
Bold Nature
- Surf
- Slack Off

Abomasnow @ Leftovers
Ability: Snow Warning
- Blizzard
`;

for (const action of ["Cancel", "Update existing team", "Copy to new team"]) {
  test(`generation transfer: forme fallback ${action}`, async ({ page }) => {
    const text = "Kyogre-Primal @ Blue Orb\nAbility: Primordial Sea\n";
    await page.goto(`/?gen=6&team=${Buffer.from(text).toString("base64url")}`);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
      "Kyogre-Primal",
    );
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: /^Gen 3/ }).press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText(
      "Your Pokémon will carry over with changes",
    );
    await expect(dialog).not.toContainText("won’t carry over");
    const member = dialog.getByRole("group", {
      name: "Kyogre-Primal",
      exact: true,
    });
    await expect(member).toContainText("Kyogre-Primal → Kyogre");
    await expect(member).toContainText("Ability: Primordial Sea → Drizzle");
    await expect(member).toContainText("Item removed:");
    await expect(member).toContainText("Blue Orb");
    await dialog.getByRole("button", { name: action, exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
      action === "Cancel" ? "Kyogre-Primal" : "Kyogre",
    );
    await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue(
      action === "Cancel" ? "Primordial Sea" : "Drizzle",
    );
    await expect(page.getByLabel("Pokemon 1's item")).toHaveValue(
      action === "Cancel" ? "Blue Orb" : "",
    );
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText(action === "Cancel" ? "Gen 6" : "Gen 3");
    if (action === "Copy to new team") {
      await expect
        .poll(() =>
          page.evaluate(() => {
            const state = JSON.parse(
              localStorage.getItem("mypokemonteam") ?? "{}",
            );
            return state.teams?.some(
              (saved: { generation: number; team: { name: string }[] }) =>
                saved.generation === 6 &&
                saved.team[0]?.name === "kyogreprimal",
            );
          }),
        )
        .toBe(true);
    }
  });
}

for (const incompatible of [false, true]) {
  test(`generation dropdown resets history after ${incompatible ? "confirmed" : "compatible"} changes`, async ({
    page,
  }) => {
    if (incompatible) {
      await page.goto(
        `/?team=${Buffer.from(transferText).toString("base64url")}`,
      );
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Slowbro");
    } else {
      await selectPokemon(page, "Nidorina");
    }
    const toolbar = page.getByRole("toolbar", { name: "Team actions" });
    const undo = toolbar.getByRole("button", { name: "Undo", exact: true });
    const redo = toolbar.getByRole("button", { name: "Redo", exact: true });
    await page.waitForTimeout(500);
    await selectMove(page, "Toxic");
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect(redo).toBeEnabled();
    const wasUndoEnabled = await undo.isEnabled();

    const chooseGeneration = async () => {
      await page.getByRole("combobox", { name: "Generation" }).click();
      await page
        .getByRole("option", { name: incompatible ? /^Gen 1/ : /^Gen 7/ })
        .click();
    };
    await chooseGeneration();
    if (incompatible) {
      const dialog = page.getByRole("dialog", {
        name: /^(Switch game or generation\? Gen 1|Switch game\? Gen 1)$/,
      });
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
      await expect(undo).toBeEnabled({ enabled: wasUndoEnabled });
      await expect(redo).toBeEnabled();
      await chooseGeneration();
      await dialog
        .getByRole("button", { name: "Update existing team", exact: true })
        .click();
    }
    await expect(undo).toBeDisabled();
    await expect(redo).toBeDisabled();
    await page.waitForTimeout(500);
    await expect(undo).toBeDisabled();
    await expect(redo).toBeDisabled();
    await selectMove(page, "Toxic");
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue(
      incompatible ? "Surf" : "",
    );
  });
}

for (const action of ["Cancel", "Update existing team", "Copy to new team"]) {
  test(`generation transfer: ${action}`, async ({ page }) => {
    await page.goto(
      `/?team=${Buffer.from(transferText).toString("base64url")}`,
      { waitUntil: "domcontentloaded" },
    );
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Slowbro");
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: /^Gen 1/ }).press("Enter");
    const dialog = page.getByRole("dialog", {
      name: /^(Switch game or generation\? Gen 1|Switch game\? Gen 1)$/,
    });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("group", { name: "From Gen 9 · SV", exact: true }),
    ).toBeVisible();
    await expect(dialog.locator("img:not([data-move-type])")).toHaveCount(5);
    for (const game of ["Scarlet", "Violet", "Red", "Blue", "Yellow"]) {
      const logo = dialog.getByRole("img", {
        name: `Pokémon ${game}`,
        exact: true,
      });
      await expect(logo).toBeVisible();
      await expect
        .poll(() =>
          logo.evaluate(
            image =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await expect(dialog).toContainText(
      "Copying keeps your original team unchanged.",
    );
    await expect(dialog).toContainText("These Pokémon won’t carry over");
    await expect(dialog).toContainText(
      "The rest of your Pokémon will carry over with changes",
    );
    await expect(
      dialog.getByRole("img", { name: "Abomasnow", exact: true }),
    ).toBeVisible();
    await expect(dialog).not.toContainText("Rocky Helmet");
    await expect(dialog).not.toContainText("Regenerator");
    await expect(dialog).toContainText(
      "Not used in Gen 1: Item, Ability, Nature, Gender, Shiny, and Tera Type.",
    );
    await expect(dialog).toContainText("Slack Off");
    const slowbro = dialog.getByRole("group", { name: "Slowbro", exact: true });
    await expect(
      slowbro.getByText("Moves removed:", { exact: true }),
    ).toHaveCount(1);
    await expect(slowbro.getByRole("listitem")).toHaveText(["Slack Off"]);
    await expect(slowbro).not.toContainText("Item removed:");
    await expect(
      slowbro.getByRole("img", { name: "Normal", exact: true }),
    ).toBeVisible();
    await expect(slowbro).not.toContainText("Ability removed:");
    await expect(slowbro).not.toContainText("Details removed:");
    await expect(dialog.getByText("Abomasnow", { exact: true })).toBeVisible();
    await expect(dialog).not.toContainText("Move: Surf");
    if (action === "Cancel" && (page.viewportSize()?.width ?? Infinity) < 600) {
      const bounds = await Promise.all(
        ["Copy to new team", "Update existing team", "Cancel"].map(name =>
          dialog.getByRole("button", { name, exact: true }).boundingBox(),
        ),
      );
      const [copy, update, cancel] = bounds;
      expect(copy && update && cancel).toBeTruthy();
      if (copy && update && cancel) {
        expect(copy.x).toBe(update.x);
        expect(copy.width).toBe(update.width);
        expect(copy.y + copy.height).toBeLessThan(update.y);
        expect(cancel.y + cancel.height).toBeLessThan(copy.y);
      }
    }
    await dialog.getByRole("button", { name: action, exact: true }).click();
    await expect(dialog).toBeHidden();
    const generation = page.getByRole("combobox", { name: "Generation" });
    await expect(generation).toContainText(
      action === "Cancel" ? "Gen 9" : "Gen 1",
    );
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("Surf");
    await expect(page.getByLabel("Pokemon 1's move2")).toHaveValue(
      action === "Cancel" ? "Slack Off" : "",
    );
    if (action === "Cancel")
      await expect(page.getByLabel("Pokemon 1's item")).toHaveValue(
        "Rocky Helmet",
      );
    else await expect(page.getByLabel("Pokemon 1's item")).toHaveCount(0);
    if (action === "Copy to new team") {
      await expect
        .poll(async () => {
          const stored = await page.evaluate(() =>
            JSON.parse(localStorage.getItem("mypokemonteam") ?? "{}"),
          );
          const original = stored.teams?.find(
            (team: {
              generation: number;
              team: { name: string; ability: string }[];
            }) =>
              team.generation === 9 && team.team[0]?.ability === "Regenerator",
          );
          const current = stored.teams?.find(
            (team: { id: string }) => team.id === stored.currentTeamId,
          );
          return (
            original?.team[1]?.name === "abomasnow" &&
            current?.generation === 1 &&
            current?.team[1]?.name === ""
          );
        })
        .toBe(true);
    }
  });
}

test("generation transfer: compact layout groups unavailable Pokemon with names", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const team = `Cacturne @
-

Forretress @ Lucky Punch
Level: 56
EVs: 131 HP
IVs: 4 HP
- Hidden Power Ghost

Rhyhorn @
-

Yanma @
-

Exeggcute @
-

Claydol @
-
`;
  await page.goto(`/?team=${Buffer.from(team).toString("base64url")}&gen=3`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Cacturne");
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 9 · Champions/ }).press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("Switch game? Gen 9 · Champions");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("group", { name: "From Gen 3 · RSE / FRLG", exact: true }),
  ).toBeVisible();
  for (const width of [320, 399, 400, 600]) {
    await page.setViewportSize({ width, height: 640 });
    const source = dialog.getByRole("group", {
      name: "From Gen 3 · RSE / FRLG",
      exact: true,
    });
    const target = dialog.locator('[aria-label="Gen 9 · Champions"]');
    await expect(source.locator("img:not([data-move-type])")).toHaveCount(0);
    const content = dialog.locator(".MuiDialogContent-root");
    await expect(content.locator("img:not([data-move-type])")).toHaveCount(0);
    await expect(dialog.locator("img:not([data-move-type])")).toHaveCount(6);
    await expect(
      dialog.getByRole("img", { name: "Pokémon Champions", exact: true }),
    ).toBeVisible();
    await expect(async () => {
      const sourceBox = await source.boundingBox();
      const targetBox = await target.boundingBox();
      expect(sourceBox).not.toBeNull();
      expect(targetBox).not.toBeNull();
      if (!sourceBox || !targetBox)
        throw new Error("Missing transfer endpoints");
      expect(targetBox.x).toBeGreaterThan(sourceBox.x + sourceBox.width);
      expect(targetBox.y).toBeCloseTo(sourceBox.y, 0);
      await expect(dialog.getByTestId("ArrowForwardIcon")).toBeVisible();
      expect(targetBox.x + targetBox.width).toBeLessThanOrEqual(width);
      const firstLogo = await dialog
        .locator("img:not([data-move-type])")
        .first()
        .boundingBox();
      for (const logo of await dialog
        .locator("img:not([data-move-type])")
        .all()) {
        const bounds = await logo.locator("..").boundingBox();
        const image = await logo.boundingBox();
        if (!bounds || !image) throw new Error("Missing game artwork");
        expect(image.x).toBeGreaterThanOrEqual(bounds.x);
        expect(image.x + image.width).toBeLessThanOrEqual(
          bounds.x + bounds.width + 1,
        );
        if (width < 400 && firstLogo)
          expect(image.y + image.height / 2).toBeCloseTo(
            firstLogo.y + firstLogo.height / 2,
            0,
          );
      }
    }).toPass();
    const fixedSections = [
      source,
      target,
      ...(await dialog.locator("img:not([data-move-type])").all()),
      dialog.getByText("Copying keeps your original team unchanged.", {
        exact: true,
      }),
      dialog.getByRole("button", { name: "Copy to new team", exact: true }),
      dialog.getByRole("button", { name: "Update existing team", exact: true }),
    ];
    const before = await Promise.all(
      fixedSections.map(section => section.boundingBox()),
    );
    await expect
      .poll(() => content.evaluate(element => element.clientHeight))
      .toBeGreaterThan(200);
    await content.evaluate(element => {
      element.scrollTop = element.scrollHeight;
    });
    const after = await Promise.all(
      fixedSections.map(section => section.boundingBox()),
    );
    expect(after).toEqual(before);
    const last = await dialog
      .getByText("HP: 131 EVs → 16 SPs", { exact: true })
      .boundingBox();
    const scrollArea = await content.boundingBox();
    if (!last || !scrollArea)
      throw new Error("Missing scrollable transfer details");
    expect(last.y).toBeGreaterThanOrEqual(scrollArea.y);
    expect(last.y + last.height).toBeLessThanOrEqual(
      scrollArea.y + scrollArea.height,
    );
    await content.evaluate(element => {
      element.scrollTop = 0;
    });
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(dialog).toContainText("These Pokémon won’t carry over");
  await expect(
    dialog.getByText("These Pokémon won’t carry over", {
      exact: true,
    }),
  ).toHaveCount(1);
  const unavailableGroup = dialog.getByRole("group", {
    name: "These Pokémon won’t carry over",
  });
  const unavailablePokemon = [
    "Cacturne",
    "Rhyhorn",
    "Yanma",
    "Exeggcute",
    "Claydol",
  ];
  await expect(unavailableGroup.getByRole("img")).toHaveCount(5);
  for (const pokemon of unavailablePokemon) {
    await expect(
      unavailableGroup.getByRole("img", { name: pokemon, exact: true }),
    ).toBeVisible();
    await expect(
      unavailableGroup.getByText(pokemon, { exact: true }),
    ).toBeVisible();
  }
  for (const sprite of await unavailableGroup.getByRole("img").all()) {
    const bounds = await sprite.locator("..").boundingBox();
    if (!bounds) throw new Error("Missing unavailable Pokemon and name");
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  }
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText([
    "Forretress",
  ]);
  await expect(dialog).toContainText(
    "The rest of your Pokémon will carry over with changes",
  );
  await expect(dialog).not.toContainText(/Slot \d/);
  const forretress = dialog.getByRole("group", {
    name: "Forretress",
    exact: true,
  });
  await expect(
    forretress.getByText("Moves removed:", { exact: true }),
  ).toHaveCount(1);
  await expect(forretress.getByRole("listitem")).toHaveText([
    "Hidden Power Ghost",
  ]);
  await expect(forretress).toContainText("Item removed:");
  await expect(
    forretress.getByRole("img", { name: "Lucky Punch icon", exact: true }),
  ).toBeVisible();
  await expect(
    forretress.getByRole("img", { name: "Ghost", exact: true }),
  ).toBeVisible();
  await expect(dialog).not.toContainText("other details");
  await expect(dialog).not.toContainText("Levels will be set to 50.");
  await expect(dialog).not.toContainText("Training values will be converted.");
  const universal = dialog.getByRole("list", {
    name: "For every Pokémon carrying over",
    exact: true,
  });
  await expect(universal).toContainText("Level is set to 50.");
  await expect(universal).toContainText("IVs don’t apply in Champions.");
  await expect(forretress).not.toContainText("IVs don’t apply");
  await expect(forretress).not.toContainText("Level:");
  await expect(forretress).toContainText("HP: 131 EVs → 16 SPs");
  const bounds = await dialog.boundingBox();
  expect(bounds).toEqual({ x: 0, y: 0, width: 320, height: 640 });
  const copy = await dialog
    .getByRole("button", { name: "Copy to new team", exact: true })
    .boundingBox();
  const update = await dialog
    .getByRole("button", { name: "Update existing team", exact: true })
    .boundingBox();
  const cancel = await dialog
    .getByRole("button", { name: "Cancel", exact: true })
    .boundingBox();
  expect(copy && update && cancel).toBeTruthy();
  if (copy && update && cancel) {
    expect(cancel.y + cancel.height).toBeLessThan(copy.y);
    expect(copy.y + copy.height).toBeLessThan(update.y);
    expect(update.y + update.height).toBeLessThanOrEqual(640);
  }
  await page.setViewportSize({ width: 400, height: 640 });
  await expect(dialog).toHaveAccessibleName("Switch game? Gen 9 · Champions");
  await expect
    .poll(() => dialog.boundingBox())
    .toEqual({
      x: 0,
      y: 0,
      width: 400,
      height: 640,
    });
  await expect(
    dialog.getByText("These Pokémon won’t carry over", {
      exact: true,
    }),
  ).toHaveCount(1);
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText([
    "Forretress",
  ]);
  await expect(dialog).toContainText(
    "The rest of your Pokémon will carry over with changes",
  );
  await expect(dialog).not.toContainText(/Slot \d/);
  await page.setViewportSize({ width: 600, height: 640 });
  await expect(dialog).toHaveAccessibleName(
    "Switch game or generation? Gen 9 · Champions",
  );
  await expect.poll(async () => (await dialog.boundingBox())?.width).toBe(536);
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(dialog).toHaveAccessibleName("Switch game? Gen 9 · Champions");
  await dialog
    .getByRole("button", { name: "Cancel", exact: true })
    .press("Enter");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(
    page.getByRole("combobox", { name: "Generation" }),
  ).toContainText("Gen 3");
});

test("generation transfer: all six adjustments fit two columns on phones", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const pokemon = [
    "Cacturne",
    "Forretress",
    "Rhyhorn",
    "Yanma",
    "Exeggcute",
    "Claydol",
  ];
  const team = pokemon
    .map(
      name =>
        `${name} @\n${
          name === "Cacturne" ? "- Encore\n"
          : name === "Forretress" ? "- Body Slam\n"
          : ""
        }- Hidden Power Ground`,
    )
    .join("\n\n");
  await page.goto(`/?team=${Buffer.from(team).toString("base64url")}&gen=3`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Cacturne");
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 8 · SwSh/ }).press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("Your Pokémon will carry over with changes", {
      exact: true,
    }),
  ).toHaveCount(1);
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(pokemon);
  await expect(
    dialog
      .getByRole("group", { name: "Cacturne", exact: true })
      .getByRole("listitem"),
  ).toHaveText(["Encore", "Hidden Power Ground"]);
  await expect(
    dialog
      .getByRole("group", { name: "Forretress", exact: true })
      .getByRole("listitem"),
  ).toHaveText(["Body Slam", "Hidden Power Ground"]);
  const cacturne = dialog.getByRole("group", { name: "Cacturne", exact: true });
  await expect(
    cacturne.getByRole("img", { name: "Normal", exact: true }),
  ).toBeVisible();
  await expect(
    cacturne.getByRole("img", { name: "Ground", exact: true }),
  ).toBeVisible();
  for (const width of [320, 399, 400, 600]) {
    await page.setViewportSize({ width, height: 640 });
    await expect(async () => {
      const cards = await Promise.all(
        pokemon.map(name =>
          dialog.getByRole("group", { name, exact: true }).boundingBox(),
        ),
      );
      for (let index = 0; index < cards.length; index += 2) {
        const left = cards[index];
        const right = cards[index + 1];
        if (!left || !right) throw new Error("Missing adjustment cards");
        expect(right.y).toBeCloseTo(left.y, 0);
        expect(right.x).toBeGreaterThanOrEqual(left.x + left.width);
        expect(right.x + right.width).toBeLessThanOrEqual(width);
      }
    }).toPass();
    await expect
      .poll(() =>
        dialog
          .locator(".MuiDialogContent-root")
          .evaluate(element => element.scrollWidth - element.clientWidth),
      )
      .toBe(0);
  }
  await dialog
    .getByRole("group", { name: "Claydol", exact: true })
    .scrollIntoViewIfNeeded();
  await expect(
    dialog.getByRole("group", { name: "Claydol", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Copy to new team", exact: true }),
  ).toBeVisible();
});

test("generation transfer: universal rules appear once without empty Pokemon cards", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const team = `Gardevoir @ Choice Band
Ability: Synchronize
IVs: 30 Atk
- Hidden Power Dragon

Vaporeon @
Level: 56
-

Meganium @
Level: 50
-
`;
  await page.goto(`/?team=${Buffer.from(team).toString("base64url")}&gen=3`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Gardevoir");
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 9 · Champions/ }).press("Enter");
  const dialog = page.getByRole("dialog");
  const universal = dialog.getByRole("list", {
    name: "For every Pokémon carrying over",
    exact: true,
  });
  await expect(universal).toContainText("Level is set to 50.");
  await expect(universal).toContainText("IVs don’t apply in Champions.");
  await expect(universal).toContainText("Training changes from EVs to SPs.");
  await expect(
    dialog.getByText("Level is set to 50.", { exact: true }),
  ).toHaveCount(1);
  await expect(dialog).not.toContainText(/Level: (100|56) → 50/);
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText([
    "Gardevoir",
  ]);
  const gardevoir = dialog.getByRole("group", {
    name: "Gardevoir",
    exact: true,
  });
  await expect(gardevoir).toContainText("Choice Band");
  await expect(gardevoir).toContainText("Hidden Power Dragon");
  await expect(gardevoir).not.toContainText("IVs don’t apply");
  await expect(gardevoir).not.toContainText("Level:");
  await expect(dialog).toContainText(
    "Your Pokémon will carry over with changes",
  );
  for (const width of [320, 400, 960]) {
    await page.setViewportSize({ width, height: 640 });
    await expect
      .poll(() =>
        dialog
          .locator(".MuiDialogContent-root")
          .evaluate(element => element.scrollWidth - element.clientWidth),
      )
      .toBe(0);
  }
  await dialog
    .getByRole("button", { name: "Update existing team", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  const params = new URL(page.url()).searchParams;
  const transferred = Buffer.from(
    params.get("team") ?? "",
    "base64url",
  ).toString();
  expect(transferred.match(/Level: 50/g)).toHaveLength(3);
  expect(transferred).not.toContain("Choice Band");
  expect(transferred).not.toContain("Hidden Power");
});

test("generation transfer: Gen 2 ability removal is a universal rule, not repeated losses", async ({
  page,
}) => {
  const team = `Slowking @
Ability: Own Tempo
-

Ursaring @
Ability: Guts
-

Ariados @
-
`;
  await page.goto(`/?team=${Buffer.from(team).toString("base64url")}&gen=3`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Slowking");
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 2/ }).press("Enter");
  const dialog = page.getByRole("dialog");
  const universal = dialog.getByRole("list", {
    name: "For every Pokémon carrying over",
    exact: true,
  });
  await expect(universal).toContainText(
    "Not used in Gen 2: Ability and Nature.",
  );
  await expect(universal).toContainText("IVs are converted into DVs.");
  await expect(
    dialog.getByText("IVs are converted into DVs.", { exact: true }),
  ).toHaveCount(1);
  await expect(dialog).toContainText(
    "Your Pokémon will carry over with changes",
  );
  await expect(
    dialog.getByText("For every Pokémon carrying over", { exact: true }),
  ).toHaveCount(0);
  await expect(dialog).not.toContainText("Own Tempo");
  await expect(dialog).not.toContainText("Guts");
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveCount(0);
  await dialog
    .getByRole("button", { name: "Update existing team", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Slowking");
  await showSlot(page, 1);
  await expect(page.getByLabel("Pokemon 2's name")).toHaveValue("Ursaring");
  const text = Buffer.from(
    new URL(page.url()).searchParams.get("team") ?? "",
    "base64url",
  ).toString();
  expect(text).not.toContain("Own Tempo");
  expect(text).not.toContain("Guts");
});

for (const action of ["Cancel", "Create empty team", "Clear existing team"]) {
  test(`generation transfer: all Pokemon unavailable, ${action}`, async ({
    page,
  }) => {
    await page.goto(
      `/?team=${Buffer.from("Unown @\n-\n\nMurkrow @\n-\n").toString("base64url")}&gen=2`,
      { waitUntil: "domcontentloaded" },
    );
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Unown");
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: /^Gen 1/ }).press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("All Pokémon won’t carry over");
    await expect(dialog).not.toContainText("These Pokémon won’t carry over");
    await expect(dialog).not.toContainText("will carry over with changes");
    await expect(
      dialog.getByRole("list", {
        name: "For every Pokémon carrying over",
        exact: true,
      }),
    ).toHaveCount(0);
    await expect(dialog).toContainText(
      "Creating an empty team keeps your original team unchanged.",
    );
    await expect(
      dialog.getByRole("button", { name: "Copy to new team", exact: true }),
    ).toHaveCount(0);
    await expect(
      dialog.getByRole("button", { name: "Update existing team", exact: true }),
    ).toHaveCount(0);
    for (const width of [320, 960]) {
      await page.setViewportSize({ width, height: 640 });
      for (const name of ["Create empty team", "Clear existing team"]) {
        await expect(
          dialog.getByRole("button", { name, exact: true }),
        ).toBeInViewport();
      }
    }
    await dialog.getByRole("button", { name: action, exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText(action === "Cancel" ? "Gen 2" : "Gen 1");
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
      action === "Cancel" ? "Unown" : "",
    );
    if (action === "Create empty team") {
      await expect
        .poll(async () => {
          const stored = await page.evaluate(() =>
            JSON.parse(localStorage.getItem("mypokemonteam") ?? "{}"),
          );
          const original = stored.teams?.find(
            (team: { generation: number; team: { name: string }[] }) =>
              team.generation === 2 &&
              team.team[0]?.name === "unown" &&
              team.team[1]?.name === "murkrow",
          );
          const current = stored.teams?.find(
            (team: { id: string }) => team.id === stored.currentTeamId,
          );
          return Boolean(
            original &&
            current?.generation === 1 &&
            current.team.every((member: { name: string }) => !member.name),
          );
        })
        .toBe(true);
    }
  });
}

test("generation transfer: universal bullets follow the heading for all affected survivors", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const team = `Swellow @
- Return

Jirachi @
- Thunderbolt

Kakuna @
- Harden

Mewtwo @
- Thunder Wave

Celebi @ Lum Berry
- Shock Wave

Lapras @ Sitrus Berry
- Waterfall
`;
  await page.goto(`/?team=${Buffer.from(team).toString("base64url")}&gen=3`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Swellow");
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 2/ }).press("Enter");
  const dialog = page.getByRole("dialog");
  const unavailable = dialog.getByRole("group", {
    name: "These Pokémon won’t carry over",
    exact: true,
  });
  const carryingOver = dialog.getByRole("group", {
    name: "The rest of your Pokémon will carry over with changes",
    exact: true,
  });
  await expect(unavailable).toContainText("Swellow");
  await expect(unavailable).toContainText("Jirachi");
  const rules = carryingOver.getByRole("list", {
    name: "For every Pokémon carrying over",
    exact: true,
  });
  await expect(rules.getByRole("listitem")).toHaveText([
    "Not used in Gen 2: Ability and Nature.",
    "IVs are converted into DVs.",
    "Training changes from EVs to Stat experience.",
  ]);
  await expect(carryingOver.getByRole("heading", { level: 3 })).toHaveText([
    "Celebi",
    "Lapras",
  ]);
  await expect(
    dialog.getByText("For every Pokémon carrying over", { exact: true }),
  ).toHaveCount(0);
  expect(
    await carryingOver.evaluate(element => {
      const rules = element.querySelector("ul");
      return (
        element.previousElementSibling?.getAttribute("aria-label") ===
          "These Pokémon won’t carry over" &&
        rules === element.children[1] &&
        rules.nextElementSibling?.querySelector("h3")?.textContent === "Celebi"
      );
    }),
  ).toBe(true);
});

test("generation transfer: expands game names when the endpoint has room", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `/?team=${Buffer.from("Noctowl @\nAbility: Insomnia\n- Hypnosis\n").toString("base64url")}&gen=3`,
    { waitUntil: "domcontentloaded" },
  );
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Noctowl");
  await page.getByRole("combobox", { name: "Generation" }).click();
  await page.getByRole("option", { name: /^Gen 2/ }).press("Enter");
  const dialog = page.getByRole("dialog");
  const source = dialog.getByTitle(
    "Ruby Sapphire Emerald / FireRed LeafGreen",
    { exact: true },
  );
  const target = dialog.getByTitle("Gold Silver Crystal", { exact: true });
  await expect(source).toHaveText("RSE / FRLG");
  await expect(target).toHaveText("Gold Silver Crystal");
  for (const width of [400, 960]) {
    await page.setViewportSize({ width, height: 640 });
    await expect(source).toHaveText(
      "Ruby Sapphire Emerald / FireRed LeafGreen",
    );
    await expect(target).toHaveText("Gold Silver Crystal");
    for (const label of [source, target]) {
      await expect
        .poll(() =>
          label.evaluate(element => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const text = range.getBoundingClientRect();
            const bounds = element.getBoundingClientRect();
            const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
            return (
              text.left >= bounds.left - 1 &&
              text.right <= bounds.right + 1 &&
              bounds.height <= lineHeight * 2 + 1
            );
          }),
        )
        .toBe(true);
    }
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(source).toHaveText("RSE / FRLG");
  await page.addStyleTag({
    content: ".MuiDialog-root p[title] { font-size: 20px; }",
  });
  await expect(target).toHaveText("GSC");
});
