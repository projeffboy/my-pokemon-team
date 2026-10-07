import { test, expect } from "fixtures";
import { openAnalysis } from "helper";

test("matrix type chips add icons, then full names as space increases", async ({
  page,
}) => {
  const team = ["Wyrdeer", "Klawf", "Nymble", "Bruxish", "Drampa", "Falinks"]
    .map(name => `${name}\n`)
    .join("\n");
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto(`/?team=${Buffer.from(team).toString("base64url")}`);
  await openAnalysis(page, "Matrix Analysis");
  const matrix = page.getByRole("region", { name: "Matrix Analysis" });
  await expect(matrix.getByRole("columnheader", { name: /^Slot/ })).toHaveCount(
    6,
  );
  const type = matrix.getByRole("rowheader", { name: "Fighting", exact: true });
  const label = type.locator("[data-type-label]");
  const icon = label.locator("img");
  const abbreviation = label.locator("[data-type-abbreviation]");
  const fullName = label.locator("[data-type-name]");
  await expect(icon).toHaveCount(0);
  await expect(abbreviation).toBeVisible();
  await expect(fullName).toBeHidden();

  await page.setViewportSize({ width: 390, height: 900 });
  await expect(icon).toBeVisible();
  await expect(abbreviation).toBeVisible();
  await expect(fullName).toBeHidden();

  await page.setViewportSize({ width: 440, height: 900 });
  await expect(icon).toBeVisible();
  await expect(fullName).toBeVisible();
  await expect(abbreviation).toBeHidden();
  await expect
    .poll(() =>
      label.evaluate(element => element.scrollWidth <= element.clientWidth),
    )
    .toBe(true);

  await matrix.getByRole("button", { name: "Coverage", exact: true }).click();
  await expect(icon).toBeVisible();
  await expect(fullName).toBeVisible();
});
