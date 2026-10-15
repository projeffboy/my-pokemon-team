import type { Page } from "@playwright/test";
import { test, expect } from "fixtures";
import {
  createViewport,
  LARGE_VIEWPORT_WIDTH,
  openMoreMenu,
  selectMove,
  selectPokemon,
} from "helper";

const SHOWDOWN_SPRITES = "https://play.pokemonshowdown.com/sprites";
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

const accessibilitySetting = (page: Page, name: string) =>
  page
    .getByRole("group", { name: "Accessibility" })
    .getByRole("menuitemcheckbox", { name });

test.describe("More menu accessibility settings", () => {
  test.use({ viewport: createViewport(400) });

  test("Show types hides the pokemon's and each move's type icons when turned off", async ({
    page,
  }) => {
    await selectPokemon(page, "Arctozolt");
    await selectMove(page, "Icicle Crash");
    const slot = page.getByRole("region", { name: "Pokemon 1", exact: true });
    const pokemonType = slot.getByRole("img", { name: "Electric" });
    const move = page.getByLabel("Pokemon 1's move1");
    const moveType = move.locator("..").getByRole("img", { name: "Ice" });
    const setting = accessibilitySetting(page, "Show types");
    await expect(pokemonType).toBeVisible();
    await expect(moveType).toBeVisible();

    await openMoreMenu(page);
    await expect(setting).toHaveAttribute("aria-checked", "true");
    await setting.click();
    await expect(setting).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Escape");
    await expect(pokemonType).toHaveCount(0);
    await expect(moveType).toHaveCount(0);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(move).toHaveValue("Icicle Crash");
    await expect(pokemonType).toHaveCount(0);
    await expect(moveType).toHaveCount(0);
    await page.getByLabel("Pokemon 1's move2").click({ force: true });
    const options = page.getByRole("listbox");
    await expect(options.getByRole("option").first()).toBeVisible();
    await expect(options.getByRole("img")).toHaveCount(0);
  });
});

test.describe("Animate sprites", () => {
  // Stub Showdown so the gen5 onError fallback never rewrites the src
  test.beforeEach(async ({ page }) => {
    await page.route(`${SHOWDOWN_SPRITES}/**`, route =>
      route.fulfill({ contentType: "image/png", body: PIXEL }),
    );
  });

  test.describe("md and up", () => {
    test.use({ viewport: createViewport(LARGE_VIEWPORT_WIDTH) });

    test("turned off, the slot and Pokemon Info show still sprites, and the choice is kept", async ({
      page,
    }) => {
      await selectPokemon(page, "Toucannon");
      const sprite = page
        .getByRole("region", { name: "Pokemon 1", exact: true })
        .getByRole("img", { name: "Toucannon", exact: true });
      const setting = accessibilitySetting(page, "Animate sprites");
      await expect(sprite).toHaveAttribute(
        "src",
        `${SHOWDOWN_SPRITES}/ani/toucannon.gif`,
      );

      await openMoreMenu(page);
      await expect(setting).toHaveAttribute("aria-checked", "true");
      await setting.click();
      await expect(setting).toHaveAttribute("aria-checked", "false");
      await page.keyboard.press("Escape");
      const still = `${SHOWDOWN_SPRITES}/dex/toucannon.png`;
      await expect(sprite).toHaveAttribute("src", still);

      await page.getByRole("button", { name: "About Toucannon" }).click();
      await expect(
        page
          .getByRole("dialog", { name: "Toucannon", exact: true })
          .getByRole("img", { name: "Toucannon", exact: true }),
      ).toHaveAttribute("src", still);

      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(sprite).toHaveAttribute("src", still);
      await openMoreMenu(page);
      await expect(setting).toHaveAttribute("aria-checked", "false");
    });
  });

  test("a device set to reduce motion gets still sprites until the player turns animation on", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const team = Buffer.from("Emolga @\n-\n").toString("base64url");
    await page.goto(`/?team=${team}&gen=5`);
    const sprite = page
      .getByRole("region", { name: "Pokemon 1", exact: true })
      .getByRole("img", { name: "Emolga", exact: true });
    const still = `${SHOWDOWN_SPRITES}/gen5/emolga.png`;
    const animated = `${SHOWDOWN_SPRITES}/gen5ani/emolga.gif`;
    await expect(sprite).toHaveAttribute("src", still);

    // Until the player chooses, the sprites follow the device's setting
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(sprite).toHaveAttribute("src", animated);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(sprite).toHaveAttribute("src", still);

    const setting = accessibilitySetting(page, "Animate sprites");
    await openMoreMenu(page);
    await expect(setting).toHaveAttribute("aria-checked", "false");
    await setting.click();
    await expect(setting).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Escape");
    await expect(sprite).toHaveAttribute("src", animated);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(sprite).toHaveAttribute("src", animated);
  });
});
