import { test, expect } from "fixtures";
import { toBase64Url } from "@/app/shared/base64url";
import { getTeamTextFromUrl } from "helper";

test.describe("Save/Load Team: Share Link - Integration Tests", () => {
  test("loads a team from the URL parameter on initial page load", async ({
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

  test("loads a CAP pokemon that the dropdown does not offer", async ({
    page,
  }) => {
    await page.goto(`/?team=${toBase64Url("Voodoom\n- Dark Pulse")}`);

    await expect(
      page.getByRole("combobox", { name: "Pokemon 1's name" }),
    ).toHaveValue("Voodoom");
    await expect(
      page.getByRole("combobox", { name: "Pokemon 1's move1" }),
    ).toHaveValue("Dark Pulse");
    expect(getTeamTextFromUrl(page)).toContain("Voodoom");

    const name = page.getByRole("combobox", { name: "Pokemon 1's name" });
    await name.click({ force: true });
    await name.fill("Voodoll");
    await expect(page.getByText("Nothing found")).toBeVisible();
    await name.fill("Houndoo");
    await expect(
      page.getByRole("option", { name: "Houndoom", exact: true }),
    ).toBeVisible();
  });
});
