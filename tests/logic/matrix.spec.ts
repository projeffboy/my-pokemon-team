import { test, expect } from "@playwright/test";
import {
  coverageMatrix,
  defenceMatrix,
  formatMultiplier,
} from "@/store/matrix";
import { createTeam } from "./shared/team";
import { calculateTypeCoverage } from "@/store/coverage";

test("formats multipliers like a type chart", () => {
  expect([4, 3, 2, 1.5, 1, 0.5, 0.25, 0].map(formatMultiplier)).toEqual([
    "×4",
    "×3",
    "×2",
    "×1.5",
    "",
    "½",
    "¼",
    "0",
  ]);
});

test("the defence matrix explains each slot's multiplier, including abilities and items", () => {
  const matrix = defenceMatrix(
    createTeam(
      { name: "bronzong", ability: "Levitate" },
      { name: "aggronmega", ability: "Filter" },
      { name: "heatran", item: "airballoon" },
    ),
  );
  expect(matrix.Ground?.[0]).toEqual({
    multiplier: 0,
    reason: "Ground does 0x to Bronzong (Steel/Psychic) with Levitate",
  });
  expect(matrix.Fire?.[0]).toEqual({
    multiplier: 2,
    reason: "Fire does 2x to Bronzong (Steel/Psychic)",
  });
  expect(matrix.Fighting?.[1]).toEqual({
    multiplier: 1.5,
    reason: "Fighting does 1.5x to Aggron-Mega (Steel) with Filter",
  });
  expect(matrix.Ground?.[2]).toEqual({
    multiplier: 0,
    reason: "Ground does 0x to Heatran (Fire/Steel) with Air Balloon",
  });
  expect(matrix.Water?.[2]?.multiplier).toBe(2);
  expect(matrix.Water?.[3]).toBeNull();
});

test("the coverage matrix picks each slot's best damaging move against a type", () => {
  const matrix = coverageMatrix(
    createTeam(
      { name: "excadrill", move1: "earthquake", move2: "ironhead" },
      { name: "hawlucha", move1: "flyingpress" },
      { name: "chansey", move1: "toxic" },
    ),
  );
  expect(matrix.Steel?.[0]).toEqual({
    multiplier: 2,
    reason: "Excadrill's Earthquake (Ground) does 2x to Steel",
  });
  expect(matrix.Flying?.[0]?.multiplier).toBe(1);
  expect(matrix.Fairy?.[0]).toEqual({
    multiplier: 2,
    reason: "Excadrill's Iron Head (Steel) does 2x to Fairy",
  });
  expect(matrix.Grass?.[1]).toEqual({
    multiplier: 2,
    reason: "Hawlucha's Flying Press (Fighting/Flying) does 2x to Grass",
  });
  expect(matrix.Ghost?.[1]?.multiplier).toBe(0);
  expect(matrix.Ice?.[1]?.multiplier).toBe(2);
  expect(matrix.Electric?.[1]?.multiplier).toBe(0.5);
  expect(matrix.Normal?.[2]).toEqual({
    multiplier: 1,
    reason: "Chansey has no damaging move",
  });
  expect(matrix.Normal?.[3]).toBeNull();
});

test("Scrappy lets Exploud's Normal and Fighting moves hit Ghost neutrally", () => {
  for (const move of ["headbutt", "lowkick"]) {
    const team = createTeam({
      name: "exploud",
      ability: "Soundproof",
      move1: move,
    });
    expect(coverageMatrix(team).Ghost?.[0]?.multiplier).toBe(0);
    team[0].ability = "Scrappy";
    expect(coverageMatrix(team).Ghost?.[0]?.multiplier).toBe(1);
  }
});

test("Scrappy also removes the Fighting immunity from Flying Press", () => {
  expect(
    coverageMatrix(
      createTeam({
        name: "hawlucha",
        ability: "Scrappy",
        move1: "flyingpress",
      }),
    ).Ghost?.[0]?.multiplier,
  ).toBe(1);
});
test("held items ground, remove type immunities, and respect Klutz", () => {
  const team = createTeam(
    { name: "bronzong", ability: "Levitate", item: "ironball" },
    { name: "gengar", ability: "Cursed Body", item: "ringtarget" },
    { name: "lopunny", ability: "Klutz", item: "airballoon" },
    { name: "charizard", item: "ironball" },
    { name: "swoobat", ability: "Klutz", item: "ironball" },
  );
  const matrix = defenceMatrix(team);
  expect(matrix.Ground?.map(cell => cell?.multiplier)).toEqual([
    2,
    2,
    1,
    1,
    0,
    undefined,
  ]);
  expect(matrix.Normal?.[1]?.multiplier).toBe(1);
  expect(matrix.Ground?.[0]?.reason).toContain("Iron Ball");
  expect(matrix.Normal?.[1]?.reason).toContain("Ring Target");
  expect(defenceMatrix(team, undefined, 4).Ground?.[3]?.multiplier).toBe(2);
  team[1].ability = "Levitate";
  expect(defenceMatrix(team).Ground?.[1]?.multiplier).toBe(0);
  team[1].ability = "Klutz";
  expect(defenceMatrix(team).Normal?.[1]?.multiplier).toBe(0);
});

test("the actual plate, drive, and memory determine attack types and STAB", () => {
  const team = createTeam(
    {
      name: "arceus",
      ability: "Multitype",
      item: "flameplate",
      move1: "judgment",
    },
    {
      name: "genesect",
      ability: "Download",
      item: "dousedrive",
      move1: "technoblast",
    },
    {
      name: "silvally",
      ability: "RKS System",
      item: "grassmemory",
      move1: "multiattack",
    },
  );
  const matrix = coverageMatrix(team);
  expect(matrix.Grass?.[0]).toMatchObject({
    multiplier: 2,
    reason: expect.stringContaining("Judgment (Fire)"),
  });
  expect(matrix.Fire?.[1]?.reason).toContain("Techno Blast (Water)");
  expect(matrix.Water?.[2]?.reason).toContain("Multi-Attack (Grass)");
  expect(calculateTypeCoverage(createTeam(team[0])).Grass).toBe(2);
  expect(calculateTypeCoverage(createTeam(team[2])).Water).toBe(2);
  team[0].item = "";
  expect(coverageMatrix(team).Ghost?.[0]?.multiplier).toBe(0);
  expect(calculateTypeCoverage(team).Grass).toBe(0);
  team[0].item = "firiumz";
  expect(coverageMatrix(team, undefined, 7).Ghost?.[0]?.multiplier).toBe(0);
  expect(defenceMatrix(team, undefined, 7).Water?.[0]?.reason).toContain(
    "(Fire)",
  );
});

test("strong item-powered moves count, while failed and weak ones do not", () => {
  const team = createTeam(
    { name: "snorlax", item: "liechiberry", move1: "naturalgift" },
    { name: "muk", item: "ironball", move1: "fling" },
    { name: "lopunny", ability: "Klutz", item: "ironball", move1: "fling" },
  );
  expect(coverageMatrix(team).Water?.[0]?.reason).toContain(
    "Natural Gift (Grass)",
  );
  expect(coverageMatrix(team).Psychic?.[1]?.multiplier).toBe(2);
  expect(coverageMatrix(team).Psychic?.[2]?.reason).toContain(
    "no damaging move",
  );
  expect(calculateTypeCoverage(team).Water).toBe(1);
  team[0].item = "";
  team[1].item = "oranberry";
  expect(coverageMatrix(team).Water?.[0]?.reason).toContain("no damaging move");
  expect(coverageMatrix(team).Psychic?.[1]?.reason).toContain(
    "no damaging move",
  );
});

test("Fling excludes items that the holder cannot give up", () => {
  const arceus = createTeam({
    name: "arceus",
    ability: "Multitype",
    item: "ironball",
    move1: "fling",
  });
  expect(coverageMatrix(arceus, undefined, 4).Psychic?.[0]?.reason).toContain(
    "no damaging move",
  );
  expect(coverageMatrix(arceus, undefined, 5).Psychic?.[0]?.multiplier).toBe(2);
  for (const [name, item] of [
    ["arceusfire", "flameplate"],
    ["silvallyfire", "firememory"],
    ["absol", "absolite"],
    ["ogerponhearthflame", "hearthflamemask"],
    ["muk", "firiumz"],
  ]) {
    const team = createTeam({ name, item, move1: "fling" });
    expect(coverageMatrix(team).Psychic?.[0]?.reason).toContain(
      "no damaging move",
    );
    expect(calculateTypeCoverage(team).Psychic).toBe(0);
  }
  const giratina = createTeam({
    name: "giratina",
    item: "griseousorb",
    move1: "fling",
  });
  expect(coverageMatrix(giratina, undefined, 8).Psychic?.[0]?.reason).toContain(
    "no damaging move",
  );
  expect(coverageMatrix(giratina, undefined, 9).Psychic?.[0]?.multiplier).toBe(
    2,
  );
  const muk = createTeam({ name: "muk", item: "griseousorb", move1: "fling" });
  expect(coverageMatrix(muk, undefined, 4).Psychic?.[0]?.reason).toContain(
    "no damaging move",
  );
  expect(coverageMatrix(muk, undefined, 5).Psychic?.[0]?.multiplier).toBe(2);
  muk[0].item = "absolite";
  expect(coverageMatrix(muk).Psychic?.[0]?.multiplier).toBe(2);
});

test("delayed attacks before Gen 5 are typeless rather than immune or resisted", () => {
  const xatu = createTeam({ name: "xatu", move1: "futuresight" });
  expect(coverageMatrix(xatu, undefined, 2).Dark?.[0]).toMatchObject({
    multiplier: 1,
    reason: expect.stringContaining("(???)"),
  });
  expect(calculateTypeCoverage(xatu, 2).Fighting).toBe(0);
  expect(coverageMatrix(xatu, undefined, 5).Dark?.[0]?.multiplier).toBe(0);
  const jirachi = createTeam({ name: "jirachi", move1: "doomdesire" });
  expect(coverageMatrix(jirachi, undefined, 3).Fire?.[0]?.multiplier).toBe(1);
  expect(coverageMatrix(jirachi, undefined, 5).Fire?.[0]?.multiplier).toBe(0.5);
});
