import { test, expect } from "fixtures";
import type { Locator, Page } from "@playwright/test";
import {
  getTeamTextFromUrl,
  isMdDown,
  openTeamTools,
  selectMove,
  selectPokemon,
  showSlot,
} from "helper";

test.describe("Slot tools - Integration Tests", () => {
  test("adds slot action icons and labels in priority order as room grows", async ({
    page,
  }) => {
    await selectPokemon(page, "Cufant");
    await openTeamTools(page);
    const random = page.getByRole("button", {
      name: "Random pokemon for slot 1",
    });
    const details = page.getByRole("button", {
      name: "More details for slot 1",
    });
    for (const { width, edit, label } of [
      { width: 600, edit: false, label: "" },
      { width: 320, edit: true, label: "" },
      { width: 420, edit: true, label: "Random" },
      { width: 480, edit: true, label: "Randomize" },
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(details).toHaveText("More details");
      await expect(random.getByTestId("CasinoIcon")).toBeVisible();
      await expect(details.getByTestId("EditOutlinedIcon"))[
        edit ? "toBeVisible" : "toBeHidden"
      ]();
      await expect(random.getByText("Random", { exact: true }))[
        label === "Random" ? "toBeVisible" : "toBeHidden"
      ]();
      await expect(random.getByText("Randomize", { exact: true }))[
        label === "Randomize" ? "toBeVisible" : "toBeHidden"
      ]();
      expect(
        await details.evaluate(
          button => button.scrollWidth > button.clientWidth,
        ),
      ).toBe(false);
    }
    await details.click();
    await expect(
      page.getByRole("dialog", { name: "More details" }),
    ).toBeVisible();
  });

  test("Random fills the slot with a pokemon and four moves", async ({
    page,
  }) => {
    const grips = page
      .getByRole("tablist", { name: "Pokemon team slots" })
      .getByTestId("DragIndicatorIcon");
    if (isMdDown(page)) await expect(grips).toHaveCount(0);

    // A few pokemon, such as Ditto, learn fewer than four moves, so the draws are fixed
    await page.evaluate(() => {
      Math.random = () => 0.5;
    });
    await page
      .getByRole("button", { name: "Random pokemon for slot 1" })
      .click();
    await expect(page.getByLabel("Pokemon 1's name")).not.toHaveValue("");
    if (isMdDown(page)) await expect(grips).toHaveCount(6);
    for (const move of [1, 2, 3, 4]) {
      await expect(page.getByLabel(`Pokemon 1's move${move}`)).not.toHaveValue(
        "",
      );
    }
    await expect
      .poll(() =>
        getTeamTextFromUrl(page)
          .split("\n")
          .filter(line => line.startsWith("- ")),
      )
      .toHaveLength(4);
  });

  test("Random completes a partly filled slot, and replaces a complete one", async ({
    page,
  }) => {
    await selectPokemon(page, "Lanturn");
    await selectMove(page, "Volt Switch");
    const random = page.getByRole("button", {
      name: "Random pokemon for slot 1",
    });
    await random.hover();
    await expect(page.getByRole("tooltip")).toHaveText(
      "Randomize moves, item, and ability",
    );
    await random.click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Lanturn");
    await expect(
      page
        .getByRole("alert")
        .last()
        .getByText("Randomized pokemon's moves, item, and ability", {
          exact: true,
        }),
    ).toBeVisible();
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue(
      "Volt Switch",
    );
    for (const field of ["move2", "move3", "move4", "item", "ability"]) {
      await expect(page.getByLabel(`Pokemon 1's ${field}`)).not.toHaveValue("");
    }

    await random.hover();
    await expect(page.getByRole("tooltip")).toHaveText("Randomize pokemon");
    await random.click();
    await expect(
      page
        .getByRole("alert")
        .last()
        .getByText("Randomized pokemon", { exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("Pokemon 1's name")).not.toHaveValue(
      "Lanturn",
    );
  });

  test("moves a pokemon to the slot picked from its sprite's menu", async ({
    page,
  }) => {
    // Phones and tablets drag the slot tabs instead
    test.skip(isMdDown(page), "The slot chip is on the desktop cards");
    await selectPokemon(page, "Quagsire");
    await page
      .getByRole("button", { name: "Move Quagsire to another slot" })
      .click();
    await page.getByRole("menuitem", { name: "Pokemon 4 (empty)" }).click();

    await expect(page.getByLabel("Pokemon 4's name")).toHaveValue("Quagsire");
    await expect.poll(() => getTeamTextFromUrl(page)).toContain("Quagsire");
  });

  test("swaps two pokemon when one card's chip is dragged onto the other card", async ({
    page,
  }) => {
    test.skip(isMdDown(page), "Phones and tablets drag the slot tabs instead");
    await selectPokemon(page, "Dhelmise");
    await selectPokemon(page, "Orbeetle", 1);

    await dragBetween(
      page,
      page.getByRole("button", { name: "Move Orbeetle to another slot" }),
      page.getByRole("region", { name: "Pokemon 1", exact: true }),
    );

    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Orbeetle");
    await expect(page.getByLabel("Pokemon 2's name")).toHaveValue("Dhelmise");
  });

  test("dragging a slot tab along the row moves the slots in between over", async ({
    page,
  }) => {
    test.skip(!isMdDown(page), "Desktop has no slot tabs");
    await selectPokemon(page, "Dhelmise");
    await showSlot(page, 1);
    await selectPokemon(page, "Orbeetle", 1);
    await showSlot(page, 2);
    await selectPokemon(page, "Kingambit", 2);

    const grips = page
      .getByRole("tablist", { name: "Pokemon team slots" })
      .getByTestId("DragIndicatorIcon");
    await dragBetween(page, grips.nth(0), grips.nth(2));

    // A tabbed viewer follows the pokemon to its new slot
    await expect(
      page.getByRole("tab", { name: /Pokemon 3 \(Dhelmise\)/ }),
    ).toHaveAttribute("aria-selected", "true");
    await expect
      .poll(() => getTeamTextFromUrl(page))
      .toMatch(/Orbeetle[^]*Kingambit[^]*Dhelmise/);
  });
});

// Drags with the mouse from the middle of one element to the middle of another
const dragBetween = async (page: Page, source: Locator, target: Locator) => {
  // Choosing a pokemon can scroll the slot tabs off screen
  await target.scrollIntoViewIfNeeded();
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error("The slots are not on screen");

  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
    steps: 10,
  });
  await page.mouse.up();
};
