import { test, expect } from "fixtures";
import { getTeamTextFromUrl, openTeamTools } from "helper";
import type { Locator, Page } from "@playwright/test";

const observeRolls = async (page: Page) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    document.documentElement.dataset.diceRolls = "0";
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this instanceof SVGElement) {
        const count = Number(document.documentElement.dataset.diceRolls ?? 0);
        document.documentElement.dataset.diceRolls = String(count + 1);
      }
      return animate.call(this, frames, options);
    };
  });
};

const rollCount = (page: Page) =>
  page.evaluate(() => Number(document.documentElement.dataset.diceRolls ?? 0));

const press = (button: Locator) =>
  button.evaluate(element => {
    element.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        isPrimary: true,
        pointerType: "mouse",
      }),
    );
    return element
      .querySelector("svg")
      ?.getAnimations({ subtree: true })
      .map(animation => ({
        state: animation.playState,
        delay: animation.effect?.getTiming().delay,
      }));
  });

for (const target of [
  "slot",
  "slot tools",
  "toolbar",
  "teams dialog",
] as const) {
  test(`${target} dice roll starts on press before randomization`, async ({
    page,
  }) => {
    await observeRolls(page);
    if (target !== "slot") await openTeamTools(page);
    if (target === "teams dialog") {
      await page.getByRole("button", { name: "Teams", exact: true }).click();
    }
    const button = page.getByRole("button", {
      name:
        target === "toolbar" ? "Randomize team"
        : target === "teams dialog" ? "Random team"
        : "Random pokemon for slot 1",
      exact: true,
    });
    await expect(button).toBeEnabled();
    const before = getTeamTextFromUrl(page);
    const animations = await press(button);
    const dice = target === "toolbar" ? 2 : 1;
    expect(animations).toHaveLength(dice);
    expect(
      animations?.every(
        animation => animation.state === "running" && animation.delay === 0,
      ),
    ).toBe(true);
    expect(getTeamTextFromUrl(page)).toBe(before);
    await button.evaluate(element => (element as HTMLElement).click());
    await expect(page.getByLabel("Pokemon 1's name")).not.toHaveValue("");
    expect(await rollCount(page)).toBe(dice);
  });
}

for (const key of ["Space", "Enter"]) {
  test(`${key} starts the dice without restarting on activation`, async ({
    page,
  }) => {
    await observeRolls(page);
    const button = page.getByRole("button", {
      name: "Random pokemon for slot 1",
    });
    await expect(button).toBeEnabled();
    await button.focus();
    await page.keyboard.down(key);
    expect(await rollCount(page)).toBe(1);
    if (key === "Space") {
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
    }
    await page.keyboard.up(key);
    await expect(page.getByLabel("Pokemon 1's name")).not.toHaveValue("");
    expect(await rollCount(page)).toBe(1);
  });
}

test("programmatic activation still rolls and reduced motion keeps randomization", async ({
  page,
}) => {
  await observeRolls(page);
  const button = page.getByRole("button", {
    name: "Random pokemon for slot 1",
  });
  await expect(button).toBeEnabled();
  await button.evaluate(element => (element as HTMLElement).click());
  await expect(page.getByLabel("Pokemon 1's name")).not.toHaveValue("");
  expect(await rollCount(page)).toBe(1);
  await expect
    .poll(() =>
      button
        .locator("svg")
        .evaluate(icon => icon.getAnimations({ subtree: true }).length),
    )
    .toBe(0);
  const previous = await page.getByLabel("Pokemon 1's name").inputValue();
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await press(button)).toHaveLength(0);
  await button.evaluate(element => (element as HTMLElement).click());
  await expect(page.getByLabel("Pokemon 1's name")).not.toHaveValue(previous);
  expect(await rollCount(page)).toBe(1);
});

test("a quick team click paints dice movement before the result appears", async ({
  page,
}) => {
  await observeRolls(page);
  await openTeamTools(page);
  const button = page.getByRole("button", {
    name: "Randomize team",
    exact: true,
  });
  await expect(button).toBeEnabled();
  await button.evaluate(element => {
    let moved = false;
    let completed = false;
    const tick = () => {
      moved ||= [...element.querySelectorAll("[data-die]")].some(die => {
        const transform = getComputedStyle(die).transform;
        return transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)";
      });
      if (!completed) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const replaceState = history.replaceState;
    history.replaceState = function (data, unused, url) {
      if (url && new URL(url, location.href).searchParams.get("team")) {
        document.documentElement.dataset.resultAfterDiceMovement =
          String(moved);
        completed = true;
      }
      return replaceState.call(this, data, unused, url);
    };
  });
  await button.click();
  await expect(page.getByLabel("Pokemon 1's name")).not.toHaveValue("");
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.dataset.resultAfterDiceMovement,
      ),
    )
    .toBe("true");
});

test("repeated presses restart the roll and secondary presses do not roll", async ({
  page,
}) => {
  await observeRolls(page);
  const button = page.getByRole("button", {
    name: "Random pokemon for slot 1",
  });
  await expect(button).toBeEnabled();
  await button.dispatchEvent("pointerdown", { button: 2, isPrimary: true });
  expect(await rollCount(page)).toBe(0);
  expect(await press(button)).toHaveLength(1);
  expect(await press(button)).toHaveLength(1);
  expect(await rollCount(page)).toBe(2);
  await button.dispatchEvent("pointercancel");
  await button.evaluate(element => (element as HTMLElement).click());
  expect(await rollCount(page)).toBe(3);
});
