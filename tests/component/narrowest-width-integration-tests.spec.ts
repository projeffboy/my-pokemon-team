import { test, expect } from "fixtures";
import type { Page } from "@playwright/test";
import {
  clickMenuItem,
  closeDialog,
  openAdvanced,
  openAnalysis,
  openFilters,
  openMoreMenu,
  openSort,
  showSlot,
} from "helper";
import { LOCALES, type Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/en";
import en from "@/i18n/en";
import ja from "@/i18n/ja";
import ko from "@/i18n/ko";
import zhHans from "@/i18n/zh-hans";
import zhHant from "@/i18n/zh-hant";
import es from "@/i18n/es";
import fr from "@/i18n/fr";
import de from "@/i18n/de";
import it from "@/i18n/it";
import ptBR from "@/i18n/pt-br";

const MESSAGES: Record<Locale, Messages> = {
  en,
  ja,
  ko,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
  es,
  fr,
  de,
  it,
  "pt-BR": ptBR,
};

// Long names, so the slots hold about the longest text they can
const TEAM = Buffer.from(
  `Necrozma-Dusk-Mane @ Ultranecrozium Z
Ability: Prism Armor
- Sunsteel Strike
- Photon Geyser

Urshifu-Rapid-Strike @ Choice Band
Ability: Unseen Fist
- Surging Strikes

Ogerpon-Hearthflame @ Hearthflame Mask
Ability: Mold Breaker
- Ivy Cudgel`,
).toString("base64url");

// What the Player could not see at this width: the page or a part of it scrolling sideways,
// or the text or icon of a control or label reaching past an element that hides its
// overflow. A field's value may run past the field, as in any text field.
const findCutOff = () => {
  const problems: string[] = [];
  const root = document.documentElement;
  const shown = (element: Element) =>
    element.checkVisibility({
      opacityProperty: true,
      visibilityProperty: true,
    });
  const describe = (element: Element) =>
    (element.getAttribute("aria-label") ?? element.textContent ?? "")
      .trim()
      .slice(0, 60);
  if (root.scrollWidth > root.clientWidth)
    problems.push(`The page is ${root.scrollWidth}px wide`);
  for (const element of document.querySelectorAll("body *")) {
    const { overflowX } = getComputedStyle(element);
    if (
      (overflowX === "auto" || overflowX === "scroll") &&
      element.scrollWidth > element.clientWidth + 1 &&
      shown(element)
    )
      problems.push(`"${describe(element)}" scrolls sideways`);
  }
  // The horizontal span that the node's ancestors and the viewport leave visible
  const visibleSpan = (node: Node) => {
    let left = 0;
    let right = root.clientWidth;
    for (let box = node.parentElement; box; box = box.parentElement) {
      if (getComputedStyle(box).overflowX === "visible") continue;
      // clientWidth ignores transforms, such as a shrunk label's scale(0.75)
      const rect = box.getBoundingClientRect();
      const scale = box.offsetWidth ? rect.width / box.offsetWidth : 1;
      const boxLeft = rect.left + box.clientLeft * scale;
      left = Math.max(left, boxLeft);
      right = Math.min(right, boxLeft + box.clientWidth * scale);
    }
    return { left, right };
  };
  const controls = document.querySelectorAll(
    "button, a[href], input:not([type=hidden]), textarea, select, label, legend, [role=button], [role=tab], [role=combobox], [role=menuitem], [role=option], [role=switch], [role=checkbox], [role=radio], [role=slider], .MuiInputLabel-root, .MuiFormControlLabel-label",
  );
  for (const control of controls) {
    if (!shown(control)) continue;
    const parts: [Node, DOMRect][] = [];
    if (control.matches("input, textarea, select"))
      parts.push([control, control.getBoundingClientRect()]);
    const texts = document.createTreeWalker(control, NodeFilter.SHOW_TEXT);
    for (let text = texts.nextNode(); text; text = texts.nextNode()) {
      const parent = text.parentElement;
      if (
        !text.textContent?.trim() ||
        !parent ||
        !shown(parent) ||
        parent.closest(".MuiSelect-select")
      )
        continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      parts.push([text, range.getBoundingClientRect()]);
    }
    for (const icon of control.querySelectorAll("svg"))
      if (shown(icon)) parts.push([icon, icon.getBoundingClientRect()]);
    for (const [node, box] of parts) {
      const { left, right } = visibleSpan(node);
      if (box.width >= 1 && (box.left < left - 1 || box.right > right + 1))
        problems.push(
          `"${describe(control)}" is cut off: ${Math.round(box.left)}-${Math.round(box.right)}px of ${Math.round(left)}-${Math.round(right)}px shows`,
        );
    }
  }
  return problems;
};

const expectNothingCutOff = (page: Page, view: string) =>
  expect.poll(() => page.evaluate(findCutOff), { message: view }).toEqual([]);

// Answers a pokepast.es link as a paste that does not exist, with CORS open to any page
const mockMissingPaste = (page: Page) =>
  page.route("https://pokepast.es/**", route =>
    route.fulfill({
      status: 404,
      headers: { "access-control-allow-origin": "*" },
      body: "Not found",
    }),
  );

const loadTeam = async (page: Page, t: Messages = en) => {
  await page.goto(`/?gen=9&team=${TEAM}`);
  await expect(
    page.getByRole("combobox", { name: t.team.input(1, "name") }),
  ).not.toHaveValue("");
};

// Opens a slot's dropdown from the keyboard, since its buttons cover much of a narrow field
const openDropdown = async (page: Page, label: string) => {
  const input = page.getByRole("combobox", { name: label });
  await input.focus();
  await input.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
};

const closeDropdown = async (page: Page) => {
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toBeHidden();
};

// Clicks somewhere that takes no action, so a focused field shows its unfocused label
const blur = (page: Page) =>
  page.getByRole("dialog").getByRole("heading").first().click();

// Checks each footer dialog, and each tab of one with tabs, once its content has loaded
const expectFooterDialogsFit = async (page: Page, goBack: string) => {
  for (const button of await page.locator("footer > button").all()) {
    const name = (await button.textContent()) ?? "";
    await button.click();
    const dialog = page.getByRole("dialog");
    const tabs = dialog.getByRole("tab");
    await expect(
      tabs.or(dialog.locator(".MuiDialogContent-root > *")).first(),
    ).toBeVisible();
    for (const tab of await tabs.all()) {
      await tab.click();
      await expectNothingCutOff(page, `${name}, ${await tab.textContent()}`);
    }
    await expectNothingCutOff(page, name);
    await closeDialog(page, goBack);
  }
};

// REQ-USE-3: at 320 CSS pixels, the narrowest supported width, the page does not scroll
// sideways and no control or label is cut off
test.describe("Narrowest Width - Integration Tests", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("the team, its analysis, and its slots' dropdowns and dialogs fit", async ({
    page,
  }) => {
    await loadTeam(page);
    for (const slot of [0, 1, 2, 3]) {
      await showSlot(page, slot);
      await expectNothingCutOff(page, `slot ${slot + 1}`);
    }
    await showSlot(page, 0);
    for (const view of [
      "Team Defence",
      "Team Type Coverage",
      "Team Checklist",
      "Matrix Analysis",
    ]) {
      await openAnalysis(page, view);
      await expectNothingCutOff(page, view);
    }

    for (const property of ["move1", "item", "ability", "name"]) {
      await openDropdown(page, `Pokemon 1's ${property}`);
      await expectNothingCutOff(page, `the ${property} dropdown`);
      if (property !== "name") await closeDropdown(page);
    }
    for (const view of ["Grid view", "Big grid view", "List view"]) {
      await page.getByRole("button", { name: view, exact: true }).click();
      await expectNothingCutOff(page, `the name dropdown's ${view}`);
    }
    await closeDropdown(page);

    await openFilters(page);
    await expectNothingCutOff(page, "Filters");
    for (const label of ["Format", "Type", "Region"]) {
      await page
        .getByRole("dialog")
        .getByRole("combobox", { name: label })
        .click();
      await expectNothingCutOff(page, `the ${label} filter`);
      await closeDropdown(page);
    }
    await closeDialog(page);

    await openSort(page);
    await expectNothingCutOff(page, "Sort");
    await page.getByRole("tab", { name: "Moves" }).click();
    await expectNothingCutOff(page, "Sort's Moves tab");
    await closeDialog(page);

    await openAdvanced(page);
    await expectNothingCutOff(page, "More details");
    await closeDialog(page);

    await page
      .getByRole("button", { name: "About Necrozma-Dusk-Mane" })
      .click();
    await expectNothingCutOff(page, "the pokemon's info");
    await closeDialog(page, "Close");
  });

  test("the team actions and the saved teams fit", async ({ page }) => {
    test.slow();
    await loadTeam(page);
    await openMoreMenu(page);
    await expectNothingCutOff(page, "More");
    await clickMenuItem(page, "Import/Export");
    const teamExport = page.getByRole("dialog", { name: "Import/Export" });
    for (const name of ["Copy", "Upload to PokePaste", "Update"])
      await expect(
        teamExport.getByRole("button", { name, exact: true }),
      ).toBeInViewport();
    await blur(page);
    await expectNothingCutOff(page, "Import/Export");
    // The problems found in the text, and the message after a link that fails
    await teamExport.getByRole("textbox").fill("Ho-Oh\n- Iron Hed");
    await expect(
      teamExport.getByText(en.importDialog.problems(1)),
    ).toBeVisible();
    await expectNothingCutOff(page, "Import/Export, with a problem");
    await mockMissingPaste(page);
    await teamExport
      .getByRole("textbox")
      .fill("https://pokepast.es/0123456789");
    await teamExport.getByRole("button", { name: "Update" }).click();
    await expect(
      teamExport.getByText(en.importDialog.linkFailed),
    ).toBeVisible();
    await expectNothingCutOff(page, "Import/Export, after a link that fails");
    await closeDialog(page, "Cancel");

    await page.getByRole("button", { name: "Share pokemon team link" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expectNothingCutOff(page, "the snackbar");

    await page.getByRole("button", { name: "Teams", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expectNothingCutOff(page, "Teams");
    const openOptions = async () => {
      await dialog
        .getByRole("button", { name: /^Options for / })
        .first()
        .click();
      await expectNothingCutOff(page, "a team's options");
    };
    for (const [item, title] of [
      ["Edit team name", "Edit team name"],
      ["Delete", /^Delete /],
    ] as const) {
      await openOptions();
      await clickMenuItem(page, item);
      // The Teams dialog is hidden from the accessibility tree while this one is open
      const itemDialog = page.getByRole("dialog", { name: title });
      await expect(itemDialog).toBeVisible();
      await expectNothingCutOff(page, item);
      await page.keyboard.press("Escape");
      await expect(itemDialog).toBeHidden();
    }

    await dialog
      .getByRole("button", { name: "Import/Export", exact: true })
      .click();
    for (const name of ["Copy", "Download", "Add teams"])
      await expect(
        dialog.getByRole("button", { name, exact: true }),
      ).toBeInViewport();
    await blur(page);
    await expectNothingCutOff(page, "the teams' Import/Export");
    await dialog.getByRole("textbox").fill("Pikablu");
    await dialog.getByRole("button", { name: "Add teams" }).click();
    await expect(dialog.getByText(en.importDialog.nothingFound)).toBeVisible();
    await expectNothingCutOff(page, "the teams' Import/Export, with a message");
    await dialog.getByRole("button", { name: "Go Back" }).first().click();
    await expect(
      dialog.getByRole("button", { name: "Import/Export", exact: true }),
    ).toBeVisible();

    // A team's own Import/Export replaces the Teams dialog
    await openOptions();
    await clickMenuItem(page, "Import/Export");
    await expect(teamExport).toBeVisible();
    await expectNothingCutOff(page, "a team's Import/Export");
  });

  test("the header, the footer, and their dialogs fit", async ({ page }) => {
    await loadTeam(page);
    await page.getByRole("button", { name: "Language", exact: true }).click();
    await expectNothingCutOff(page, "Language");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toBeHidden();

    await page.getByRole("button", { name: "Feedback" }).click();
    await expectNothingCutOff(page, "Feedback");
    await closeDialog(page, "Cancel");

    // With a team, the old website's button asks first
    await page.locator("header").getByRole("button").first().click();
    await expectNothingCutOff(page, "the old website's warning");
    await closeDialog(page, "Cancel");

    await expectFooterDialogsFit(page, "Go Back");

    await page.getByRole("combobox", { name: "Generation" }).click();
    await expectNothingCutOff(page, "Generation");
    await page.getByRole("option", { name: /^Gen 4/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNothingCutOff(page, "the switch to Gen 4");
  });

  // The places with the longest text, in every language
  for (const locale of LOCALES) {
    const t = MESSAGES[locale];
    test.describe(locale, () => {
      test.use({ locale });

      test(`the longest labels fit in ${locale}`, async ({ page }) => {
        await loadTeam(page, t);
        await expectNothingCutOff(page, "the team");

        await page.getByRole("button", { name: t.team.advancedFor(1) }).click();
        await expectNothingCutOff(page, "More details");
        await closeDialog(page, t.done);

        await openDropdown(page, t.team.input(1, "name"));
        await page
          .getByRole("button", { name: t.team.sort, exact: true })
          .click();
        await expect(page.getByRole("dialog")).toBeVisible();
        for (const tab of await page
          .getByRole("dialog")
          .getByRole("tab")
          .all()) {
          await tab.click();
          await expectNothingCutOff(page, `Sort, ${await tab.textContent()}`);
        }
        await closeDialog(page, t.done);

        await page
          .getByRole("button", { name: t.team.more, exact: true })
          .click();
        await page
          .getByRole("menuitem", { name: t.importDialog.title, exact: true })
          .click();
        await blur(page);
        await expectNothingCutOff(page, "Import/Export");
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeHidden();

        await page
          .getByRole("button", { name: t.team.teams, exact: true })
          .click();
        await page
          .getByRole("button", { name: t.importDialog.title, exact: true })
          .click();
        await blur(page);
        await expectNothingCutOff(page, "the teams' Import/Export");
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeHidden();

        await page.getByRole("combobox", { name: t.generationSelect }).click();
        await expectNothingCutOff(page, "Generation");
        await closeDropdown(page);

        await expectFooterDialogsFit(page, t.goBack);
      });
    });
  }
});
