import spreads from "@/data/hidden-power-spreads";
import {
  MOVE_KEYS,
  STAT_KEYS,
  type Gender,
  type Generation,
  type TeamPokemon,
} from "@/types";
import {
  dvGender,
  generationRules,
  gen2Dvs,
  getDv,
  isShinyDv,
  syncDvs,
} from "./generation-rules";
import {
  DEFAULT_LEVEL,
  getIv,
  MAX_IV,
  setDetail,
  setStat,
} from "./set-details";

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

const IV_ORDER = ["hp", "atk", "def", "spe", "spa", "spd"] as const;

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
  const bits = IV_ORDER.reduce(
    (sum, stat, i) => sum + (getIv(member.ivs, stat) % 2) * 2 ** i,
    0,
  );
  return TYPES[Math.floor((bits * 15) / 63)];
}

export function hiddenPowerPower(
  member: Readonly<TeamPokemon>,
  generation: Generation,
) {
  if (generation >= 6) return 60;
  if (generation === 2) {
    const resolved = gen2Dvs(member);
    const special = getDv(resolved, "spa");
    const bits =
      (special >> 3) +
      2 * (getDv(resolved, "spe") >> 3) +
      4 * (getDv(resolved, "def") >> 3) +
      8 * (getDv(resolved, "atk") >> 3);
    return Math.floor((5 * bits + (special % 4)) / 2 + 31);
  }
  const bits = IV_ORDER.reduce(
    (sum, stat, i) =>
      sum + (Math.floor(getIv(member.ivs, stat) / 2) % 2) * 2 ** i,
    0,
  );
  return Math.floor((bits * 40) / 63) + 30;
}

export const canHyperTrain = (
  member: Readonly<TeamPokemon>,
  generation: Generation,
) =>
  generation >= 7 &&
  (member.level ?? DEFAULT_LEVEL) >= (generation < 9 ? 100 : 50);

// A Hyper Trained 31 can come from either parity without changing its stat IV.
export function canHaveHiddenPowerType(
  member: Readonly<TeamPokemon>,
  type: string,
  generation: Generation,
  allowHyperTraining = true,
) {
  if (!allowHyperTraining || !canHyperTrain(member, generation))
    return hiddenPowerType(member, generation) === type;
  for (let bits = 0; bits < 64; bits++) {
    if (
      TYPES[Math.floor((bits * 15) / 63)] === type &&
      IV_ORDER.every(
        (stat, i) =>
          getIv(member.ivs, stat) === MAX_IV ||
          getIv(member.ivs, stat) % 2 === ((bits >> i) & 1),
      )
    )
      return true;
  }
  return false;
}

// Use Showdown's recommended spreads when the current IVs/DVs cannot produce the type.
// From Gen 6, where the IVs no longer change its power, only the IVs whose
// parity differs from the spread's change, each by one.
export function matchHiddenPower(
  member: TeamPokemon,
  move: string,
  generation: Generation,
  format = "",
  { allowHyperTraining = true }: { allowHyperTraining?: boolean } = {},
) {
  if (
    !move.startsWith("hiddenpower") ||
    generation === 1 ||
    !generationRules(generation, format).ivs
  )
    return;
  const type = move.slice("hiddenpower".length);
  const spread = spreads[type];
  if (
    !spread ||
    canHaveHiddenPowerType(member, type, generation, allowHyperTraining)
  )
    return;
  if (generation === 2) {
    const ivs = Object.fromEntries(
      STAT_KEYS.map(stat => [stat, (spread.dvs[stat] ?? 15) * 2 + 1]),
    );
    setDetail(member, "ivs", ivs);
    syncDvs(member, generation);
  } else if (generation >= 6) {
    for (const stat of STAT_KEYS) {
      const iv = getIv(member.ivs, stat);
      if (iv % 2 !== getIv(spread.ivs, stat) % 2)
        setStat(member, "ivs", stat, iv ^ 1);
    }
  } else {
    setDetail(
      member,
      "ivs",
      Object.keys(spread.ivs).length ? { ...spread.ivs } : undefined,
    );
  }
}

// After an edit that changes which IVs or DVs can give the slot's Hidden Power
// type, such as a level that loses Hyper Training. Shiny Gen 2 DVs only give
// Grass or Dragon, so the move follows the DVs rather than undoing the shiny.
export function rematchHiddenPower(
  member: TeamPokemon,
  generation: Generation,
  format = "",
) {
  const key = MOVE_KEYS.find(key => member[key].startsWith("hiddenpower"));
  if (!key) return;
  const move = member[key];
  if (generation !== 2 || !isShinyDv(gen2Dvs(member))) {
    matchHiddenPower(member, move, generation, format);
    return;
  }
  if (
    !generationRules(generation, format).ivs ||
    matchHiddenPowerPreservingDetails(member, move, generation, format)
  )
    return;
  const type = hiddenPowerType(member, generation);
  if (type) member[key] = `hiddenpower${type}`;
}

export function matchImportedHiddenPower(
  member: TeamPokemon,
  move: string,
  generation: Generation,
  format = "",
  options: { allowHyperTraining?: boolean } = {},
) {
  if (generation !== 2 || (!member.shiny && !member.gender)) {
    matchHiddenPower(member, move, generation, format, options);
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

// Match a new move without changing the set's Gen 2 shiny or gender choices.
export function matchHiddenPowerPreservingDetails(
  member: TeamPokemon,
  move: string,
  generation: Generation,
  format = "",
  options: { preserveIvs?: boolean; gender?: Gender } = {},
) {
  if (!move.startsWith("hiddenpower") || move === "hiddenpower") return true;
  const candidate = { ...member };
  const legacy = generation === 2 ? gen2Dvs(member) : undefined;
  const gender = options.gender ?? (legacy && dvGender(legacy));
  if (legacy) {
    candidate.gender = gender;
    candidate.shiny = isShinyDv(legacy);
  }
  matchImportedHiddenPower(candidate, move, generation, format);
  if (
    !canHaveHiddenPowerType(
      candidate,
      move.slice("hiddenpower".length),
      generation,
    ) ||
    (legacy &&
      (dvGender(gen2Dvs(candidate)) !== gender ||
        isShinyDv(gen2Dvs(candidate)) !== isShinyDv(legacy))) ||
    (options.preserveIvs &&
      STAT_KEYS.some(
        stat => getIv(candidate.ivs, stat) !== getIv(member.ivs, stat),
      ))
  )
    return false;
  setDetail(member, "ivs", candidate.ivs);
  return true;
}
