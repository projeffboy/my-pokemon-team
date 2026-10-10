import { test, expect } from "@playwright/test";
import { planGenerationTransfer } from "@/store/generation-transfer";
import { parseTeamText, serializeTeam } from "@/store/team-text";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import spreads from "@/data/hidden-power-spreads";
import { hiddenPowerType, matchHiddenPower } from "@/shared/hidden-power";
import { createTeam } from "./shared/team";
import { convertTraining } from "@/store/generation-transfer/training";
import {
  generationRules,
  gen2Dvs,
  getDv,
  hpDv,
  isShinyDv,
  LEGENDS_ARCEUS,
} from "@/shared/generation-rules";
import { evTotal, getIv } from "@/shared/set-details";
import { STAT_KEYS } from "@/types";

const data = await loadGenerationTransferData();
const from = { generation: 9 as const, format: "" };

test.describe("Gen 2 Hidden Power transfer", () => {
  for (const type of Object.keys(spreads)) {
    test(`${type} retains its type and source DVs in modern games`, () => {
      const original = createTeam({
        name: "unown",
        move1: `hiddenpower${type}`,
      });
      matchHiddenPower(original[0]!, original[0]!.move1, 2);
      expect(hiddenPowerType(original[0]!, 2)).toBe(type);
      const before = structuredClone(original);
      const text = serializeTeam(original);
      for (const generation of [3, 6] as const) {
        const plan = planGenerationTransfer(
          original,
          { generation: 2, format: "" },
          generation,
          "",
          data,
        );
        const member = plan.team[0]!;
        expect(member.move1).toBe(`hiddenpower${type}`);
        expect(hiddenPowerType(member, generation)).toBe(type);
        for (const stat of STAT_KEYS)
          expect(getDv(member, stat)).toBe(getDv(original[0]!, stat));
        const conversion = plan.losses.find(
          loss => loss.field === "ivs",
        )?.conversion;
        if (type === "dark") expect(conversion).toBeUndefined();
        else {
          expect(conversion?.from).toBe("dvs");
          expect(conversion?.after).toEqual(
            Object.fromEntries(
              STAT_KEYS.map(stat => [stat, getIv(member.ivs, stat)]),
            ),
          );
        }
      }
      expect(original).toEqual(before);
      expect(serializeTeam(original)).toBe(text);
    });
  }

  test("implicit shiny DVs stay shiny while Dragon keeps its modern type", () => {
    const original = createTeam({
      name: "unown",
      move1: "hiddenpowerdragon",
      shiny: true,
    });
    const text = serializeTeam(original);
    const source = gen2Dvs(original[0]!);
    expect(hiddenPowerType(source, 2)).toBe("dragon");
    const plan = planGenerationTransfer(
      original,
      { generation: 2, format: "" },
      3,
      "",
      data,
    );
    expect(hiddenPowerType(plan.team[0]!, 3)).toBe("dragon");
    expect(plan.team[0]?.shiny).toBe(true);
    for (const stat of STAT_KEYS)
      expect(getDv(plan.team[0]!, stat)).toBe(getDv(source, stat));
    expect(original[0]?.ivs).toBeUndefined();
    expect(serializeTeam(original)).toBe(text);
  });

  test("an invalid source label keeps its existing conversion", () => {
    const original = createTeam({ name: "unown", move1: "hiddenpowerfire" });
    expect(hiddenPowerType(original[0]!, 2)).toBe("dark");
    const plan = planGenerationTransfer(
      original,
      { generation: 2, format: "" },
      3,
      "",
      data,
    );
    expect(plan.team[0]?.move1).toBe("hiddenpowerfire");
    expect(hiddenPowerType(plan.team[0]!, 3)).toBe("dark");
    expect(plan.losses).toEqual([]);
  });

  test("destinations without IVs still remove unsupported IVs and moves", () => {
    const original = createTeam({ name: "espeon", move1: "hiddenpowerfire" });
    matchHiddenPower(original[0]!, original[0]!.move1, 2);
    const before = structuredClone(original);
    for (const [generation, format] of [
      [8, LEGENDS_ARCEUS],
      [9, CHAMPIONS_FORMAT],
    ] as const) {
      const plan = planGenerationTransfer(
        original,
        { generation: 2, format: "" },
        generation,
        format,
        data,
      );
      expect(plan.team[0]?.name).toBe("espeon");
      expect(plan.team[0]?.ivs).toBeUndefined();
      expect(plan.team[0]?.move1).toBe("");
      expect(plan.losses).toContainEqual({
        index: 0,
        pokemon: "espeon",
        field: "ivs",
      });
    }
    expect(original).toEqual(before);
  });
});

for (const generation of [1, 2] as const) {
  test(`Gen ${generation} imports transfer their derived HP and shared Special DVs`, () => {
    const original = parseTeamText("Vulpix\nIVs: 0 Atk / 10 SpA", generation);
    const before = structuredClone(original);
    const plan = planGenerationTransfer(
      original,
      { generation, format: "" },
      3,
      "",
      data,
    );
    expect(getIv(plan.team[0]?.ivs, "hp")).toBe(15);
    expect(getIv(plan.team[0]?.ivs, "spa")).toBe(11);
    expect(getIv(plan.team[0]?.ivs, "spd")).toBe(11);
    expect(original).toEqual(before);
  });
}

test("even and odd legacy IV encodings of the same DVs transfer identically", () => {
  for (const generation of [1, 2] as const) {
    for (const [even, odd] of [
      ["30 HP / 30 Atk / 30 Def / 30 SpA / 30 SpD / 30 Spe", "31 HP"],
      ["0 Atk / 10 SpA", "1 Atk / 11 SpA"],
    ] as const) {
      const transfer = (ivs: string) => {
        const original = parseTeamText(`Vulpix\nIVs: ${ivs}`, generation);
        const text = serializeTeam(original);
        const plan = planGenerationTransfer(
          original,
          { generation, format: "" },
          3,
          "",
          data,
        );
        expect(serializeTeam(original)).toBe(text);
        return plan;
      };
      const evenPlan = transfer(even);
      const oddPlan = transfer(odd);
      expect(evenPlan).toEqual(oddPlan);
      if (even.startsWith("30 HP")) expect(evenPlan.losses).toEqual([]);
    }
  }
});

test("Gen 2 transfers preserve DV-derived shiny and gender rather than conflicting import labels", () => {
  for (const [details, shiny, gender] of [
    ["(F)\nIVs: 20 Def / 20 SpA / 20 Spe", true, "M"],
    ["(M)\nShiny: Yes\nIVs: 0 Atk / 20 Def / 20 SpA / 20 Spe", false, "F"],
  ] as const) {
    const original = parseTeamText(`Jigglypuff ${details}`, 2);
    const before = structuredClone(original);
    expect(isShinyDv(original[0]!)).toBe(shiny);
    const plan = planGenerationTransfer(
      original,
      { generation: 2, format: "" },
      3,
      "",
      data,
    );
    expect(plan.team[0]?.shiny ?? false).toBe(shiny);
    expect(plan.team[0]?.gender).toBe(gender);
    expect(original).toEqual(before);
  }
});

test("Gen 2 shiny DVs without a shiny label still preview its removal in Gen 1", () => {
  const original = parseTeamText(
    "Jigglypuff\nIVs: 20 Def / 20 SpA / 20 Spe",
    2,
  );
  const plan = planGenerationTransfer(
    original,
    { generation: 2, format: "" },
    1,
    "",
    data,
  );
  expect(plan.losses.map(loss => loss.field)).toEqual(["shiny"]);
  expect(plan.team[0]?.shiny).toBeUndefined();
  expect(isShinyDv(plan.team[0]!)).toBe(true);
  expect(original[0]?.shiny).toBeUndefined();
});

test("default IVs and DVs transfer without reported adjustments", () => {
  for (const [fromGeneration, generation] of [
    [7, 2],
    [7, 1],
    [2, 7],
    [1, 7],
  ] as const) {
    for (const member of [
      { name: "bulbasaur" },
      { name: "bulbasaur", ivs: { hp: 31, atk: 31 } },
    ]) {
      const original = createTeam(member);
      const plan = planGenerationTransfer(
        original,
        { generation: fromGeneration, format: "" },
        generation,
        "",
        data,
      );
      expect(plan.losses).toEqual([]);
      expect(plan.team[0]?.name).toBe("bulbasaur");
      for (const stat of STAT_KEYS)
        expect(getIv(plan.team[0]?.ivs, stat)).toBe(31);
      expect(original[0]).toMatchObject(member);
    }
  }
});

test("custom IVs and implicit Gen 2 shiny DVs retain conversion warnings", () => {
  const custom = planGenerationTransfer(
    createTeam({ name: "bulbasaur", ivs: { atk: 0 } }),
    { generation: 7, format: "" },
    2,
    "",
    data,
  );
  expect(custom.losses).toEqual([
    expect.objectContaining({
      field: "ivs",
      conversion: expect.objectContaining({
        from: "ivs",
        to: "dvs",
        before: expect.objectContaining({ atk: 0 }),
        after: expect.objectContaining({ atk: 0 }),
      }),
    }),
  ]);
  const shiny = createTeam({ name: "bulbasaur", shiny: true });
  const modern = planGenerationTransfer(
    shiny,
    { generation: 2, format: "" },
    7,
    "",
    data,
  );
  expect(modern.losses).toEqual([
    expect.objectContaining({
      field: "ivs",
      conversion: expect.objectContaining({
        from: "dvs",
        to: "ivs",
        before: expect.objectContaining({ def: 10, spa: 10, spe: 10 }),
        after: expect.objectContaining({ def: 21, spa: 21, spe: 21 }),
      }),
    }),
  ]);
  expect(modern.team[0]?.shiny).toBe(true);
  expect(shiny[0]?.ivs).toBeUndefined();
});

test("modern shiny sets keep shiny Gen 2 DVs when their IVs are unset", () => {
  const original = createTeam({ name: "bulbasaur", shiny: true });
  const plan = planGenerationTransfer(
    original,
    { generation: 7, format: "" },
    2,
    "",
    data,
  );
  expect(plan.team[0]?.shiny).toBe(true);
  expect(isShinyDv(plan.team[0]!)).toBe(true);
  expect(plan.losses).toEqual([]);
  expect(original[0]?.shiny).toBe(true);
  expect(original[0]?.ivs).toBeUndefined();
});

test("implicit Gen 2 shiny DVs survive a transfer through Gen 1", () => {
  const original = createTeam({ name: "ponyta", shiny: true });
  const legacy = planGenerationTransfer(
    original,
    { generation: 2, format: "" },
    1,
    "",
    data,
  );
  expect(legacy.team[0]?.shiny).toBeUndefined();
  expect(isShinyDv(legacy.team[0]!)).toBe(true);
  expect(legacy.losses.map(loss => loss.field)).toEqual(["shiny"]);
  const returning = planGenerationTransfer(
    legacy.team,
    { generation: 1, format: "" },
    2,
    "",
    data,
  );
  expect(returning.team[0]?.shiny).toBe(true);
  expect(original[0]?.ivs).toBeUndefined();
});

test("Gen 2 DV-derived gender changes are reported for explicit modern genders", () => {
  const original = createTeam({ name: "bulbasaur", gender: "F" });
  const plan = planGenerationTransfer(
    original,
    { generation: 7, format: "" },
    2,
    "",
    data,
  );
  expect(plan.team[0]?.gender).toBe("M");
  expect(plan.losses).toEqual([
    {
      index: 0,
      pokemon: "bulbasaur",
      field: "gender",
      value: "F",
      replacement: "M",
    },
  ]);
  expect(original[0]?.gender).toBe("F");
});

test("happiness carries over only to games that support it", () => {
  const original = createTeam({ name: "clefable", happiness: 0 });
  const supported = planGenerationTransfer(original, from, 2, "", data);
  expect(supported.team[0]?.happiness).toBe(0);
  for (const [generation, format] of [
    [1, ""],
    [9, CHAMPIONS_FORMAT],
  ] as const) {
    const plan = planGenerationTransfer(
      original,
      from,
      generation,
      format,
      data,
    );
    expect(plan.team[0]?.happiness).toBeUndefined();
    expect(plan.losses).toContainEqual({
      index: 0,
      pokemon: "clefable",
      field: "happiness",
    });
  }
  expect(original[0]?.happiness).toBe(0);
});

test("leaving Champions preserves its effective level when the set omits it", () => {
  const original = createTeam(
    { name: "forretress" },
    { name: "venusaur", level: 72 },
  );
  const plan = planGenerationTransfer(
    original,
    { generation: 9, format: CHAMPIONS_FORMAT },
    9,
    "",
    data,
  );
  expect(plan.team[0]!.level).toBe(50);
  expect(plan.team[1]!.level).toBe(72);
  expect(plan.losses.filter(loss => loss.field === "level")).toEqual([]);
  expect(original[0]!.level).toBeUndefined();
});

test("EVs convert at level-50 SP thresholds and return to a minimal equivalent spread", () => {
  for (const [ev, sp] of [
    [0, 0],
    [3, 0],
    [4, 1],
    [8, 1],
    [11, 1],
    [12, 2],
    [131, 16],
    [252, 32],
    [255, 32],
  ]) {
    const converted = convertTraining(
      createTeam({ evs: { hp: ev } })[0]!,
      generationRules(3),
      generationRules(9, CHAMPIONS_FORMAT),
    );
    expect(converted?.values.hp).toBe(sp);
  }
  const original = createTeam({
    name: "forretress",
    evs: { hp: 252, def: 252, spe: 4 },
  });
  const before = structuredClone(original);
  const champions = planGenerationTransfer(
    original,
    { generation: 3, format: "" },
    9,
    CHAMPIONS_FORMAT,
    data,
  );
  expect(champions.team[0]!.evs).toEqual({ hp: 32, def: 32, spe: 1 });
  const back = planGenerationTransfer(
    champions.team,
    { generation: 9, format: CHAMPIONS_FORMAT },
    3,
    "",
    data,
  );
  expect(back.team[0]!.evs).toEqual(original[0]!.evs);
  expect(original).toEqual(before);
});

test("conversions fit per-stat and total budgets without discarding the spread", () => {
  const source = createTeam({ name: "venusaur", evs: { hp: 255, def: 255 } });
  const capped = planGenerationTransfer(
    source,
    { generation: 3, format: "" },
    6,
    "",
    data,
  );
  expect(capped.team[0]!.evs).toEqual({ hp: 252, def: 252 });
  expect(
    capped.losses.find(loss => loss.field === "evs")?.conversion?.limited,
  ).toBe(true);
  const overBudget = createTeam({
    name: "venusaur",
    evs: { hp: 32, def: 32, spe: 2 },
  });
  const adapted = planGenerationTransfer(
    overBudget,
    { generation: 9, format: CHAMPIONS_FORMAT },
    9,
    "",
    data,
  );
  expect(evTotal(adapted.team[0]!.evs)).toBeLessThanOrEqual(510);
  expect(Object.values(adapted.team[0]!.evs!)).toEqual(
    expect.arrayContaining([248, 12]),
  );
  expect(
    adapted.losses.find(loss => loss.field === "evs")?.conversion?.limited,
  ).toBe(true);
});

test("legacy training conversions preserve bonuses where possible and share Special", () => {
  const source = createTeam({
    name: "hypno",
    evs: { hp: 100, spa: 80, spd: 120 },
    ivs: { atk: 0, spa: 20, spd: 30 },
  });
  const legacy = planGenerationTransfer(source, from, 2, "", data);
  expect(legacy.team[0]!.statExperience).toMatchObject({
    hp: 10000,
    spa: 14400,
    spd: 14400,
  });
  expect(getDv(legacy.team[0]!, "atk")).toBe(0);
  expect(getDv(legacy.team[0]!, "spa")).toBe(10);
  expect(getDv(legacy.team[0]!, "spd")).toBe(10);
  expect(getDv(legacy.team[0]!, "hp")).toBe(hpDv(legacy.team[0]!));
  const modern = planGenerationTransfer(
    legacy.team,
    { generation: 2, format: "" },
    3,
    "",
    data,
  );
  expect(modern.team[0]!.evs).toEqual({ hp: 100, spa: 120, spd: 120 });
  expect(modern.team[0]!.ivs).toMatchObject({ atk: 1, spa: 21, spd: 21 });
  expect(
    modern.losses
      .filter(loss => loss.conversion)
      .every(loss => loss.conversion?.approximate),
  ).toBe(true);
  const raw = createTeam({
    name: "hypno",
    statExperience: { atk: 12345, spa: 65535, spd: 65535 },
  });
  const preserved = planGenerationTransfer(
    raw,
    { generation: 2, format: "" },
    1,
    "",
    data,
  );
  expect(preserved.team[0]!.statExperience?.atk).toBe(12345);
  const converted = planGenerationTransfer(
    raw,
    { generation: 2, format: "" },
    3,
    "",
    data,
  );
  expect(evTotal(converted.team[0]!.evs)).toBeLessThanOrEqual(510);
  expect(
    converted.losses.find(loss => loss.field === "statExperience")?.conversion
      ?.limited,
  ).toBe(true);
});

test("legacy imports share Special training when leaving the generation", () => {
  for (const training of ["EVs: 100 SpA", "Stat Experience: 10000 SpA"]) {
    const original = parseTeamText(`Drowzee\n${training}`, 2);
    const before = structuredClone(original);
    const modern = planGenerationTransfer(
      original,
      { generation: 2, format: "" },
      3,
      "",
      data,
    );
    expect(modern.team[0]?.evs, training).toEqual({ spa: 100, spd: 100 });
    expect(original).toEqual(before);
    const legacy = planGenerationTransfer(
      original,
      { generation: 2, format: "" },
      1,
      "",
      data,
    );
    expect(legacy.team[0]?.evs, training).toEqual({ spa: 100, spd: 100 });
  }
});

test("Gen 9 includes Z-A Mega formes and their required stones", () => {
  const original = createTeam({
    name: "skarmorymega",
    item: "skarmorite",
    ability: "Stalwart",
    move1: "bravebird",
  });
  expect(planGenerationTransfer(original, from, 9, "", data).losses).toEqual(
    [],
  );
});

test("unavailable species clears its whole slot without shifting later slots", () => {
  const original = createTeam(
    { name: "helioptile", item: "leftovers", move1: "thunderbolt" },
    { name: "rattata" },
  );
  const before = structuredClone(original);
  const plan = planGenerationTransfer(original, from, 5, "", data);
  expect(plan.losses).toEqual([
    { index: 0, pokemon: "helioptile", field: "pokemon", value: "helioptile" },
  ]);
  expect(Object.values(plan.team[0]!)).toEqual(["", "", "", "", "", "", ""]);
  expect(plan.team[1]!.name).toBe("rattata");
  expect(original).toEqual(before);
});

test("unavailable Primal forme converts to its available base and checks the base set", () => {
  const original = createTeam(
    {
      name: "kyogreprimal",
      item: "blueorb",
      ability: "Primordial Sea",
      move1: "surf",
      move2: "originpulse",
      nickname: "Ocean",
      shiny: true,
      level: 72,
      evs: { hp: 128 },
      ivs: { atk: 0 },
    },
    { name: "kyogre", ability: "Drizzle", move1: "surf" },
  );
  const before = structuredClone(original);
  const plan = planGenerationTransfer(
    original,
    { generation: 6, format: "" },
    3,
    "",
    data,
  );
  expect(plan.team[0]).toMatchObject({
    name: "kyogre",
    item: "",
    ability: "Drizzle",
    move1: "surf",
    move2: "",
    nickname: "Ocean",
    shiny: true,
    level: 72,
    evs: { hp: 128 },
    ivs: { atk: 0 },
  });
  expect(plan.losses).toEqual([
    {
      index: 0,
      pokemon: "kyogreprimal",
      field: "pokemon",
      value: "kyogreprimal",
      replacement: "kyogre",
    },
    { index: 0, pokemon: "kyogreprimal", field: "item", value: "blueorb" },
    {
      index: 0,
      pokemon: "kyogreprimal",
      field: "ability",
      value: "Primordial Sea",
      replacement: "Drizzle",
    },
    { index: 0, pokemon: "kyogreprimal", field: "move", value: "originpulse" },
  ]);
  expect(plan.team[1]).toEqual(original[1]);
  expect(original).toEqual(before);
});

test("forme fallback leaves an ambiguous base ability for the player to choose", () => {
  const plan = planGenerationTransfer(
    createTeam({ name: "charizardmegax", ability: "Tough Claws" }),
    { generation: 6, format: "" },
    5,
    "",
    data,
  );
  expect(plan.team[0]).toMatchObject({ name: "charizard", ability: "" });
  const ability = plan.losses.find(loss => loss.field === "ability");
  expect(ability?.value).toBe("Tough Claws");
  expect(ability?.replacement).toBeUndefined();
});

test("regional formes fall back only when their base species is available", () => {
  const plan = planGenerationTransfer(
    createTeam(
      { name: "ninetalesalola", ability: "Snow Warning", move1: "icebeam" },
      { name: "decidueyehisui", ability: "Scrappy" },
    ),
    from,
    3,
    "",
    data,
  );
  expect(plan.team[0]).toMatchObject({
    name: "ninetales",
    ability: "Flash Fire",
    move1: "",
  });
  expect(plan.team[1]?.name).toBe("");
  expect(plan.losses.find(loss => loss.index === 1)).toEqual({
    index: 1,
    pokemon: "decidueyehisui",
    field: "pokemon",
    value: "decidueyehisui",
  });
});

test("available formes keep their forme and ability", () => {
  const original = createTeam({
    name: "kyogreprimal",
    item: "blueorb",
    ability: "Primordial Sea",
    move1: "surf",
  });
  const plan = planGenerationTransfer(
    original,
    { generation: 6, format: "" },
    7,
    "",
    data,
  );
  expect(plan.team).toEqual(original);
  expect(plan.losses).toEqual([]);
});

test("keeps compatible moves and details and explains every unsupported field", () => {
  const original = createTeam({
    name: "slowbro",
    move1: "surf",
    move2: "slackoff",
    item: "rockyhelmet",
    ability: "Regenerator",
    nature: "Bold",
    gender: "M",
    shiny: true,
    teraType: "Water",
    nickname: "Tank",
    level: 50,
    evs: { hp: 252 },
    ivs: { spa: 0 },
  });
  const plan = planGenerationTransfer(original, from, 1, "", data);
  expect(plan.team[0]).toMatchObject({
    name: "slowbro",
    move1: "surf",
    move2: "",
    item: "",
    ability: "",
    nickname: "Tank",
    level: 50,
  });
  expect(plan.losses.map(loss => loss.field)).toEqual([
    "item",
    "ability",
    "move",
    "nature",
    "gender",
    "shiny",
    "teraType",
    "evs",
    "ivs",
  ]);
  expect(original[0]!.move2).toBe("slackoff");
});

test("uses historical abilities and moves without treating tier filters as transfer bans", () => {
  const historical = createTeam({
    name: "gengar",
    ability: "Levitate",
    move1: "shadowball",
  });
  expect(
    planGenerationTransfer(historical, from, 4, "OU: Over Used", data).losses,
  ).toEqual([]);
  historical[0]!.ability = "Cursed Body";
  expect(
    planGenerationTransfer(historical, from, 4, "Uber", data).losses.map(
      loss => loss.field,
    ),
  ).toEqual(["ability"]);
  const blastoise = createTeam({
    name: "blastoise",
    move1: "waterpulse",
    move2: "surf",
  });
  const plan = planGenerationTransfer(blastoise, from, 2, "", data);
  expect(plan.team[0]).toMatchObject({ move1: "", move2: "surf" });
});

test("Champions checks its own moves, items, abilities, and stat system", () => {
  const original = createTeam({
    name: "venusaur",
    ability: "Overgrow",
    move1: "gigadrain",
    move2: "hiddenpowerice",
    item: "assaultvest",
    teraType: "Grass",
    evs: { hp: 252 },
    ivs: { atk: 0 },
  });
  const plan = planGenerationTransfer(
    original,
    from,
    9,
    CHAMPIONS_FORMAT,
    data,
  );
  expect(plan.team[0]!.name).toBe("venusaur");
  expect(plan.team[0]!.move1).toBe("gigadrain");
  expect(plan.losses.map(loss => loss.field)).toEqual(
    expect.arrayContaining(["move", "teraType", "evs", "ivs"]),
  );
  expect(plan.team[0]!.evs).toEqual({ hp: 32 });
  expect(
    plan.losses.find(loss => loss.field === "evs")?.conversion,
  ).toMatchObject({ from: "evs", to: "sps", after: { hp: 32 } });
  expect(original[0]!.evs).toEqual({ hp: 252 });
});

test("Hidden Power variants use the base move's historical availability", () => {
  const original = createTeam({ name: "unown", move1: "hiddenpowerfire" });
  expect(
    planGenerationTransfer(original, from, 2, "", data).losses.filter(
      loss => !loss.conversion,
    ),
  ).toEqual([]);
});

test("Champions sets surviving Pokemon to level 50 and reports adjustments without changing the original", () => {
  const original = createTeam(
    { name: "forretress", level: 56 },
    { name: "charizard" },
    { name: "venusaur", level: 50 },
    { name: "cacturne", level: 56 },
  );
  const plan = planGenerationTransfer(
    original,
    { generation: 3, format: "" },
    9,
    CHAMPIONS_FORMAT,
    data,
  );
  expect(plan.team.slice(0, 3).map(member => member.level)).toEqual([
    50, 50, 50,
  ]);
  expect(plan.losses.filter(loss => loss.field === "level")).toEqual([
    {
      index: 0,
      pokemon: "forretress",
      field: "level",
      value: "56",
      replacement: "50",
    },
    {
      index: 1,
      pokemon: "charizard",
      field: "level",
      value: "100",
      replacement: "50",
    },
  ]);
  expect(plan.team[3]!.name).toBe("");
  expect(original[0]!.level).toBe(56);
  expect(original[1]!.level).toBeUndefined();
  const returning = planGenerationTransfer(
    plan.team,
    { generation: 9, format: CHAMPIONS_FORMAT },
    3,
    "",
    data,
  );
  expect(returning.team[0]!.level).toBe(50);
  expect(returning.losses).toEqual([]);
});
