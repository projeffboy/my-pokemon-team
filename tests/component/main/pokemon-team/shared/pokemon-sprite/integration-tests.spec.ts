import { test, expect } from "fixtures";
import {
  createViewport,
  LARGE_VIEWPORT_WIDTH,
  selectPokemon,
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
