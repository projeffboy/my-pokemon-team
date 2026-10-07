import { test, expect } from "fixtures";
import { toBase64Url } from "@/app/shared/base64url";
import {
  clickMenuItem,
  getTeamTextFromUrl,
  openTeamTools,
  selectPokemon,
} from "helper";
import type { Page } from "@playwright/test";
import type { StoredState } from "@/store/teams-storage";

const savedState = (page: Page) =>
  page.evaluate(
    () =>
      JSON.parse(
        localStorage.getItem("mypokemonteam") ?? "null",
      ) as StoredState | null,
  );

test.describe("Share Link - Integration Tests", () => {
  test("fresh visits default to Champions and explicit regular Gen 9 links retain their game", async ({
    page,
  }) => {
    // This sequence loads the app six times in addition to the fixture's first visit.
    test.slow();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const generation = page.getByRole("combobox", { name: "Generation" });
    await expect(generation).toContainText("Champions");
    await expect(page).toHaveURL(/game=Pokemon\+Champions/);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(generation).toContainText("Champions");
    await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });
    await expect(generation).toContainText(/SV|Scarlet/);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(generation).toContainText(/SV|Scarlet/);
    await page.goto(`/?team=${toBase64Url("Lucario\n- Aura Sphere")}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Lucario");
    await expect(generation).toContainText(/SV|Scarlet/);
    await expect(page).not.toHaveURL(/game=/);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(generation).toContainText("Champions");
  });
  test("an empty game-specific link preserves its profile through reload", async ({
    page,
  }) => {
    await page.goto("/?gen=8&game=Legends%3A%20Arceus");
    const generation = page.getByRole("combobox", { name: "Generation" });
    await expect(generation).toContainText(/Arceus|PLA/);
    await page.reload();
    await expect(generation).toContainText(/Arceus|PLA/);
    await selectPokemon(page, "Turtwig");
    await expect(
      page.getByLabel("Pokemon 1's item", { exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByLabel("Pokemon 1's ability", { exact: true }),
    ).toHaveCount(0);
  });
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

test.describe("Share Link - Navigation", () => {
  test("loads the team of the URL that back/forward navigation lands on", async ({
    page,
  }) => {
    await page.goto(`/?team=${toBase64Url("Skeledirge\n- Torch Song")}`);
    const pokemonName = page.getByRole("combobox", {
      name: "Pokemon 1's name",
    });
    await expect(pokemonName).toHaveValue("Skeledirge");

    // The app only ever replaces history entries, so create a second one by hand
    await page.evaluate(
      teamParameter => history.pushState(null, "", `/?team=${teamParameter}`),
      toBase64Url("Meowscarada\n- Flower Trick"),
    );
    await expect(pokemonName).toHaveValue("Skeledirge");

    await page.goBack();
    await expect(pokemonName).toHaveValue("Skeledirge");
    await page.goForward();
    await expect(pokemonName).toHaveValue("Meowscarada");
    await page.goBack();
    await expect(pokemonName).toHaveValue("Skeledirge");
  });
});

test.describe("Teams across tabs and links", () => {
  test("a plain new tab starts a distinct team without switching the first tab", async ({
    page,
    context,
  }) => {
    await selectPokemon(page, "Gogoat");
    await expect
      .poll(() => savedState(page))
      .toMatchObject({
        teams: [{ team: [{ name: "gogoat" }, {}, {}, {}, {}, {}] }],
      });
    const firstId = (await savedState(page))?.currentTeamId;
    const other = await context.newPage();
    await other.goto("/");
    await expect(other.getByLabel("Pokemon 1's name")).toHaveValue("");
    await selectPokemon(other, "Florges");
    await expect
      .poll(async () => (await savedState(other))?.teams.length)
      .toBe(2);
    const secondId = (await savedState(other))?.currentTeamId;
    expect(secondId).not.toBe(firstId);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Gogoat");
    await expect
      .poll(async () =>
        (await savedState(page))?.teams.map(team => team.team[0]?.name).sort(),
      )
      .toEqual(["florges", "gogoat"]);
  });

  test("the same team URL opens the same saved team and synchronizes edits", async ({
    page,
    context,
  }) => {
    await selectPokemon(page, "Brambleghast");
    await expect
      .poll(async () => (await savedState(page))?.teams[0]?.team[0]?.name)
      .toBe("brambleghast");
    const originalId = (await savedState(page))?.currentTeamId;
    const other = await context.newPage();
    await other.goto(page.url());
    await expect(other.getByLabel("Pokemon 1's name")).toHaveValue(
      "Brambleghast",
    );
    await selectPokemon(other, "Toedscruel");
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Toedscruel");
    await expect
      .poll(async () => (await savedState(other))?.teams.length)
      .toBe(1);
    expect((await savedState(other))?.currentTeamId).toBe(originalId);
  });

  test("a matching URL reopens the selected saved copy", async ({
    page,
    context,
  }) => {
    await selectPokemon(page, "Tropius");
    await openTeamTools(page);
    await page.getByRole("button", { name: "Teams", exact: true }).click();
    await page
      .getByRole("button", { name: "Options for Team 1", exact: true })
      .click();
    await clickMenuItem(page, "Duplicate");
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect
      .poll(async () => (await savedState(page))?.teams.length)
      .toBe(2);
    const copyId = (await savedState(page))?.currentTeamId;
    const other = await context.newPage();
    await other.goto(page.url());
    await expect(other.getByLabel("Pokemon 1's name")).toHaveValue("Tropius");
    await selectPokemon(other, "Castform");
    await expect
      .poll(async () =>
        (await savedState(other))?.teams.map(team => team.team[0]?.name),
      )
      .toEqual(["tropius", "castform"]);
    expect((await savedState(other))?.currentTeamId).toBe(copyId);
  });

  test("an unfamiliar URL stays unsaved through reloads and other tabs' edits", async ({
    page,
    context,
  }) => {
    await selectPokemon(page, "Greedent");
    await expect
      .poll(async () => (await savedState(page))?.teams[0]?.team[0]?.name)
      .toBe("greedent");
    const other = await context.newPage();
    await other.goto(`/?team=${toBase64Url("Copperajah\n- Heavy Slam")}`);
    await expect(other.getByLabel("Pokemon 1's name")).toHaveValue(
      "Copperajah",
    );
    await other.reload();
    await expect(other.getByLabel("Pokemon 1's name")).toHaveValue(
      "Copperajah",
    );
    await selectPokemon(page, "Dubwool");
    await expect
      .poll(async () => (await savedState(other))?.teams[0]?.team[0]?.name)
      .toBe("dubwool");
    await expect(other.getByLabel("Pokemon 1's name")).toHaveValue(
      "Copperajah",
    );
    expect((await savedState(other))?.teams).toHaveLength(1);
    await selectPokemon(other, "Cufant");
    await expect
      .poll(async () =>
        (await savedState(other))?.teams.map(team => team.team[0]?.name).sort(),
      )
      .toEqual(["cufant", "dubwool"]);
  });

  test("changing the current tab's URL opens a draft without overwriting its saved team", async ({
    page,
  }) => {
    await selectPokemon(page, "Falinks");
    await expect
      .poll(async () => (await savedState(page))?.teams[0]?.team[0]?.name)
      .toBe("falinks");
    await page.goto(`/?team=${toBase64Url("Cursola\n- Shadow Ball")}`);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Cursola");
    expect((await savedState(page))?.teams).toHaveLength(1);
    await page.evaluate(() => {
      history.pushState(null, "", "/");
      dispatchEvent(new PopStateEvent("popstate"));
    });
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
    await page.goBack();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Cursola");
    expect((await savedState(page))?.teams[0]?.team[0]?.name).toBe("falinks");
    await selectPokemon(page, "Polteageist");
    await expect
      .poll(async () => (await savedState(page))?.teams.length)
      .toBe(2);
  });
});
