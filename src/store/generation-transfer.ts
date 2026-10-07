import {
  MOVE_KEYS,
  STAT_KEYS,
  type Generation,
  type GenerationTransferData,
  type ReadonlyTeam,
  type SavedTeam,
  type Team,
  type TeamPokemonDetails,
} from "@/types";
import { createEmptyTeam } from "@/shared/team";
import {
  generationRules,
  generationBit,
  hpDv,
  getDv,
  syncDvs,
  setLegacyShiny,
  gen2Dvs,
} from "@/shared/generation-rules";
import { DEFAULT_LEVEL, getIv } from "@/shared/set-details";
import { nicknameLimit, shortenNickname } from "@/shared/nickname";
import pokedex from "@/data/pokedex";
import { pokemonNameInverse } from "@/shared/names";
import type { Locale } from "@/i18n/locales";
import {
  convertTraining,
  type TrainingConversion,
} from "./generation-transfer/training";

export type TransferField =
  "pokemon" | "move" | "item" | "ability" | keyof TeamPokemonDetails;
export interface TransferLoss {
  index: number;
  pokemon: string;
  field: TransferField;
  value?: string;
  replacement?: string;
  conversion?: TrainingConversion;
}

// Adapt a copy of the team; no format tiers or user search filters affect transferability.
export function planGenerationTransfer(
  team: ReadonlyTeam,
  from: Pick<SavedTeam, "generation" | "format">,
  generation: Generation,
  format: string,
  data: GenerationTransferData,
  locale: Locale = "en",
): { team: Team; losses: TransferLoss[] } {
  const bit = generationBit(generation, format);
  const rules = generationRules(generation, format);
  const previousRules = generationRules(from.generation, from.format);
  const has = (mask: number | undefined) => !!((mask ?? 0) & bit);
  const losses: TransferLoss[] = [];
  const result = team.map((original, index) => {
    const member = {
      ...original,
      ...(original.evs && { evs: { ...original.evs } }),
      ...(original.ivs && { ivs: { ...original.ivs } }),
    };
    if (!member.name) return member;
    let entry = data.pokemon[member.name];
    const loss = (field: TransferField, value?: string) =>
      losses.push({
        index,
        pokemon: original.name,
        field,
        ...(value && { value }),
      });
    if (member.name && !has(entry?.generations)) {
      const baseSpecies = pokedex[member.name]?.baseSpecies;
      const base = baseSpecies && pokemonNameInverse(baseSpecies);
      const baseEntry = base ? data.pokemon[base] : undefined;
      if (!base || !baseEntry || !has(baseEntry.generations)) {
        loss("pokemon", member.name);
        return createEmptyTeam()[0] ?? member;
      }
      losses.push({
        index,
        pokemon: original.name,
        field: "pokemon",
        value: member.name,
        replacement: base,
      });
      member.name = base;
      entry = baseEntry;
    }
    const maxNicknameLength = nicknameLimit(generation, locale);
    if (member.nickname && member.nickname.length > maxNicknameLength) {
      const replacement = shortenNickname(
        member.nickname,
        maxNicknameLength,
      ).trim();
      losses.push({
        index,
        pokemon: original.name,
        field: "nickname",
        value: member.nickname,
        replacement,
      });
      member.nickname = replacement;
    }
    if (rules.fixedLevel !== undefined) {
      const level = member.level ?? previousRules.fixedLevel ?? DEFAULT_LEVEL;
      if (level !== rules.fixedLevel)
        losses.push({
          index,
          pokemon: original.name,
          field: "level",
          value: String(level),
          replacement: String(rules.fixedLevel),
        });
      member.level = rules.fixedLevel;
    }
    if (member.item && (!rules.items || !has(data.items[member.item]))) {
      loss("item", member.item);
      member.item = "";
    }
    if (
      member.ability &&
      (!rules.abilities || !has(entry?.abilities[member.ability]))
    ) {
      const abilities =
        member.name !== original.name && rules.abilities ?
          Object.entries(entry?.abilities ?? {})
            .filter(([, mask]) => has(mask))
            .map(([ability]) => ability)
        : [];
      const replacement = abilities.length === 1 ? abilities[0] : undefined;
      if (replacement)
        losses.push({
          index,
          pokemon: original.name,
          field: "ability",
          value: member.ability,
          replacement,
        });
      else loss("ability", member.ability);
      member.ability = replacement ?? "";
    }
    for (const key of MOVE_KEYS) {
      const move = member[key];
      const id = move.startsWith("hiddenpower") ? "hiddenpower" : move;
      if (move && !has(entry?.moves[id])) {
        loss("move", move);
        member[key] = "";
      }
    }
    const removeDetail = (
      key: keyof TeamPokemonDetails,
      unsupported: boolean,
    ) => {
      if (unsupported && member[key] !== undefined) {
        loss(key);
        delete member[key];
      }
    };
    removeDetail("nature", generation < 3);
    removeDetail("gender", generation === 1);
    removeDetail("shiny", generation === 1);
    removeDetail("teraType", !rules.tera);
    const training = convertTraining(original, previousRules, rules);
    if (training) {
      if (training.conversion)
        losses.push({
          index,
          pokemon: original.name,
          field: previousRules.legacy ? "statExperience" : "evs",
          conversion: training.conversion,
        });
      member.evs = Object.fromEntries(
        Object.entries(training.values).filter(([, value]) => value !== 0),
      );
      if (!Object.keys(member.evs).length) delete member.evs;
      if (
        (rules.legacy && original.statExperience) ||
        (rules.legacy && training.conversion)
      )
        member.statExperience = training.after;
      else delete member.statExperience;
    } else {
      removeDetail("statExperience", !rules.legacy);
      removeDetail("evs", previousRules.investment !== rules.investment);
    }
    removeDetail("effortLevels", rules.investment !== "effortLevels");
    removeDetail("ivs", !rules.ivs);
    if (rules.ivs && previousRules.legacy !== rules.legacy) {
      const source = from.generation === 2 ? gen2Dvs(original) : original;
      const before = Object.fromEntries(
        STAT_KEYS.map(stat => [
          stat,
          previousRules.legacy ? getDv(source, stat) : getIv(source.ivs, stat),
        ]),
      );
      member.ivs = Object.fromEntries(
        STAT_KEYS.map(stat => [
          stat,
          previousRules.legacy ?
            getIv(source.ivs, stat)
          : Math.floor(getIv(source.ivs, stat) / 2) * 2 + 1,
        ]),
      );
      if (rules.legacy) syncDvs(member, generation);
      if (generation === 2 && member.shiny) setLegacyShiny(member, true);
      const after = Object.fromEntries(
        STAT_KEYS.map(stat => [
          stat,
          rules.legacy ? getDv(member, stat) : getIv(member.ivs, stat),
        ]),
      );
      losses.push({
        index,
        pokemon: original.name,
        field: "ivs",
        conversion: {
          from: previousRules.legacy ? "dvs" : "ivs",
          to: rules.legacy ? "dvs" : "ivs",
          before,
          after,
          limited: false,
          approximate: true,
        },
      });
    } else if (
      rules.legacy &&
      (getIv(member.ivs, "spa") !== getIv(member.ivs, "spd") ||
        getDv(member, "hp") !== hpDv(member))
    )
      syncDvs(member, generation);
    if (generation === 2) {
      if (member.shiny) setLegacyShiny(member, true);
      else syncDvs(member, generation);
    }
    return member;
  });
  return { team: result, losses };
}
