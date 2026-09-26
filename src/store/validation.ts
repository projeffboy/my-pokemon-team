import pokedex from "@/data/pokedex";
import { MOVE_KEYS, type Generation, type ReadonlyTeam } from "@/types";
import { isDoublesFormat } from "@/shared/formats";
import { LATEST_GENERATION } from "@/shared/generations";
import { itemNameInverse, pokemonNameInverse } from "@/shared/names";
import { pokemonAbilities } from "@/shared/pokedex";
import { english, type Translation } from "@/i18n/translation";
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
  { t, names }: Translation = english,
): string[] {
  const members = team.filter(({ name }) => name);
  if (!members.length) return [t.validation.empty];

  const problems: string[] = [];
  const allowed = new Set(
    filterPokemon({ generation, format, region: "", type: "", ability: "" }),
  );
  const where = `${t.generation(generation)}${format ? ` ${format}` : ""}`;
  const species = (pokemon: string) => {
    const base = pokedex[pokemon]?.baseSpecies;
    return (base && pokemonNameInverse(base)) || pokemon;
  };

  for (const member of members) {
    const { name, item, ability } = member;
    const label = names.pokemon(name);
    const entry = pokedex[name];

    if (!allowed.has(name))
      problems.push(t.validation.notAllowed(label, where));

    if (ability && !pokemonAbilities(name).includes(ability))
      problems.push(t.validation.wrongAbility(label, names.ability(ability)));

    const required = [
      ...(entry?.requiredItem ? [entry.requiredItem] : []),
      ...(entry?.requiredItems ?? []),
    ].map(itemNameInverse);
    if (required.length && !required.includes(item))
      problems.push(
        t.validation.missingItem(
          label,
          required.map(id => names.item(id ?? "")),
        ),
      );

    const moves = MOVE_KEYS.map(key => member[key]).filter(move => move);
    const repeated = moves.find((move, i) => moves.indexOf(move) !== i);
    if (repeated)
      problems.push(t.validation.repeatedMove(label, names.move(repeated)));

    const total = evTotal(member.evs);
    if (total > MAX_EV_TOTAL)
      problems.push(t.validation.tooManyEvs(label, total, MAX_EV_TOTAL));
    if (
      [...(member.evs ? Object.keys(member.evs) : [])].some(
        stat => getEv(member.evs, stat as never) > MAX_EV,
      )
    )
      problems.push(t.validation.tooManyStatEvs(label, MAX_EV));

    if (
      member.level !== undefined &&
      (member.level < 1 || member.level > MAX_LEVEL)
    )
      problems.push(t.validation.badLevel(label, MAX_LEVEL));

    if (member.teraType && generation !== LATEST_GENERATION)
      problems.push(t.validation.teraType(label));
  }

  const seenSpecies = new Set<string>();
  for (const { name } of members) {
    const base = species(name);
    if (seenSpecies.has(base))
      problems.push(t.validation.speciesClause(names.pokemon(base)));
    seenSpecies.add(base);
  }

  if (isDoublesFormat(format)) {
    const seenItems = new Set<string>();
    for (const { item } of members) {
      if (!item) continue;
      if (seenItems.has(item))
        problems.push(t.validation.itemClause(names.item(item)));
      seenItems.add(item);
    }
  }

  return [...new Set(problems)];
}
