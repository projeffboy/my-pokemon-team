import { test, expect } from "@playwright/test";
import pokedex from "@/data/pokedex";
import type { Generation, TeamPokemon } from "@/types";
import {
  LEGACY_LINK_PARSING_OPTIONS,
  parseTeamText,
  serializeTeam,
  teamTextProblems,
  type TeamTextProblem,
} from "@/store/team-text";
import {
  availablePokemon,
  generationLearnset,
  learnsetsReady,
} from "@/store/learnsets";
import { randomSet } from "@/store/random";
import { generationRules } from "@/shared/generation-rules";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { COMBINED_GENERATIONS_FORMAT } from "@/shared/generation-profile";
import { LEGENDS_ARCEUS, LEGENDS_ZA, LETS_GO } from "@/shared/game-variants";

test.beforeAll(() => learnsetsReady);

const read = (text: string, generation: Generation = 9, format = "") => {
  const problems: TeamTextProblem[] = [];
  const team = parseTeamText(text, generation, format, {
    onProblem: problem => problems.push(problem),
  });
  return { team, problems };
};

test("an unrecognized move leaves its slot empty and keeps the other edits", () => {
  const { team, problems } = read(`Lugia @ Leftovers
Ability: Multiscale
- Aeroblast
- Iron Hed
- Roost
- Calm Mind`);
  expect(team[0]).toMatchObject({
    name: "lugia",
    item: "leftovers",
    ability: "Multiscale",
    move1: "aeroblast",
    move2: "",
    move3: "roost",
    move4: "calmmind",
  });
  expect(problems).toEqual([
    {
      slot: 1,
      pokemon: "lugia",
      field: "move",
      move: 2,
      value: "Iron Hed",
      reason: "unrecognized",
    },
  ]);
});

test("a move the pokemon cannot learn is reported with that reason", () => {
  const { team, problems } = read("Sigilyph\n- Psychic\n- Close Combat");
  expect(team[0]).toMatchObject({ move1: "psychic", move2: "" });
  expect(problems).toEqual([
    {
      slot: 1,
      pokemon: "sigilyph",
      field: "move",
      move: 2,
      value: "Close Combat",
      reason: "unlearnable",
    },
  ]);
});

test("bare dashes and fewer than four moves are not problems", () => {
  const { team, problems } = read("Mienshao\n-\n- U-turn\n-");
  expect(team[0]).toMatchObject({ move1: "", move2: "uturn", move3: "" });
  expect(problems).toEqual([]);
  expect(teamTextProblems("Mienshao", 9, "")).toEqual([]);
});

test("an unrecognized pokemon is named by its team slot and leaves that slot empty", () => {
  const { team, problems } = read(
    "Furret\n\nToucanon @ Life Orb\n- Beak Blast\n\nGrimmsnarl",
  );
  expect(team.map(({ name }) => name).slice(0, 3)).toEqual([
    "furret",
    "",
    "grimmsnarl",
  ]);
  expect(problems).toEqual([
    {
      slot: 2,
      field: "pokemon",
      value: "Toucanon @ Life Orb",
      reason: "unrecognized",
    },
  ]);
});

test("pokemon past the sixth and moves past the fourth are left out", () => {
  const text = [
    "Azumarill\n- Aqua Jet\n- Play Rough\n- Belly Drum\n- Knock Off\n- Superpower\n-",
    "Furret",
    "Tinkaton",
    "Cofagrigus",
    "Mienshao",
    "Sigilyph",
    "Lugia @ Leftovers",
  ].join("\n\n");
  const { team, problems } = read(text);
  expect(team[0]).toMatchObject({ move4: "knockoff" });
  expect(team[5]?.name).toBe("sigilyph");
  expect(problems).toEqual([
    {
      slot: 1,
      pokemon: "azumarill",
      field: "move",
      move: 5,
      value: "Superpower",
      reason: "tooManyMoves",
    },
    {
      slot: 7,
      field: "pokemon",
      value: "Lugia @ Leftovers",
      reason: "tooManyPokemon",
    },
  ]);
});

test("an unrecognized item or ability names what is used in its place", () => {
  expect(
    teamTextProblems(
      "Zacian-Crowned @ Rusted Swrd\n\nCofagrigus @ Leftover\nAbility: Levitate\n\nTinkaton\nAbility: Pressure",
      9,
      "",
    ),
  ).toEqual([
    {
      slot: 1,
      pokemon: "zaciancrowned",
      field: "item",
      value: "Rusted Swrd",
      reason: "unrecognized",
      replacement: "rustedsword",
    },
    {
      slot: 2,
      pokemon: "cofagrigus",
      field: "item",
      value: "Leftover",
      reason: "unrecognized",
    },
    {
      slot: 2,
      pokemon: "cofagrigus",
      field: "ability",
      value: "Levitate",
      reason: "wrongAbility",
      replacement: "Mummy",
    },
    {
      slot: 3,
      pokemon: "tinkaton",
      field: "ability",
      value: "Pressure",
      reason: "wrongAbility",
    },
  ]);
});

test("a CAP pokemon's ability on another pokemon is the wrong ability, not an unknown one", () => {
  expect(read("Klefki\nAbility: Mountaineer").problems).toEqual([
    {
      slot: 1,
      pokemon: "klefki",
      field: "ability",
      value: "Mountaineer",
      reason: "wrongAbility",
    },
  ]);
});

test("an ability in another case is not recognized and the auto-selected one is used", () => {
  const { team, problems } = read("Shedinja\nAbility: wonder guard");
  expect(team[0]?.ability).toBe("Wonder Guard");
  expect(problems).toEqual([
    {
      slot: 1,
      pokemon: "shedinja",
      field: "ability",
      value: "wonder guard",
      reason: "unrecognized",
      replacement: "Wonder Guard",
    },
  ]);
});

test("a Gigantamax line that cannot be used is reported and left out", () => {
  const where = (pokemon: string, value: string) => ({
    slot: 1,
    pokemon,
    field: "line",
    value,
  });
  const { team, problems } = read("Garchomp\nGigantamax: Yes\n- Earthquake", 8);
  expect(team[0]).toMatchObject({ name: "garchomp", move1: "earthquake" });
  expect(problems).toEqual([
    { ...where("garchomp", "Gigantamax: Yes"), reason: "noGigantamax" },
  ]);
  expect(teamTextProblems("Lapras\nGigantamax: Maybe", 8, "")).toEqual([
    { ...where("lapras", "Gigantamax: Maybe"), reason: "unrecognized" },
  ]);
  for (const answer of ["Yes", "No", ""])
    expect(teamTextProblems(`Lapras\nGigantamax: ${answer}`, 8, "")).toEqual(
      [],
    );
});

test("set details that cannot be read are reported with what is used instead", () => {
  const { team, problems } = read(`Grimmsnarl
Level: 105
Shiny: Maybe
Happiness: 300
Tera Type: Fyre
EVs: 300 Atk / 4 Spx / x Spe / 252 HP
Adamantt Nature
IVs: 40 SpA
Abilty: Prankster
Pokeball: Poke Ball
Dynamax Level: 10
Hidden Power: Fire`);
  expect(team[0]?.evs).toEqual({ atk: 255, hp: 252 });
  expect(team[0]?.ivs).toBeUndefined();
  const where = (field: TeamTextProblem["field"], value: string) => ({
    slot: 1,
    pokemon: "grimmsnarl",
    field,
    value,
  });
  expect(problems).toEqual([
    {
      ...where("level", "105"),
      reason: "outOfRange",
      range: [1, 100],
      replacement: "100",
    },
    { ...where("shiny", "Maybe"), reason: "unrecognized" },
    { ...where("happiness", "300"), reason: "outOfRange", range: [0, 255] },
    { ...where("teraType", "Fyre"), reason: "unrecognized" },
    {
      ...where("evs", "300 Atk"),
      stat: "atk",
      reason: "outOfRange",
      range: [0, 255],
      replacement: "255",
    },
    { ...where("evs", "4 Spx"), reason: "unrecognized" },
    {
      ...where("evs", "x Spe"),
      stat: "spe",
      reason: "outOfRange",
      range: [0, 255],
    },
    { ...where("nature", "Adamantt"), reason: "unrecognized" },
    {
      ...where("ivs", "40 SpA"),
      stat: "spa",
      reason: "outOfRange",
      range: [0, 31],
      replacement: "31",
    },
    { ...where("line", "Abilty: Prankster"), reason: "unread" },
  ]);
  expect(teamTextProblems("Grimmsnarl\nLevel: 49.6", 9, "")).toEqual([
    {
      ...where("level", "49.6"),
      reason: "outOfRange",
      range: [1, 100],
      replacement: "50",
    },
  ]);
});

test("happiness in a game without it is left out as unsupported", () => {
  expect(teamTextProblems("Mew\nHappiness: 0", 1, "")).toEqual([
    {
      slot: 1,
      pokemon: "mew",
      field: "happiness",
      value: "0",
      reason: "unsupported",
    },
  ]);
});

test("details a game has no field for are left out as unsupported", () => {
  const { team, problems } = read(
    "Farigiraf\nTera Type: Fairy\nIVs: 0 Spe\nQuiet Nature",
    9,
    CHAMPIONS_FORMAT,
  );
  expect(team[0]).not.toHaveProperty("ivs");
  expect(team[0]).not.toHaveProperty("teraType");
  expect(problems.map(({ field, reason }) => [field, reason])).toEqual([
    ["teraType", "unsupported"],
    ["ivs", "unsupported"],
  ]);

  // Gen 1 has no genders, which the first line holds
  const gen1 = read("Pikachu (F)\nShiny: Yes", 1);
  expect(gen1.team[0]).not.toHaveProperty("gender");
  expect(gen1.problems).toEqual([
    {
      slot: 1,
      pokemon: "pikachu",
      field: "gender",
      value: "F",
      reason: "unsupported",
    },
    {
      slot: 1,
      pokemon: "pikachu",
      field: "shiny",
      value: "Yes",
      reason: "unsupported",
    },
  ]);
  expect(read("Pikachu (F)", 2).problems).toEqual([]);
});

test("an ability in a game without abilities is left out as unsupported", () => {
  const games: [Generation, string][] = [
    [1, ""],
    [2, ""],
    [7, LETS_GO],
    [8, LEGENDS_ARCEUS],
    [9, LEGENDS_ZA],
  ];
  for (const [generation, format] of games) {
    const game = `Gen ${generation} ${format}`;
    const { team, problems } = read(
      "Gengar\nAbility: Levitate",
      generation,
      format,
    );
    expect(team[0].ability, game).toBe("");
    expect(problems, game).toEqual([
      {
        slot: 1,
        pokemon: "gengar",
        field: "ability",
        value: "Levitate",
        reason: "unsupported",
      },
    ]);
    // The site's own text writes No Ability in every game
    expect(
      read("Gengar\nAbility: No Ability", generation, format).problems,
      game,
    ).toEqual([]);
    // Links keep every detail they carry
    expect(
      parseTeamText(
        "Gengar\nAbility: Levitate",
        generation,
        format,
        LEGACY_LINK_PARSING_OPTIONS,
      )[0].ability,
      game,
    ).toBe("Levitate");
  }
  const gen3 = read("Gengar\nAbility: Levitate", 3);
  expect(gen3.team[0].ability).toBe("Levitate");
  expect(gen3.problems).toEqual([]);
});

// A deterministic stand-in for Math.random
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

const GAMES: [Generation, string][] = [
  ...([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map(
    (generation): [Generation, string] => [generation, ""],
  ),
  [9, CHAMPIONS_FORMAT],
  [7, LETS_GO],
  [8, LEGENDS_ARCEUS],
  [9, LEGENDS_ZA],
  [9, COMBINED_GENERATIONS_FORMAT],
];

for (const [generation, format] of GAMES)
  test(`the site's own text has no problems in Gen ${generation} ${format}`, () => {
    const rules = generationRules(generation, format);
    const random = seeded(generation * 31 + format.length);
    const pokemon = availablePokemon(Object.keys(pokedex), generation, format);
    const training = { atk: Math.min(252, rules.maxStat), spe: 4 };
    for (const name of pokemon) {
      const set: TeamPokemon = {
        ...randomSet(
          name,
          generationLearnset(name, generation, format),
          random,
          generation,
          format,
        ),
        nickname: "Ace",
        ...(!rules.fixedLevel && { level: 50 }),
        ...(rules.shiny && { shiny: true }),
        ...(rules.happiness && { happiness: 70 }),
        ...(rules.tera && { teraType: "Fairy" }),
        ...(rules.nature && { nature: "modest" }),
        ...(rules.investment === "statExperience" ?
          { statExperience: { atk: 65535 } }
        : rules.investment === "effortLevels" ? { effortLevels: { atk: 10 } }
        : { evs: training }),
        ...(rules.ivs && { ivs: { spa: 30 } }),
      };
      const text = serializeTeam([set], generation, format);
      expect(
        teamTextProblems(text, generation, format),
        `${text} in Gen ${generation} ${format}`,
      ).toEqual([]);
    }
  });

test("a replacement names what a later line of the same field leaves in place", () => {
  const { team, problems } = read(`Pikachu
Ability: Pressure
Ability: Lightning Rod
Level: 0
Level: 50
EVs: 300 Atk
EVs: 100 Atk`);
  expect(team[0]).toMatchObject({
    ability: "Lightning Rod",
    level: 50,
    evs: { atk: 100 },
  });
  expect(
    problems.map(({ field, replacement }) => [field, replacement]),
  ).toEqual([
    ["ability", "Lightning Rod"],
    ["level", "50"],
    ["evs", "100"],
  ]);
});
