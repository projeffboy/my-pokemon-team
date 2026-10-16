import { test, expect } from "fixtures";
import { openMoreMenu } from "helper";
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

test("the More menu keeps the accessibility settings apart from the team's actions", async ({
  page,
}) => {
  await openMoreMenu(page);
  const menu = page.getByRole("menu");
  await expect(
    menu.getByRole("group", { name: "Manage team" }).getByRole("menuitem"),
  ).toHaveText(["Copy text", "Edit Pokepaste", "Delete", "Import team"]);
  const settings = menu
    .getByRole("group", { name: "Accessibility" })
    .getByRole("menuitemcheckbox");
  await expect(settings).toHaveText(["Animate sprites", "Show types"]);

  // The arrow keys pass over the section titles, and Enter flips a switch
  await expect(menu.getByRole("menuitem", { name: "Copy text" })).toBeFocused();
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowDown");
  await expect(settings.first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(settings.first()).toHaveAttribute("aria-checked", "false");
  await expect(menu).toBeVisible();
});

for (const locale of LOCALES) {
  test.describe(`at 320px in ${locale}`, () => {
    test.use({ locale, viewport: { width: 320, height: 640 } });

    test("each setting's label ends before its switch", async ({ page }) => {
      const { team } = MESSAGES[locale];
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await page.getByRole("button", { name: team.more, exact: true }).click();
      const settings = page.getByRole("menu").getByRole("menuitemcheckbox");
      await expect(settings).toHaveText([team.animateSprites, team.showTypes]);
      for (const setting of await settings.all()) {
        const { overflow, gap } = await setting.evaluate(item => {
          const label = item.querySelector(".MuiListItemText-root");
          const toggle = item.querySelector(".MuiSwitch-root");
          if (!label || !toggle) throw new Error("A setting lacks its parts");
          return {
            overflow: label.scrollWidth - label.clientWidth,
            gap:
              toggle.getBoundingClientRect().left -
              label.getBoundingClientRect().right,
          };
        });
        expect(overflow).toBeLessThanOrEqual(0);
        expect(gap).toBeGreaterThanOrEqual(0);
      }
    });
  });
}
