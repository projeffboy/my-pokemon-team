import { test, expect } from "@playwright/test";
import {
  isMoveStrongEnough,
  moveAgainstType,
  moveType,
  typeAgainstPokemon,
} from "@/store/shared/effectiveness";
import { coverageMatrix, defenceMatrix } from "@/store/matrix";
import { calculateTypeCoverage } from "@/store/coverage";
import { createTeam } from "./shared/team";

const moveCases = [
  ["return", "Dragon", "feraligatrmega", "Dragonize", 2],
  ["return", "Ghost", "feraligatrmega", "Dragonize", 1],
  ["bloodmoon", "Ghost", "ursalunabloodmoon", "Mind's Eye", 1],
  ["focusblast", "Ghost", "ursalunabloodmoon", "Mind's Eye", 1],
  ["shadowball", "Normal", "ursalunabloodmoon", "Mind's Eye", 0],
  ["thousandarrows", "Flying", "zygarde", "Aura Break", 1],
  ["earthquake", "Flying", "zygarde", "Aura Break", 0],
  ["thousandarrows", "Flying", "zygarde", "Normalize", 1],
  ["freezedry", "Water", "cryogonal", "Normalize", 1],
  ["freezedry", "Ghost", "cryogonal", "Normalize", 0],
  ["flyingpress", "Ghost", "hawlucha", "Normalize", 0],
  ["flyingpress", "Rock", "hawlucha", "Normalize", 0.25],
  ["flyingpress", "Normal", "hawlucha", "Normalize", 1],
  ["flyingpress", "Grass", "hawlucha", "Normalize", 2],
  ["revelationdance", "Grass", "oricorio", "Dancer", 2],
  ["revelationdance", "Fighting", "oricoriopau", "Dancer", 2],
  ["revelationdance", "Psychic", "oricoriosensu", "Dancer", 2],
  ["aurawheel", "Ghost", "morpekohangry", "Hunger Switch", 2],
  ["aurawheel", "Water", "morpeko", "Hunger Switch", 2],
  ["ragingbull", "Steel", "taurospaldeacombat", "Intimidate", 2],
  ["ragingbull", "Grass", "taurospaldeablaze", "Intimidate", 2],
  ["ragingbull", "Fire", "taurospaldeaaqua", "Intimidate", 2],
  ["ragingbull", "Ghost", "tauros", "Intimidate", 0],
] as const;
for (const [move, target, pokemon, ability, multiplier] of moveCases) {
  test(`${pokemon}'s ${move} with ${ability} hits ${target} for ${multiplier}x`, () => {
    expect(
      coverageMatrix(createTeam({ name: pokemon, ability, move1: move }))[
        target
      ]?.[0]?.multiplier,
    ).toBe(multiplier);
  });
}

const typeCases = [
  ["hiddenpowerice", "delcatty", "Normalize", "Ice"],
  ["judgment", "arceuspoison", "Normalize", "Poison"],
  ["judgment", "arceus", "Aerilate", "Normal"],
  ["multiattack", "silvallyghost", "Normalize", "Ghost"],
  ["technoblast", "genesectdouse", "Normalize", "Water"],
  ["technoblast", "genesect", "Pixilate", "Normal"],
  ["revelationdance", "oricoriosensu", "Normalize", "Ghost"],
  ["weatherball", "delcatty", "Pixilate", "Normal"],
  ["terrainpulse", "delcatty", "Pixilate", "Normal"],
] as const;
for (const [move, pokemon, ability, type] of typeCases) {
  test(`${ability} respects ${move}'s special type`, () => {
    expect(moveType(move, pokemon, ability)).toBe(type);
  });
}

test("Air Balloon's immunity and Dry Skin's Fire penalty use accurate matrix multipliers", () => {
  const matrix = defenceMatrix(
    createTeam(
      { name: "heatran", item: "airballoon" },
      { name: "toxicroak", ability: "Dry Skin" },
      { name: "parasect", ability: "Dry Skin" },
    ),
  );
  expect(matrix.Ground?.[0]?.multiplier).toBe(0);
  expect(matrix.Fire?.[1]?.multiplier).toBe(1.25);
  expect(matrix.Fire?.[2]?.multiplier).toBe(5);
  expect(matrix.Water?.[1]?.multiplier).toBe(0);
});

test("Klutz prevents held items from changing defensive immunities", () => {
  expect(typeAgainstPokemon("Ground", "swoobat", "Klutz", "ironball")).toBe(3);
  expect(typeAgainstPokemon("Ghost", "lopunny", "Klutz", "ringtarget")).toBe(3);
  expect(typeAgainstPokemon("Ground", "lopunny", "Klutz", "airballoon")).toBe(
    0,
  );
  expect(
    defenceMatrix(
      createTeam({ name: "swoobat", ability: "Klutz", item: "ironball" }),
    ).Ground?.[0]?.reason,
  ).toBe("Ground does 0x to Swoobat (Psychic/Flying)");
});

test("Klutz prevents Natural Gift from providing damaging berry coverage", () => {
  const team = createTeam({
    name: "lopunny",
    ability: "Klutz",
    item: "cheriberry",
    move1: "naturalgift",
  });
  expect(calculateTypeCoverage(team, 4).Grass).toBe(0);
  expect(coverageMatrix(team, undefined, 4).Grass?.[0]?.reason).toBe(
    "Lopunny has no damaging move",
  );
  team[0].ability = "Cute Charm";
  expect(calculateTypeCoverage(team, 4).Grass).toBe(1);
});

test("Klutz leaves item-dependent attack types Normal while other attacks retain their type", () => {
  for (const [move, item] of [
    ["judgment", "dracoplate"],
    ["technoblast", "chilldrive"],
    ["multiattack", "ghostmemory"],
  ]) {
    expect(moveType(move, "smeargle", "Klutz", 7, "", item)).toBe("Normal");
  }
  expect(moveType("icebeam", "lopunny", "Klutz", 7, "", "cheriberry")).toBe(
    "Ice",
  );
});

test("Thick Fat preserves an eighth-damage resistance in the defence matrix", () => {
  const matrix = defenceMatrix(
    createTeam(
      { name: "walrein", ability: "Thick Fat" },
      { name: "dewgong", ability: "Thick Fat" },
    ),
  );
  expect(matrix.Ice?.[0]?.multiplier).toBe(0.125);
  expect(matrix.Ice?.[1]?.multiplier).toBe(0.125);
  expect(matrix.Fire?.[0]?.multiplier).toBe(0.5);
});

test("special moves keep their coverage when ordinary moves of the same type precede them", () => {
  const team = createTeam({
    name: "oricoriosensu",
    ability: "Dancer",
    move1: "shadowball",
    move2: "revelationdance",
  });
  expect(calculateTypeCoverage(team).Psychic).toBe(2);
  expect(moveAgainstType("freezedry", "Water", "cryogonal", "Normalize")).toBe(
    0,
  );
});

test("Normalize's Hidden Power exception starts in generation 7", () => {
  expect(moveType("hiddenpowerice", "delcatty", "Normalize", 6)).toBe("Normal");
  expect(moveType("hiddenpowerice", "delcatty", "Normalize", 7)).toBe("Ice");
  expect(moveType("notamove", "delcatty", "Normalize")).toBeUndefined();
});

test("coverage uses the damaging move's power in its generation", () => {
  expect(isMoveStrongEnough("leechlife", 6)).toBeFalsy();
  expect(isMoveStrongEnough("leechlife", 7)).toBe(true);
  expect(isMoveStrongEnough("rapidspin", 7)).toBeFalsy();
  expect(isMoveStrongEnough("rapidspin", 8)).toBe(true);
  expect(isMoveStrongEnough("bubble", 5)).toBeFalsy();
  expect(isMoveStrongEnough("bubble", 6)).toBe(true);
  expect(isMoveStrongEnough("rocksmash", 3)).toBeFalsy();
  expect(isMoveStrongEnough("rocksmash", 4)).toBe(true);
  const team = createTeam({ name: "parasect", move1: "leechlife" });
  expect(calculateTypeCoverage(team, 6).Psychic).toBe(0);
  expect(calculateTypeCoverage(team, 7).Psychic).toBe(2);
  expect(coverageMatrix(team, undefined, 6).Psychic?.[0]?.reason).toBe(
    "Parasect has no damaging move",
  );
  expect(coverageMatrix(team, undefined, 7).Psychic?.[0]?.multiplier).toBe(2);
  expect(
    moveAgainstType("leechlife", "Psychic", "parasect", "", 6),
  ).toBeUndefined();
});

test("Flying Press explains its converted Normal/Flying type", () => {
  expect(
    coverageMatrix(
      createTeam({
        name: "hawlucha",
        ability: "Normalize",
        move1: "flyingpress",
      }),
    ).Rock?.[0]?.reason,
  ).toBe("Hawlucha's Flying Press (Normal/Flying) does 0.25x to Rock");
});
