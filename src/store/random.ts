import viableMoves from "@/data/viable-moves";
import { generationRules } from "@/shared/generation-rules";
import { baseMoveId } from "@/shared/moves";
import { matchHiddenPower } from "@/shared/hidden-power";
import { availableItems, generationLearnset } from "./learnsets";
import { MOVE_KEYS, type Generation, type TeamPokemon } from "@/types";
import { pokemonAbilities } from "@/shared/pokedex";
import { getAutoSelectedItem } from "@/shared/team";
import { completeLearnset } from "./learnsets";
import { english, type Translation } from "@/i18n/translation";

export function randomizedFieldsMessage(
  before: Readonly<TeamPokemon>,
  after: Readonly<TeamPokemon>,
  { t, locale }: Translation = english,
) {
  const fields = [
    MOVE_KEYS.some(key => before[key] !== after[key]) ? t.filters.moves : "",
    before.item !== after.item ? t.team.item : "",
    before.ability !== after.ability ? t.team.ability : "",
  ].filter(Boolean);
  if (!fields.length) return undefined;
  return t.team.randomizedPokemonDetails(
    new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(
      fields,
    ),
  );
}

type Random = () => number;

export function pickRandom<T>(
  options: readonly T[],
  random: Random = Math.random,
): T | undefined {
  return options[Math.floor(random() * options.length)];
}

// A random pokemon from the options, preferring ones not already on the team.
// Pokemon that learn no moves, such as the Pokestars, are left out while any
// others remain, so a random set has moves.
export function randomPokemon(
  options: readonly string[],
  taken: readonly string[],
  random: Random = Math.random,
) {
  const movable = options.filter(pokemon => completeLearnset(pokemon).length);
  if (movable.length) options = movable;
  const fresh = options.filter(pokemon => !taken.includes(pokemon));
  return pickRandom(fresh.length ? fresh : options, random) ?? "";
}

// Items that suit most pokemon, for one without a required item
export const RANDOM_ITEMS: readonly string[] = [
  "leftovers",
  "choicescarf",
  "choiceband",
  "choicespecs",
  "lifeorb",
  "focussash",
  "heavydutyboots",
  "assaultvest",
  "rockyhelmet",
  "expertbelt",
  "lumberry",
  "sitrusberry",
  "airballoon",
  "weaknesspolicy",
];

// Whether the set has a pokemon, an item, an ability, and four moves
export function isSetComplete(
  member: Readonly<TeamPokemon>,
  generation: Generation = 9,
  format = "",
) {
  const rules = generationRules(generation, format);
  const moveCount = Math.min(
    4,
    new Set(generationLearnset(member.name, generation, format).map(baseMoveId))
      .size,
  );
  const selected = MOVE_KEYS.map(key => member[key]).filter(Boolean);
  const uniqueCount = new Set(selected.map(baseMoveId)).size;
  return (
    !!member.name &&
    (!rules.items || !!member.item) &&
    (!rules.abilities || !!member.ability) &&
    uniqueCount === selected.length &&
    uniqueCount >= moveCount
  );
}

export function randomizeSlotLabel(
  member: Readonly<TeamPokemon>,
  { t, locale }: Translation = english,
  generation: Generation = 9,
  format = "",
) {
  const rules = generationRules(generation, format);
  if (!member.name || isSetComplete(member, generation, format))
    return t.team.randomizePokemon;
  const selectedMoves = MOVE_KEYS.map(key => member[key]).filter(Boolean);
  const fields = [
    (
      selectedMoves.length < MOVE_KEYS.length ||
      new Set(selectedMoves.map(baseMoveId)).size < selectedMoves.length
    ) ?
      t.filters.moves
    : "",
    rules.items && !member.item ? t.team.item : "",
    rules.abilities && !member.ability ? t.team.ability : "",
  ].filter(Boolean);
  return t.team.randomizeDetails(
    new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(
      fields,
    ),
  );
}

// Fills in what the set lacks: one of its abilities, its required item or else
// a random one, and different moves, drawn from its viable moves when it has
// enough of them
export function completeSet(
  member: Readonly<TeamPokemon>,
  learnset: readonly string[],
  random: Random = Math.random,
  generation: Generation = 9,
  format = "",
): TeamPokemon {
  const rules = generationRules(generation, format);
  const { name } = member;
  const set = { ...member };
  const chosen = new Set<string>();
  for (const key of MOVE_KEYS) {
    if (!set[key]) continue;
    const id = baseMoveId(set[key]);
    if (chosen.has(id)) set[key] = "";
    else chosen.add(id);
  }
  const groupMoves = (moves: readonly string[]) => {
    const groups = new Map<string, string[]>();
    for (const move of new Set(moves)) {
      if (!move) continue;
      const id = baseMoveId(move);
      const variants = groups.get(id) ?? [];
      variants.push(move);
      groups.set(id, variants);
    }
    return groups;
  };
  const viable = groupMoves(learnset.filter(move => viableMoves.has(move)));
  const groups = viable.size >= 4 ? viable : groupMoves(learnset);
  const pool = [...groups].filter(([id]) => !chosen.has(id));
  for (const key of MOVE_KEYS) {
    if (set[key] || !pool.length) continue;
    const group = pickRandom(pool, random);
    if (!group) continue;
    pool.splice(pool.indexOf(group), 1);
    const [id, variants] = group;
    const typed = variants.filter(move => move !== "hiddenpower");
    set[key] =
      id === "hiddenpower" ?
        (pickRandom(typed.length ? typed : variants, random) ?? "")
      : (variants[0] ?? "");
    matchHiddenPower(set, set[key], generation, format);
  }
  if (!rules.items) set.item = "";
  else if (!set.item) {
    set.item =
      getAutoSelectedItem(name, "") ||
      (pickRandom(availableItems(RANDOM_ITEMS, generation, format), random) ??
        "");
  }
  if (!rules.abilities) set.ability = "";
  else if (!set.ability)
    set.ability = pickRandom(pokemonAbilities(name, generation), random) ?? "";
  return set;
}

// A whole random set for the pokemon
export const randomSet = (
  pokemon: string,
  learnset: readonly string[],
  random: Random = Math.random,
  generation: Generation = 9,
  format = "",
) =>
  completeSet(
    {
      name: pokemon,
      item: "",
      ability: "",
      move1: "",
      move2: "",
      move3: "",
      move4: "",
    },
    learnset,
    random,
    generation,
    format,
  );
