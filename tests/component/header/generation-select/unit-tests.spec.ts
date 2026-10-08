import { test, expect } from "fixtures";
import { GENERATION_GAMES, GENERATIONS } from "@/shared/generations";
import en from "@/i18n/en";
import type { Locator } from "@playwright/test";

test("Legends options are disabled with Coming soon beside their logos", async ({
  page,
}) => {
  const generation = page.getByRole("combobox", { name: "Generation" });
  const generationInput = page.locator("header .MuiSelect-nativeInput");
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const before = await generationInput.inputValue();
    await generation.click();
    for (const value of ["Legends: Arceus", "Legends: Z-A"]) {
      const option = page.locator(`[role="option"][data-value="${value}"]`);
      await expect(option).toHaveAttribute("aria-disabled", "true");
      await option.scrollIntoViewIfNeeded();
      const status = option.getByText("Coming soon", { exact: true });
      await expect(status).toBeVisible();
      await expect(status).toHaveCSS("font-size", "12px");
      const logoBounds = await option.locator("img").boundingBox();
      const statusBounds = await status.boundingBox();
      expect(logoBounds).not.toBeNull();
      expect(statusBounds).not.toBeNull();
      if (logoBounds && statusBounds)
        expect(statusBounds.x).toBeGreaterThanOrEqual(
          logoBounds.x + logoBounds.width,
        );
      if (logoBounds)
        await page.mouse.click(
          logoBounds.x + logoBounds.width / 2,
          logoBounds.y + logoBounds.height / 2,
        );
      await expect(generationInput).toHaveValue(before);
      await expect(page.getByRole("dialog")).toHaveCount(0);
    }
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[role="option"]:focus')).toHaveAttribute(
      "data-value",
      "8",
    );
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[role="option"]:focus')).toHaveAttribute(
      "data-value",
      "7",
    );
    await page.keyboard.press("Escape");
  }
});

const mainGames = (gen: keyof typeof GENERATION_GAMES, full: boolean) => {
  const games = full ? en.generationGames[gen] : GENERATION_GAMES[gen];
  return gen >= 8 ?
      games
        .split(" / ")
        .slice(0, gen === 8 ? 2 : 1)
        .join(" / ")
    : games;
};

async function expectedLabel(
  generation: Locator,
  gen: keyof typeof GENERATION_GAMES,
) {
  return generation.locator("span").evaluate(
    (element, { full, short }) => {
      const probe = element.cloneNode() as HTMLElement;
      probe.textContent = full;
      probe.style.width = "max-content";
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      element.parentElement?.append(probe);
      const range = document.createRange();
      range.selectNodeContents(probe);
      const fits = range.getBoundingClientRect().width <= element.clientWidth;
      probe.remove();
      return fits ? full : short;
    },
    {
      full: `Gen ${gen} · ${mainGames(gen, true)}`,
      short: `Gen ${gen} · ${mainGames(gen, false)}`,
    },
  );
}

test("matches the widest menu option including its game logos", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const generation = page.getByRole("combobox", { name: "Generation" });
  await generation.click();
  await expect(page.locator(".MuiMenu-paper")).toHaveCSS("transform", "none");
  const options = page.getByRole("option");
  await expect
    .poll(() =>
      options
        .locator("img")
        .evaluateAll(images =>
          images.every(
            image =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  const widest = await page
    .locator('header [aria-hidden="true"] > .MuiListItemText-root')
    .evaluateAll(options =>
      Math.max(
        ...options.map(option => {
          const logos = [...option.querySelectorAll("img")];
          const first = logos[0]?.getBoundingClientRect();
          const last = logos.at(-1)?.getBoundingClientRect();
          const logoWidth = first && last ? last.right - first.left : 0;
          const label = option.querySelector(".MuiListItemText-primary");
          const range = document.createRange();
          if (label) range.selectNodeContents(label);
          const labelWidth = label ? range.getBoundingClientRect().width : 0;
          const style = getComputedStyle(option.parentElement ?? option);
          return (
            Math.max(logoWidth, labelWidth) +
            parseFloat(style.paddingLeft) +
            parseFloat(style.paddingRight)
          );
        }),
      ),
    );
  await page.keyboard.press("Escape");
  await expect(page.locator(".MuiMenu-paper")).toBeHidden();
  expect(
    await generation.evaluate(el => el.getBoundingClientRect().width),
  ).toBeCloseTo(widest, 0);
});

for (const gen of [9, 8, 7, 6, 5, 4, 3, 2, 1] as const) {
  test(`Gen ${gen} expands game names only when the entire label fits, including after resizing`, async ({
    page,
  }) => {
    const generation = page.getByRole("combobox", { name: "Generation" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(generation).toHaveText(`Gen 9 · ${mainGames(9, true)}`);
    const wideWidth = await generation.evaluate(
      el => el.getBoundingClientRect().width,
    );
    await generation.click();
    await page.locator(`[role="option"][data-value="${gen}"]`).click();
    await expect(generation).toHaveText(`Gen ${gen} · ${mainGames(gen, true)}`);
    const width = await generation.evaluate(
      el => el.getBoundingClientRect().width,
    );
    expect(width).toBeCloseTo(wideWidth, 0);
    await expect(generation.locator("span")).toHaveJSProperty(
      "scrollWidth",
      await generation.locator("span").evaluate(el => el.clientWidth),
    );
    await expect(page.locator(".MuiMenu-paper")).toBeHidden();
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(generation).toHaveCSS("overflow", "hidden");
    await expect(generation).toHaveCSS("text-overflow", "clip");
    await expect(generation.locator("span")).toHaveCSS("overflow", "visible");
    expect(
      await page.locator("body").evaluate(el => el.scrollWidth),
    ).toBeLessThanOrEqual(320);
    await expect(generation).toHaveText(
      `Gen ${gen} · ${mainGames(gen, false)}`,
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(generation).toHaveText(await expectedLabel(generation, gen));
  });
}

test("abbreviates game menu labels on narrow screens without clipping", async ({
  page,
}) => {
  const generation = page.getByRole("combobox", { name: "Generation" });
  const variants = [
    ...GENERATIONS.map(gen => ({
      value: `${gen}`,
      full: `Gen ${gen} · ${en.generationGames[gen]}`,
      short: `Gen ${gen} · ${GENERATION_GAMES[gen]}`,
      compact: undefined,
    })),
    {
      value: "Let’s Go",
      full: `Gen 7 · ${en.gameVariants["Let’s Go"]}`,
      short: "Gen 7 · LGPE",
    },
    {
      value: "Legends: Arceus",
      full: `Gen 8 · ${en.gameVariants["Legends: Arceus"]}`,
      compact: "Gen 8 · Legends Arceus",
      short: "Gen 8 · PLA",
    },
    {
      value: "Legends: Z-A",
      full: `Gen 9 · ${en.gameVariants["Legends: Z-A"]}`,
      compact: "Gen 9 · Legends Z-A",
      short: "Gen 9 · Z-A",
    },
  ];
  for (const width of [1440, 320, 360, 400, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await generation.click();
    await expect(page.locator(".MuiMenu-paper")).toHaveCSS("transform", "none");
    for (const variant of variants) {
      const label = page
        .locator(`[role="option"][data-value="${variant.value}"]`)
        .locator(".MuiListItemText-primary");
      const expected = await label.evaluate(
        (element, { full, compact, short }) => {
          const probe = element.cloneNode() as HTMLElement;
          probe.style.width = "max-content";
          probe.style.position = "absolute";
          probe.style.visibility = "hidden";
          element.parentElement?.append(probe);
          const range = document.createRange();
          const expected = [full, ...(compact ? [compact] : []), short].find(
            text => {
              probe.textContent = text;
              range.selectNodeContents(probe);
              return range.getBoundingClientRect().width <= element.clientWidth;
            },
          );
          probe.remove();
          return expected ?? short;
        },
        variant,
      );
      await expect(label).toHaveText(expected);
      expect(
        await label.evaluate(element => {
          const range = document.createRange();
          range.selectNodeContents(element);
          const text = range.getBoundingClientRect();
          const bounds = element.getBoundingClientRect();
          return (
            text.width <= bounds.width + 1 && text.height <= bounds.height + 1
          );
        }),
      ).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(page.locator(".MuiMenu-paper")).toBeHidden();
  }
});

test("keeps Legends names when they fit before using initials", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.addStyleTag({
    content: ".MuiMenu-paper .MuiListItemText-primary { font-size: 20px; }",
  });
  const generation = page.getByRole("combobox", { name: "Generation" });
  await generation.click();
  const arceus = page
    .locator('[role="option"][data-value="Legends: Arceus"]')
    .locator(".MuiListItemText-primary");
  const za = page
    .locator('[role="option"][data-value="Legends: Z-A"]')
    .locator(".MuiListItemText-primary");
  const gen1 = page
    .locator('[role="option"][data-value="1"]')
    .locator(".MuiListItemText-primary");
  await expect(gen1).toHaveText("Gen 1 · Red Blue Yellow");
  await expect(arceus).toHaveText("Gen 8 · Legends: Arceus");
  await expect(za).toHaveText("Gen 9 · Legends: Z-A");
  await page.addStyleTag({
    content: ".MuiMenu-paper .MuiListItemText-primary { font-size: 40px; }",
  });
  await expect(arceus).toHaveText("Gen 8 · PLA");
  await expect(za).toHaveText("Gen 9 · Z-A");
  await expect(gen1).toHaveText("Gen 1 · RBY");
});
