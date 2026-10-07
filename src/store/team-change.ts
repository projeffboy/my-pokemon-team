import {
  generationRules,
  getDv,
  gen2Dvs,
  getStatExperience,
} from "@/shared/generation-rules";
import type { Generation } from "@/types";
import { MOVE_KEYS, type ReadonlyTeam } from "@/types";
import {
  DEFAULT_LEVEL,
  DEFAULT_HAPPINESS,
  getEv,
  getIv,
} from "@/shared/set-details";
import { english, type Translation } from "@/i18n/translation";
import { stableJson } from "./teams-storage";

// Describe the original edit for both Undo and Redo.
export function describeTeamChange(
  before: ReadonlyTeam,
  after: ReadonlyTeam,
  { t, names }: Translation = english,
  generation: Generation = 9,
  format = "",
): string | undefined {
  const changedSlots = after.flatMap((member, index) =>
    stableJson(member) === stableJson(before[index]) ? [] : [index],
  );
  const [first, second] = changedSlots;
  if (
    changedSlots.length === 2 &&
    first !== undefined &&
    second !== undefined &&
    stableJson(before[first]) === stableJson(after[second]) &&
    stableJson(before[second]) === stableJson(after[first])
  ) {
    const firstName = after[first]?.name;
    const secondName = after[second]?.name;
    if (!firstName || !secondName) {
      const occupied = firstName ? first : second;
      return t.team.pokemonInSlot(
        names.pokemon(after[occupied]?.name ?? ""),
        occupied + 1,
      );
    }
    const label = (name: string, index: number) =>
      firstName === secondName ?
        t.advanced.subtitle(names.pokemon(name), index + 1)
      : names.pokemon(name);
    return t.team.swappedSlots(
      label(firstName, first),
      label(secondName, second),
    );
  }

  const rules = generationRules(generation, format);
  const changes: string[] = [];
  for (const index of changedSlots) {
    const previous = before[index];
    const current = after[index];
    if (!previous || !current) continue;
    const previousDvs = generation === 2 ? gen2Dvs(previous) : previous;
    const currentDvs = generation === 2 ? gen2Dvs(current) : current;
    if (previous.name !== current.name) {
      changes.push(
        current.name ?
          t.team.pokemonInSlot(names.pokemon(current.name), index + 1)
        : t.team.removedPokemon(names.pokemon(previous.name), index + 1),
      );
      continue;
    }

    const pokemonName = names.pokemon(current.name) || t.team.slot(index + 1);
    const hasDuplicate = after.some(
      (member, otherIndex) =>
        otherIndex !== index && member.name === current.name,
    );
    const pokemon =
      hasDuplicate ? t.advanced.subtitle(pokemonName, index + 1) : pokemonName;
    const add = (
      label: string,
      oldValue: string | number,
      newValue: string | number,
    ) => {
      if (oldValue !== newValue)
        changes.push(
          t.team.setValue(
            label,
            String(newValue === "" ? t.none : newValue),
            pokemon,
          ),
        );
    };
    const addValue = (oldValue: string, newValue: string) => {
      if (oldValue === newValue) return;
      changes.push(
        !newValue ? t.team.removedValue(oldValue, pokemon)
        : !oldValue ? t.team.addedValue(newValue, pokemon)
        : t.team.replacedValue(oldValue, newValue, pokemon),
      );
    };
    for (const key of MOVE_KEYS)
      addValue(names.move(previous[key]), names.move(current[key]));
    addValue(names.item(previous.item), names.item(current.item));
    addValue(names.ability(previous.ability), names.ability(current.ability));
    add(t.advanced.nickname, previous.nickname ?? "", current.nickname ?? "");
    add(
      t.advanced.level,
      previous.level ?? DEFAULT_LEVEL,
      current.level ?? DEFAULT_LEVEL,
    );
    add(
      t.advanced.happiness,
      previous.happiness ?? DEFAULT_HAPPINESS,
      current.happiness ?? DEFAULT_HAPPINESS,
    );
    add(
      t.advanced.gender,
      previous.gender ? t.genders[previous.gender] : t.any,
      current.gender ? t.genders[current.gender] : t.any,
    );
    add(
      t.advanced.shiny,
      previous.shiny ? t.advanced.shiny : t.none,
      current.shiny ? t.advanced.shiny : t.none,
    );
    add(
      t.advanced.teraType,
      names.type(previous.teraType ?? ""),
      names.type(current.teraType ?? ""),
    );
    add(
      t.advanced.nature,
      names.nature(previous.nature ?? ""),
      names.nature(current.nature ?? ""),
    );
    for (const stat of rules.statKeys) {
      const label =
        rules.legacy && stat === "spa" ? t.info.special : t.statNames[stat];
      add(
        `${label} ${t.advanced[rules.investment]}`,
        rules.legacy ? getStatExperience(previous, stat)
        : rules.investment === "effortLevels" ?
          (previous.effortLevels?.[stat] ?? 0)
        : getEv(previous.evs, stat),
        rules.legacy ? getStatExperience(current, stat)
        : rules.investment === "effortLevels" ?
          (current.effortLevels?.[stat] ?? 0)
        : getEv(current.evs, stat),
      );
      if (rules.ivs)
        add(
          `${label} ${rules.legacy ? t.advanced.dvs : t.advanced.ivs}`,
          rules.legacy ? getDv(previousDvs, stat) : getIv(previous.ivs, stat),
          rules.legacy ? getDv(currentDvs, stat) : getIv(current.ivs, stat),
        );
    }
  }
  if (!changes.length) return undefined;
  const summary = changes.slice(0, 2);
  if (changes.length > 2) summary.push(t.team.moreChanges(changes.length - 2));
  return summary.join("; ");
}
