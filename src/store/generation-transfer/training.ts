import { STAT_KEYS, type BaseStats, type TeamPokemon } from "@/types";
import { generationRules, getStatExperience } from "@/shared/generation-rules";
import { getEv } from "@/shared/set-details";

type Rules = ReturnType<typeof generationRules>;
export interface TrainingConversion {
  from: Rules["investment"] | "ivs" | "dvs";
  to: Rules["investment"] | "ivs" | "dvs";
  before: Partial<BaseStats>;
  after: Partial<BaseStats>;
  limited: boolean;
  approximate: boolean;
}

const convertible = (system: Rules["investment"]) =>
  system === "evs" || system === "sps" || system === "statExperience";

export function convertTraining(
  member: Readonly<TeamPokemon>,
  from: Rules,
  to: Rules,
) {
  if (!convertible(from.investment) || !convertible(to.investment)) return;
  const before = Object.fromEntries(
    STAT_KEYS.map(stat => [
      stat,
      from.legacy ? getStatExperience(member, stat) : getEv(member.evs, stat),
    ]),
  ) as BaseStats;
  const values = Object.fromEntries(
    STAT_KEYS.map(stat => {
      const ev =
        from.legacy ? Math.min(255, Math.ceil(Math.sqrt(before[stat])))
        : from.investment === "sps" ? Math.max(0, before[stat] * 8 - 4)
        : before[stat];
      return [stat, to.investment === "sps" ? Math.floor((ev + 4) / 8) : ev];
    }),
  ) as BaseStats;
  if (to.legacy) values.spa = values.spd = Math.max(values.spa, values.spd);
  const max = to.legacy ? 255 : to.maxStat;
  let limited = false;
  for (const stat of STAT_KEYS) {
    if (values[stat] > max) limited = true;
    values[stat] = Math.min(max, values[stat]);
  }
  const total = STAT_KEYS.reduce((sum, stat) => sum + values[stat], 0);
  const cap = to.maxTotal;
  if (cap !== undefined && total > cap) {
    limited = true;
    const step = to.investment === "sps" ? 1 : 4;
    const scaled = STAT_KEYS.map(stat => ({
      stat,
      value: (values[stat] * cap) / total / step,
    }));
    for (const { stat, value } of scaled)
      values[stat] = Math.floor(value) * step;
    let remaining =
      cap - STAT_KEYS.reduce((sum, stat) => sum + values[stat], 0);
    scaled.sort((a, b) => (b.value % 1) - (a.value % 1));
    for (const { stat } of scaled) {
      if (remaining < step) break;
      if (values[stat] + step <= max) {
        values[stat] += step;
        remaining -= step;
      }
    }
  }
  const after =
    from.legacy && to.legacy ?
      before
    : (Object.fromEntries(
        STAT_KEYS.map(stat => [
          stat,
          to.legacy ? values[stat] ** 2 : values[stat],
        ]),
      ) as BaseStats);
  const changed =
    from.investment !== to.investment ||
    STAT_KEYS.some(stat => before[stat] !== after[stat]);
  const conversion: TrainingConversion | undefined =
    changed && STAT_KEYS.some(stat => before[stat] !== 0) ?
      {
        from: from.investment,
        to: to.investment,
        before,
        after,
        limited,
        approximate: from.legacy !== to.legacy,
      }
    : undefined;
  return { values, after, conversion };
}
