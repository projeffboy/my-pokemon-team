import {
  generationRules,
  gen2Dvs,
  getDv,
  isShinyInGeneration,
} from "@/shared/generation-rules";
import { STAT_KEYS, type ReadonlyTeam, type SavedTeam } from "@/types";
import { getIv, MAX_IV } from "@/shared/set-details";
import type { TransferLoss } from "../generation-transfer";

type UniversalField =
  | "item"
  | "ability"
  | "nature"
  | "gender"
  | "shiny"
  | "happiness"
  | "teraType"
  | "ivs";

type Settings = Pick<SavedTeam, "generation" | "format">;

export function universalTransferChanges(
  from: Settings,
  to: Settings,
  team: ReadonlyTeam,
) {
  const before = generationRules(from.generation, from.format);
  const after = generationRules(to.generation, to.format);
  const members = team.filter(member => member.name);
  const customIvs = members.some(member => {
    const source = from.generation === 2 ? gen2Dvs(member) : member;
    return before.legacy ?
        before.statKeys.some(
          stat => stat !== "hp" && getDv(source, stat) !== 15,
        )
      : STAT_KEYS.some(stat => getIv(source.ivs, stat) !== MAX_IV);
  });
  const hasField = (field: UniversalField) =>
    field === "ivs" ? customIvs : (
      members.some(member => {
        if (field === "shiny")
          return isShinyInGeneration(member, from.generation);
        const value = member[field];
        return value !== undefined && value !== "";
      })
    );
  const hasTraining = members.some(member =>
    [
      before.investment === "effortLevels" ? member.effortLevels : member.evs,
      ...(before.legacy ? [member.statExperience] : []),
    ].some(stats => Object.values(stats ?? {}).some(value => (value ?? 0) > 0)),
  );
  const features: [UniversalField, boolean, boolean][] = [
    ["item", before.items, after.items],
    ["ability", before.abilities, after.abilities],
    ["nature", before.nature, after.nature],
    ["gender", before.gender, after.gender],
    ["shiny", before.shiny, after.shiny],
    ["happiness", before.happiness, after.happiness],
    ["teraType", before.tera, after.tera],
    ["ivs", before.ivs, after.ivs],
  ];
  const unsupported = features
    .filter(
      ([, supportedBefore, supportedAfter]) =>
        supportedBefore && !supportedAfter,
    )
    .map(([field]) => field);
  const removed = unsupported.filter(hasField);
  const fixedLevel =
    after.fixedLevel !== before.fixedLevel ? after.fixedLevel : undefined;
  const convertsIvs = after.ivs && before.legacy !== after.legacy;
  const ivsConversion =
    customIvs && convertsIvs ?
      after.legacy ?
        "dvs"
      : "ivs"
    : undefined;
  const training =
    hasTraining && before.investment !== after.investment ?
      { from: before.investment, to: after.investment }
    : undefined;
  const isUniversal = (loss: TransferLoss) =>
    unsupported.some(field => field === loss.field) ||
    (loss.field === "level" && fixedLevel !== undefined) ||
    (loss.field === "ivs" && convertsIvs);
  return { fixedLevel, removed, ivsConversion, training, isUniversal };
}
