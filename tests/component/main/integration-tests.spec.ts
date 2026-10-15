import { test, expect } from "fixtures";
import { getTeamTextFromUrl, openAnalysis } from "helper";

test("one Randomize team click gives a team of six and its analysis", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Randomize team", exact: true })
    .click();
  await expect
    .poll(() => getTeamTextFromUrl(page).split("\n\n").filter(Boolean))
    .toHaveLength(6);

  // An empty team scores every type 0
  await openAnalysis(page, "Team Defence");
  await expect(
    page
      .getByRole("region", { name: "Team Defence" })
      .getByLabel(/ score: [+-]\d/)
      .first(),
  ).toBeVisible();
});
