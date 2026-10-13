import { test, expect } from "fixtures";

test("captions the language button with its code, then its name beside the icon", async ({
  page,
}) => {
  const button = page.getByRole("button", { name: /^(Language|Idioma)$/ });
  // The name is upper case, as a button label beside its icon
  const expectCaptions = async (
    captions: [width: number, caption: string][],
  ) => {
    for (const [width, caption] of captions) {
      await page.setViewportSize({ width, height: 800 });
      await expect(button).toHaveText(caption, { useInnerText: true });
    }
  };

  await expectCaptions([
    [599, "EN"],
    [700, "EN"],
    [790, "EN"],
    [840, "ENGLISH"],
  ]);

  await button.click();
  await page.getByRole("menuitem", { name: "Português (Brasil)" }).click();
  await expectCaptions([
    [840, "PT"],
    [960, "PORTUGUÊS (BRASIL)"],
  ]);
});
