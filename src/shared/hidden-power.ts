import spreads from "@/data/hidden-power-spreads";
import { STAT_KEYS, type Generation, type TeamPokemon } from "@/types";
import { generationRules, gen2Dvs, getDv, syncDvs } from "./generation-rules";
import { getIv, setDetail } from "./set-details";

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
