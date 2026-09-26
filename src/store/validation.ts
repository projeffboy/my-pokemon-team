import pokedex from "@/data/pokedex";
import { MOVE_KEYS, type Generation, type ReadonlyTeam } from "@/types";
import { isDoublesFormat } from "@/shared/formats";
import { generationLabel, LATEST_GENERATION } from "@/shared/generations";
import {
  itemName,
  itemNameInverse,
  moveName,
  pokemonName,
} from "@/shared/names";
import { pokemonAbilities } from "@/shared/pokedex";
import {
  evTotal,
  getEv,
  MAX_EV,
  MAX_EV_TOTAL,
  MAX_LEVEL,
} from "@/shared/set-details";
import { filterPokemon } from "./filtering";

// The problems that stop a team from being legal in its format, or none
export function validateTeam(
  team: ReadonlyTeam,
  generation: Generation,
  format: string,
): string[] {
  const members = team.filter(({ name }) => name);
  if (!members.length) return ["The team is empty."];

  const problems: string[] = [];
  const allowed = new Set(
    filterPokemon({ generation, format, region: "", type: "", ability: "" }),
  );
  const where = `${generationLabel(generation)}${format ? ` ${format}` : ""}`;
  const species = (pokemon: string) =>
    pokedex[pokemon]?.baseSpecies ?? pokemonName(pokemon) ?? pokemon;

  for (const member of members) {
    const { name, item, ability } = member;
    const label = pokemonName(name) ?? name;
    const entry = pokedex[name];

    if (!allowed.has(name))
      problems.push(`${label} is not allowed in ${where}.`);

    if (ability && !pokemonAbilities(name).includes(ability))
      problems.push(`${label} cannot have ${ability}.`);

    const required = [
      ...(entry?.requiredItem ? [entry.requiredItem] : []),
      ...(entry?.requiredItems ?? []),
    ].map(itemNameInverse);
    if (required.length && !required.includes(item))
      problems.push(
        `${label} must hold ${required.map(id => itemName(id ?? "")).join(" or ")}.`,
      );

    const moves = MOVE_KEYS.map(key => member[key]).filter(move => move);
    const repeated = moves.find((move, i) => moves.indexOf(move) !== i);
    if (repeated) problems.push(`${label} has ${moveName(repeated)} twice.`);

    const total = evTotal(member.evs);
    if (total > MAX_EV_TOTAL)
      problems.push(`${label} has ${total} EVs (at most ${MAX_EV_TOTAL}).`);
    if (
      [...(member.evs ? Object.keys(member.evs) : [])].some(
        stat => getEv(member.evs, stat as never) > MAX_EV,
      )
    )
      problems.push(`${label} has more than ${MAX_EV} EVs in one stat.`);

    if (
      member.level !== undefined &&
      (member.level < 1 || member.level > MAX_LEVEL)
    )
      problems.push(`${label}'s level must be 1 to ${MAX_LEVEL}.`);

    if (member.teraType && generation !== LATEST_GENERATION)
      problems.push(`${label} has a Tera Type, which only exists in Gen 9.`);
  }

  const seenSpecies = new Set<string>();
  for (const { name } of members) {
    const base = species(name);
    if (seenSpecies.has(base))
      problems.push(`Two pokemon are ${base} (Species Clause).`);
    seenSpecies.add(base);
  }

  if (isDoublesFormat(format)) {
    const seenItems = new Set<string>();
    for (const { item } of members) {
      if (!item) continue;
      if (seenItems.has(item))
        problems.push(`Two pokemon hold ${itemName(item)} (Item Clause).`);
      seenItems.add(item);
    }
  }

  return [...new Set(problems)];
}
