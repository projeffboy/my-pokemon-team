import { test, expect } from "@playwright/test";
import {
  LEGACY_LINK_PARSING_OPTIONS,
  parseTeamsText,
  parseTeamText,
  serializeTeam,
  serializeTeams,
} from "@/store/team-text";
import { createSavedTeam } from "@/shared/team";
import { createTeam } from "./shared/team";
import { LEGENDS_ARCEUS, LEGENDS_ZA, LETS_GO } from "@/shared/generation-rules";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import type { Generation } from "@/types";

const fullSet = `Chompy (Garchomp) (F) @ Choice Scarf
Ability: Rough Skin
Level: 50
Shiny: Yes
Happiness: 0
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
  test("auto-selected abilities follow the imported generation and game", () => {
    expect(parseTeamText("Gengar", 4)[0].ability).toBe("Levitate");
    expect(parseTeamText("Gengar\nAbility: Unknown", 4)[0].ability).toBe(
      "Levitate",
    );
    expect(parseTeamText("Gengar", 9)[0].ability).toBe("Cursed Body");
    expect(parseTeamText("Gengar", 2)[0].ability).toBe("");
    expect(parseTeamText("Gengar", 8, LEGENDS_ARCEUS)[0].ability).toBe("");
    expect(parseTeamText("Gengar", 7, LETS_GO)[0].ability).toBe("");
    expect(
      parseTeamsText("=== [gen4ou] Ghosts ===\n\nGengar")[0]?.team[0]?.ability,
    ).toBe("Levitate");
  });

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
      happiness: 0,
      teraType: "Steel",
      evs: { hp: 4, atk: 252, spe: 252 },
      nature: "jolly",
      ivs: { spa: 0 },
    });
    expect(serializeTeam(team)).toBe(fullSet);
  });

  test("leaves out details at their defaults", () => {
    const team = parseTeamText(
      "Garchomp (M)\nLevel: 100\nShiny: No\nHappiness: 255\nEVs: 0 HP\nIVs: 31 Spe\n- Earthquake",
    );
    expect(team[0]).toEqual({
      ...createTeam({ name: "garchomp", move1: "earthquake" })[0],
      gender: "M",
    });
    expect(serializeTeam(team)).toBe(
      "Garchomp (M)\nAbility: No Ability\n- Earthquake\n-\n-\n-\n\n",
    );
  });

  test("a set without an item leaves out the @, as Showdown does", () => {
    const [member] = createTeam({
      name: "pikachu",
      nickname: "Sparky",
      gender: "F",
      move1: "thunderbolt",
    });
    const text = serializeTeam([member]);
    expect(text.split("\n")[0]).toBe("Sparky (Pikachu) (F)");
    expect(parseTeamText(text)[0]).toEqual(member);
    // Text and links made before keep reading the same
    for (const line of ["Pikachu", "Pikachu (F)", "Sparky (Pikachu) (F)"]) {
      const set = "\nAbility: Static\n- Thunderbolt";
      expect(parseTeamText(`${line} @ ${set}`), line).toEqual(
        parseTeamText(`${line}${set}`),
      );
    }
  });

  test("a nickname holding an @ round-trips without an item", () => {
    // [nickname, gender, first line]. " @ " in the name keeps a bare "@ ", which
    // Showdown would otherwise read as the item separator
    const cases = [
      ["Mew@x", undefined, "Mew@x (Pikachu)"],
      ["a@b", undefined, "a@b (Pikachu)"],
      ["Mew @ x", undefined, "Mew @ x (Pikachu) @ "],
      ["Mew @ x", "F", "Mew @ x (Pikachu) (F) @ "],
      ["Mr. @ (Mime)", undefined, "Mr. @ (Mime) (Pikachu) @ "],
      ["Eevee @ home", undefined, "Eevee @ home (Pikachu) @ "],
      // Its " @ " appears only once the species follows it
      ["Mew @", undefined, "Mew @ (Pikachu) @ "],
    ] as const;
    for (const [nickname, gender, line] of cases) {
      const [member] = createTeam({
        name: "pikachu",
        nickname,
        ...(gender && { gender }),
        ability: "Static",
        move1: "thunderbolt",
      });
      const text = serializeTeam([member]);
      expect(text.split("\n")[0], nickname).toBe(line);
      expect(parseTeamText(text)[0], nickname).toEqual(member);
      expect(
        parseTeamText(text, 9, "", LEGACY_LINK_PARSING_OPTIONS)[0],
        nickname,
      ).toEqual(member);
    }
  });

  test("clamps stats and levels, and drops unknown natures and tera types", () => {
    const team = parseTeamText(
      "Garchomp\nLevel: 0\nTera Type: Cosmic\nEVs: 300 Atk / 10 Luck\nIVs: 40 Spe / -1 Atk\nImaginary Nature",
    );
    expect(team[0]).toEqual(
      createTeam({
        name: "garchomp",
        evs: { atk: 255 },
        ivs: { atk: 0 },
      })[0],
    );
  });

  test("takes the nickname from either name order", () => {
    expect(parseTeamText("Jelly (Reuniclus)")[0].nickname).toBe("Jelly");
    expect(parseTeamText("Reuniclus (Jelly)")[0].nickname).toBe("Jelly");
    expect(parseTeamText("Reuniclus")[0].nickname).toBeUndefined();
  });

  test("happiness follows the selected game without dropping the rest of the set", () => {
    const text = "Cleffa\nHappiness: 70\nLevel: 5\n- Charm";
    expect(parseTeamText(text, 2)[0].happiness).toBe(70);
    expect(parseTeamText(text, 1)[0]).toMatchObject({
      level: 5,
      move1: "charm",
    });
    expect(parseTeamText(text, 1)[0].happiness).toBeUndefined();
    expect(
      parseTeamsText(`=== [gen9championsregmc] Champions ===\n\n${text}`)[0]
        ?.team[0]?.happiness,
    ).toBeUndefined();
    expect(
      parseTeamsText(`=== [gen2] Gold ===\n\n${text}`)[0]?.team[0]?.happiness,
    ).toBe(70);
  });

  test("Champions and Legends: Arceus leave out the IVs they have no fields for", () => {
    const farigiraf = `Farigiraf @ Electric Seed
Ability: Armor Tail
EVs: 252 HP / 4 Def / 252 SpD
Relaxed Nature
IVs: 0 Atk / 0 Spe
- Trick Room`;
    const [champions] = parseTeamText(farigiraf, 9, CHAMPIONS_FORMAT);
    expect(champions).toMatchObject({
      name: "farigiraf",
      nature: "relaxed",
      evs: { hp: 252, def: 4, spd: 252 },
    });
    expect(champions.ivs).toBeUndefined();
    expect(serializeTeam([champions], 9, CHAMPIONS_FORMAT)).not.toContain(
      "IVs:",
    );
    expect(
      parseTeamText("Stantler\nIVs: 0 Atk", 8, LEGENDS_ARCEUS)[0].ivs,
    ).toBeUndefined();
    expect(parseTeamText(farigiraf)[0].ivs).toEqual({ atk: 0, spe: 0 });
    // Links made before this keep loading the details they carry
    expect(
      parseTeamText(
        farigiraf,
        9,
        CHAMPIONS_FORMAT,
        LEGACY_LINK_PARSING_OPTIONS,
      )[0].ivs,
    ).toEqual({ atk: 0, spe: 0 });
  });

  test("other details follow the selected game like happiness", () => {
    const text = `Pikachu (F) @ Light Ball
Shiny: Yes
Tera Type: Electric
EVs: 252 SpA
Timid Nature
- Thunderbolt`;
    const parse = (generation: Generation, format = "") =>
      parseTeamText(text, generation, format)[0];
    expect(parse(9)).toMatchObject({
      gender: "F",
      shiny: true,
      teraType: "Electric",
      evs: { spa: 252 },
      nature: "timid",
    });
    expect(parse(9, CHAMPIONS_FORMAT).teraType).toBeUndefined();
    expect(parse(9, LEGENDS_ZA).teraType).toBeUndefined();
    expect(parse(8)).toMatchObject({ gender: "F", shiny: true });
    expect(parse(8).teraType).toBeUndefined();
    expect(parse(8, LEGENDS_ARCEUS).evs).toBeUndefined();
    expect(parse(7, LETS_GO).evs).toEqual({ spa: 252 });
    expect(parse(2)).toMatchObject({ gender: "F", shiny: true });
    expect(parse(2).nature).toBeUndefined();
    const gen1 = parse(1);
    expect(gen1).toMatchObject({ name: "pikachu", move1: "thunderbolt" });
    expect([gen1.gender, gen1.shiny, gen1.teraType, gen1.nature]).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });

  test("ignores malformed happiness and retains both endpoints", () => {
    for (const value of ["", "-1", "256", "1.5", "NaN", "Infinity", "bad"])
      expect(
        parseTeamText(`Cleffa\nHappiness: ${value}`)[0].happiness,
      ).toBeUndefined();
    expect(parseTeamText("Cleffa\nHappiness: 0")[0].happiness).toBe(0);
    expect(parseTeamText("Cleffa\nHappiness: 254")[0].happiness).toBe(254);
    expect(
      parseTeamText("Cleffa\nHappiness: 255")[0].happiness,
    ).toBeUndefined();
  });

  test("a nickname that is also a pokemon survives the round trip", () => {
    const [member] = parseTeamText("Mew (Mewtwo) @ Life Orb");
    expect(member).toMatchObject({ name: "mewtwo", nickname: "Mew" });
    expect(serializeTeam([member])).toContain("Mew (Mewtwo) @ Life Orb");
  });

  test("a nickname may hold parentheses and an at sign", () => {
    for (const nickname of ["Big (Boss)", "a@b", "(^_^)", "Mr. @ (Mime)"]) {
      const [member] = parseTeamText("Excadrill @ Choice Scarf");
      member.nickname = nickname;
      const [parsed] = parseTeamText(serializeTeam([member]));
      expect(parsed, nickname).toMatchObject({
        name: "excadrill",
        item: "choicescarf",
        nickname,
      });
    }
    // Without an item, and as pasted text with several @
    expect(parseTeamText("a@b (Excadrill)")[0]).toMatchObject({
      name: "excadrill",
      nickname: "a@b",
      item: "",
    });
    expect(parseTeamText("Excadrill@Leftovers @ junk")[0]).toMatchObject({
      name: "excadrill",
      item: "leftovers",
    });
  });

  test("an at sign after a pokemon name in a nickname is not read as an item", () => {
    // Showdown leaves out " @ " when a set has no item
    const [member] = parseTeamText(
      "Mew@x (Pikachu)\nAbility: Static\n- Thunderbolt",
    );
    expect(member).toMatchObject({
      name: "pikachu",
      nickname: "Mew@x",
      item: "",
      ability: "Static",
      move1: "thunderbolt",
    });
    expect(parseTeamText("Mew@x (Pikachu) (F)")[0]).toMatchObject({
      name: "pikachu",
      nickname: "Mew@x",
      gender: "F",
      item: "",
    });
  });

  test("first lines with an item or no nickname parse as before", () => {
    // [line, name, nickname, gender, item]
    const cases = [
      ["Pikachu", "pikachu", undefined, undefined, ""],
      ["Pikachu @ Light Ball", "pikachu", undefined, undefined, "lightball"],
      ["Pikachu (M) @ Light Ball", "pikachu", undefined, "M", "lightball"],
      [
        "Sparky (Pikachu) (F) @ Light Ball",
        "pikachu",
        "Sparky",
        "F",
        "lightball",
      ],
      [
        "Mew@x (Pikachu) @ Light Ball",
        "pikachu",
        "Mew@x",
        undefined,
        "lightball",
      ],
      ["Pikachu (Mew)@Leftovers", "mew", "Pikachu", undefined, "leftovers"],
      ["Pikachu@Light Ball", "pikachu", undefined, undefined, "lightball"],
      ["Pikachu (M)@Light Ball", "pikachu", undefined, "M", "lightball"],
      // Showdown reads " @ " as the item separator even in a nickname
      ["Mew @ x (Pikachu)", "mew", undefined, undefined, ""],
    ];
    for (const [line = "", name, nickname, gender, item] of cases) {
      const [member] = parseTeamText(line);
      expect(
        {
          name: member.name,
          nickname: member.nickname,
          gender: member.gender,
          item: member.item,
        },
        line,
      ).toEqual({ name, nickname, gender, item });
    }
  });

  test("a nickname still being typed is written without its outer spaces", () => {
    const [member] = parseTeamText("Porygon-Z");
    member.nickname = "Big Bird ";
    expect(serializeTeam([member])).toContain("Big Bird (Porygon-Z)");
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

=== [gen8championsregmc] Folder / Champions ===

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

  test("keeps named empty backup teams without importing empty or invalid text", () => {
    const teams = parseTeamsText("Kingdra\n- Surf");
    expect(teams).toHaveLength(1);
    expect(teams[0]).toMatchObject({ name: "", generation: 9, format: "" });
    expect(teams[0].team[0].name).toBe("kingdra");

    const withEmpty = parseTeamsText(
      "=== [gen9ou] Empty ===\n\n=== [gen9uu] Full ===\n\nKingdra\n",
    );
    expect(withEmpty.map(({ name }) => name)).toEqual(["Empty", "Full"]);
    expect(withEmpty[0]).toMatchObject({
      generation: 9,
      format: "OU: Over Used",
      team: createTeam(),
    });
    expect(parseTeamsText("=== [gen9] Invalid ===\n\nPikablu")).toEqual([]);
    expect(parseTeamsText("=== [gen9] ===\n\n")).toEqual([]);
    expect(parseTeamsText("")).toEqual([]);
    expect(parseTeamsText("Not a pokemon @ Leftovers")).toEqual([]);
  });

  test("reads headers with leading or trailing spaces", () => {
    const teams = parseTeamsText(
      "  === [gen8ou] A ===\n\nGarchomp\n\n\t=== [gen9uu] B ===  \n\nKingdra\n",
    );
    expect(
      teams.map(({ name, generation, format, team }) => [
        name,
        generation,
        format,
        team[0].name,
      ]),
    ).toEqual([
      ["A", 8, "OU: Over Used", "garchomp"],
      ["B", 9, "UU: Under Used", "kingdra"],
    ]);
  });

  test("splits a Showdown box of more than six pokemon into teams of six", () => {
    const box = [
      "Bulbasaur",
      "Charmander",
      "Squirtle",
      "Pikachu",
      "Eevee",
      "Snorlax",
      "Lapras",
      "Ditto",
      "Mew",
      "Chikorita",
      "Cyndaquil",
      "Totodile",
      "Togepi",
      "Mareep",
    ];
    const teams = parseTeamsText(
      `=== [gen9ou-box] Box 1 ===\n\n${box.map(name => `${name}\n- Tackle`).join("\n\n")}\n\n=== [gen9uu] Sun ===\n\nTorkoal\n`,
    );
    expect(
      teams.map(({ name, format, team }) => [
        name,
        format,
        team.map(({ name }) => name).filter(Boolean),
      ]),
    ).toEqual([
      ["Box 1", "OU: Over Used", box.slice(0, 6).map(n => n.toLowerCase())],
      [
        "Box 1 (2)",
        "OU: Over Used",
        box.slice(6, 12).map(n => n.toLowerCase()),
      ],
      ["Box 1 (3)", "OU: Over Used", box.slice(12).map(n => n.toLowerCase())],
      ["Sun", "UU: Under Used", ["torkoal"]],
    ]);
    expect(parseTeamsText(box.join("\n\n"))).toHaveLength(3);
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
      "=== [gen8ou] Rain ===\n\nKingdra\nAbility: No Ability\n- Surf\n-\n-\n-\n\n=== [gen9] Team ===\n\nTorkoal\nAbility: No Ability\n-\n-\n-\n-\n\n",
    );
    expect(parseTeamsText(text)).toHaveLength(2);
    expect(parseTeamsText(text)[1]).toMatchObject({
      name: "Team",
      generation: 9,
      format: "",
    });
  });
});
test("app backup names preserve slashes without changing external folder imports", () => {
  for (const name of [
    "Rain / OU",
    "mypokemonteam:Rain / OU",
    "雨 / OU %2F",
    "Rain / \ud800",
  ]) {
    const text = serializeTeams([
      createSavedTeam({ name, team: createTeam({ name: "kingdra" }) }),
    ]);
    expect(parseTeamsText(text)[0]?.name).toBe(name);
  }
  expect(
    parseTeamsText("=== [gen8ou] Folder/Rain ===\n\nKingdra")[0]?.name,
  ).toBe("Rain");
  expect(
    parseTeamsText(
      "=== [gen9vgc2025regh] VGC/Kyogre / Groudon ===\n\nKyogre",
    )[0]?.name,
  ).toBe("Kyogre / Groudon");
  expect(
    parseTeamsText("=== [gen8ou] Ladder/Rain/Sand ===\n\nKingdra")[0]?.name,
  ).toBe("Rain/Sand");
  expect(
    parseTeamsText("=== [gen8ou] mypokemonteam:Rain%20OU ===\n\nKingdra")[0]
      ?.name,
  ).toBe("mypokemonteam:Rain%20OU");
  expect(
    parseTeamsText("=== [gen8ou] mypokemonteam:%invalid ===\n\nKingdra")[0]
      ?.name,
  ).toBe("mypokemonteam:%invalid");
  const text = serializeTeams([
    createSavedTeam({ name: "Empty" }),
    createSavedTeam({
      name: "Rain / OU",
      team: createTeam({ name: "kingdra" }),
    }),
    createSavedTeam({ name: "Sun", team: createTeam({ name: "torkoal" }) }),
  ]);
  expect(text).toMatch(
    /^Kingdra\n# mypokemonteam backup: preserve team names\n/m,
  );
  expect(
    parseTeamsText(text).map(({ name, team }) => [name, team[0].name]),
  ).toEqual([
    ["Empty", ""],
    ["Rain / OU", "kingdra"],
    ["Sun", "torkoal"],
  ]);
});

test("Export All restores a backup containing only named empty teams", () => {
  const original = [
    createSavedTeam({
      name: "Next season",
      generation: 2,
      format: "OU: Over Used",
    }),
    createSavedTeam({ name: "Testing", generation: 8, format: "Doubles OU" }),
  ];
  expect(parseTeamsText(serializeTeams(original))).toEqual(
    original.map(({ name, generation, format, team }) => ({
      name,
      generation,
      format,
      team,
    })),
  );
  expect(parseTeamsText("\n\n")).toEqual([]);
  expect(
    parseTeamsText(
      "=== [gen8ou] Empty ===\n\n# mypokemonteam backup: preserve team names\n",
    ),
  ).toHaveLength(1);
});

test("legacy Showdown backups without a generation retain Gen 6 tier rules", () => {
  expect(
    parseTeamsText("=== [ou] Old OU ===\n\nGyarados\n- Waterfall\n")[0],
  ).toMatchObject({ name: "Old OU", generation: 6, format: "OU: Over Used" });
});

test("empty backup names preserve slashes while populated external folders still unwrap", () => {
  const original = [
    createSavedTeam({ name: "Rain / OU", generation: 8 }),
    createSavedTeam({
      name: "Folder/Draft",
      generation: 2,
      format: "OU: Over Used",
    }),
  ];
  expect(
    parseTeamsText(serializeTeams(original)).map(({ name }) => name),
  ).toEqual(original.map(({ name }) => name));
  const mixed = parseTeamsText(
    "=== [gen8ou] Folder/Draft ===\n\n=== [gen8ou] Folder/Rain ===\n\nKingdra",
  );
  expect(mixed.map(({ name }) => name)).toEqual(["Folder/Draft", "Rain"]);
  expect(
    parseTeamsText(
      serializeTeams([
        ...original,
        createSavedTeam({
          name: "Populated",
          team: createTeam({ name: "torkoal" }),
        }),
      ]),
    ).map(({ name }) => name),
  ).toEqual(["Rain / OU", "Folder/Draft", "Populated"]);
});
