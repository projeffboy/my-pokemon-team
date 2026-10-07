import { generationRules } from "@/shared/generation-rules";
import type { SavedTeam } from "@/types";
import type { TransferLoss } from "../generation-transfer";

type UniversalField =
  "item" | "ability" | "nature" | "gender" | "shiny" | "teraType" | "ivs";

type Settings = Pick<SavedTeam, "generation" | "format">;

export function universalTransferChanges(from: Settings, to: Settings) {
  const before = generationRules(from.generation, from.format);
  const after = generationRules(to.generation, to.format);
  const features: [UniversalField, boolean, boolean][] = [
    ["item", before.items, after.items],
    ["ability", before.abilities, after.abilities],
    ["nature", before.nature, after.nature],
    ["gender", before.gender, after.gender],
    ["shiny", before.shiny, after.shiny],
    ["teraType", before.tera, after.tera],
    ["ivs", before.ivs, after.ivs],
  ];
  const removed = features
    .filter(
      ([, supportedBefore, supportedAfter]) =>
        supportedBefore && !supportedAfter,
    )
    .map(([field]) => field);
  const fixedLevel =
    after.fixedLevel !== before.fixedLevel ? after.fixedLevel : undefined;
  const ivsConversion =
    after.ivs && before.legacy !== after.legacy ?
      after.legacy ?
        "dvs"
      : "ivs"
    : undefined;
  const training =
    before.investment !== after.investment ?
      { from: before.investment, to: after.investment }
    : undefined;
  const isUniversal = (loss: TransferLoss) =>
    removed.some(field => field === loss.field) ||
    (loss.field === "level" && fixedLevel !== undefined) ||
    (loss.field === "ivs" && ivsConversion !== undefined);
  return { fixedLevel, removed, ivsConversion, training, isUniversal };
}
