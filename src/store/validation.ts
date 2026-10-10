import pokedex from "@/data/pokedex";
import { MOVE_KEYS, type Generation, type ReadonlyTeam } from "@/types";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LATEST_GENERATION } from "@/shared/generations";
import { itemNameInverse, pokemonNameInverse } from "@/shared/names";
import { pokemonAbilities } from "@/shared/pokedex";
import { baseMoveId } from "@/shared/moves";
import { nicknameLimit } from "@/shared/nickname";
import { generationRules, getStatExperience } from "@/shared/generation-rules";
import { english, type Translation } from "@/i18n/translation";
import { evTotal, getEv, MAX_LEVEL } from "@/shared/set-details";
import { filterPokemon } from "./filtering";

// The problems that stop a team from being legal in its format, or none
export function validateTeam(
  team: ReadonlyTeam,
  generation: Generation,
  format: string,
  { t, names, locale }: Translation = english,
): string[] {
  const members = team.filter(({ name }) => name);
  if (!members.length) return [t.validation.empty];

  const problems: string[] = [];
  const rules = generationRules(generation, format);
  const training = t.advanced[rules.investment];
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
    const maxNicknameLength = nicknameLimit(generation, locale);
    if ((member.nickname?.trim().length ?? 0) > maxNicknameLength)
      problems.push(t.validation.nicknameTooLong(label, maxNicknameLength));

    if (!allowed.has(name))
      problems.push(t.validation.notAllowed(label, where));

    if (
      ability &&
      (!rules.abilities ||
        !pokemonAbilities(name, generation).includes(ability))
    )
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
    const moveIds = moves.map(baseMoveId);
    const repeated = moves.find(
      (_, i) => moveIds.indexOf(moveIds[i] ?? "") !== i,
    );
    if (repeated)
      problems.push(
        t.validation.repeatedMove(label, names.move(baseMoveId(repeated))),
      );

    const total = evTotal(member.evs);
    if (rules.maxTotal !== undefined && total > rules.maxTotal)
      problems.push(
        t.validation.tooMuchTraining(label, total, rules.maxTotal, training),
      );
    if (
      rules.statKeys.some(stat => {
        const amount =
          rules.legacy ? getStatExperience(member, stat)
          : rules.investment === "effortLevels" ?
            getEv(member.effortLevels, stat)
          : getEv(member.evs, stat);
        return amount > rules.maxStat;
      })
    )
      problems.push(
        t.validation.tooMuchStatTraining(label, rules.maxStat, training),
      );

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

  // Smogon's doubles tiers have no Item Clause
  if (format === CHAMPIONS_FORMAT) {
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
