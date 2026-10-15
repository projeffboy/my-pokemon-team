import { test, expect } from "fixtures";
import { openMoreMenu } from "helper";

test("the More menu keeps the accessibility settings apart from the team's actions", async ({
  page,
}) => {
  await openMoreMenu(page);
  const menu = page.getByRole("menu");
  await expect(
    menu.getByRole("group", { name: "Manage team" }).getByRole("menuitem"),
  ).toHaveText(["Copy text", "Edit Pokepaste", "Clear", "Import team"]);
  const settings = menu
    .getByRole("group", { name: "Accessibility" })
    .getByRole("menuitemcheckbox");
  await expect(settings).toHaveText(["Animate sprites", "Show move types"]);

  // The arrow keys pass over the section titles, and Enter flips a switch
  await expect(menu.getByRole("menuitem", { name: "Copy text" })).toBeFocused();
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowDown");
  await expect(settings.first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(settings.first()).toHaveAttribute("aria-checked", "false");
  await expect(menu).toBeVisible();
});
