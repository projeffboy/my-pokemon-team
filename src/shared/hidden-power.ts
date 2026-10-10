import spreads from "@/data/hidden-power-spreads";
import { STAT_KEYS, type Generation, type TeamPokemon } from "@/types";
import {
  dvGender,
  generationRules,
  gen2Dvs,
  getDv,
  syncDvs,
} from "./generation-rules";
import { getIv, MAX_IV, setDetail } from "./set-details";

const TYPES = [
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
] as const;

export function hiddenPowerType(
  member: Readonly<TeamPokemon>,
  generation: Generation,
) {
  if (generation === 2) {
    const resolved = gen2Dvs(member);
    return TYPES[
      (getDv(resolved, "atk") % 4) * 4 + (getDv(resolved, "def") % 4)
    ];
  }
  const bits = (["hp", "atk", "def", "spe", "spa", "spd"] as const).reduce(
    (sum, stat, i) => sum + (getIv(member.ivs, stat) % 2) * 2 ** i,
    0,
  );
  return TYPES[Math.floor((bits * 15) / 63)];
}

// Use Showdown's recommended spreads when the current IVs/DVs cannot produce the type.
export function matchHiddenPower(
  member: TeamPokemon,
  move: string,
  generation: Generation,
  format = "",
) {
  if (
    !move.startsWith("hiddenpower") ||
    generation === 1 ||
    !generationRules(generation, format).ivs
  )
    return;
  const type = move.slice("hiddenpower".length);
  const spread = spreads[type];
  if (!spread || hiddenPowerType(member, generation) === type) return;
  if (generation === 2) {
    const ivs = Object.fromEntries(
      STAT_KEYS.map(stat => [stat, (spread.dvs[stat] ?? 15) * 2 + 1]),
    );
    setDetail(member, "ivs", ivs);
    syncDvs(member, generation);
  } else {
    setDetail(
      member,
      "ivs",
      Object.keys(spread.ivs).length ? { ...spread.ivs } : undefined,
    );
  }
}

export function matchImportedHiddenPower(
  member: TeamPokemon,
  move: string,
  generation: Generation,
  format = "",
) {
  if (generation !== 2 || (!member.shiny && !member.gender)) {
    matchHiddenPower(member, move, generation, format);
    return;
  }
  const type = move.slice("hiddenpower".length);
  const spread = spreads[type];
  if (
    !move.startsWith("hiddenpower") ||
    !spread ||
    !generationRules(generation, format).ivs
  )
    return;
  if (
    hiddenPowerType(member, generation) === type &&
    (!member.gender || dvGender(gen2Dvs(member)) === member.gender)
  )
    return;

  for (let atk = 15; atk >= 0; atk--) {
    const dvs = {
      ...spread.dvs,
      ...(member.shiny ? { def: 10, spe: 10, spa: 10 } : {}),
      atk,
    };
    const candidate = {
      ...member,
      ivs: Object.fromEntries(
        STAT_KEYS.map(stat => [stat, (dvs[stat] ?? 15) * 2 + 1]),
      ),
    };
    syncDvs(candidate, generation);
    if (
      hiddenPowerType(candidate, generation) === type &&
      (!member.shiny || candidate.shiny) &&
      (!member.gender || candidate.gender === member.gender)
    ) {
      const ivs = Object.fromEntries(
        Object.entries(candidate.ivs).filter(([, value]) => value !== MAX_IV),
      );
      setDetail(member, "ivs", Object.keys(ivs).length ? ivs : undefined);
      return;
    }
  }
}
