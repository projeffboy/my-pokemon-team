import { test, expect } from "fixtures";
import { GENERATION_GAMES, GENERATIONS } from "@/shared/generations";
import en from "@/i18n/en";
import type { Locator } from "@playwright/test";

test("Let’s Go and Legends options are disabled, under Coming soon only", async ({
  page,
}) => {
  const generation = page.getByRole("combobox", { name: "Generation" });
  const generationInput = page.locator("header .MuiSelect-nativeInput");
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const before = await generationInput.inputValue();
    await generation.click();
    // The group heading says it once, rather than each option
    await expect(
      page.getByRole("listbox").getByText("Coming soon", { exact: true }),
    ).toHaveCount(1);
    for (const value of ["Let’s Go", "Legends: Arceus", "Legends: Z-A"]) {
      const option = page.locator(`[role="option"][data-value="${value}"]`);
      await expect(option).toHaveAttribute("aria-disabled", "true");
      await option.scrollIntoViewIfNeeded();
      const logoBounds = await option.locator("img").last().boundingBox();
      expect(logoBounds).not.toBeNull();
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
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[role="option"]:focus')).toHaveAttribute(
      "data-value",
      "6",
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
  // The sizing copies hold a placeholder for each logo, so the logos load with the menu
  const sizers = page.locator(
    'header [aria-hidden="true"] > .MuiListItemText-root',
  );
  await expect(sizers.locator("img")).toHaveCount(0);
  const widths = (elements: Element[]) =>
    elements.map(element => Math.round(element.getBoundingClientRect().width));
  expect(await sizers.locator("span:empty").evaluateAll(widths)).toEqual(
    await options.locator("img").evaluateAll(widths),
  );
  const widest = await sizers.evaluateAll(options =>
    Math.max(
      ...options.map(option => {
        const logos = [...option.querySelectorAll("span:empty")];
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
    await expect
      .poll(() => page.locator("body").evaluate(el => el.scrollWidth))
      .toBeLessThanOrEqual(320);
    await expect(generation).toHaveText(await expectedLabel(generation, gen));
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

test("groups the options under headings, with the coming-soon games last", async ({
  page,
}) => {
  await page.getByRole("combobox", { name: "Generation" }).click();
  const listbox = page.getByRole("listbox");
  await expect(listbox.getByRole("option")).toHaveCount(14);
  const items = await listbox
    .locator(":scope > li")
    .evaluateAll(items =>
      items.map(item =>
        item.getAttribute("role") === "option" ?
          item.getAttribute("data-value")
        : item.textContent,
      ),
    );
  expect(items).toEqual([
    "Spin-offs",
    "champions",
    "Main series",
    "6-9",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1",
    "Coming soon",
    "Legends: Z-A",
    "Legends: Arceus",
    "Let’s Go",
  ]);
  // Screen readers say each option's group after its name
  await expect(
    listbox.locator('[role="option"][data-value="9"]'),
  ).toHaveAccessibleDescription("Main series");
  await expect(
    listbox.locator('[role="option"][data-value="Legends: Z-A"]'),
  ).toHaveAccessibleDescription("Coming soon");
  // A heading stays put when clicked, rather than choosing a generation
  const before = await page
    .locator("header .MuiSelect-nativeInput")
    .inputValue();
  await listbox.getByText("Main series", { exact: true }).click();
  await expect(listbox).toBeVisible();
  await expect(page.locator("header .MuiSelect-nativeInput")).toHaveValue(
    before,
  );
});

test("checks only the selected option", async ({ page }) => {
  const generation = page.getByRole("combobox", { name: "Generation" });
  for (const value of ["9", "3"]) {
    await generation.click();
    const option = page.locator(`[role="option"][data-value="${value}"]`);
    await option.click();
    await expect(page.getByRole("listbox")).toBeHidden();
    await generation.click();
    await expect(option.getByTestId("CheckIcon")).toBeVisible();
    await expect(
      page
        .getByRole("listbox")
        .getByTestId("CheckIcon")
        .filter({ visible: true }),
    ).toHaveCount(1);
    await page.keyboard.press("Escape");
  }
});

test("the menu reaches down to the screen's edge, even after the screen shrinks", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("combobox", { name: "Generation" }).click();
  const paper = page.locator(".MuiMenu-paper");
  await expect(paper).toHaveCSS("transform", "none");
  const bottom = async () => {
    const bounds = await paper.boundingBox();
    return bounds && bounds.y + bounds.height;
  };
  expect(await bottom()).toBeCloseTo(900 - 16, 0);
  // As when a phone is turned while the menu is open
  await page.setViewportSize({ width: 1440, height: 500 });
  await expect.poll(bottom).toBeLessThanOrEqual(500 - 16 + 1);
});

test("an option reached with the keyboard scrolls clear of the sticky group heading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.getByRole("combobox", { name: "Generation" }).click();
  const paper = page.locator(".MuiMenu-paper");
  await expect(paper).toHaveCSS("transform", "none");
  await page.keyboard.press("End");
  for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowUp");
  const focused = page.locator('[role="option"]:focus');
  await expect(focused).toHaveAttribute("data-value", "4");
  const heading = await page
    .getByRole("listbox")
    .getByText("Main series", { exact: true })
    .boundingBox();
  const label = await focused.locator(".MuiListItemText-primary").boundingBox();
  // The heading is stuck to the menu's top, over the options scrolled past
  expect(heading?.y).toBeCloseTo((await paper.boundingBox())?.y ?? 0, 0);
  expect(label?.y).toBeGreaterThanOrEqual(
    (heading?.y ?? 0) + (heading?.height ?? 0),
  );
});

test("keeps each option's logos on one line on a small phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.getByRole("combobox", { name: "Generation" }).click();
  await expect(page.locator(".MuiMenu-paper")).toHaveCSS("transform", "none");
  for (const option of await page.getByRole("option").all()) {
    const logos = await option
      .locator("img")
      .evaluateAll(images =>
        images.map(image => image.getBoundingClientRect().toJSON() as DOMRect),
      );
    if (!logos.length) continue;
    const optionRight = await option.evaluate(
      element => element.getBoundingClientRect().right,
    );
    const centres = logos.map(logo => logo.top + logo.height / 2);
    expect(Math.max(...centres) - Math.min(...centres)).toBeLessThan(1);
    expect(Math.max(...logos.map(logo => logo.right))).toBeLessThanOrEqual(
      optionRight,
    );
  }
});

test("uses the larger logos from larger phones up, with box fronts twice as tall", async ({
  page,
}) => {
  const generation = page.getByRole("combobox", { name: "Generation" });
  const diamond = page
    .locator('[role="option"][data-value="4"]')
    .getByRole("img", { name: "Pokémon Diamond" });
  const red = page
    .locator('[role="option"][data-value="1"]')
    .getByRole("img", { name: "Pokémon Red" });
  for (const [width, height] of [
    [500, 40],
    [399, 28],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await generation.click();
    await expect(diamond).toHaveCSS("height", `${height}px`);
    await expect(red).toHaveCSS("height", `${height * 2}px`);
    await page.keyboard.press("Escape");
  }
});
