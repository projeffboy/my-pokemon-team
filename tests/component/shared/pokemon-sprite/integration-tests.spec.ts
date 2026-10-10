import { test, expect } from "fixtures";
import {
  createViewport,
  closeDialog,
  LARGE_VIEWPORT_WIDTH,
  openAdvanced,
  selectPokemon,
  selectMove,
  SMALL_VIEWPORT_WIDTH,
} from "helper";

const SHOWDOWN_SPRITES = "https://play.pokemonshowdown.com/sprites";
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

test.describe("Pokemon Sprite - Integration Tests", () => {
  // Stub Showdown so the gen5 onError fallback never rewrites the src
  test.beforeEach(async ({ page }) => {
    await page.route(`${SHOWDOWN_SPRITES}/**`, route =>
      route.fulfill({ contentType: "image/png", body: PIXEL }),
    );
  });

  for (const generation of [2, 3, 4]) {
    test(`Gen ${generation} animation keeps the still sprite's pixel scale`, async ({
      page,
    }) => {
      const still = await page.evaluate(() => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 96;
        return canvas.toDataURL();
      });
      await page.route(`${SHOWDOWN_SPRITES}/**`, route =>
        route.fulfill({
          contentType: "image/png",
          body: Buffer.from(still.split(",")[1]!, "base64"),
        }),
      );
      for (const width of [320, 1200]) {
        await page.setViewportSize({ width, height: 800 });
        const team = "Qwilfish @\n-\n";
        await page.goto(
          `/?team=${Buffer.from(team).toString("base64url")}&gen=${generation}`,
        );
        const sprites = page.locator('img[alt="qwilfish"]');
        await expect(sprites.first()).toHaveAttribute("src", /selection=/);
        await expect
          .poll(() =>
            sprites
              .first()
              .evaluate(image =>
                image.style.getPropertyValue("--sprite-scale"),
              ),
          )
          .not.toBe("");
        const animated = await sprites.evaluateAll(images =>
          images.map(image => {
            const img = image as HTMLImageElement;
            return {
              scale: img.getBoundingClientRect().width / img.naturalWidth,
              parent: img.parentElement?.getBoundingClientRect().toJSON(),
            };
          }),
        );
        await expect(sprites.first()).toHaveAttribute(
          "src",
          `${SHOWDOWN_SPRITES}/gen${generation}/qwilfish.png`,
          { timeout: 10000 },
        );
        await expect(sprites.first()).toHaveJSProperty("naturalWidth", 96);
        const restored = await sprites.evaluateAll(images =>
          images.map(image => {
            const img = image as HTMLImageElement;
            return {
              scale: img.getBoundingClientRect().width / img.naturalWidth,
              parent: img.parentElement?.getBoundingClientRect().toJSON(),
            };
          }),
        );
        expect(restored).toHaveLength(animated.length);
        for (const [index, after] of restored.entries()) {
          expect(after.scale).toBeCloseTo(animated[index]!.scale, 2);
          expect(after.parent).toEqual(animated[index]!.parent);
        }
      }
    });

    test(`Gen ${generation} selection and page loads briefly animate the sprite, but move edits do not`, async ({
      page,
    }) => {
      await page.getByRole("combobox", { name: "Generation" }).click();
      await page
        .locator(`[role="option"][data-value="${generation}"]`)
        .press("Enter");
      await expect(
        page.getByRole("combobox", { name: "Generation" }),
      ).toContainText(`Gen ${generation} ·`);
      await expect(page.locator(".MuiMenu-paper")).toBeHidden();
      await selectPokemon(page, "Dunsparce");
      const sprite = page
        .getByRole("region", { name: "Pokemon 1", exact: true })
        .getByRole("img", { name: "dunsparce", exact: true });
      const extension = generation === 2 ? "gif" : "png";
      await expect(sprite).toHaveAttribute(
        "src",
        new RegExp(
          `/sprite-animations/${generation}/dunsparce\\.${extension}\\?(?:no-inline&)?selection=`,
        ),
      );
      expect(await sprite.evaluate(image => image.getAnimations().length)).toBe(
        0,
      );
      const firstFrame = await sprite.screenshot();
      await expect
        .poll(async () => {
          if (
            !(await sprite.getAttribute("src"))?.includes("sprite-animations")
          )
            return false;
          return !firstFrame.equals(await sprite.screenshot());
        })
        .toBe(true);
      const still = `${SHOWDOWN_SPRITES}/gen${generation}/dunsparce.png`;
      await expect(sprite).toHaveAttribute("src", still, { timeout: 10000 });
      await selectMove(page, "Defense Curl");
      await expect(sprite).toHaveAttribute("src", still);
      await selectPokemon(page, "Qwilfish");
      const qwilfish = page
        .getByRole("region", { name: "Pokemon 1", exact: true })
        .getByRole("img", { name: "qwilfish", exact: true });
      await expect(qwilfish).toHaveAttribute(
        "src",
        new RegExp(
          `/sprite-animations/${generation}/qwilfish\\.${extension}\\?(?:no-inline&)?selection=`,
        ),
      );
      await page.reload();
      await expect(qwilfish).toHaveAttribute(
        "src",
        new RegExp(
          `/sprite-animations/${generation}/qwilfish\\.${extension}\\?(?:no-inline&)?selection=`,
        ),
      );
      await expect(qwilfish).toHaveAttribute(
        "src",
        `${SHOWDOWN_SPRITES}/gen${generation}/qwilfish.png`,
        { timeout: 10000 },
      );
    });
  }

  test("reduced motion skips Gen 2 selection and page load animations", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page.getByRole("option", { name: /^Gen 2 / }).press("Enter");
    await expect(
      page.getByRole("combobox", { name: "Generation" }),
    ).toContainText("Gen 2 ·");
    await expect(page.locator(".MuiMenu-paper")).toBeHidden();
    await selectPokemon(page, "Corsola");
    await expect(
      page
        .getByRole("region", { name: "Pokemon 1", exact: true })
        .getByRole("img", { name: "corsola", exact: true }),
    ).toHaveAttribute("src", `${SHOWDOWN_SPRITES}/gen2/corsola.png`);
    await page.reload();
    await expect(
      page
        .getByRole("region", { name: "Pokemon 1", exact: true })
        .getByRole("img", { name: "corsola", exact: true }),
    ).toHaveAttribute("src", `${SHOWDOWN_SPRITES}/gen2/corsola.png`);
  });

  test("Shiny changes the card and viewer sprites, survives reload, and can be turned off", async ({
    page,
  }) => {
    await selectPokemon(page, "Purugly");
    const cardSprite = page
      .getByRole("region", { name: "Pokemon 1", exact: true })
      .getByRole("img", { name: "purugly", exact: true });
    await openAdvanced(page);
    await page.getByRole("dialog").getByLabel("Shiny").check();
    await closeDialog(page);
    await expect(cardSprite).toHaveAttribute(
      "src",
      `${SHOWDOWN_SPRITES}/ani-shiny/purugly.gif`,
    );
    const viewerSprite = page
      .getByRole("tablist", { name: "Pokemon team slots" })
      .locator('img[alt="purugly"]');
    if (await viewerSprite.count())
      await expect(viewerSprite).toHaveAttribute(
        "src",
        /\/(dex|ani)-shiny\/purugly\./,
      );
    await page.reload();
    await expect(cardSprite).toHaveAttribute(
      "src",
      `${SHOWDOWN_SPRITES}/ani-shiny/purugly.gif`,
    );
    await openAdvanced(page);
    await page.getByRole("dialog").getByLabel("Shiny").uncheck();
    await closeDialog(page);
    await expect(cardSprite).toHaveAttribute(
      "src",
      `${SHOWDOWN_SPRITES}/ani/purugly.gif`,
    );
  });

  test("an unavailable shiny animation uses a shiny static sprite", async ({
    page,
  }) => {
    await page.route(`${SHOWDOWN_SPRITES}/ani-shiny/**`, route =>
      route.fulfill({ status: 404, body: "Not found" }),
    );
    await selectPokemon(page, "Bergmite");
    await openAdvanced(page);
    await page.getByRole("dialog").getByLabel("Shiny").check();
    await closeDialog(page);
    await expect(
      page
        .getByRole("region", { name: "Pokemon 1", exact: true })
        .getByRole("img", { name: "bergmite", exact: true }),
    ).toHaveAttribute("src", `${SHOWDOWN_SPRITES}/gen5-shiny/bergmite.png`);
  });

  test("a bundled forme tries its shiny sprite and safely falls back to local artwork", async ({
    page,
  }) => {
    await selectPokemon(page, "Zeraora-Mega");
    await openAdvanced(page);
    await page.getByRole("dialog").getByLabel("Shiny").check();
    await closeDialog(page);
    const sprite = page
      .getByRole("region", { name: "Pokemon 1", exact: true })
      .getByRole("img", { name: "zeraora-mega", exact: true });
    await expect(sprite).toHaveAttribute(
      "src",
      `${SHOWDOWN_SPRITES}/gen5-shiny/zeraora-mega.png`,
    );
    await page.route(`${SHOWDOWN_SPRITES}/gen5-shiny/zeraora-mega.png`, route =>
      route.fulfill({ status: 404, body: "Not found" }),
    );
    await page.reload();
    await expect(sprite).toHaveAttribute("src", /zeraoramega.*\.png/);
    await expect(sprite).not.toHaveAttribute("src", /pokemonshowdown/);
    await expect(sprite).toHaveJSProperty("naturalWidth", 192);
  });

  test.describe("md and up", () => {
    test.use({ viewport: createViewport(LARGE_VIEWPORT_WIDTH) });

    test("should animate a mega that Showdown hosts", async ({ page }) => {
      await selectPokemon(page, "Starmie-Mega");

      await expect(
        page.getByRole("img", { name: "starmie-mega" }),
      ).toHaveAttribute("src", `${SHOWDOWN_SPRITES}/ani/starmie-mega.gif`);
    });

    test("should drop the space in a two-word forme", async ({ page }) => {
      await selectPokemon(page, "Vivillon-Icy Snow");

      await expect(
        page.getByRole("img", { name: "vivillon-icysnow" }),
      ).toHaveAttribute("src", `${SHOWDOWN_SPRITES}/ani/vivillon-icysnow.gif`);
    });

    test("should reuse the base sprite for a forme that looks the same", async ({
      page,
    }) => {
      await selectPokemon(page, "Rockruff-Dusk");

      await expect(page.getByRole("img", { name: "rockruff" })).toHaveAttribute(
        "src",
        `${SHOWDOWN_SPRITES}/ani/rockruff.gif`,
      );
    });

    test("should bundle a mega that Showdown does not host", async ({
      page,
    }) => {
      await selectPokemon(page, "Zeraora-Mega");

      const sprite = page.getByRole("img", { name: "zeraora-mega" });
      await expect(sprite).toHaveAttribute("src", /zeraoramega.*\.png/);
      await expect(sprite).not.toHaveAttribute("src", /pokemonshowdown/);
    });
  });

  test.describe("below md", () => {
    test.use({ viewport: createViewport(SMALL_VIEWPORT_WIDTH) });

    test("should use the dex sprite in the team viewer", async ({ page }) => {
      await selectPokemon(page, "Froslass-Mega");

      await expect(
        page
          .getByRole("tablist", { name: "Pokemon team slots" })
          .locator('img[alt="froslass-mega"]'),
      ).toHaveAttribute("src", `${SHOWDOWN_SPRITES}/dex/froslass-mega.png`);
    });

    test("should use the base dex sprite for a totem", async ({ page }) => {
      await selectPokemon(page, "Salazzle-Totem");

      await expect(
        page
          .getByRole("tablist", { name: "Pokemon team slots" })
          .locator('img[alt="salazzle"]'),
      ).toHaveAttribute("src", `${SHOWDOWN_SPRITES}/dex/salazzle.png`);
    });
  });
});
