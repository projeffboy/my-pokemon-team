import { test, expect } from "fixtures";
import { selectPokemon } from "helper";

test.describe("Name dropdown views - Unit Tests", () => {
  test("keyboard navigation keeps filtered options in view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await expect(
      page
        .getByRole("tablist", { name: "Pokemon team slots" })
        .getByRole("tab"),
    ).toHaveCount(6);
    const input = page.getByLabel("Pokemon 1's name");
    await input.fill("a");
    for (let index = 0; index < 25; index++) {
      await input.press("ArrowDown");
      const activeId = `react-select-single-0-name-option-${index}`;
      await expect(input).toHaveAttribute("aria-activedescendant", activeId);
      const active = page.locator(`[id="${activeId}"]`);
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
    }
  });

  test("filtering before the selected row scrolls does not raise a list error", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await selectPokemon(page, "Rhyperior");
    const input = page.getByLabel("Pokemon 1's name");
    await page.evaluate(() => {
      const request = window.requestAnimationFrame;
      const cancel = window.cancelAnimationFrame;
      const pending = new Map<number, FrameRequestCallback>();
      let nextId = -1;
      window.requestAnimationFrame = callback => {
        const id = nextId--;
        pending.set(id, callback);
        return id;
      };
      window.cancelAnimationFrame = id => {
        if (!pending.delete(id)) cancel(id);
      };
      (
        window as typeof window & { releaseListFrames: () => void }
      ).releaseListFrames = () => {
        window.requestAnimationFrame = request;
        window.cancelAnimationFrame = cancel;
        for (const callback of pending.values()) request(callback);
        pending.clear();
      };
    });
    await input.click();
    await input.fill("Bulbasaur");
    await expect(
      page.getByRole("option", { name: "Bulbasaur", exact: true }),
    ).toBeVisible();
    await page.evaluate(async () => {
      (
        window as typeof window & { releaseListFrames: () => void }
      ).releaseListFrames();
      await new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    });
    expect(errors).toEqual([]);
    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(input).toHaveValue("Bulbasaur");
  });

  test("a single filtered pokemon fits completely in Grid and Big Grid", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await expect(
      page
        .getByRole("tablist", { name: "Pokemon team slots" })
        .getByRole("tab"),
    ).toHaveCount(6);
    const input = page.getByLabel("Pokemon 1's name");
    for (const view of ["Grid view", "Big grid view"]) {
      await input.fill("rhyper");
      await page.getByRole("button", { name: view, exact: true }).click();
      const option = page.getByRole("option", {
        name: "Rhyperior",
        exact: true,
      });
      await expect(option).toBeVisible();
      await expect
        .poll(() =>
          option.evaluate(element => {
            const list = element.closest("ul");
            const sprite = element.querySelector("span, img");
            if (!list || !sprite) return false;
            const viewport = list.getBoundingClientRect();
            return [element, sprite].every(part => {
              const bounds = part.getBoundingClientRect();
              return (
                bounds.top >= viewport.top &&
                bounds.bottom <= viewport.bottom &&
                bounds.left >= viewport.left &&
                bounds.right <= viewport.right
              );
            });
          }),
        )
        .toBe(true);
      await input.press("ArrowDown");
      await expect(input).toHaveAttribute(
        "aria-activedescendant",
        (await option.getAttribute("id")) ?? "",
      );
      await input.press("Enter");
      await expect(input).toHaveValue("Rhyperior");
    }
  });

  test("fits Dudunsparce-Three-Segment within two lines", async ({ page }) => {
    await page
      .getByRole("combobox", { name: "Pokemon 1's name" })
      .fill("Dudunsparce");
    await page.evaluate(() => document.fonts.ready);
    const option = page.getByRole("option", {
      name: "Dudunsparce-Three-Segment",
      exact: true,
    });
    await expect(option).toBeVisible();
    await expect(option).toHaveText("Dudunsparce-Three-Segment");
    await expect
      .poll(() =>
        option
          .locator("span")
          .first()
          .evaluate(icon => icon.getBoundingClientRect().width),
      )
      .toBe(40);
    await expect
      .poll(() =>
        option
          .locator("span")
          .last()
          .evaluate(label => {
            const lineHeight = parseFloat(getComputedStyle(label).lineHeight);
            return label.getBoundingClientRect().height / lineHeight;
          }),
      )
      .toBeLessThanOrEqual(2);
    await expect
      .poll(() =>
        option
          .locator("span")
          .last()
          .evaluate(label => {
            const row = label.parentElement;
            if (!row) return false;
            const bounds = label.getBoundingClientRect();
            const rowBounds = row.getBoundingClientRect();
            return (
              label.scrollWidth <= label.clientWidth &&
              label.scrollHeight <= label.clientHeight &&
              bounds.right <= rowBounds.right &&
              bounds.bottom <= rowBounds.bottom
            );
          }),
      )
      .toBe(true);
  });

  test("Big Grid uses static sprites, supports selection, and remembers the view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await expect(
      page
        .getByRole("tablist", { name: "Pokemon team slots" })
        .getByRole("tab"),
    ).toHaveCount(6);
    const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
    await input.fill("Nido");
    const bigGrid = page.getByRole("button", {
      name: "Big grid view",
      exact: true,
    });
    await expect(bigGrid).toHaveCount(0);
    const grid = page.getByRole("button", { name: "Grid view", exact: true });
    await grid.click();
    await expect(bigGrid).toBeVisible();
    const gridBounds = await grid.boundingBox();
    const bigBounds = await bigGrid.boundingBox();
    if (!gridBounds || !bigBounds) throw new Error("Missing grid controls");
    expect(bigBounds.x).toBeGreaterThanOrEqual(
      gridBounds.x + gridBounds.width - 1,
    );
    await bigGrid.click();
    await expect(bigGrid).toHaveAttribute("aria-pressed", "true");
    for (const option of await page.getByRole("option").all()) {
      await expect(option.locator("img")).toHaveAttribute(
        "src",
        /\.png(?:\?|$)/,
      );
      await expect(option.locator("img")).not.toHaveAttribute(
        "src",
        /ani\/|\.gif/,
      );
    }
    const popup = page.locator(".MuiAutocomplete-paper");
    await expect
      .poll(() =>
        popup.evaluate(element => element.scrollWidth - element.clientWidth),
      )
      .toBe(0);
    const popupBounds = await popup.boundingBox();
    if (!popupBounds) throw new Error("Missing Pokémon popup");
    expect(popupBounds.x).toBeGreaterThanOrEqual(0);
    expect(popupBounds.x + popupBounds.width).toBeLessThanOrEqual(320);
    expect(popupBounds.y + popupBounds.height).toBeLessThanOrEqual(640);
    await input.press("ArrowDown");
    await input.press("ArrowDown");
    await input.press("ArrowDown");
    await input.press("ArrowDown");
    const activeId = await input.getAttribute("aria-activedescendant");
    if (!activeId) throw new Error("No highlighted Pokémon");
    const active = page.locator(`[id="${activeId}"]`);
    await expect(active).toBeVisible();
    const selectedName = await active.getAttribute("aria-label");
    if (!selectedName) throw new Error("Missing Pokémon name");
    await input.press("Enter");
    await expect(input).toHaveValue(selectedName);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("mypokemonteam") ?? "{}").nameView,
        ),
      )
      .toBe("big-grid");
    await page.reload({ waitUntil: "domcontentloaded" });
    await input.fill("Wooper");
    await expect(bigGrid).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "List view" }).click();
    await expect(bigGrid).toHaveCount(0);
    await expect(
      page.getByRole("option", { name: "Wooper", exact: true }),
    ).toContainText("Wooper");
  });

  test("Big Grid falls back to a static sprite when dex artwork is unavailable", async ({
    page,
  }) => {
    await page.route("**/sprites/dex/wooper.png", route =>
      route.fulfill({ status: 404, body: "" }),
    );
    await page.goto("/?gen=9");
    await page.getByLabel("Pokemon 1's name").fill("Wooper");
    await page.getByRole("button", { name: "Grid view", exact: true }).click();
    await page
      .getByRole("button", { name: "Big grid view", exact: true })
      .click();
    const wooper = page.getByRole("option", { name: "Wooper", exact: true });
    await expect(wooper.locator("img")).toHaveAttribute(
      "src",
      /\/gen5\/wooper\.png$/,
    );
    await wooper.click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Wooper");
  });

  test("switches between the list and the grid of icons", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Pokemon 1's name" });
    await input.fill("Wooper");
    const listbox = page.getByRole("listbox");
    await expect(
      listbox.getByRole("option", { name: "Wooper", exact: true }),
    ).toContainText("Wooper");

    const toggle = page.getByRole("group", { name: "Name list view" });
    const buttons = toggle.getByRole("button");
    const firstButton = await buttons.first().boundingBox();
    const lastButton = await buttons.last().boundingBox();
    const popup = await page.locator(".MuiAutocomplete-paper").boundingBox();
    expect(firstButton && lastButton && popup).toBeTruthy();
    if (firstButton && lastButton && popup)
      expect((firstButton.x + lastButton.x + lastButton.width) / 2).toBeCloseTo(
        popup.x + popup.width / 2,
        0,
      );
    const listBounds = await toggle.boundingBox();
    await page.getByRole("button", { name: "Grid view", exact: true }).click();
    await expect
      .poll(async () => (await toggle.boundingBox())?.x)
      .toBe(listBounds?.x);
    const gridOption = listbox.getByRole("option", {
      name: "Wooper-Paldea",
      exact: true,
    });
    await expect(gridOption).toBeVisible();
    await expect(gridOption).toHaveText("");
    await gridOption.click();
    await expect(input).toHaveValue("Wooper-Paldea");

    // The chosen view is remembered for the next time the dropdown opens
    await input.fill("Clod");
    await expect(
      page.getByRole("button", { name: "Grid view", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    const gridBounds = await toggle.boundingBox();
    await page.getByRole("button", { name: "List view" }).click();
    await expect
      .poll(async () => (await toggle.boundingBox())?.x)
      .toBe(gridBounds?.x);
    await expect(
      listbox.getByRole("option", { name: "Clodsire" }),
    ).toContainText("Clodsire");
  });
});
