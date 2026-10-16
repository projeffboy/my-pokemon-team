import { test, expect } from "fixtures";
import {
  clickMenuItem,
  openAdvanced,
  openAnalysis,
  openFilters,
  openMoreMenu,
  openSort,
} from "helper";
import type { Locator, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { toBase64Url } from "@/app/shared/base64url";

// WCAG 2.2 levels A and AA: names, keyboard access, structure, and text contrast
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const teamUrl = `/?gen=9&team=${toBase64Url(`Kilowattrel @ Heavy-Duty Boots
Ability: Volt Absorb
- Thunderbolt
- Hurricane

Dachsbun @ Leftovers
Ability: Well-Baked Body
- Body Press
- Wish
`)}`;

// Waits out fades and slides, since a half-faded dialog fails the contrast check.
// Ripples that pulse while a button has focus never end.
const settle = (page: Page) =>
  page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        animation =>
          animation.playState !== "running" ||
          animation.effect?.getComputedTiming().iterations === Infinity,
      ),
  );

// In the dark scheme, MUI lightens raised surfaces with a flat gradient that axe cannot
// see through. Painting each as the flat colour it shows lets the contrast check run there.
const flattenSurfaceOverlays = (page: Page) =>
  page.evaluate(() => {
    const channels = (color: string) =>
      (color.match(/[\d.]+/g) ?? []).map(Number);
    for (const element of document.querySelectorAll<HTMLElement>("*")) {
      const { backgroundImage, backgroundColor } = getComputedStyle(element);
      const gradient =
        /^linear-gradient\((rgba?\([^)]*\)), (rgba?\([^)]*\))\)$/.exec(
          backgroundImage,
        );
      if (!gradient?.[1] || gradient[1] !== gradient[2]) continue;
      const [r = 0, g = 0, b = 0, alpha = 1] = channels(gradient[1]);
      const [R = 0, G = 0, B = 0] = channels(backgroundColor);
      const mix = (top: number, bottom: number) =>
        Math.round(top * alpha + bottom * (1 - alpha));
      element.style.backgroundImage = "none";
      element.style.backgroundColor = `rgb(${mix(r, R)}, ${mix(g, G)}, ${mix(b, B)})`;
    }
  });

// `within` checks only that part of the page
const expectNoViolations = async (
  page: Page,
  skippedRules: string[] = [],
  within?: string,
) => {
  await settle(page);
  await flattenSurfaceOverlays(page);
  const axe = new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .disableRules(skippedRules);
  const { violations } = await (within ? axe.include(within) : axe).analyze();
  expect(
    violations.flatMap(({ id, nodes }) => {
      const targets = nodes
        .map(({ target }) => target.join(" "))
        // Below 960px the slot move grip is 18px wide, under the 24px target size; see #77
        .filter(
          target =>
            id !== "target-size" || !target.startsWith("#team-slot-move-"),
        );
      return targets.length ? [`${id}: ${targets.join(", ")}`] : [];
    }),
  ).toEqual([]);
};

// Closes whatever is open on top of the page. Closing Filters or Sort reopens their dropdown.
const closeAll = async (page: Page) => {
  const overlays = page.locator(
    '[role="dialog"], [role="menu"], [role="listbox"]',
  );
  await expect(async () => {
    if (await overlays.count()) await page.keyboard.press("Escape");
    await expect(overlays).toHaveCount(0, { timeout: 1000 });
  }).toPass();
};

// Every dialog needs a name. `content` is something that loads with the dialog's code.
const checkDialog = async (
  page: Page,
  open: () => Promise<unknown>,
  content?: (dialog: Locator) => Locator,
) => {
  await open();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName(/\S/);
  if (content) await expect(content(dialog)).toBeVisible();
  await expectNoViolations(page);
  await closeAll(page);
};

const footerButton = (page: Page, name: RegExp) =>
  page.locator("footer").getByRole("button", { name });

// An open dropdown's list scrolls with the arrow keys from its combobox. axe accepts that
// only when the scrolling element is the listbox itself, and here it sits inside it.
const DROPDOWN_RULES = ["scrollable-region-focusable"];

// The open list covers part of the slot beneath it, such as the About button, whose
// target size the check with nothing open covers. So target sizes count only in the list.
const checkDropdown = async (page: Page, input: Locator) => {
  await input.click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await expectNoViolations(page, [...DROPDOWN_RULES, "target-size"]);
  await expectNoViolations(page, DROPDOWN_RULES, ".MuiAutocomplete-popper");
  await closeAll(page);
};

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`Accessibility in the ${colorScheme} scheme - Integration Tests`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(teamUrl);
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
        "Kilowattrel",
      );
    });

    test("the page, its menus, its dropdowns, and every analysis pass", async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await expectNoViolations(page);

      await openMoreMenu(page);
      await expectNoViolations(page);
      await closeAll(page);

      await page
        .getByRole("button", { name: "Move Kilowattrel to another slot" })
        .click();
      await expect(page.getByRole("menu")).toBeVisible();
      await expectNoViolations(page);
      await closeAll(page);

      await page
        .locator("header")
        .getByRole("button", { name: /Language/ })
        .click();
      await expect(page.getByRole("menu")).toBeVisible();
      await expectNoViolations(page);
      await closeAll(page);

      await checkDropdown(page, page.getByLabel("Pokemon 1's name"));
      await page.getByLabel("Pokemon 1's name").click();
      await page
        .getByRole("button", { name: "Grid view", exact: true })
        .click();
      await expectNoViolations(page, DROPDOWN_RULES);
      await page
        .getByRole("button", { name: "List view", exact: true })
        .click();
      await closeAll(page);
      await checkDropdown(page, page.getByLabel("Pokemon 1's move1"));
      await checkDropdown(page, page.getByLabel("Pokemon 1's item"));

      for (const analysis of [
        "Team Type Coverage",
        "Matrix Analysis",
        "Team Checklist",
      ]) {
        await openAnalysis(page, analysis);
        await expectNoViolations(page);
      }
    });

    test("the dialogs the team opens pass", async ({ page }) => {
      test.setTimeout(120_000);
      await checkDialog(page, () =>
        page.getByRole("button", { name: "Teams", exact: true }).click(),
      );
      await checkDialog(page, async () => {
        await openMoreMenu(page);
        await clickMenuItem(page, "Edit Pokepaste");
      });
      await checkDialog(page, async () => {
        await openMoreMenu(page);
        await clickMenuItem(page, "Import team");
      });
      await checkDialog(page, async () => {
        await openMoreMenu(page);
        await clickMenuItem(page, "Delete");
      });
      await checkDialog(page, () => openAdvanced(page));
      await checkDialog(page, () =>
        page.getByRole("button", { name: "About Kilowattrel" }).click(),
      );
      await checkDialog(page, () => openFilters(page));
      await checkDialog(page, () => openSort(page));
    });

    test("the header and footer dialogs pass", async ({ page }) => {
      test.setTimeout(120_000);
      await checkDialog(
        page,
        () => footerButton(page, /^Type Chart$/).click(),
        dialog => dialog.getByRole("img"),
      );
      for (const name of [
        /^Manual$/,
        /^Credits$/,
        /^Updates/,
        /^Privacy Policy$/,
      ]) {
        await checkDialog(
          page,
          () => footerButton(page, name).click(),
          dialog => dialog.locator(".MuiDialogContent-root > *").first(),
        );
      }
      await checkDialog(page, () =>
        page.getByRole("button", { name: "Send feedback" }).click(),
      );
      // With a team to lose, the old website asks first
      await checkDialog(page, () =>
        page
          .locator("header")
          .getByRole("button", { name: /old (website|site)/i })
          .click(),
      );
      // So does a switch to a game the team has to change for
      await checkDialog(page, async () => {
        await page.getByRole("combobox", { name: "Generation" }).click();
        await page
          .getByRole("option")
          .and(page.locator('[data-value="7"]'))
          .click();
      });
    });
  });
}
