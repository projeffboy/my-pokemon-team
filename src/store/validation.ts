import pokedex from "@/data/pokedex";
import formatBans from "@/data/format-bans";
import { MOVE_KEYS, type Generation, type ReadonlyTeam } from "@/types";
import { CHAMPIONS_FORMAT, FORMATS, showdownFormatId } from "@/shared/formats";
import { LATEST_GENERATION } from "@/shared/generations";
import { pokemonNameInverse } from "@/shared/names";
import { pokemonAbilities } from "@/shared/pokedex";
import { baseMoveId } from "@/shared/moves";
import { nicknameLimit } from "@/shared/nickname";
import { generationRules, getStatExperience } from "@/shared/generation-rules";
import { english, type Translation } from "@/i18n/translation";
import { evTotal, getEv, MAX_LEVEL } from "@/shared/set-details";
import { requiredItemGroups } from "@/shared/team";
import { filterPokemon } from "./filtering";
import { availablePokemon, isItemAvailable } from "./learnsets";
import { COMBINED_GENERATIONS_FORMAT } from "@/shared/generation-profile";
import { variantGeneration } from "@/shared/game-variants";

// A rule the team breaks, and the slots of the pokemon it concerns
export type TeamProblem = { message: string; slots: number[] };

// The generation and format whose rules a team is checked against, e.g. "Gen 9 OU: Over Used"
// or "Generations 6–9 OU: Over Used"
export const rulesLabel = (
  generation: Generation,
  format: string,
  { t }: Translation = english,
  tier = format,
) => {
  const games =
    format === COMBINED_GENERATIONS_FORMAT ?
      t.combinedGenerations.label
    : t.generation(generation);
  return tier && tier !== COMBINED_GENERATIONS_FORMAT ?
      `${games} ${tier}`
    : games;
};

// The problems that stop a team from being legal in its format, or none. The
// format picks the games' data, and the tier the allowed pokemon, the bans, and
// the Species Clause; the tier is the format, except in Generations 6–9.
export function validateTeam(
  team: ReadonlyTeam,
  generation: Generation,
  format: string,
  translation: Translation = english,
  tier = format,
): TeamProblem[] {
  const { t, names, locale } = translation;
  const members = team.flatMap((member, slot) =>
    member.name ? [{ member, slot }] : [],
  );
  if (!members.length) return [{ message: t.validation.empty, slots: [] }];

  // Each problem once, with every slot it concerns
  const problems = new Map<string, number[]>();
  const report = (message: string, slots: number[]) =>
    problems.set(message, [...(problems.get(message) ?? []), ...slots]);
  const rules = generationRules(generation, format);
  const training = t.advanced[rules.investment];
  const candidates = filterPokemon({
    generation,
    format: tier,
    region: "",
    type: "",
    ability: "",
  });
  // Like the Name dropdown, the combined generations and each game list only
  // the pokemon their games have
  const allowed = new Set(
    format === COMBINED_GENERATIONS_FORMAT || variantGeneration(format) ?
      availablePokemon(candidates, generation, format)
    : candidates,
  );
  const where = rulesLabel(generation, format, translation, tier);
  const bans = formatBans[showdownFormatId(generation, tier)];
  const species = (pokemon: string) => {
    const base = pokedex[pokemon]?.baseSpecies;
    return (base && pokemonNameInverse(base)) || pokemon;
  };

  for (const { member, slot } of members) {
    const { name, item, ability } = member;
    const label = names.pokemon(name);
    const add = (message: string) => report(message, [slot]);
    const maxNicknameLength = nicknameLimit(generation, locale);
    if ((member.nickname?.trim().length ?? 0) > maxNicknameLength)
      add(t.validation.nicknameTooLong(label, maxNicknameLength));

    if (!allowed.has(name)) add(t.validation.notAllowed(label, where));

    if (
      ability &&
      (!rules.abilities ||
        !pokemonAbilities(name, generation, format).includes(ability))
    )
      add(t.validation.wrongAbility(label, names.ability(ability)));

    // Only the ones the game has, which are none in games without items. A game
    // requires the newest it has, e.g. the Griseous Core from Gen 9, while the
    // combined generations accept the earlier one too.
    const required = requiredItemGroups(name).flatMap(group => {
      const items = group.filter(id => isItemAvailable(id, generation, format));
      return format === COMBINED_GENERATIONS_FORMAT ? items : items.slice(0, 1);
    });
    if (required.length && !required.includes(item))
      add(t.validation.missingItem(label, required.map(names.item)));

    const moves = MOVE_KEYS.map(key => member[key]).filter(move => move);
    const moveIds = moves.map(baseMoveId);
    const repeated = moves.find(
      (_, i) => moveIds.indexOf(moveIds[i] ?? "") !== i,
    );
    if (repeated)
      add(t.validation.repeatedMove(label, names.move(baseMoveId(repeated))));

    const banned = [
      bans?.abilities?.includes(ability) && names.ability(ability),
      bans?.items?.includes(item) && names.item(item),
      ...moves
        .filter(move => bans?.moves?.includes(move))
        .map(move => names.move(move)),
    ];
    for (const thing of banned)
      if (thing) add(t.validation.banned(label, thing, where));

    const total = evTotal(member.evs);
    if (rules.maxTotal !== undefined && total > rules.maxTotal)
      add(t.validation.tooMuchTraining(label, total, rules.maxTotal, training));
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
      add(t.validation.tooMuchStatTraining(label, rules.maxStat, training));

    if (
      member.level !== undefined &&
      (member.level < 1 || member.level > MAX_LEVEL)
    )
      add(t.validation.badLevel(label, MAX_LEVEL));

    if (member.teraType && generation !== LATEST_GENERATION)
      add(t.validation.teraType(label));
  }

  // Each value that more than one pokemon shares, with their slots
  const shared = (value: (slot: (typeof members)[number]) => string) => {
    const slots = new Map<string, number[]>();
    for (const entry of members) {
      const key = value(entry);
      if (key) slots.set(key, [...(slots.get(key) ?? []), entry.slot]);
    }
    return [...slots].filter(([, sharing]) => sharing.length > 1);
  };

  // The games allow two of a species; Smogon's tiers and Champions do not
  if (FORMATS.includes(tier))
    for (const [base, slots] of shared(({ member }) => species(member.name)))
      report(t.validation.speciesClause(names.pokemon(base)), slots);

  // Smogon's doubles tiers have no Item Clause
  if (format === CHAMPIONS_FORMAT)
    for (const [item, slots] of shared(({ member }) => member.item))
      report(t.validation.itemClause(names.item(item)), slots);

  return [...problems].map(([message, slots]) => ({ message, slots }));
}
