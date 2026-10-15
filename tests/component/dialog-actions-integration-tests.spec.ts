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

// Switching to Gen 1 leaves out Gallade and changes Electrode
const TRANSFER_TEAM_TEXT = `Electrode @ Life Orb
Ability: Aftermath
Timid Nature
- Thunderbolt
- Volt Switch

Gallade @ Leftovers
Ability: Sharpness
- Sacred Sword
`;

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
  // Phones held sideways, with the browser's toolbar taking part of the height
  ...[
    { width: 844, height: 340 },
    { width: 568, height: 270 },
  ].map(viewport => ({
    name: `Switch game at ${viewport.width}x${viewport.height}`,
    open: async (page: Page) => {
      await page.goto(
        `/?gen=9&team=${Buffer.from(TRANSFER_TEAM_TEXT).toString("base64url")}`,
      );
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
        "Electrode",
      );
      await page.getByRole("combobox", { name: "Generation" }).click();
      await page.locator('[role="option"][data-value="1"]').press("Enter");
      return page.getByRole("dialog", { name: /^Switch game/ });
    },
    actions: ["Cancel", "Update existing team", "Copy to new team"],
    close: "Cancel",
    viewport,
  })),
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

// Also checks that a tap on the action's centre reaches it, which fails when the
// dialog's edge cuts it off
const expectWithin = async (locator: Locator, top: number, bottom: number) => {
  await expect
    .poll(async () => {
      const box = await locator.boundingBox();
      if (!box || box.y < top || box.y + box.height > bottom) return false;
      return locator.evaluate(
        (element, { x, y }) =>
          element.contains(document.elementFromPoint(x, y)),
        { x: box.x + box.width / 2, y: box.y + box.height / 2 },
      );
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

// Phone browsers shrink only the visual viewport for the on-screen keyboard and for
// pinch zoom, and Safari pans it to show the focused field
const moveVisualViewport = (
  page: Page,
  offsetTop: number,
  height: number,
  scale = 1,
) =>
  page.evaluate(
    ([offsetTop, height, scale]) => {
      const viewport = window.visualViewport;
      if (!viewport) throw new Error("No visual viewport");
      const resized = viewport.height !== height;
      for (const [key, value] of Object.entries({ offsetTop, height, scale }))
        Object.defineProperty(viewport, key, {
          get: () => value,
          configurable: true,
        });
      viewport.dispatchEvent(new Event(resized ? "resize" : "scroll"));
    },
    [offsetTop, height, scale],
  );

// The height of the part of the dialog that scrolls the field, which should leave
// room for a few lines of text above the keyboard
const MIN_FIELD_AREA_HEIGHT = 80;
const expectRoomForField = async (field: Locator) =>
  expect(
    await field.evaluate(element => {
      let area = element.parentElement;
      while (area && getComputedStyle(area).overflowY !== "auto")
        area = area.parentElement;
      return area?.clientHeight ?? 0;
    }),
  ).toBeGreaterThanOrEqual(MIN_FIELD_AREA_HEIGHT);

for (const { name, open, actions, close, field } of dialogs)
  if (field)
    test(`${name} keeps its actions above the on-screen keyboard`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      const dialog = await open(page);
      await field(dialog).focus();
      await moveVisualViewport(page, 0, 270);
      await expectActionsInView(dialog, actions, 0, 270);
      await expectRoomForField(field(dialog));
      // Safari pans the visible part of the page down to the field
      await moveVisualViewport(page, 120, 270);
      await expectActionsInView(dialog, actions, 120, 390);
      await expectRoomForField(field(dialog));
      await dialog.getByRole("button", { name: close, exact: true }).click();
      await expect(dialog).toBeHidden();
    });

test("Pinch zoom leaves an open dialog where it is", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Type Chart" }).click();
  const dialog = page.getByRole("dialog");
  await expectImageToBeLoaded(dialog.getByRole("img"));
  const box = await dialog.boundingBox();
  await moveVisualViewport(page, 300, 281, 3);
  expect(await dialog.boundingBox()).toEqual(box);
});
