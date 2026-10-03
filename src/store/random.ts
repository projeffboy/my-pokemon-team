import viableMoves from "@/data/viable-moves";
import { MOVE_KEYS, type TeamPokemon } from "@/types";
import { pokemonAbilities } from "@/shared/pokedex";
import { getAutoSelectedItem } from "@/shared/team";
import { completeLearnset } from "./learnsets";

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
export const isSetComplete = (member: Readonly<TeamPokemon>) =>
  !!member.name &&
  !!member.item &&
  !!member.ability &&
  MOVE_KEYS.every(key => member[key]);

// Fills in what the set lacks: one of its abilities, its required item or else
// a random one, and different moves, drawn from its viable moves when it has
// enough of them
export function completeSet(
  member: Readonly<TeamPokemon>,
  learnset: readonly string[],
  random: Random = Math.random,
): TeamPokemon {
  const { name } = member;
  const chosen = MOVE_KEYS.map(key => member[key]);
  const viable = learnset.filter(move => viableMoves.has(move));
  const pool = (viable.length >= 4 ? viable : learnset).filter(
    move => !chosen.includes(move),
  );
  const set = { ...member };
  for (const key of MOVE_KEYS) {
    if (set[key] || !pool.length) continue;
    const move = pickRandom(pool, random) ?? "";
    pool.splice(pool.indexOf(move), 1);
    set[key] = move;
  }
  if (!set.item) {
    set.item =
      getAutoSelectedItem(name, "") || (pickRandom(RANDOM_ITEMS, random) ?? "");
  }
  if (!set.ability)
    set.ability = pickRandom(pokemonAbilities(name), random) ?? "";
  return set;
}

// A whole random set for the pokemon
export const randomSet = (
  pokemon: string,
  learnset: readonly string[],
  random: Random = Math.random,
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
  );
