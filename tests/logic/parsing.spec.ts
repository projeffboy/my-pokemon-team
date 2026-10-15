import { parseTeamText, serializeTeam } from "@/store/team-text";
import { learnsetsReady } from "@/store/learnsets";
import { fromBase64Url, toBase64Url } from "@/app/shared/base64url";
import {
  encodeTeamForUrl,
  importTeamFromUrlParameter,
  MAX_ENCODED_TEAM_PARAMETER_LENGTH,
} from "@/app/shared/team-link";
import { autorun } from "mobx";
import { createTeam } from "./shared/team";
import { test, expect } from "./fixtures";
import { hiddenPowerType } from "@/shared/hidden-power";
import { dvGender, getDv, isShinyDv } from "@/shared/generation-rules";

const reuniclusText = `Reuniclus @ Life Orb
Ability: Magic Guard
- Psychic
- Recover
- Shadow Ball
- Focus Blast`;

test.describe("Showdown team text", () => {
  test("returns six independent empty slots for empty text", () => {
    const team = parseTeamText("");
    expect(team).toEqual(createTeam());
    team[0].name = "eelektross";
    expect(team.slice(1)).toEqual(createTeam().slice(1));
    expect(parseTeamText("")).toEqual(createTeam());
  });

  test("parses independently of the current team without notifying observers", ({
    store,
  }) => {
    store.replaceTeam(parseTeamText(reuniclusText));
    const originalTeam = store.team;
    const snapshots: string[] = [];
    const dispose = autorun(() => {
      snapshots.push(encodeTeamForUrl());
    });
    try {
      const team = parseTeamText("Eelektross\n- Thunderbolt");
      expect(team).toEqual(
        createTeam({
          name: "eelektross",
          ability: "Levitate",
          move1: "thunderbolt",
        }),
      );
      team[0].move1 = "";
      expect(parseTeamText("Eelektross\n- Thunderbolt")[0].move1).toBe(
        "thunderbolt",
      );
      expect(store.team).toBe(originalTeam);
      expect(serializeTeam(store.team)).toBe(`${reuniclusText}\n\n`);
      expect(snapshots).toHaveLength(1);
    } finally {
      dispose();
    }
  });

  test("parses names, an item, an ability, and four moves", () => {
    const team = parseTeamText(reuniclusText);
    expect(team[0]).toEqual({
      name: "reuniclus",
      item: "lifeorb",
      ability: "Magic Guard",
      move1: "psychic",
      move2: "recover",
      move3: "shadowball",
      move4: "focusblast",
    });
    expect(team.slice(1).every(pokemon => !pokemon.name)).toBe(true);
  });

  for (const header of [
    "Reuniclus (Jelly)",
    "Jelly (Reuniclus)",
    "Reuniclus (M)",
    "Jelly (Reuniclus) (F)",
  ]) {
    test(`accepts ${header}`, () => {
      const team = parseTeamText(
        `${header} @ Leftovers\nAbility: Regenerator\n- Psychic`,
      );
      expect(team[0]).toMatchObject({
        name: "reuniclus",
        item: "leftovers",
        ability: "Regenerator",
        move1: "psychic",
      });
    });
  }

  test("accepts bracketed Hidden Power and inherited moves", () => {
    const team = parseTeamText(
      "Roserade\n- Hidden Power [Fire]\n- Sleep Powder\n- Water Sport",
    );
    expect(team[0]).toMatchObject({
      name: "roserade",
      move1: "hiddenpowerfire",
      move2: "sleeppowder",
      move3: "watersport",
    });
  });

  test("ignores unknown properties and moves the species cannot learn", () => {
    const team = parseTeamText(`Reuniclus @ Imaginary Item
Ability: Imaginary Ability
Imaginary Property: 0
Imaginary Nature
- Imaginary Move
- Spore
- Psychic
-`);
    expect(team[0]).toEqual({
      name: "reuniclus",
      item: "",
      ability: "",
      move1: "",
      move2: "",
      move3: "psychic",
      move4: "",
    });
  });

  test("chooses the only available ability when the supplied ability is invalid", () => {
    const team = parseTeamText(
      "Cryogonal\nAbility: Imaginary Ability\n- Ice Beam",
    );
    expect(team[0].ability).toBe("Levitate");
  });

  test("defaults invalid items only for their own slot and leaves omitted items blank", () => {
    const team = parseTeamText(`Ampharos-Mega @ Leftovers

Altaria-Mega @ Imaginary Item

Ampharos-Mega`);
    expect(team).toEqual(
      createTeam(
        { name: "ampharosmega", item: "leftovers", ability: "Mold Breaker" },
        { name: "altariamega", item: "altarianite", ability: "Pixilate" },
        { name: "ampharosmega", ability: "Mold Breaker" },
      ),
    );
  });

  test("ignores invalid species while preserving subsequent slot positions", () => {
    const team = parseTeamText(
      "Not a Pokemon\n- Tackle\n\nAromatisse\n- Moonblast",
    );
    expect(team.map(pokemon => pokemon.name)).toEqual([
      "",
      "aromatisse",
      "",
      "",
      "",
      "",
    ]);
    expect(team[1].move1).toBe("moonblast");
  });

  test("limits each Pokemon to four moves", () => {
    const team = parseTeamText(`${reuniclusText}\n- Energy Ball`);
    expect([
      team[0].move1,
      team[0].move2,
      team[0].move3,
      team[0].move4,
    ]).toEqual(["psychic", "recover", "shadowball", "focusblast"]);
    expect(team[0]).not.toHaveProperty("move5");
  });

  test("limits a team to six Pokemon", () => {
    const names = [
      "Arbok",
      "Sunflora",
      "Lumineon",
      "Chimecho",
      "Beheeyem",
      "Komala",
      "Dhelmise",
    ];
    const team = parseTeamText(names.join("\n\n"));
    expect(team.map(pokemon => pokemon.name)).toEqual([
      "arbok",
      "sunflora",
      "lumineon",
      "chimecho",
      "beheeyem",
      "komala",
    ]);
  });

  test("clears every property of slots left over from a longer team", ({
    store,
  }) => {
    store.replaceTeam(
      parseTeamText(`${reuniclusText}\n\nCryogonal @ Leftovers\n- Ice Beam`),
    );
    const emptySlot = { ...store.team[5] };
    store.replaceTeam(parseTeamText(reuniclusText));
    expect(store.team.slice(1)).toEqual(Array(5).fill(emptySlot));

    store.replaceTeam(parseTeamText(""));
    expect(store.team).toEqual(Array(6).fill(emptySlot));
    expect(serializeTeam(store.team)).toBe("");
  });

  test("replacement clears omitted moves, items, abilities, and invalid species", ({
    store,
  }) => {
    store.replaceTeam(parseTeamText(`${reuniclusText}\n\n${reuniclusText}`));
    store.replaceTeam(
      parseTeamText("Reuniclus\n- Psychic\n\nNot a Pokemon\n- Tackle"),
    );
    expect(store.team).toEqual(
      createTeam({ name: "reuniclus", move1: "psychic" }),
    );
  });

  for (const source of ["text", "URL"] as const) {
    test(`${source} replacement publishes one complete URL update and keeps nested edits reactive`, ({
      store,
    }) => {
      store.replaceTeam(parseTeamText(reuniclusText));
      const snapshots: string[] = [];
      const dispose = autorun(() => {
        snapshots.push(encodeTeamForUrl());
      });
      const text = [
        ["Eelektross", "Levitate"],
        ["Delcatty", "Normalize"],
        ["Ledian", "Swarm"],
        ["Swalot", "Liquid Ooze"],
        ["Spinda", "Own Tempo"],
        ["Maractus", "Water Absorb"],
      ]
        .map(
          ([name, ability]) =>
            `${name} @ Leftovers\nAbility: ${ability}\n- Protect\n-\n-\n-\n\n`,
        )
        .join("");
      try {
        if (source === "text") {
          store.replaceTeam(parseTeamText(text));
        } else {
          importTeamFromUrlParameter(toBase64Url(text));
        }
        expect(snapshots).toEqual([
          toBase64Url(`${reuniclusText}\n\n`),
          toBase64Url(text),
        ]);
        store.team[0].move1 = "";
        expect(snapshots).toHaveLength(3);
        expect(snapshots[2]).toBe(toBase64Url(text.replace("- Protect", "-")));
      } finally {
        dispose();
      }
    });
  }

  test("serializes canonical Showdown text and restores all team properties", ({
    store,
  }) => {
    store.replaceTeam(
      parseTeamText(`${reuniclusText}\n\nCryogonal @ Leftovers\n- Ice Beam`),
    );
    const expectedTeam = store.team.map(pokemon => ({ ...pokemon }));
    const serialized = serializeTeam(store.team);
    expect(serialized).toBe(
      `${reuniclusText}\n\nCryogonal @ Leftovers\nAbility: Levitate\n- Ice Beam\n-\n-\n-\n\n`,
    );

    store.replaceTeam(parseTeamText(""));
    store.replaceTeam(parseTeamText(serialized));
    expect(store.team).toEqual(expectedTeam);
  });
});

test.describe("team URL encoding", () => {
  test("round-trips UTF-8 through unpadded URL-safe base64", () => {
    const text = "Flabébé / Farfetch’d + 雪 ❄️";
    const encoded = toBase64Url(text);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(fromBase64Url(encoded)).toBe(text);
    expect(toBase64Url("f")).toBe("Zg");
    expect(fromBase64Url("Zg==")).toBe("f");
    expect(toBase64Url("")).toBe("");
    expect(fromBase64Url("")).toBe("");
  });

  for (const malformed of ["%not-base64%", "A", "_w"]) {
    test(`rejects malformed or non-UTF-8 base64: ${malformed}`, () => {
      expect(() => fromBase64Url(malformed)).toThrow();
    });
  }

  test("encodes and restores a team through the URL parameter", ({ store }) => {
    expect(encodeTeamForUrl()).toBe("");
    store.replaceTeam(parseTeamText(reuniclusText));
    const expectedTeam = store.team.map(pokemon => ({ ...pokemon }));
    const teamParameter = encodeTeamForUrl();
    expect(fromBase64Url(teamParameter)).toBe(`${reuniclusText}\n\n`);

    store.replaceTeam(parseTeamText(""));
    expect(importTeamFromUrlParameter(teamParameter)).toBe(true);
    expect(store.team).toEqual(expectedTeam);
  });

  for (const [description, teamParameter] of [
    ["empty", ""],
    ["malformed", "%not-base64%"],
    ["truncated", "A"],
    ["invalid UTF-8", "_w"],
    [
      "oversized",
      toBase64Url("Komala".padEnd(MAX_ENCODED_TEAM_PARAMETER_LENGTH, " ")),
    ],
    ["unknown pokemon", toBase64Url("Notamon\n- Tackle")],
  ]) {
    test(`ignores ${description} URL parameters without changing the team`, ({
      store,
    }) => {
      store.replaceTeam(parseTeamText(reuniclusText));
      const expectedTeam = store.team.map(pokemon => ({ ...pokemon }));
      expect(importTeamFromUrlParameter(teamParameter)).toBe(false);
      expect(store.team).toEqual(expectedTeam);
    });
  }

  test("accepts a parameter at the size limit and rejects it just above", ({
    store,
  }) => {
    const text = "Komala".padEnd(
      (MAX_ENCODED_TEAM_PARAMETER_LENGTH * 3) / 4,
      " ",
    );
    const teamParameter = toBase64Url(text);
    expect(teamParameter).toHaveLength(MAX_ENCODED_TEAM_PARAMETER_LENGTH);
    expect(importTeamFromUrlParameter(teamParameter)).toBe(true);
    expect(store.team[0].name).toBe("komala");

    store.replaceTeam(parseTeamText(reuniclusText));
    const oversizedParameter = toBase64Url(`${text} `);
    expect(oversizedParameter.length).toBeGreaterThan(
      MAX_ENCODED_TEAM_PARAMETER_LENGTH,
    );
    expect(fromBase64Url(oversizedParameter).trim()).toBe("Komala");
    expect(importTeamFromUrlParameter(oversizedParameter)).toBe(false);
    expect(store.team[0].name).toBe("reuniclus");
  });
});
test("omitted abilities and Hidden Power IVs use the imported generation", async ({
  store,
}) => {
  store.currentTeam.generation = 6;
  expect(parseTeamText("Gengar", 6)[0]?.ability).toBe("Levitate");
  expect(parseTeamText("Gengar", 2)[0]?.ability).toBe("");
  const imported = parseTeamText("Raikou\n- Hidden Power Ice", 6)[0];
  expect(imported?.move1).toBe("hiddenpowerice");
  expect(hiddenPowerType(imported, 6)).toBe("ice");
  const explicit = parseTeamText(
    "Raikou\nIVs: 31 HP / 31 Atk\n- Hidden Power Ice",
    6,
  )[0];
  expect(explicit.ivs).toBeUndefined();
  expect(hiddenPowerType(explicit, 6)).toBe("dark");
  expect(
    parseTeamText("Raikou\nIVs: 0 Atk\n- Hidden Power Ice", 6)[0]?.ivs,
  ).toEqual({ atk: 0 });
});

for (const details of [
  { name: "Gengar", shiny: true },
  { name: "Gengar (F)", gender: "F" },
  { name: "Gengar (F)", shiny: true, gender: "F" },
] as const) {
  test(`Gen 2 omitted Hidden Power DVs preserve ${JSON.stringify(details)}`, () => {
    const text = `${details.name}\n${"shiny" in details ? "Shiny: Yes\n" : ""}- Hidden Power Grass`;
    const member = parseTeamText(text, 2)[0];
    if (!member) throw new Error("Missing pokemon");
    expect(member.shiny ?? false).toBe("shiny" in details);
    expect(isShinyDv(member)).toBe("shiny" in details);
    if ("gender" in details) expect(member.gender).toBe(details.gender);
    if ("gender" in details) expect(dvGender(member)).toBe(details.gender);
    expect(getDv(member, "atk")).toBe("gender" in details ? 6 : 14);
    for (const stat of ["def", "spe", "spa"] as const)
      expect(getDv(member, stat)).toBe(
        "shiny" in details ? 10
        : stat === "def" ? 14
        : 15,
      );
    expect(hiddenPowerType(member, 2)).toBe("grass");
    expect(parseTeamText(serializeTeam([member]), 2)[0]).toEqual(member);
  });
}

test("incompatible Gen 2 Hidden Power constraints retain explicit imported details", () => {
  for (const text of [
    "Gengar\nShiny: Yes\n- Hidden Power Fire",
    "Chikorita (F)\nShiny: Yes\n- Hidden Power Grass",
  ]) {
    const member = parseTeamText(text, 2)[0];
    expect(member.shiny).toBe(true);
    if (text.includes("(F)")) expect(member.gender).toBe("F");
    expect(member.ivs).toBeUndefined();
  }
});

test("compatible omitted Gen 2 shiny DVs stay implicit", () => {
  const member = parseTeamText(
    "Gengar\nShiny: Yes\n- Hidden Power Dragon",
    2,
  )[0];
  expect(member.shiny).toBe(true);
  expect(member.ivs).toBeUndefined();
  expect(hiddenPowerType(member, 2)).toBe("dragon");
});

test("Gen 2 explicit IVs prevent Hidden Power inference from changing details", () => {
  for (const ivs of ["31 HP / 31 Atk", "13 Atk / 21 Def / 21 SpA / 21 Spe"]) {
    const member = parseTeamText(
      `Gengar (F)\nShiny: Yes\nIVs: ${ivs}\n- Hidden Power Grass`,
      2,
    )[0];
    expect(member.gender).toBe("F");
    expect(member.shiny).toBe(true);
    expect(member.ivs).toEqual(
      ivs.startsWith("31") ? undefined : { atk: 13, def: 21, spa: 21, spe: 21 },
    );
  }
});

test("canonical Showdown Gigantamax metadata selects an existing forme", async () => {
  await learnsetsReady;
  for (const [species, name] of [
    ["Charizard", "charizardgmax"],
    ["Urshifu-Rapid-Strike", "urshifurapidstrikegmax"],
  ]) {
    const team = parseTeamText(`${species}\nGigantamax: Yes`, 8);
    expect(team[0].name).toBe(name);
    expect(parseTeamText(serializeTeam(team), 8)[0].name).toBe(name);
  }
  expect(parseTeamText("Rotom\nGigantamax: Yes", 8)[0].name).toBe("rotom");
  expect(parseTeamText("Charizard\nGigantamax: No", 8)[0].name).toBe(
    "charizard",
  );
});

test("Frustration defaults happiness to zero without overriding explicit values", async () => {
  await learnsetsReady;
  const text = "Lopunny\nAbility: Cute Charm\n- Frustration";
  expect(parseTeamText(text, 7)[0].happiness).toBe(0);
  for (const happiness of [0, 70, 255]) {
    for (const input of [
      `Lopunny\nHappiness: ${happiness}\n- Frustration`,
      `${text}\nHappiness: ${happiness}`,
    ])
      expect(parseTeamText(input, 7)[0].happiness).toBe(
        happiness === 255 ? undefined : happiness,
      );
  }
  expect(parseTeamText("Lopunny\n- Return", 7)[0].happiness).toBeUndefined();
  expect(parseTeamText(text, 1)[0].happiness).toBeUndefined();
  const team = parseTeamText(text, 7);
  expect(parseTeamText(serializeTeam(team), 7)[0].happiness).toBe(0);
});

test("Showdown separator lines start another set without consuming a move slot", async () => {
  await learnsetsReady;
  for (const separator of ["\n---\n", "\n\n---\n\n", "\r\n --- \r\n"]) {
    const team = parseTeamText(
      `Pikachu\n- Thunderbolt${separator}Raichu\n- Surf`,
    );
    expect(team[0]).toMatchObject({
      name: "pikachu",
      move1: "thunderbolt",
      move2: "",
      move3: "",
    });
    expect(team[1]).toMatchObject({ name: "raichu", move1: "surf" });
  }
  expect(parseTeamText("Pikachu\n-\n- Thunderbolt")[0]).toMatchObject({
    move1: "",
    move2: "thunderbolt",
  });
});

test("legacy Showdown aliases and metadata case preserve set fields", async () => {
  await learnsetsReady;
  const team = parseTeamText(
    "Gyarados\nTrait: Moxie\nAdamant nature\n~ Waterfall\nMove: Earthquake",
  );
  expect(team[0]).toMatchObject({
    name: "gyarados",
    ability: "Moxie",
    nature: "adamant",
    move1: "waterfall",
    move2: "earthquake",
  });
  expect(
    parseTeamText("Gyarados\ntrait: Moxie\nAdamant NATURE\nmove: Waterfall")[0],
  ).toMatchObject({ ability: "Moxie", nature: "adamant", move1: "waterfall" });
});

test("old Frustration share links keep their original default happiness", ({
  store,
}) => {
  const text = "Lopunny\nAbility: Cute Charm\n- Frustration";
  importTeamFromUrlParameter(toBase64Url(text));
  expect(store.team[0].happiness).toBeUndefined();
  expect(parseTeamText(text, 7)[0].happiness).toBe(0);
  const exported = serializeTeam(store.team);
  expect(exported).toContain("Happiness: 255");
  expect(parseTeamText(exported, 7)[0].happiness).toBeUndefined();
  expect(serializeTeam(parseTeamText(exported, 7))).toBe(exported);
});
