import { test, expect } from "@playwright/test";
import {
  parseTeamsText,
  parseTeamText,
  serializeTeam,
  serializeTeams,
} from "@/app/shared/team-text";
import { createSavedTeam } from "@/shared/team";
import { createTeam } from "./shared/team";

const fullSet = `Chompy (Garchomp) (F) @ Choice Scarf
Ability: Rough Skin
Level: 50
Shiny: Yes
Tera Type: Steel
EVs: 4 HP / 252 Atk / 252 Spe
Jolly Nature
IVs: 0 SpA
- Earthquake
- Outrage
- Stone Edge
- Fire Fang

`;

test.describe("set details in Showdown text", () => {
  test("parses every detail and serializes it back unchanged", () => {
    const team = parseTeamText(fullSet);
    expect(team[0]).toEqual({
      name: "garchomp",
      item: "choicescarf",
      ability: "Rough Skin",
      move1: "earthquake",
      move2: "outrage",
      move3: "stoneedge",
      move4: "firefang",
      nickname: "Chompy",
      gender: "F",
      level: 50,
      shiny: true,
      teraType: "Steel",
      evs: { hp: 4, atk: 252, spe: 252 },
      nature: "jolly",
      ivs: { spa: 0 },
    });
    expect(serializeTeam(team)).toBe(fullSet);
  });

  test("leaves out details at their defaults", () => {
    const team = parseTeamText(
      "Garchomp (M)\nLevel: 100\nShiny: No\nEVs: 0 HP\nIVs: 31 Spe\n- Earthquake",
    );
    expect(team[0]).toEqual({
      ...createTeam({ name: "garchomp", move1: "earthquake" })[0],
      gender: "M",
    });
    expect(serializeTeam(team)).toBe(
      "Garchomp (M) @ \nAbility: \n- Earthquake\n-\n-\n-\n\n",
    );
  });

  test("clamps stats and levels, and drops unknown natures and tera types", () => {
    const team = parseTeamText(
      "Garchomp\nLevel: 0\nTera Type: Cosmic\nEVs: 300 Atk / 10 Luck\nIVs: 40 Spe / -1 Atk\nImaginary Nature",
    );
    expect(team[0]).toEqual(
      createTeam({
        name: "garchomp",
        evs: { atk: 252 },
        ivs: { atk: 0 },
      })[0],
    );
  });

  test("takes the nickname from either name order", () => {
    expect(parseTeamText("Jelly (Reuniclus)")[0].nickname).toBe("Jelly");
    expect(parseTeamText("Reuniclus (Jelly)")[0].nickname).toBe("Jelly");
    expect(parseTeamText("Reuniclus")[0].nickname).toBeUndefined();
  });

  test("accepts blank lines with spaces between pokemon", () => {
    const team = parseTeamText("Garchomp\n- Earthquake\n  \nKingdra\n- Surf");
    expect(team[1]).toMatchObject({ name: "kingdra", move1: "surf" });
  });
});

test.describe("several teams in one text", () => {
  test("splits a Showdown backup on its headers", () => {
    const teams = parseTeamsText(`=== [gen8ou] Folder/Rain ===

Kingdra @ Choice Specs
Ability: Swift Swim
- Surf

=== [gen9doublesou] Sun ===

Torkoal @ Heat Rock
Ability: Drought
- Eruption

=== [gen9championsregmc] Champions ===

Garchomp
`);
    expect(teams).toHaveLength(3);
    expect(teams[0]).toMatchObject({
      name: "Rain",
      generation: 8,
      format: "OU: Over Used",
    });
    expect(teams[0].team[0]).toMatchObject({ name: "kingdra", move1: "surf" });
    expect(teams[1]).toMatchObject({
      name: "Sun",
      generation: 9,
      format: "Doubles OU",
    });
    expect(teams[2]).toMatchObject({
      name: "Champions",
      generation: 9,
      format: "Pokemon Champions (M-C)",
    });
  });

  test("treats text without headers as one team, and skips empty teams", () => {
    const teams = parseTeamsText("Kingdra\n- Surf");
    expect(teams).toHaveLength(1);
    expect(teams[0]).toMatchObject({ name: "", generation: 9, format: "" });
    expect(teams[0].team[0].name).toBe("kingdra");

    const withEmpty = parseTeamsText(
      "=== [gen9ou] Empty ===\n\n=== [gen9uu] Full ===\n\nKingdra\n",
    );
    expect(withEmpty.map(({ name }) => name)).toEqual(["Full"]);
    expect(parseTeamsText("")).toHaveLength(1);
  });

  test("serializes every saved team under a header", () => {
    const text = serializeTeams([
      createSavedTeam({
        name: "Rain",
        generation: 8,
        format: "OU: Over Used",
        team: createTeam({ name: "kingdra", move1: "surf" }),
      }),
      createSavedTeam({ team: createTeam({ name: "torkoal" }) }),
    ]);
    expect(text).toBe(
      "=== [gen8ou] Rain ===\n\nKingdra @ \nAbility: \n- Surf\n-\n-\n-\n\n=== [gen9] Team ===\n\nTorkoal @ \nAbility: \n-\n-\n-\n-\n\n",
    );
    expect(parseTeamsText(text)).toHaveLength(2);
    expect(parseTeamsText(text)[1]).toMatchObject({
      name: "Team",
      generation: 9,
      format: "",
    });
  });
});
