import { applyTeamText, serializeTeamText } from "@/app/shared/team-text";
import { fromBase64Url, toBase64Url } from "@/app/shared/base64url";
import {
  encodeTeamForUrl,
  importTeamFromUrlParam,
  MAX_ENCODED_TEAM_PARAM_LENGTH,
} from "@/app/shared/team-link";
import { test, expect } from "./fixtures";

const reuniclusText = `Reuniclus @ Life Orb
Ability: Magic Guard
- Psychic
- Recover
- Shadow Ball
- Focus Blast`;

test.describe("Showdown team text", () => {
  test("parses names, an item, an ability, and four moves", ({ store }) => {
    applyTeamText(reuniclusText);
    expect(store.team[0]).toEqual({
      name: "reuniclus",
      item: "lifeorb",
      ability: "Magic Guard",
      move1: "psychic",
      move2: "recover",
      move3: "shadowball",
      move4: "focusblast",
    });
    expect(store.team.slice(1).every(pokemon => !pokemon.name)).toBe(true);
  });

  for (const header of [
    "Reuniclus (Jelly)",
    "Jelly (Reuniclus)",
    "Reuniclus (M)",
    "Jelly (Reuniclus) (F)",
  ]) {
    test(`accepts ${header}`, ({ store }) => {
      applyTeamText(`${header} @ Leftovers\nAbility: Regenerator\n- Psychic`);
      expect(store.team[0]).toMatchObject({
        name: "reuniclus", item: "leftovers", ability: "Regenerator", move1: "psychic",
      });
    });
  }

  test("accepts bracketed Hidden Power and inherited moves", ({ store }) => {
    applyTeamText("Roserade\n- Hidden Power [Fire]\n- Sleep Powder\n- Water Sport");
    expect(store.team[0]).toMatchObject({
      name: "roserade", move1: "hiddenpowerfire", move2: "sleeppowder", move3: "watersport",
    });
  });

  test("ignores unknown properties and moves the species cannot learn", ({ store }) => {
    applyTeamText(`Reuniclus @ Imaginary Item
Ability: Imaginary Ability
EVs: 252 HP / 252 SpA / 4 SpD
Modest Nature
- Imaginary Move
- Spore
- Psychic
-`);
    expect(store.team[0]).toEqual({
      name: "reuniclus", item: "", ability: "", move1: "", move2: "", move3: "psychic", move4: "",
    });
  });

  test("chooses the only available ability when the supplied ability is invalid", ({ store }) => {
    applyTeamText("Cryogonal\nAbility: Imaginary Ability\n- Ice Beam");
    expect(store.team[0].ability).toBe("Levitate");
  });

  test("ignores invalid species while preserving subsequent slot positions", ({ store }) => {
    applyTeamText("Not a Pokemon\n- Tackle\n\nAromatisse\n- Moonblast");
    expect(store.teamPokemon).toEqual(["", "aromatisse", "", "", "", ""]);
    expect(store.team[1].move1).toBe("moonblast");
  });

  test("limits each Pokemon to four moves", ({ store }) => {
    applyTeamText(`${reuniclusText}\n- Energy Ball`);
    expect(store.teamFourMoveslots[0]).toEqual(["psychic", "recover", "shadowball", "focusblast"]);
    expect(store.team[0]).not.toHaveProperty("move5");
  });

  test("limits a team to six Pokemon", ({ store }) => {
    const names = [
      "Arbok", "Sunflora", "Lumineon", "Chimecho", "Beheeyem", "Komala", "Dhelmise",
    ];
    applyTeamText(names.join("\n\n"));
    expect(store.teamPokemon).toEqual([
      "arbok", "sunflora", "lumineon", "chimecho", "beheeyem", "komala",
    ]);
  });

  test("clears every property of slots left over from a longer team", ({ store }) => {
    applyTeamText(`${reuniclusText}\n\nCryogonal @ Leftovers\n- Ice Beam`);
    const emptySlot = { ...store.team[5] };
    applyTeamText(reuniclusText);
    expect(store.team.slice(1)).toEqual(Array(5).fill(emptySlot));

    applyTeamText("");
    expect(store.team).toEqual(Array(6).fill(emptySlot));
    expect(serializeTeamText()).toBe("");
  });

  test("serializes canonical Showdown text and restores all team properties", ({ store }) => {
    applyTeamText(`${reuniclusText}\n\nCryogonal @ Leftovers\n- Ice Beam`);
    const expectedTeam = store.team.map(pokemon => ({ ...pokemon }));
    const serialized = serializeTeamText();
    expect(serialized).toBe(
      `${reuniclusText}\n\nCryogonal @ Leftovers\nAbility: Levitate\n- Ice Beam\n-\n-\n-\n\n`,
    );

    applyTeamText("");
    applyTeamText(serialized);
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
    applyTeamText(reuniclusText);
    const expectedTeam = store.team.map(pokemon => ({ ...pokemon }));
    const param = encodeTeamForUrl();
    expect(fromBase64Url(param)).toBe(`${reuniclusText}\n\n`);

    applyTeamText("");
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
      applyTeamText(reuniclusText);
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

    applyTeamText(reuniclusText);
    const oversizedParam = toBase64Url(text + " ");
    expect(oversizedParam.length).toBeGreaterThan(MAX_ENCODED_TEAM_PARAM_LENGTH);
    expect(fromBase64Url(oversizedParam).trim()).toBe("Komala");
    importTeamFromUrlParam(oversizedParam);
    expect(store.team[0].name).toBe("reuniclus");
  });
});
