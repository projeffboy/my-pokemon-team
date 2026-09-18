import { parseTeamText, serializeTeamText } from "@/app/shared/team-text";
import { fromBase64Url, toBase64Url } from "@/app/shared/base64url";
import {
  encodeTeamForUrl,
  importTeamFromUrlParam,
  MAX_ENCODED_TEAM_PARAM_LENGTH,
} from "@/app/shared/team-link";
import { autorun } from "mobx";
import { createTeam } from "./shared/team";
import { test, expect } from "./fixtures";

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

  test("parses independently of the current team without notifying observers", ({ store }) => {
    store.replaceTeam(parseTeamText(reuniclusText));
    const originalTeam = store.team;
    const snapshots: string[] = [];
    const dispose = autorun(() => { snapshots.push(encodeTeamForUrl()); });
    try {
      const team = parseTeamText("Eelektross\n- Thunderbolt");
      expect(team).toEqual(createTeam({
        name: "eelektross", ability: "Levitate", move1: "thunderbolt",
      }));
      team[0].move1 = "";
      expect(parseTeamText("Eelektross\n- Thunderbolt")[0].move1).toBe("thunderbolt");
      expect(store.team).toBe(originalTeam);
      expect(serializeTeamText()).toBe(`${reuniclusText}\n\n`);
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
      const team = parseTeamText(`${header} @ Leftovers\nAbility: Regenerator\n- Psychic`);
      expect(team[0]).toMatchObject({
        name: "reuniclus", item: "leftovers", ability: "Regenerator", move1: "psychic",
      });
    });
  }

  test("accepts bracketed Hidden Power and inherited moves", () => {
    const team = parseTeamText("Roserade\n- Hidden Power [Fire]\n- Sleep Powder\n- Water Sport");
    expect(team[0]).toMatchObject({
      name: "roserade", move1: "hiddenpowerfire", move2: "sleeppowder", move3: "watersport",
    });
  });

  test("ignores unknown properties and moves the species cannot learn", () => {
    const team = parseTeamText(`Reuniclus @ Imaginary Item
Ability: Imaginary Ability
EVs: 252 HP / 252 SpA / 4 SpD
Modest Nature
- Imaginary Move
- Spore
- Psychic
-`);
    expect(team[0]).toEqual({
      name: "reuniclus", item: "", ability: "", move1: "", move2: "", move3: "psychic", move4: "",
    });
  });

  test("chooses the only available ability when the supplied ability is invalid", () => {
    const team = parseTeamText("Cryogonal\nAbility: Imaginary Ability\n- Ice Beam");
    expect(team[0].ability).toBe("Levitate");
  });

  test("defaults invalid items only for their own slot and leaves omitted items blank", () => {
    const team = parseTeamText(`Ampharos-Mega @ Leftovers

Altaria-Mega @ Imaginary Item

Ampharos-Mega`);
    expect(team).toEqual(createTeam(
      { name: "ampharosmega", item: "leftovers", ability: "Mold Breaker" },
      { name: "altariamega", item: "altarianite", ability: "Pixilate" },
      { name: "ampharosmega", ability: "Mold Breaker" },
    ));
  });

  test("ignores invalid species while preserving subsequent slot positions", () => {
    const team = parseTeamText("Not a Pokemon\n- Tackle\n\nAromatisse\n- Moonblast");
    expect(team.map(pokemon => pokemon.name)).toEqual(["", "aromatisse", "", "", "", ""]);
    expect(team[1].move1).toBe("moonblast");
  });

  test("limits each Pokemon to four moves", () => {
    const team = parseTeamText(`${reuniclusText}\n- Energy Ball`);
    expect([team[0].move1, team[0].move2, team[0].move3, team[0].move4]).toEqual(["psychic", "recover", "shadowball", "focusblast"]);
    expect(team[0]).not.toHaveProperty("move5");
  });

  test("limits a team to six Pokemon", () => {
    const names = [
      "Arbok", "Sunflora", "Lumineon", "Chimecho", "Beheeyem", "Komala", "Dhelmise",
    ];
    const team = parseTeamText(names.join("\n\n"));
    expect(team.map(pokemon => pokemon.name)).toEqual([
      "arbok", "sunflora", "lumineon", "chimecho", "beheeyem", "komala",
    ]);
  });

  test("clears every property of slots left over from a longer team", ({ store }) => {
    store.replaceTeam(parseTeamText(`${reuniclusText}\n\nCryogonal @ Leftovers\n- Ice Beam`));
    const emptySlot = { ...store.team[5] };
    store.replaceTeam(parseTeamText(reuniclusText));
    expect(store.team.slice(1)).toEqual(Array(5).fill(emptySlot));

    store.replaceTeam(parseTeamText(""));
    expect(store.team).toEqual(Array(6).fill(emptySlot));
    expect(serializeTeamText()).toBe("");
  });

  test("replacement clears omitted moves, items, abilities, and invalid species", ({ store }) => {
    store.replaceTeam(parseTeamText(`${reuniclusText}\n\n${reuniclusText}`));
    store.replaceTeam(parseTeamText("Reuniclus\n- Psychic\n\nNot a Pokemon\n- Tackle"));
    expect(store.team).toEqual(createTeam({ name: "reuniclus", move1: "psychic" }));
  });

  for (const source of ["text", "URL"] as const) {
    test(`${source} replacement publishes one complete URL update and keeps nested edits reactive`, ({ store }) => {
      store.replaceTeam(parseTeamText(reuniclusText));
      const snapshots: string[] = [];
      const dispose = autorun(() => { snapshots.push(encodeTeamForUrl()); });
      const text = [
        ["Eelektross", "Levitate"],
        ["Delcatty", "Normalize"],
        ["Ledian", "Swarm"],
        ["Swalot", "Liquid Ooze"],
        ["Spinda", "Own Tempo"],
        ["Maractus", "Water Absorb"],
      ].map(([name, ability]) => `${name} @ Leftovers\nAbility: ${ability}\n- Protect\n-\n-\n-\n\n`).join("");
      try {
        if (source === "text") {
          store.replaceTeam(parseTeamText(text));
        } else {
          importTeamFromUrlParam(toBase64Url(text));
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

  test("serializes canonical Showdown text and restores all team properties", ({ store }) => {
    store.replaceTeam(parseTeamText(`${reuniclusText}\n\nCryogonal @ Leftovers\n- Ice Beam`));
    const expectedTeam = store.team.map(pokemon => ({ ...pokemon }));
    const serialized = serializeTeamText();
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
    const param = encodeTeamForUrl();
    expect(fromBase64Url(param)).toBe(`${reuniclusText}\n\n`);

    store.replaceTeam(parseTeamText(""));
    importTeamFromUrlParam(param);
    expect(store.team).toEqual(expectedTeam);
  });

  for (const [description, param] of [
    ["empty", ""],
    ["malformed", "%not-base64%"],
    ["truncated", "A"],
    ["invalid UTF-8", "_w"],
    ["oversized", toBase64Url("Komala".padEnd(MAX_ENCODED_TEAM_PARAM_LENGTH, " "))],
  ]) {
    test(`ignores ${description} URL parameters without changing the team`, ({ store }) => {
      store.replaceTeam(parseTeamText(reuniclusText));
      const expectedTeam = store.team.map(pokemon => ({ ...pokemon }));
      expect(() => importTeamFromUrlParam(param)).not.toThrow();
      expect(store.team).toEqual(expectedTeam);
    });
  }

  test("accepts a parameter at the size limit and rejects it just above", ({ store }) => {
    const text = "Komala".padEnd(MAX_ENCODED_TEAM_PARAM_LENGTH * 3 / 4, " ");
    const param = toBase64Url(text);
    expect(param).toHaveLength(MAX_ENCODED_TEAM_PARAM_LENGTH);
    importTeamFromUrlParam(param);
    expect(store.team[0].name).toBe("komala");

    store.replaceTeam(parseTeamText(reuniclusText));
    const oversizedParam = toBase64Url(text + " ");
    expect(oversizedParam.length).toBeGreaterThan(MAX_ENCODED_TEAM_PARAM_LENGTH);
    expect(fromBase64Url(oversizedParam).trim()).toBe("Komala");
    importTeamFromUrlParam(oversizedParam);
    expect(store.team[0].name).toBe("reuniclus");
  });
});
