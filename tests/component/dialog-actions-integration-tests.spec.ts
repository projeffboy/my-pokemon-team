import { test, expect } from "fixtures";
import {
  expectImageToBeLoaded,
  openAdvanced,
  openEditPokepaste,
  openFilters,
  openSort,
  selectPokemon,
} from "helper";
import type { Locator, Page } from "@playwright/test";

const LONG_TEAM_TEXT = Array.from(
  { length: 6 },
  () =>
    "Mesprit @ Leftovers\nAbility: Levitate\nEVs: 252 HP / 4 Def / 252 SpD\nCalm Nature\n- Psychic\n- Thunder Wave\n- U-turn\n- Stealth Rock\n",
).join("\n");

interface DialogCase {
  name: string;
  open: (page: Page) => Promise<Locator>;
  actions: string[];
  close: string;
  // A text field the on-screen keyboard opens for
  field?: (dialog: Locator) => Locator;
  viewport?: { width: number; height: number };
}

const SMALL_PHONE = { width: 320, height: 480 };

const dialogs: DialogCase[] = [
  {
    name: "Type Chart",
    open: async page => {
      await page.getByRole("button", { name: "Type Chart" }).click();
      const dialog = page.getByRole("dialog");
      await expectImageToBeLoaded(dialog.getByRole("img"));
      return dialog;
    },
    actions: ["Go Back"],
    close: "Go Back",
    // The charts are wide, so they scroll on a phone held sideways
    viewport: { width: 844, height: 390 },
  },
  {
    name: "Update Log",
    open: async page => {
      await page.getByRole("button", { name: /^Updates/ }).click();
      const dialog = page.getByRole("dialog", { name: "Update Log" });
      await expect(
        dialog.getByRole("link", { name: "GitHub Repo" }),
      ).toBeVisible();
      return dialog;
    },
    actions: ["Go Back"],
    close: "Go Back",
  },
  {
    name: "Send Feedback",
    open: async page => {
      await page.getByRole("button", { name: "Send feedback" }).click();
      const dialog = page.getByRole("dialog", { name: "Send Feedback" });
      await dialog
        .getByRole("textbox", { name: "Your feedback" })
        .fill("Mesprit is missing a move.\n".repeat(8));
      return dialog;
    },
    actions: ["Cancel", "Send"],
    close: "Cancel",
    field: dialog => dialog.getByRole("textbox", { name: "Your feedback" }),
  },
  {
    name: "Edit Pokepaste",
    open: async page => {
      await openEditPokepaste(page);
      const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
      await dialog.getByRole("textbox").fill(LONG_TEAM_TEXT);
      return dialog;
    },
    actions: ["Cancel", "Update"],
    close: "Cancel",
    field: dialog => dialog.getByRole("textbox"),
  },
  {
    name: "Import Team",
    open: async page => {
      await page.getByRole("button", { name: "Teams", exact: true }).click();
      await page.getByRole("button", { name: "Import Team" }).click();
      const dialog = page.getByRole("dialog", { name: "Import Team" });
      await dialog.getByRole("textbox").fill(LONG_TEAM_TEXT);
      return dialog;
    },
    actions: ["Cancel", "Import"],
    close: "Cancel",
    field: dialog => dialog.getByRole("textbox"),
  },
  {
    name: "Filters",
    open: async page => {
      await openFilters(page);
      return page.getByRole("dialog", { name: "Filters" });
    },
    actions: ["Clear", "Done"],
    close: "Done",
    field: dialog => dialog.getByRole("combobox", { name: "Ability" }),
  },
  {
    name: "Sort",
    open: async page => {
      await openSort(page);
      return page.getByRole("dialog", { name: "Sort" });
    },
    actions: ["Done"],
    close: "Done",
  },
  {
    name: "More details",
    open: async page => {
      await selectPokemon(page, "Mesprit");
      await openAdvanced(page);
      return page.getByRole("dialog", { name: "More details" });
    },
    actions: ["Reset", "Done"],
    close: "Done",
    field: dialog => dialog.getByRole("textbox", { name: "Nickname" }),
  },
  {
    name: "Pokemon info",
    open: async page => {
      await selectPokemon(page, "Mesprit");
      await page.getByRole("button", { name: "About Mesprit" }).click();
      return page.getByRole("dialog", { name: "Mesprit" });
    },
    actions: ["Close"],
    close: "Close",
  },
];

// Scrolls the dialog's scrolling parts to the start or the end of its content, and
// returns whether any of them had content to scroll
const scrollDialog = (dialog: Locator, to: "start" | "end") =>
  dialog.evaluate((root, to) => {
    let scrolls = false;
    for (const element of [root, ...root.querySelectorAll("*")]) {
      if (element.scrollHeight <= element.clientHeight + 1) continue;
      scrolls = true;
      element.scrollTop = to === "start" ? 0 : element.scrollHeight;
    }
    return scrolls;
  }, to);

const expectWithin = async (locator: Locator, top: number, bottom: number) => {
  await expect
    .poll(async () => {
      const box = await locator.boundingBox();
      return !!box && box.y >= top && box.y + box.height <= bottom;
    })
    .toBe(true);
};

// Scrolls from the start to the end of the content and back, checking every action
// stays within the given part of the screen
const expectActionsInView = async (
  dialog: Locator,
  actions: string[],
  top: number,
  bottom: number,
) => {
  for (const to of ["end", "start"] as const) {
    expect(await scrollDialog(dialog, to)).toBe(true);
    for (const name of actions)
      await expectWithin(
        dialog.getByRole("button", { name, exact: true }),
        top,
        bottom,
      );
  }
};

for (const { name, open, actions, close, viewport = SMALL_PHONE } of dialogs)
  test(`${name} keeps its actions in view while its content scrolls`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const dialog = await open(page);
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      await expectActionsInView(dialog, actions, 0, viewport.height);
    }
    await dialog.getByRole("button", { name: close, exact: true }).click();
    await expect(dialog).toBeHidden();
  });

// Phone browsers shrink only the visual viewport for the on-screen keyboard, and
// Safari pans it to show the focused field
const openKeyboard = (page: Page, offsetTop: number, height: number) =>
  page.evaluate(
    ([offsetTop, height]) => {
      const viewport = window.visualViewport;
      if (!viewport) throw new Error("No visual viewport");
      const resized = viewport.height !== height;
      for (const [key, value] of Object.entries({ offsetTop, height }))
        Object.defineProperty(viewport, key, {
          get: () => value,
          configurable: true,
        });
      viewport.dispatchEvent(new Event(resized ? "resize" : "scroll"));
    },
    [offsetTop, height],
  );

for (const { name, open, actions, close, field } of dialogs)
  if (field)
    test(`${name} keeps its actions above the on-screen keyboard`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      const dialog = await open(page);
      await field(dialog).focus();
      await openKeyboard(page, 0, 270);
      await expectActionsInView(dialog, actions, 0, 270);
      // Safari pans the visible part of the page down to the field
      await openKeyboard(page, 120, 270);
      await expectActionsInView(dialog, actions, 120, 390);
      await dialog.getByRole("button", { name: close, exact: true }).click();
      await expect(dialog).toBeHidden();
    });
