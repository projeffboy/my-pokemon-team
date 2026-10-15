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
import {
  COMBINED_GENERATIONS_FORMAT,
  teamDataFormat,
} from "@/shared/generation-profile";
import {
  createEmptyTeam,
  getAutoSelectedItem,
  requiredItemReplacement,
} from "@/shared/team";
import {
  generationRules,
  generationBit,
  hpDv,
  getDv,
  syncDvs,
  setLegacyShiny,
  gen2Dvs,
  dvGender,
  isShinyDv,
} from "@/shared/generation-rules";
import {
  DEFAULT_LEVEL,
  genderOptions,
  getIv,
  MAX_IV,
  setDetail,
  setStat,
} from "@/shared/set-details";
import {
  hiddenPowerType,
  matchHiddenPowerPreservingDetails,
} from "@/shared/hidden-power";
import { nicknameLimit, shortenNickname } from "@/shared/nickname";
import pokedex from "@/data/pokedex";
import hiddenPowerSpreads from "@/data/hidden-power-spreads";
import { pokemonNameInverse } from "@/shared/names";
import { pokemonAbilities } from "@/shared/pokedex";
import { LATEST_GENERATION } from "@/shared/generations";
import type { Locale } from "@/i18n/locales";
import { filterPokemon } from "./filtering";
import { generationLearnset } from "./learnsets";
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
  from: Pick<SavedTeam, "generation" | "format" | "generationProfile">,
  generation: Generation,
  format: string,
  data: GenerationTransferData,
  locale: Locale = "en",
): { team: Team; losses: TransferLoss[] } {
  const bit = generationBit(generation, format);
  const rules = generationRules(generation, format);
  const previousRules = generationRules(from.generation, teamDataFormat(from));
  const combined = format === COMBINED_GENERATIONS_FORMAT;
  const has = (mask: number | undefined) => !!((mask ?? 0) & bit);
  // The regular latest generation's editor is National Dex, so it keeps what that editor offers
  const nationalDex =
    generation === LATEST_GENERATION && !format ?
      new Set(filterPokemon({ generation, format, type: "", region: "" }))
    : undefined;
  const isAvailable = (pokemon: string) =>
    nationalDex ?
      nationalDex.has(pokemon)
    : has(data.pokemon[pokemon]?.generations);
  const losses: TransferLoss[] = [];
  const result = team.map((original, index) => {
    const source = {
      ...(from.generation === 2 ? gen2Dvs(original) : original),
    };
    if (previousRules.legacy) {
      for (const stat of STAT_KEYS)
        setStat(source, "ivs", stat, getDv(source, stat) * 2 + 1);
      syncDvs(source, from.generation);
    }
    const member = {
      ...original,
      ...(original.evs && { evs: { ...original.evs } }),
      ...(source.ivs && { ivs: { ...source.ivs } }),
    };
    if (!member.name) return member;
    if (from.generation === 2) {
      setDetail(member, "shiny", source.shiny);
      if (rules.gender) setDetail(member, "gender", source.gender);
    }
    let entry = data.pokemon[member.name];
    const loss = (field: TransferField, value?: string) =>
      losses.push({
        index,
        pokemon: original.name,
        field,
        ...(value && { value }),
      });
    if (member.name && !isAvailable(member.name)) {
      // A battle forme returns to the forme it changes from, such as
      // Meowstic-F-Mega to Meowstic-F, before its base species
      const { changesFrom, baseSpecies } = pokedex[member.name] ?? {};
      const base = [changesFrom, baseSpecies]
        .map(species => species && pokemonNameInverse(species))
        .find(species => species && isAvailable(species));
      if (!base) {
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
      entry = data.pokemon[base];
      if (member.gender && !genderOptions(base).includes(member.gender)) {
        loss("gender");
        delete member.gender;
      }
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
    } else if (
      member.level === undefined &&
      previousRules.fixedLevel !== undefined
    )
      member.level = previousRules.fixedLevel;
    // The combined profile spans games that use either version, so it keeps both
    const itemReplacement =
      rules.items &&
      !(combined && has(data.items[member.item])) &&
      requiredItemReplacement(member.name, member.item, item =>
        has(data.items[item]),
      );
    if (itemReplacement) {
      losses.push({
        index,
        pokemon: original.name,
        field: "item",
        value: member.item,
        replacement: itemReplacement,
      });
      member.item = itemReplacement;
    } else if (
      member.item &&
      (!rules.items ||
        !(
          has(data.items[member.item]) ||
          // The editor gives a pokemon its required item even when the game lacks it,
          // e.g. Bug Memory for Silvally-Bug in Gen 9
          getAutoSelectedItem(member.name, "", item =>
            has(data.items[item]),
          ) === member.item
        ))
    ) {
      loss("item", member.item);
      member.item = "";
    }
    const abilities =
      !rules.abilities ? []
      : nationalDex ? pokemonAbilities(member.name, generation)
      : Object.entries(entry?.abilities ?? {})
          .filter(([, mask]) => has(mask))
          .map(([ability]) => ability)
          .filter(
            (ability, _, available) =>
              !combined || ability !== "No Ability" || available.length === 1,
          );
    if (member.ability && !abilities.includes(member.ability)) {
      const replacement =
        (combined || member.name !== original.name) && abilities.length === 1 ?
          abilities[0]
        : undefined;
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
    const learnset =
      nationalDex && new Set(generationLearnset(member.name, generation));
    for (const key of MOVE_KEYS) {
      const move = member[key];
      const id = move.startsWith("hiddenpower") ? "hiddenpower" : move;
      if (move && !(learnset ? learnset.has(move) : has(entry?.moves[id]))) {
        loss("move", move);
        member[key] = "";
      }
    }
    if (from.generation === 2 && !rules.legacy) {
      const source = gen2Dvs(original);
      setDetail(member, "shiny", isShinyDv(source));
      member.gender = dvGender(source);
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
    removeDetail("happiness", !rules.happiness);
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
      const sourceStat = (stat: (typeof STAT_KEYS)[number]) =>
        from.generation === 1 && stat === "spd" ? "spa" : stat;
      const before = Object.fromEntries(
        STAT_KEYS.map(stat => [
          stat,
          previousRules.legacy ?
            getDv(source, sourceStat(stat))
          : getIv(source.ivs, stat),
        ]),
      );
      member.ivs = Object.fromEntries(
        STAT_KEYS.map(stat => [
          stat,
          previousRules.legacy ?
            getIv(source.ivs, sourceStat(stat))
          : Math.floor(getIv(source.ivs, stat) / 2) * 2 + 1,
        ]),
      );
      if (generation === 2 && original.shiny) setLegacyShiny(member, true);
      else if (rules.legacy) syncDvs(member, generation);
      if (from.generation === 2) {
        const type = hiddenPowerType(source, 2);
        const spread =
          type && MOVE_KEYS.some(key => member[key] === `hiddenpower${type}`) ?
            hiddenPowerSpreads[type]
          : undefined;
        if (spread)
          for (const stat of STAT_KEYS)
            setStat(
              member,
              "ivs",
              stat,
              getDv(source, stat) * 2 + (getIv(spread.ivs, stat) % 2),
            );
      }
      const after = Object.fromEntries(
        STAT_KEYS.map(stat => [
          stat,
          rules.legacy ? getDv(member, stat) : getIv(member.ivs, stat),
        ]),
      );
      if (STAT_KEYS.some(stat => getIv(source.ivs, stat) !== MAX_IV))
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
    const convertedIvs = member.ivs;
    let matchedHiddenPowerType: string | undefined;
    for (const key of MOVE_KEYS) {
      const move = member[key];
      if (
        !move.startsWith("hiddenpower") ||
        move === "hiddenpower" ||
        !rules.ivs
      )
        continue;
      if (
        matchedHiddenPowerType ||
        (!matchHiddenPowerPreservingDetails(member, move, generation, format, {
          gender: generation === 2 ? original.gender : undefined,
        }) &&
          !matchHiddenPowerPreservingDetails(member, move, generation, format))
      ) {
        const type =
          matchedHiddenPowerType ?? hiddenPowerType(member, generation);
        if (type && move !== `hiddenpower${type}`) {
          member[key] = `hiddenpower${type}`;
          losses.push({
            index,
            pokemon: original.name,
            field: "move",
            value: move,
            replacement: member[key],
          });
        }
      }
      matchedHiddenPowerType = member[key].slice("hiddenpower".length);
    }
    if (
      STAT_KEYS.some(
        stat => getIv(convertedIvs, stat) !== getIv(member.ivs, stat),
      )
    ) {
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
          from: rules.legacy ? "dvs" : "ivs",
          to: rules.legacy ? "dvs" : "ivs",
          before: Object.fromEntries(
            STAT_KEYS.map(stat => [
              stat,
              rules.legacy ?
                Math.floor(getIv(convertedIvs, stat) / 2)
              : getIv(convertedIvs, stat),
            ]),
          ),
          after,
          limited: false,
          approximate: false,
        },
      });
    }
    if (generation === 2) {
      if (member.shiny) setLegacyShiny(member, true);
      else syncDvs(member, generation);
      if (original.gender && member.gender !== original.gender)
        losses.push({
          index,
          pokemon: original.name,
          field: "gender",
          value: original.gender,
          replacement: member.gender,
        });
    }
    return member;
  });
  return { team: result, losses };
}
