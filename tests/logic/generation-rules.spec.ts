import { test, expect } from "./fixtures";
import {
  generationRules,
  getDv,
  gen2Dvs,
  hpDv,
  isShinyDv,
  dvGender,
  setDv,
  setLegacyShiny,
  setStatExperience,
  getStatExperience,
  LEGENDS_ARCEUS,
  LEGENDS_ZA,
  LETS_GO,
} from "@/shared/generation-rules";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { createTeam } from "./shared/team";
import {
  generationLearnset,
  availableItems,
  availablePokemon,
  learnsetsReady,
} from "@/store/learnsets";
import { completeSet, isSetComplete, randomizeSlotLabel } from "@/store/random";
import { pokemonAbilities } from "@/shared/pokedex";
import {
  parseTeamText,
  serializeTeam,
  serializeTeams,
  parseTeamsText,
} from "@/store/team-text";
import { createSavedTeam } from "@/shared/team";
import { sanitizeSavedTeam } from "@/store/teams-storage";
import { planGenerationTransfer } from "@/store/generation-transfer";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import {
  typeAgainstPokemon,
  moveAgainstType,
} from "@/store/shared/effectiveness";
import { sortPokemon } from "@/store/sorting";

test.beforeAll(async () => {
  await learnsetsReady;
});

test("generation rules match the stat systems and feature introductions", () => {
  expect(generationRules(1)).toMatchObject({
    happiness: false,
    gender: false,
    shiny: false,
    nature: false,
    items: false,
    abilities: false,
    legacy: true,
    maxStat: 65535,
    maxTotal: undefined,
  });
  expect(generationRules(2)).toMatchObject({
    happiness: true,
    gender: true,
    shiny: true,
    nature: false,
    items: true,
    abilities: false,
  });
  expect(generationRules(3)).toMatchObject({
    nature: true,
    abilities: true,
    maxStat: 255,
    maxTotal: 510,
  });
  expect(generationRules(5).maxStat).toBe(255);
  expect(generationRules(6).maxStat).toBe(252);
  expect(generationRules(9, CHAMPIONS_FORMAT)).toMatchObject({
    happiness: false,
    investment: "sps",
    maxStat: 32,
    maxTotal: 66,
    ivs: false,
    tera: false,
  });
  expect(generationRules(8, LEGENDS_ARCEUS)).toMatchObject({
    happiness: true,
    investment: "effortLevels",
    maxStat: 10,
    maxTotal: undefined,
    ivs: false,
    items: false,
    abilities: false,
  });
  expect(generationRules(9, LEGENDS_ZA)).toMatchObject({
    happiness: true,
    investment: "evs",
    maxStat: 252,
    ivs: true,
    items: true,
    abilities: false,
    tera: false,
  });
  expect(generationRules(7, LETS_GO)).toMatchObject({
    happiness: true,
    investment: "avs",
    maxStat: 200,
    maxTotal: undefined,
    items: false,
    abilities: false,
  });
});

test("Gen 2 DVs derive HP, gender and shiny while Special stays shared", () => {
  const member = createTeam({ name: "chikorita" })[0]!;
  setDv(member, "atk", 0, 2);
  expect(hpDv(member)).toBe(7);
  expect(dvGender(member)).toBe("F");
  setLegacyShiny(member, true);
  expect(isShinyDv(member)).toBe(true);
  expect(member.shiny).toBe(true);
  expect(dvGender(member)).toBe("M");
  expect(hpDv(member)).toBe(8);
  expect(getDv(member, "spd")).toBe(10);
  setDv(member, "spa", 9, 2);
  expect(member.shiny).toBeUndefined();
  expect(getDv(member, "spd")).toBe(9);
  expect(hpDv(member)).toBe(9);
});

test("a Gen 2 shiny import with omitted IVs resolves linked DVs without changing its text", () => {
  const member = parseTeamText("Hoothoot\nShiny: Yes")[0]!;
  const text = serializeTeam([member]);
  const resolved = gen2Dvs(member);
  expect(getDv(resolved, "spa")).toBe(10);
  expect(hpDv(resolved)).toBe(8);
  expect(isShinyDv(resolved)).toBe(true);
  expect(serializeTeam([member])).toBe(text);
  setLegacyShiny(member, false);
  expect(member.shiny).toBeUndefined();
  expect(getDv(member, "hp")).toBe(hpDv(member));
});

test("generation transfers leave empty slots empty without reporting detail losses", async () => {
  const data = await loadGenerationTransferData();
  const toGen2 = planGenerationTransfer(
    createTeam(),
    { generation: 3, format: "" },
    2,
    "",
    data,
  );
  expect(toGen2).toEqual({ team: createTeam(), losses: [] });
  expect(
    planGenerationTransfer(
      toGen2.team,
      { generation: 2, format: "" },
      1,
      "",
      data,
    ),
  ).toEqual(toGen2);
});

test("raw stat experience, shared Special and Effort Levels round-trip in links and storage", () => {
  const team = createTeam({ name: "hypno" });
  setStatExperience(team[0]!, "spa", 65535);
  setStatExperience(team[0]!, "atk", 12345);
  expect(team[0]!.evs).toEqual({ spa: 255, spd: 255, atk: 112 });
  const imported = parseTeamText(serializeTeam(team));
  expect(getStatExperience(imported[0]!, "atk")).toBe(12345);
  expect(getStatExperience(imported[0]!, "spd")).toBe(65535);
  const saved = createSavedTeam({
    generation: 8,
    format: LEGENDS_ARCEUS,
    team: createTeam({ name: "stantler", effortLevels: { hp: 10, spe: 7 } }),
  });
  expect(sanitizeSavedTeam(saved)?.team[0]?.effortLevels).toEqual({
    hp: 10,
    spe: 7,
  });
  expect(parseTeamsText(serializeTeams([saved]))[0]).toMatchObject({
    generation: 8,
    format: LEGENDS_ARCEUS,
    team: expect.any(Array),
  });
  expect(
    parseTeamsText(serializeTeams([saved]))[0]?.team[0]?.effortLevels,
  ).toEqual({ hp: 10, spe: 7 });
});

test("historical dropdown and random pools exclude future moves, items and hidden abilities", ({
  store,
}) => {
  store.currentTeam.generation = 1;
  store.selectPokemon(0, "magmar");
  expect(store.teamItems).toEqual([]);
  expect(store.teamAbilities[0]).toEqual([]);
  expect(store.teamLearnsets.values[0]).toContain("firepunch");
  expect(store.teamLearnsets.values[0]).not.toContain("flareblitz");
  store.randomizeSlot(0);
  expect(store.team[0]).toMatchObject({ item: "", ability: "" });
  expect(isSetComplete(store.team[0]!, 1)).toBe(true);
  expect(randomizeSlotLabel(store.team[0]!, undefined, 1)).toBe(
    "Randomize pokemon",
  );
  expect(pokemonAbilities("bulbasaur", 4)).toEqual(["Overgrow"]);
  expect(pokemonAbilities("bulbasaur", 5)).toContain("Chlorophyll");
  expect(
    availableItems(["leftovers", "choicescarf", "heavydutyboots"], 2),
  ).toEqual(["leftovers"]);
  expect(generationLearnset("magmar", 2)).not.toContain("flareblitz");
});

test("variants use native species and transfer removes unsupported fields with explanations", async () => {
  expect(
    availablePokemon(["pikachu", "mew", "mewtwo", "dialga"], 8, LEGENDS_ARCEUS),
  ).toEqual(["pikachu", "dialga"]);
  const team = createTeam({
    name: "golem",
    ability: "Sturdy",
    item: "leftovers",
    evs: { atk: 252 },
    ivs: { spe: 0 },
    teraType: "Rock",
  });
  const data = await loadGenerationTransferData();
  const plan = planGenerationTransfer(
    team,
    { generation: 9, format: "" },
    8,
    LEGENDS_ARCEUS,
    data,
  );
  expect(plan.losses.map(loss => loss.field)).toEqual(
    expect.arrayContaining(["ability", "item", "evs", "ivs", "teraType"]),
  );
  expect(plan.team[0]).toMatchObject({ name: "golem", ability: "", item: "" });
  expect(plan.team[0]?.evs).toBeUndefined();
  expect(team[0]?.evs).toEqual({ atk: 252 });
  const ditto = completeSet(
    createTeam({ name: "ditto" })[0]!,
    generationLearnset("ditto", 1),
    () => 0,
    1,
  );
  expect(isSetComplete(ditto, 1)).toBe(true);
});

test("historical stats sort correctly and unsupported abilities cannot change early-gen coverage", () => {
  expect(
    sortPokemon(
      ["pidgeot", "jynx"],
      { by: "spe", descending: true },
      undefined,
      5,
    ),
  ).toEqual(["jynx", "pidgeot"]);
  expect(
    sortPokemon(
      ["pidgeot", "jynx"],
      { by: "spe", descending: true },
      undefined,
      6,
    ),
  ).toEqual(["pidgeot", "jynx"]);
  expect(typeAgainstPokemon("Electric", "rhydon", "Lightning Rod", "", 4)).toBe(
    3,
  );
  expect(typeAgainstPokemon("Water", "gastrodon", "Storm Drain", "", 4)).toBe(
    0,
  );
  expect(typeAgainstPokemon("Water", "gastrodon", "Storm Drain", "", 5)).toBe(
    3,
  );
  expect(moveAgainstType("bodyslam", "Ghost", "kangaskhan", "Scrappy", 1)).toBe(
    2,
  );
  expect(parseTeamText("Gengar\nAbility: Levitate")[0]?.ability).toBe(
    "Levitate",
  );
});
