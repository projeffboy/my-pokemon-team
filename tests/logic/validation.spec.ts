import { test, expect } from "@playwright/test";
import { rulesLabel, validateTeam } from "@/store/validation";
import { createTeam } from "./shared/team";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LETS_GO, LEGENDS_ARCEUS } from "@/shared/game-variants";
import { COMBINED_GENERATIONS_FORMAT } from "@/shared/generation-profile";

const messages = (...args: Parameters<typeof validateTeam>) =>
  validateTeam(...args).map(({ message }) => message);

test("an empty team is the only problem of an empty team", () => {
  expect(messages(createTeam(), 9, "OU: Over Used")).toEqual([
    "The team is empty.",
  ]);
});

test("a legal team has no problems", () => {
  const team = createTeam(
    { name: "milotic", ability: "Marvel Scale", move1: "scald" },
    { name: "ogerponwellspring", item: "wellspringmask" },
  );
  expect(messages(team, 9, "")).toEqual([]);
});

test("ability legality follows the team's generation", () => {
  const levitate = createTeam({ name: "gengar", ability: "Levitate" });
  const cursedBody = createTeam({ name: "gengar", ability: "Cursed Body" });
  expect(messages(levitate, 6, "")).toEqual([]);
  expect(messages(cursedBody, 6, "")).toEqual([
    "Gengar cannot have Cursed Body.",
  ]);
  expect(messages(cursedBody, 7, "")).toEqual([]);
  expect(messages(levitate, 7, "")).toEqual(["Gengar cannot have Levitate."]);
  expect(messages(cursedBody, 7, LETS_GO)).toContain(
    "Gengar cannot have Cursed Body.",
  );
});

test("Gen 1–2 stat experience has no total training limit", () => {
  const team = createTeam({
    name: "gengar",
    evs: { hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255 },
    statExperience: {
      hp: 65535,
      atk: 65535,
      def: 65535,
      spa: 65535,
      spe: 65535,
    },
  });
  expect(messages(team, 1, "")).toEqual([]);
  expect(messages(team, 2, "")).toEqual([]);
  expect(
    messages(
      createTeam({ name: "gengar", statExperience: { hp: 65536 } }),
      2,
      "",
    ),
  ).toEqual(["Gengar has more than 65535 Stat experience in one stat."]);
});

test("EV limits distinguish Gen 3–5 from later generations", () => {
  const team = createTeam({ name: "gengar", evs: { hp: 255, atk: 255 } });
  expect(messages(team, 3, "")).toEqual([]);
  expect(messages(team, 5, "")).toEqual([]);
  expect(messages(team, 6, "")).toEqual([
    "Gengar has more than 252 EVs in one stat.",
  ]);
  expect(
    messages(createTeam({ name: "gengar", evs: { hp: 256 } }), 3, ""),
  ).toEqual(["Gengar has more than 255 EVs in one stat."]);
});

test("Champions enforces 66 total SPs and 32 SPs per stat", () => {
  expect(
    messages(
      createTeam({ name: "gengar", evs: { hp: 32, atk: 32, def: 2 } }),
      9,
      CHAMPIONS_FORMAT,
    ),
  ).toEqual([]);
  expect(
    messages(
      createTeam({ name: "gengar", evs: { hp: 32, atk: 32, def: 32 } }),
      9,
      CHAMPIONS_FORMAT,
    ),
  ).toEqual(["Gengar has 96 SPs (at most 66)."]);
  expect(
    messages(
      createTeam({ name: "gengar", evs: { hp: 33 } }),
      9,
      CHAMPIONS_FORMAT,
    ),
  ).toEqual(["Gengar has more than 32 SPs in one stat."]);
});

test("Let's Go and Arceus use uncapped totals and their own per-stat training", () => {
  const avs = createTeam({
    name: "gengar",
    evs: { hp: 200, atk: 200, def: 200, spa: 200, spd: 200, spe: 200 },
  });
  expect(messages(avs, 7, LETS_GO)).toEqual([]);
  expect(
    messages(createTeam({ name: "gengar", evs: { hp: 201 } }), 7, LETS_GO),
  ).toEqual(["Gengar has more than 200 AVs in one stat."]);
  const effortLevels = createTeam({
    name: "gengar",
    effortLevels: { hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 10 },
  });
  expect(messages(effortLevels, 8, LEGENDS_ARCEUS)).toEqual([]);
  expect(
    messages(
      createTeam({ name: "gengar", effortLevels: { hp: 11 } }),
      8,
      LEGENDS_ARCEUS,
    ),
  ).toEqual(["Gengar has more than 10 Effort Levels in one stat."]);
});

test("reports pokemon outside the format or generation", () => {
  expect(
    messages(createTeam({ name: "milotic" }), 9, "Little Cup (LC)"),
  ).toEqual(["Milotic is not allowed in Gen 9 Little Cup (LC)."]);
  expect(messages(createTeam({ name: "chikorita" }), 1, "")).toEqual([
    "Chikorita is not allowed in Gen 1.",
  ]);
});

test("reports illegal abilities, missing required items, and repeated moves", () => {
  const team = createTeam(
    {
      name: "milotic",
      ability: "Levitate",
      move1: "scald",
      move2: "scald",
    },
    { name: "ogerponwellspring" },
  );
  expect(messages(team, 9, "")).toEqual([
    "Milotic cannot have Levitate.",
    "Milotic has Scald twice.",
    "Ogerpon-Wellspring must hold Wellspring Mask.",
  ]);
});

test("different Hidden Power types are still duplicate moves", () => {
  expect(
    messages(
      createTeam({
        name: "misdreavus",
        move1: "hiddenpowerice",
        move2: "hiddenpowerfire",
      }),
      3,
      "",
    ),
  ).toEqual(["Misdreavus has Hidden Power twice."]);
});

test("reports EVs, levels, and tera types that the games do not allow", () => {
  const team = createTeam(
    { name: "milotic", evs: { hp: 252, atk: 252, spe: 252 }, level: 0 },
    { name: "kingdra", evs: { hp: 300 }, level: 101 },
    { name: "chansey", teraType: "Steel" },
  );
  expect(messages(team, 8, "")).toEqual([
    "Milotic has 756 EVs (at most 510).",
    "Milotic's level must be 1 to 100.",
    "Kingdra has more than 252 EVs in one stat.",
    "Kingdra's level must be 1 to 100.",
    "Chansey has a Tera Type, which only exists in Gen 9.",
  ]);
});

test("applies Species Clause everywhere and Item Clause in Champions", () => {
  const team = createTeam(
    { name: "milotic", item: "leftovers" },
    { name: "kingdra", item: "leftovers" },
    { name: "kingdra" },
  );
  expect(messages(team, 9, "OU: Over Used")).toEqual([
    "Two pokemon are Kingdra (Species Clause).",
  ]);
  expect(messages(team, 9, "Doubles OU")).toEqual([
    "Two pokemon are Kingdra (Species Clause).",
  ]);
  expect(messages(team, 9, "Pokemon Champions (M-C)")).toContain(
    "Two pokemon hold Leftovers (Item Clause).",
  );
  expect(
    messages(
      createTeam(
        { name: "venusaur" },
        { name: "venusaurmega", item: "venusaurite" },
      ),
      9,
      "Pokemon Champions (M-C)",
    ),
  ).toEqual(["Two pokemon are Venusaur (Species Clause)."]);
});

test("each problem names the slots of the pokemon it concerns, skipping empty slots", () => {
  const toxicTwice = { move1: "toxic", move2: "toxic" };
  const team = createTeam(
    { name: "toxapex", item: "blacksludge", ...toxicTwice },
    {},
    { name: "toxapex", item: "blacksludge", ...toxicTwice },
    { name: "dondozo", item: "blacksludge", level: 0 },
  );
  expect(validateTeam(team, 9, CHAMPIONS_FORMAT)).toEqual([
    { message: "Toxapex has Toxic twice.", slots: [0, 2] },
    {
      message: "Dondozo is not allowed in Gen 9 Pokemon Champions (M-C).",
      slots: [3],
    },
    { message: "Dondozo's level must be 1 to 100.", slots: [3] },
    { message: "Two pokemon are Toxapex (Species Clause).", slots: [0, 2] },
    {
      message: "Two pokemon hold Black Sludge (Item Clause).",
      slots: [0, 2, 3],
    },
  ]);
});

test("names the generation and format whose rules apply", () => {
  expect(rulesLabel(9, "")).toBe("Gen 9");
  expect(rulesLabel(4, "OU: Over Used")).toBe("Gen 4 OU: Over Used");
  expect(rulesLabel(9, COMBINED_GENERATIONS_FORMAT)).toBe("Generations 6–9");
});
