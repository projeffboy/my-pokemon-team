import { test, expect } from "fixtures";
import { toBase64Url } from "@/base64url";
import { getTeamTextFromUrl } from "helper";

test.describe("Save/Load Team: Share Link - Integration Tests", () => {
  test("loads a team from the URL param on initial page load", async ({
    page,
  }) => {
    const teamText = `Tyranitar
Ability: Sand Stream
- Crunch
- Stone Edge
- Ice Punch
- Earthquake`;

    await page.goto(`/?team=${toBase64Url(teamText)}`);

    const pokemonName = page.getByRole("combobox", {
      name: "Pokemon 1's name",
    });
    await expect(pokemonName).toHaveValue("Tyranitar");

    const pokemonAbility = page.getByRole("combobox", {
      name: "Pokemon 1's ability",
    });
    await expect(pokemonAbility).toHaveValue("Sand Stream");

    await expect(page).toHaveURL(/[?&]team=/);
    expect(getTeamTextFromUrl(page)).toContain("Tyranitar");
    expect(getTeamTextFromUrl(page)).toContain("Ability: Sand Stream");
    expect(getTeamTextFromUrl(page)).toContain("- Crunch");
  });
});
