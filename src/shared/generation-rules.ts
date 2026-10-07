import pokedex from "@/data/pokedex";
import {
  STAT_KEYS,
  type Generation,
  type StatKey,
  type TeamPokemon,
} from "@/types";
import { CHAMPIONS_FORMAT } from "./formats";
import { getEv, getIv, setDetail, setStat } from "./set-details";

import { LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA } from "./game-variants";
export {
  LETS_GO,
  LEGENDS_ARCEUS,
  LEGENDS_ZA,
  GAME_VARIANTS,
  variantGeneration,
} from "./game-variants";

export function generationRules(generation: Generation, format = "") {
  const champions = format === CHAMPIONS_FORMAT;
  const arceus = format === LEGENDS_ARCEUS;
  const letsGo = format === LETS_GO;
  const legacy = generation <= 2;
  const investment =
    champions ? "sps"
    : arceus ? "effortLevels"
    : letsGo ? "avs"
    : legacy ? "statExperience"
    : "evs";
  return {
    legacy,
    fixedLevel: champions ? 50 : undefined,
    happiness: generation >= 2 && !champions,
    gender: generation >= 2,
    shiny: generation >= 2,
    nature: generation >= 3,
    abilities: generation >= 3 && !arceus && !letsGo && format !== LEGENDS_ZA,
    items: generation >= 2 && !arceus && !letsGo,
    tera: generation === 9 && !champions && format !== LEGENDS_ZA,
    ivs: !champions && !arceus,
    investment,
    maxStat:
      champions ? 32
      : arceus ? 10
      : letsGo ? 200
      : legacy ? 65535
      : generation <= 5 ? 255
      : 252,
    maxTotal:
      champions ? 66
      : legacy || arceus || letsGo ? undefined
      : 510,
    statKeys: legacy ? STAT_KEYS.filter(stat => stat !== "spd") : STAT_KEYS,
  } as const;
}

// Showdown stores DVs as doubled IVs; retain that representation in old links.
export const getDv = (member: Readonly<TeamPokemon>, stat: StatKey) =>
  Math.floor(getIv(member.ivs, stat) / 2);
export const hpDv = (member: Readonly<TeamPokemon>) =>
  (getDv(member, "atk") % 2) * 8 +
  (getDv(member, "def") % 2) * 4 +
  (getDv(member, "spe") % 2) * 2 +
  (getDv(member, "spa") % 2);
export const isShinyDv = (member: Readonly<TeamPokemon>) =>
  getDv(member, "def") === 10 &&
  getDv(member, "spe") === 10 &&
  getDv(member, "spa") === 10 &&
  getDv(member, "atk") % 4 >= 2;
export const dvGender = (member: Readonly<TeamPokemon>) => {
  const entry = pokedex[member.name];
  return (
    entry?.gender ??
    (getDv(member, "atk") >= (entry?.genderRatio?.F ?? 0.5) * 16 ? "M" : "F")
  );
};
export function syncDvs(member: TeamPokemon, generation: Generation) {
  setStat(member, "ivs", "spd", getIv(member.ivs, "spa"));
  setStat(member, "ivs", "hp", hpDv(member) * 2 + 1);
  if (generation === 2) {
    setDetail(member, "shiny", isShinyDv(member));
    setDetail(member, "gender", dvGender(member));
  }
}
export function setDv(
  member: TeamPokemon,
  stat: StatKey,
  value: number,
  generation: Generation,
) {
  if (stat === "hp") return;
  if (generation === 2 && member.shiny && !member.ivs)
    setLegacyShiny(member, true);
  setStat(
    member,
    "ivs",
    stat,
    Math.min(15, Math.max(0, Math.round(value))) * 2 + 1,
  );
  syncDvs(member, generation);
}
export function setLegacyShiny(member: TeamPokemon, shiny: boolean) {
  if (member.shiny && !member.ivs)
    for (const stat of ["def", "spe", "spa"] as const)
      setStat(member, "ivs", stat, 21);
  if (shiny) {
    for (const stat of ["def", "spe", "spa"] as const)
      setStat(member, "ivs", stat, 21);
    if (getDv(member, "atk") % 4 < 2) setStat(member, "ivs", "atk", 31);
  } else if (isShinyDv(member)) setStat(member, "ivs", "def", 31);
  syncDvs(member, 2);
}

// Showdown imports can mark a Gen 2 shiny without explicitly listing its DVs.
export function gen2Dvs(member: Readonly<TeamPokemon>) {
  if (!member.shiny || member.ivs) return member;
  const resolved = { ...member };
  setLegacyShiny(resolved, true);
  return resolved;
}

export const isShinyInGeneration = (
  member: Readonly<TeamPokemon>,
  generation: Generation,
) =>
  generation === 2 ?
    isShinyDv(gen2Dvs(member))
  : generation >= 2 && !!member.shiny;

// Legacy Showdown EVs encode the square root of stat experience, not modern EVs.
export const getStatExperience = (
  member: Readonly<TeamPokemon>,
  stat: StatKey,
) =>
  member.statExperience?.[stat] ??
  Math.min(65535, getEv(member.evs, stat) ** 2);
export function setStatExperience(
  member: TeamPokemon,
  stat: StatKey,
  value: number,
) {
  const experience = Math.min(65535, Math.max(0, Math.round(value)));
  const values = { ...member.statExperience, [stat]: experience };
  if (stat === "spa") values.spd = experience;
  setDetail(member, "statExperience", values);
  const normalized = Math.min(255, Math.ceil(Math.sqrt(experience)));
  setStat(member, "evs", stat, normalized);
  if (stat === "spa") setStat(member, "evs", "spd", normalized);
}

export const generationBit = (generation: Generation, format = "") =>
  format === CHAMPIONS_FORMAT ? 512
  : format === LEGENDS_ARCEUS ? 1024
  : format === LEGENDS_ZA ? 2048
  : format === LETS_GO ? 4096
  : 2 ** (generation - 1);
