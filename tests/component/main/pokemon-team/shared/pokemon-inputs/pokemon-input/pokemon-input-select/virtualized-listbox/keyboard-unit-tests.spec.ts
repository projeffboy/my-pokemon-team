import { test, expect } from "fixtures";
import type { Locator, Page } from "@playwright/test";
import { filterPokemon } from "@/store/filtering";

const lastIndex =
  filterPokemon({ generation: 9, format: "", type: "", region: "" }).length - 1;
const optionId = (index: number) =>
  `react-select-single-0-name-option-${index}`;

const openView = async (page: Page, view: string, filter = "") => {
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(
    page.getByRole("tablist", { name: "Pokemon team slots" }).getByRole("tab"),
  ).toHaveCount(6);
  const input = page.getByLabel("Pokemon 1's name", { exact: true });
  await input.fill(filter);
  await input.click();
  if (view !== "List view")
    await page.getByRole("button", { name: "Grid view", exact: true }).click();
  if (view === "Big grid view")
    await page.getByRole("button", { name: view, exact: true }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  return input;
};

const expectActive = async (page: Page, input: Locator, index: number) => {
  const id = optionId(index);
  await expect(input).toHaveAttribute("aria-activedescendant", id);
  const active = page.locator(`[id="${id}"]`);
  await expect(active).toBeVisible();
  await expect
    .poll(() =>
      active.evaluate(element => {
        const viewport = element.closest("ul")?.getBoundingClientRect();
        const bounds = element.getBoundingClientRect();
        return (
          viewport !== undefined &&
          bounds.top >= viewport.top - 1 &&
          bounds.bottom <= viewport.bottom + 1
        );
      }),
    )
    .toBe(true);
};

for (const view of ["List view", "Grid view", "Big grid view"]) {
  test(`${view}: End and Home reach unmounted boundary options`, async ({
    page,
  }) => {
    const input = await openView(page, view);
    await input.press("PageDown");
    await expectActive(page, input, 4);
    await input.press("PageDown");
    await expectActive(page, input, 9);
    await input.press("PageUp");
    await expectActive(page, input, 4);
    await expect(page.locator(`[id="${optionId(lastIndex)}"]`)).toHaveCount(0);
    await input.press("End");
    await expectActive(page, input, lastIndex);
    await expect(page.locator(`[id="${optionId(0)}"]`)).toHaveCount(0);
    await input.press("Home");
    await expectActive(page, input, 0);
    await input.press("ArrowUp");
    await expectActive(page, input, 0);
  });

  test(`${view}: first ArrowUp reaches the last option without wrapping afterward`, async ({
    page,
  }) => {
    const input = await openView(page, view);
    await input.press("ArrowUp");
    await expectActive(page, input, lastIndex);
    await input.press("ArrowDown");
    await expectActive(page, input, lastIndex);
  });

  test(`${view}: selection, reopening, and filtering keep keyboard navigation synchronized`, async ({
    page,
  }) => {
    const input = await openView(page, view);
    await input.press("End");
    await expectActive(page, input, lastIndex);
    const active = page.locator(`[id="${optionId(lastIndex)}"]`);
    const selectedName =
      (await active.getAttribute("aria-label")) ??
      (await active.textContent())?.trim();
    if (!selectedName) throw new Error("Missing option name");
    await input.press("Enter");
    await expect(input).toHaveValue(selectedName);
    await input.click();
    await expectActive(page, input, lastIndex);
    await input.press("ArrowUp");
    await expectActive(page, input, lastIndex - 1);
    await input.fill("Bulbasaur");
    await expect(
      page.getByRole("option", { name: "Bulbasaur", exact: true }),
    ).toBeVisible();
    await input.press("ArrowDown");
    await expectActive(page, input, 0);
    await input.press("Enter");
    await expect(input).toHaveValue("Bulbasaur");
  });

  test(`${view}: arrow keys traverse rows while native scroll events are delayed`, async ({
    page,
  }) => {
    const input = await openView(page, view, "a");
    await page
      .getByRole("listbox")
      .locator("ul")
      .evaluate(list => {
        // Browser scroll events can arrive after another keyboard event. Keep them
        // pending to exercise navigation before react-window updates its row range.
        list.addEventListener(
          "scroll",
          event => {
            if (event.isTrusted) event.stopImmediatePropagation();
          },
          { capture: true },
        );
      });
    for (let index = 0; index < 50; index++) {
      await input.press("ArrowDown");
      await expectActive(page, input, index);
    }
    for (let index = 48; index >= 0; index--) {
      await input.press("ArrowUp");
      await expectActive(page, input, index);
    }
  });
}
